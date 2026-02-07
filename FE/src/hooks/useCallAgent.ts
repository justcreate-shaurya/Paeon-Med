import { useState, useRef, useEffect, useCallback } from 'react';

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

export function useCallAgent(config: CallAgentConfig = {}) {
  const {
    serverUrl = `ws://${window.location.hostname}:3000/media-stream`,
    onStatusChange,
    onError,
  } = config;

  const [state, setState] = useState<CallAgentState>({
    isConnected: false,
    isActive: false,
    isMicEnabled: false,
    status: 'Idle',
    error: null,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const scriptNodeRef = useRef<ScriptProcessorNode | null>(null);
  const streamSidRef = useRef<string>('WEB_' + Math.random().toString(36).slice(2, 10));

  const updateState = useCallback((updates: Partial<CallAgentState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      if (updates.status) {
        onStatusChange?.(updates.status);
      }
      return newState;
    });
  }, [onStatusChange]);

  const handleError = useCallback((error: string) => {
    updateState({ error, status: 'Error' });
    onError?.(error);
    console.error('[CallAgent Error]', error);
  }, [updateState, onError]);

  const initAudioContext = useCallback(async () => {
    try {
      if (audioContextRef.current) return;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      scriptNodeRef.current = processor;

      source.connect(processor);
      processor.connect(audioContext.destination);

      // Capture audio data from microphone
      processor.onaudioprocess = (event) => {
        if (!state.isMicEnabled) return;

        const inputData = event.inputBuffer.getChannelData(0);
        const payload = btoa(String.fromCharCode.apply(null, Array.from(inputData) as any));

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              event: 'media',
              media: { payload },
            })
          );
        }
      };

      return audioContext;
    } catch (err) {
      handleError(`Failed to initialize audio: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    }
  }, [state.isMicEnabled, handleError]);

  const startCall = useCallback(async () => {
    try {
      updateState({ status: 'Connecting...', isActive: true, error: null });

      // Initialize audio context
      await initAudioContext();

      // Connect WebSocket
      const ws = new WebSocket(serverUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        updateState({ isConnected: true, status: 'Connected' });

        // Send initial handshake
        ws.send(
          JSON.stringify({
            event: 'start',
            streamSid: streamSidRef.current,
            mediaFormat: {
              encoding: 'linear16',
              sampleRate: 8000,
            },
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.event === 'media' && data.media?.payload) {
            // Handle audio from the server (AI response)
            playAudio(data.media.payload);
          }
        } catch (err) {
          console.warn('[WebSocket Parse Error]', err);
        }
      };

      ws.onerror = (error) => {
        handleError(`WebSocket error: ${error}`);
      };

      ws.onclose = () => {
        updateState({
          isConnected: false,
          isActive: false,
          isMicEnabled: false,
          status: 'Disconnected',
        });
      };
    } catch (err) {
      handleError(`Failed to start call: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [serverUrl, initAudioContext, updateState, handleError]);

  const endCall = useCallback(() => {
    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

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

    updateState({
      isConnected: false,
      isActive: false,
      isMicEnabled: false,
      status: 'Idle',
    });
  }, [updateState]);

  const toggleMic = useCallback(() => {
    if (!state.isConnected) return;
    updateState({ isMicEnabled: !state.isMicEnabled });
  }, [state.isConnected, updateState]);

  const playAudio = useCallback((payload: string) => {
    // This is a placeholder for audio playback
    // In production, you'd decode the base64 payload and play it
    console.log('[Call Agent] Received audio response');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, [endCall]);

  return {
    state,
    startCall,
    endCall,
    toggleMic,
  };
}
