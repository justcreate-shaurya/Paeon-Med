# FloatingCallButton Integration with Calling Agent

Your FloatingCallButton is now integrated with the Calling Agent! Here's how to use it:

## Quick Start

### 1. **Start the Calling Agent Server**

Open a terminal and run:

```bash
cd "Calling agent"
npm install  # (if not already done)
npm start
```

The server should start on port 3000:
```
╔══════════════════════════════════════════════════════════╗
║  Voice AI Medical Rep — PRODUCTION SERVER                ║
║  Port: 3000                                              ║
║  ...                                                     ║
╚══════════════════════════════════════════════════════════╝
```

### 2. **Start the Frontend**

In another terminal:

```bash
cd FE
npm install  # (if not already done)
npm run dev
```

### 3. **Use the FloatingCallButton**

- Click the **blue phone button** in the bottom-right corner of the app
- A call modal will appear
- Click **"Start Call"** to begin a voice conversation with the AI medical representative
- Use the **mic button** to toggle your microphone on/off
- Click **"End Call"** to disconnect

## How It Works

### Components

1. **FloatingCallButton.tsx** - The blue button in the bottom-right corner
   - Triggers the call modal when clicked
   - Always visible on the page

2. **CallModal.tsx** - The call interface modal
   - Shows call status (Idle, Connected, In Call)
   - Displays Start Call / Mic Toggle / End Call buttons
   - Shows real-time connection status
   - Displays error messages if something goes wrong

3. **useCallAgent.ts** - Hook managing the WebSocket connection
   - Handles connection to the calling agent server
   - Manages microphone access and audio capture
   - Sends/receives audio data via WebSocket
   - Manages call state (active, connected, muted)

### Data Flow

```
FloatingCallButton
       ↓
   [Click]
       ↓
   CallModal Opens
       ↓
  useCallAgent Hook
       ↓
   WebSocket Connection
   ws://localhost:3000/media-stream
       ↓
   Bidirectional Audio Stream
   (Your mic → Server → AI → Response Audio → Your speakers)
```

## Configuration

### Server URL

The default WebSocket URL is:
```
ws://localhost:3000/media-stream
```

If your calling agent is on a different machine or port, update the `serverUrl` in `CallModal.tsx`:

```tsx
const { state, startCall, endCall, toggleMic } = useCallAgent({
  serverUrl: `ws://YOUR_SERVER_IP:3000/media-stream`,
  // ... rest of config
});
```

### Environment Setup

Make sure your calling agent `.env` file is properly configured:

```
GOOGLE_PROJECT_ID=your-gcp-project
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
PORT=3000
```

See `Calling agent/.env.example` for a complete template.

## Troubleshooting

### "Failed to initialize audio"
- **Cause**: Browser doesn't have microphone permission
- **Fix**: Allow microphone access when the browser prompts

### "WebSocket connection failed"
- **Cause**: Calling agent server not running or on wrong port
- **Fix**: 
  1. Check that `npm start` is running in the `Calling agent` folder
  2. Make sure it says "Port: 3000"
  3. Check that there's no port conflict

### "Connection Timeout"
- **Cause**: CORS or network issues
- **Fix**: 
  1. Check firewall settings
  2. Make sure frontend and backend are on the same network
  3. Try `localhost` if both are on the same machine

### No audio response
- **Cause**: Missing Google Cloud API credentials or unavailable service
- **Fix**: 
  1. Check that `GOOGLE_PROJECT_ID` is set in `.env`
  2. Verify service account JSON key path is correct
  3. Check Google Cloud console for API quotas/errors

## Files Changed

- **Created**: `FE/src/hooks/useCallAgent.ts` - WebSocket hook
- **Created**: `FE/src/components/CallModal.tsx` - Call interface
- **Modified**: `FE/src/components/FloatingCallButton.tsx` - Added modal trigger

## Next Steps

1. Test the integration locally with `localhost`
2. Once working, update WebSocket URL to your production server
3. Add proper error boundaries and logging for production
4. Consider adding call history/transcript storage
5. Add CORS headers in calling agent server if needed for cross-origin requests

---

**Happy calling! 🎤**
