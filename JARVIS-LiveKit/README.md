# JARVIS LiveKit Hologram AI Agent

A JARVIS-style realtime voice agent with a holographic HUD and camera hand gestures.

## Secure API-key setup

The Gemini API key is a **backend environment variable**. It is not stored in the frontend and must not be committed to GitHub.

Create this local file:

`JARVIS-LiveKit/agent/.env.local`

and add:

```text
GOOGLE_API_KEY=YOUR_GEMINI_API_KEY
LIVEKIT_URL=wss://YOUR_PROJECT.livekit.cloud
LIVEKIT_API_KEY=YOUR_LIVEKIT_API_KEY
LIVEKIT_API_SECRET=YOUR_LIVEKIT_API_SECRET
```

The Python agent loads `.env.local` automatically. Keep this file private.

For hosted deployment, set `GOOGLE_API_KEY` as a **server-side environment variable/secret** in your hosting platform instead of putting it in source code.

## Includes

- LiveKit Agents Python backend
- Google Gemini LLM
- LiveKit Inference STT and TTS
- Realtime WebRTC voice
- Hologram-style browser HUD
- Camera hand tracking with MediaPipe
- Gesture controls: open palm, fist, pointing, victory and pinch
- Agent-state visualization
- Browser wake-word helper for "Jarvis"

## Run on Windows

```powershell
cd JARVIS-LiveKit\agent
py -m venv .venv
.\.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
lk cloud auth
lk agent dev
```

Then run the frontend in another PowerShell window:

```powershell
cd JARVIS-LiveKit\frontend
py -m http.server 5500
```

Open `http://localhost:5500`.

## Important

Never put `GOOGLE_API_KEY`, `LIVEKIT_API_SECRET`, or other private credentials in `frontend/app.js`, `index.html`, or any committed source file.
