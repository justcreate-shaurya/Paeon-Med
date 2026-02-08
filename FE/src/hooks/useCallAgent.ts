import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

export interface CallAgentState {
  isConnected: boolean;
  isActive: boolean;
  isMicEnabled: boolean;
  status: string;
  error: string | null;
}

interface CallAgentConfig {
  serverUrl?: string;
  onStatusChange?: (status: string) => void;
  onError?: (error: string) => void;
  onAudioData?: (data: Float32Array) => void;
}

// ── Mulaw codec (matches Twilio's PCMU) ────────────────────
const MULAW_BIAS = 33;
const MULAW_MAX = 32635;
const INPUT_SAMPLE_RATE = 8000; // Server sends 8kHz mulaw
const OUTPUT_SAMPLE_RATE = 48000; // Browser playback rate (high quality)
const NOISE_GATE = 0.008;

function linearToMulaw(sample: number): number {
  sample = Math.max(-32768, Math.min(32767, sample));
  const sign = sample < 0 ? 0x80 : 0;
  if (sample < 0) sample = -sample;
  sample = Math.min(sample + MULAW_BIAS, MULAW_MAX);
  const exp = [0, 1, 2, 3, 4, 5, 6, 7].find((e) => sample < 0x84 << e) ?? 7;
  const mantissa = (sample >> (exp + 3)) & 0x0f;
  return ~(sign | (exp << 4) | mantissa) & 0xff;
}

function mulawToLinear(byte: number): number {
  byte = ~byte & 0xff;
  const sign = byte & 0x80;
  const exp = (byte >> 4) & 0x07;
  const mantissa = byte & 0x0f;
  let sample = ((mantissa << 4) + 0x84) << exp;
  sample -= MULAW_BIAS * 4;
  return sign ? -sample : sample;
}

// ── High-quality upsampler: 8kHz → 48kHz ──────────────────
// Uses cubic interpolation for smoother playback
function upsample8kTo48k(input: Float32Array): Float32Array {
  const ratio = OUTPUT_SAMPLE_RATE / INPUT_SAMPLE_RATE; // 6x
  const outLen = Math.floor(input.length * ratio);
  const out = new Float32Array(outLen);
  
  for (let i = 0; i < outLen; i++) {
    const srcPos = i / ratio;
    const idx = Math.floor(srcPos);
    const frac = srcPos - idx;
    
    // Cubic interpolation for smoother upsampling
    const p0 = input[Math.max(0, idx - 1)] || 0;
    const p1 = input[idx] || 0;
    const p2 = input[Math.min(input.length - 1, idx + 1)] || 0;
    const p3 = input[Math.min(input.length - 1, idx + 2)] || 0;
    
    // Catmull-Rom spline interpolation
    const a = -0.5 * p0 + 1.5 * p1 - 1.5 * p2 + 0.5 * p3;
    const b = p0 - 2.5 * p1 + 2 * p2 - 0.5 * p3;
    const c = -0.5 * p0 + 0.5 * p2;
    const d = p1;
    
    out[i] = a * frac * frac * frac + b * frac * frac + c * frac + d;
  }
  
  return out;
}

// ── Downsampler: any rate → 8000 Hz (for mic capture) ──────
function resample(input: Float32Array, fromRate: number, toRate: number): Float32Array {
  const ratio = fromRate / toRate;
  const len = Math.floor(input.length / ratio);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const srcIdx = i * ratio;
    const idx = Math.floor(srcIdx);
    const frac = srcIdx - idx;
    const a = input[idx] || 0;
    const b = input[idx + 1] || 0;
    out[i] = a + frac * (b - a);
  }
  return out;
}

export function useCallAgent(config: CallAgentConfig = {}) {
  // Memoize server URL to prevent re-renders
  const serverUrl = useMemo(
    () => config.serverUrl || `ws://${window.location.hostname}:3001/media-stream`,
    [config.serverUrl]
  );

  const [state, setState] = useState<CallAgentState>({
    isConnected: false,
    isActive: false,
    isMicEnabled: false,
    status: 'Idle',
    error: null,
  });

  // Use refs to avoid stale closures and prevent multiple connections
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const scriptNodeRef = useRef<ScriptProcessorNode | null>(null);
  const streamSidRef = useRef<string>('');
  const micEnabledRef = useRef<boolean>(false);
  const micRateRef = useRef<number>(48000);
  const isStartingRef = useRef<boolean>(false); // Guard against multiple starts

  // Playback state
  const playbackQueueRef = useRef<Uint8Array[]>([]);
  const isPlayingRef = useRef<boolean>(false);
  const pendingMarksRef = useRef<string[]>([]);

  // Store callbacks in refs to avoid dependency issues
  const onStatusChangeRef = useRef(config.onStatusChange);
  const onErrorRef = useRef(config.onError);
  useEffect(() => {
    onStatusChangeRef.current = config.onStatusChange;
    onErrorRef.current = config.onError;
  }, [config.onStatusChange, config.onError]);

  const updateState = useCallback((updates: Partial<CallAgentState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      if (updates.status && onStatusChangeRef.current) {
        onStatusChangeRef.current(updates.status);
      }
      if (updates.isMicEnabled !== undefined) {
        micEnabledRef.current = updates.isMicEnabled;
      }
      return newState;
    });
  }, []);

  const handleError = useCallback(
    (error: string) => {
      updateState({ error, status: 'Error' });
      if (onErrorRef.current) onErrorRef.current(error);
      console.error('[CallAgent Error]', error);
    },
    [updateState]
  );

  // ── Playback: decode mulaw and queue for playing ─────────
  // Accumulate chunks for smoother playback
  const accumulatedAudioRef = useRef<Float32Array[]>([]);
  const playbackScheduledRef = useRef<boolean>(false);
  const CHUNK_ACCUMULATE_MS = 50; // Accumulate 50ms of audio before playing

  const processAndPlayAudio = useCallback(() => {
    if (accumulatedAudioRef.current.length === 0) {
      playbackScheduledRef.current = false;
      return;
    }

    // Combine all accumulated chunks
    const totalLength = accumulatedAudioRef.current.reduce((sum, arr) => sum + arr.length, 0);
    const combined = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of accumulatedAudioRef.current) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }
    accumulatedAudioRef.current = [];
    playbackScheduledRef.current = false;

    if (!audioContextRef.current || combined.length === 0) return;

    // Upsample 8kHz → 48kHz for high-quality playback
    const upsampled = upsample8kTo48k(combined);

    // Create audio buffer at high sample rate
    const buffer = audioContextRef.current.createBuffer(1, upsampled.length, OUTPUT_SAMPLE_RATE);
    buffer.getChannelData(0).set(upsampled);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => {
      // Check if more audio came in while playing
      if (accumulatedAudioRef.current.length > 0) {
        processAndPlayAudio();
      } else {
        isPlayingRef.current = false;
        // Process any pending marks now that audio is done
        while (pendingMarksRef.current.length > 0) {
          const markName = pendingMarksRef.current.shift()!;
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ event: 'mark', mark: { name: markName } }));
          }
          // Enable mic after greeting completes
          if (!micEnabledRef.current) {
            updateState({ isMicEnabled: true, status: '🎤 Listening...' });
          }
        }
      }
    };
    source.start();
  }, [updateState]);

  const playNextChunk = useCallback(() => {
    if (playbackQueueRef.current.length === 0) {
      // If we have accumulated audio, play it
      if (accumulatedAudioRef.current.length > 0 && !playbackScheduledRef.current) {
        processAndPlayAudio();
      } else if (accumulatedAudioRef.current.length === 0) {
        isPlayingRef.current = false;
        // Process any pending marks
        while (pendingMarksRef.current.length > 0) {
          const markName = pendingMarksRef.current.shift()!;
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ event: 'mark', mark: { name: markName } }));
          }
          if (!micEnabledRef.current) {
            updateState({ isMicEnabled: true, status: '🎤 Listening...' });
          }
        }
      }
      return;
    }

    isPlayingRef.current = true;
    const chunk = playbackQueueRef.current.shift()!;

    if (!audioContextRef.current) return;

    // Convert mulaw to linear PCM (normalized float)
    const pcm = new Float32Array(chunk.length);
    for (let i = 0; i < chunk.length; i++) {
      pcm[i] = mulawToLinear(chunk[i]) / 32768;
    }

    // Accumulate chunks for smoother playback
    accumulatedAudioRef.current.push(pcm);

    // Schedule playback after accumulation period
    if (!playbackScheduledRef.current) {
      playbackScheduledRef.current = true;
      setTimeout(() => {
        processAndPlayAudio();
        // Continue processing queue
        if (playbackQueueRef.current.length > 0) {
          playNextChunk();
        }
      }, CHUNK_ACCUMULATE_MS);
    } else {
      // Keep processing queue
      if (playbackQueueRef.current.length > 0) {
        playNextChunk();
      }
    }
  }, [updateState, processAndPlayAudio]);

  // Legacy playNextChunk for compatibility - redirect to new implementation
  const queuePlayback = useCallback(
    (mulaw: Uint8Array) => {
      playbackQueueRef.current.push(mulaw);
      if (!isPlayingRef.current) {
        isPlayingRef.current = true;
        playNextChunk();
      }
    },
    [playNextChunk]
  );

  const endCall = useCallback(() => {
    // Send stop event
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ event: 'stop', streamSid: streamSidRef.current }));
      wsRef.current.close();
    }
    wsRef.current = null;

    // Stop microphone
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }

    // Stop audio processor
    if (scriptNodeRef.current) {
      scriptNodeRef.current.disconnect();
      scriptNodeRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Clear playback
    playbackQueueRef.current = [];
    isPlayingRef.current = false;
    pendingMarksRef.current = [];
    isStartingRef.current = false;

    updateState({
      isConnected: false,
      isActive: false,
      isMicEnabled: false,
      status: 'Idle',
    });
  }, [updateState]);

  const startCall = useCallback(async () => {
    // Prevent multiple simultaneous starts
    if (isStartingRef.current || wsRef.current) {
      console.warn('[CallAgent] Call already in progress or starting');
      return;
    }
    isStartingRef.current = true;

    try {
      updateState({ status: 'Requesting microphone...', isActive: true, error: null });

      // Get microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      micStreamRef.current = stream;
      const micRate = stream.getAudioTracks()[0].getSettings().sampleRate || 48000;
      micRateRef.current = micRate;

      // Create audio context at mic's native rate for capture
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: micRate,
      });
      audioContextRef.current = audioContext;

      // Reset playback state
      playbackQueueRef.current = [];
      isPlayingRef.current = false;
      pendingMarksRef.current = [];
      streamSidRef.current = 'WEB_' + Math.random().toString(36).slice(2, 10);

      updateState({ status: 'Connecting...' });

      // Connect WebSocket
      const ws = new WebSocket(serverUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        updateState({ isConnected: true, status: '🔊 AI greeting...' });

        // Send Twilio-style handshake
        ws.send(JSON.stringify({ event: 'connected', protocol: 'Call', version: '1.0.0' }));

        // Send start event with proper format
        ws.send(
          JSON.stringify({
            event: 'start',
            streamSid: streamSidRef.current,
            start: {
              streamSid: streamSidRef.current,
              callSid: 'CA_browser_' + Date.now().toString(36),
              customParameters: { callerNumber: '+0000000000' },
              mediaFormat: { encoding: 'audio/x-mulaw', sampleRate: '8000', channels: '1' },
            },
          })
        );

        // Start mic capture but suppress sending until greeting finishes
        micEnabledRef.current = false;

        // Set up mic capture
        const source = audioContext.createMediaStreamSource(stream);
        const bufSize = 4096;
        const processor = audioContext.createScriptProcessor(bufSize, 1, 1);
        scriptNodeRef.current = processor;

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (e) => {
          if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
          if (!micEnabledRef.current) return;

          const input = e.inputBuffer.getChannelData(0);

          // Calculate RMS energy for noise gate
          let sumSq = 0;
          for (let i = 0; i < input.length; i++) sumSq += input[i] * input[i];
          const rms = Math.sqrt(sumSq / input.length);

          // Resample to 8kHz for server
          const resampled = resample(input, micRateRef.current, INPUT_SAMPLE_RATE);

          // Convert to mulaw
          const mulaw = new Uint8Array(resampled.length);
          if (rms < NOISE_GATE) {
            // Send silence (mulaw silence byte is 0xFF)
            mulaw.fill(0xff);
          } else {
            for (let i = 0; i < resampled.length; i++) {
              const sample = Math.round(resampled[i] * 32767);
              mulaw[i] = linearToMulaw(sample);
            }
          }

          // Encode as base64 and send
          let binary = '';
          for (let i = 0; i < mulaw.length; i++) {
            binary += String.fromCharCode(mulaw[i]);
          }
          const payload = btoa(binary);

          wsRef.current.send(
            JSON.stringify({
              event: 'media',
              streamSid: streamSidRef.current,
              media: { payload },
            })
          );
        };

        // Safety: enable mic after 8s even if mark never arrives
        setTimeout(() => {
          if (!micEnabledRef.current && wsRef.current) {
            updateState({ isMicEnabled: true, status: '🎤 Listening...' });
          }
        }, 8000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.event === 'media' && data.media?.payload) {
            // Decode base64 mulaw and queue for playback
            const raw = atob(data.media.payload);
            const mulaw = new Uint8Array(raw.length);
            for (let i = 0; i < raw.length; i++) mulaw[i] = raw.charCodeAt(i);
            queuePlayback(mulaw);
          } else if (data.event === 'mark') {
            // Queue mark to echo after audio finishes playing
            pendingMarksRef.current.push(data.mark?.name || 'unknown');
          } else if (data.event === 'clear') {
            // AI was interrupted, clear playback queue
            playbackQueueRef.current = [];
          }
        } catch (err) {
          console.warn('[WebSocket Parse Error]', err);
        }
      };

      ws.onerror = () => {
        handleError('WebSocket connection failed');
        isStartingRef.current = false;
      };

      ws.onclose = () => {
        isStartingRef.current = false;
        updateState({
          isConnected: false,
          isActive: false,
          isMicEnabled: false,
          status: 'Disconnected',
        });
      };
    } catch (err) {
      isStartingRef.current = false;
      handleError(`Failed to start call: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [serverUrl, updateState, handleError, queuePlayback]);

  const toggleMic = useCallback(() => {
    if (!state.isConnected) return;
    const newMicState = !micEnabledRef.current;
    updateState({ isMicEnabled: newMicState, status: newMicState ? '🎤 Listening...' : '🔇 Muted' });
  }, [state.isConnected, updateState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    state,
    startCall,
    endCall,
    toggleMic,
  };
}
