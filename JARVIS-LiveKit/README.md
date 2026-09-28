# JARVIS LiveKit Hologram AI Agent

A JARVIS-style realtime voice agent with a holographic HUD and camera hand gestures.

Includes:
- LiveKit Agents Python backend
- LiveKit Inference STT, LLM and TTS
- Realtime WebRTC voice
- Hologram-style browser HUD
- Camera hand tracking with MediaPipe
- Gesture controls: open palm, fist, pointing, victory and pinch
- Agent-state visualization
- Browser wake-word helper for "Jarvis"

## Run

1. Create a LiveKit Cloud project and enable the development token server.
2. Put its token-server ID into frontend/app.js.
3. Install the backend:
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   py -m pip install -r requirements.txt
4. Authenticate LiveKit CLI:
   lk cloud auth
5. Run the agent:
   lk agent dev
6. Run the frontend:
   py -m http.server 5500
7. Open http://localhost:5500

For production, replace the development token server with a secure token endpoint.

## Gestures

Open palm = wake HUD
Fist = standby
Pointing = holographic cursor
Victory = panel command
Pinch = holographic selection

Never place LiveKit API secrets or long-lived tokens in the browser.
