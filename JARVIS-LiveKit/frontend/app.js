const CONFIG={
TOKEN_SERVER_ID:"PASTE_YOUR_LIVEKIT_TOKEN_SERVER_ID_HERE",
AGENT_NAME:"jarvis"
};

const $=id=>document.getElementById(id);
const feed=$("feed");
const addFeed=t=>{const d=document.createElement("div");d.textContent=t;feed.prepend(d)};
setInterval(()=>{$("clock").textContent=new Date().toLocaleTimeString()},250);

let room=null,camera=null,cameraStream=null,wakeRecognition=null,wakeOn=false,lastGesture="",lastGestureAt=0;

function setState(t){$("agentState").textContent=t.toUpperCase()}
function setVoiceState(t){$("voiceState").textContent=t.toUpperCase()}

async function connectJarvis(){
if(!window.LivekitClient){addFeed("LiveKit browser SDK failed to load.");return}
if(CONFIG.TOKEN_SERVER_ID.includes("PASTE_")){addFeed("Add your LiveKit token-server ID in app.js first.");return}
try{
setState("CONNECTING");setVoiceState("CONNECTING");
const tokenSource=LivekitClient.TokenSource.developmentTokenServer(CONFIG.TOKEN_SERVER_ID);
const token=await tokenSource.fetch({agentName:CONFIG.AGENT_NAME});
room=new LivekitClient.Room({adaptiveStream:true,dynacast:true});
room.on(LivekitClient.RoomEvent.ConnectionStateChanged,state=>{$("networkState").textContent=String(state).toUpperCase()});
room.on(LivekitClient.RoomEvent.ActiveSpeakersChanged,speakers=>{
const speaking=speakers.some(p=>p.isAgent);setState(speaking?"SPEAKING":"LISTENING");setVoiceState(speaking?"SPEAKING":"LISTENING")
});
room.on(LivekitClient.RoomEvent.TrackSubscribed,track=>{
if(track.kind==="audio"){const el=track.attach();el.autoplay=true;document.body.appendChild(el)}
});
await room.connect(token.serverUrl,token.participantToken);
await room.localParticipant.setMicrophoneEnabled(true);
setState("ONLINE");setVoiceState("LIVE");$("connectBtn").textContent="JARVIS ONLINE";addFeed("LiveKit voice channel connected.");addFeed("JARVIS is listening.")
}catch(e){console.error(e);setState("ERROR");setVoiceState("ERROR");addFeed("Connection error: "+e.message)}
}

async function startHandTracking(){
if(cameraStream)return;
try{
const video=$("camera"),canvas=$("handCanvas"),ctx=canvas.getContext("2d");
cameraStream=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:"user"},audio:false});
video.srcObject=cameraStream;await video.play();$("cameraState").textContent="LIVE";addFeed("Hand sensor online.");
const hands=new Hands({locateFile:file=>"https://cdn.jsdelivr.net/npm/@mediapipe/hands/"+file});
hands.setOptions({maxNumHands:1,modelComplexity:1,minDetectionConfidence:.65,minTrackingConfidence:.6});
hands.onResults(results=>{
canvas.width=video.videoWidth||640;canvas.height=video.videoHeight||480;ctx.clearRect(0,0,canvas.width,canvas.height);
if(!results.multiHandLandmarks?.length){$("gestureState").textContent="NONE";$("handCursor").style.display="none";return}
const lm=results.multiHandLandmarks[0];
drawConnectors(ctx,lm,HAND_CONNECTIONS,{color:"#59f6ff",lineWidth:2});drawLandmarks(ctx,lm,{color:"#a6ffff",lineWidth:1,radius:2});
const gesture=classifyGesture(lm);$("gestureState").textContent=gesture.toUpperCase();
const index=lm[8],cursor=$("handCursor");cursor.style.display="block";cursor.style.left=(index.x*470-11)+"px";cursor.style.top=(index.y*470-11)+"px";
if(gesture!==lastGesture&&Date.now()-lastGestureAt>700){lastGesture=gesture;lastGestureAt=Date.now();handleGesture(gesture)}
});
camera=new Camera(video,{onFrame:async()=>{await hands.send({image:video})},width:640,height:480});camera.start()
}catch(e){$("cameraState").textContent="ERROR";addFeed("Camera error: "+e.message)}
}

function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function classifyGesture(lm){
if(distance(lm[4],lm[8])<.07)return"pinch";
const f=[lm[8].y<lm[6].y,lm[12].y<lm[10].y,lm[16].y<lm[14].y,lm[20].y<lm[18].y];
if(f.every(Boolean))return"open palm";
if(f.every(v=>!v))return"fist";
if(f[0]&&!f[1]&&!f[2]&&!f[3])return"point";
if(f[0]&&f[1]&&!f[2]&&!f[3])return"victory";
return"tracking"
}
function handleGesture(g){
if(g==="open palm"){setState("AWAKE");addFeed("Gesture: open palm -> JARVIS awake.")}
else if(g==="fist"){setState("STANDBY");addFeed("Gesture: fist -> HUD standby.")}
else if(g==="point")addFeed("Gesture: point -> holographic cursor active.")
else if(g==="victory")addFeed("Gesture: victory -> panel command.")
else if(g==="pinch")addFeed("Gesture: pinch -> holographic selection.")
}

function toggleWakeWord(){
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(!SR){addFeed("Wake-word helper is not supported by this browser.");return}
if(wakeOn){wakeRecognition?.stop();wakeOn=false;$("wakeBtn").textContent="WAKE WORD: OFF";return}
wakeRecognition=new SR();wakeRecognition.continuous=true;wakeRecognition.interimResults=true;wakeRecognition.lang="en-US";
wakeRecognition.onresult=event=>{
for(let i=event.resultIndex;i<event.results.length;i++){
const text=event.results[i][0].transcript.toLowerCase();
if(text.includes("jarvis")){setState("WAKE");addFeed('Wake word detected: "Jarvis".');if(!room)connectJarvis()}
}};
wakeRecognition.onend=()=>{if(wakeOn){try{wakeRecognition.start()}catch{}}};
wakeRecognition.start();wakeOn=true;$("wakeBtn").textContent="WAKE WORD: ON";addFeed("Wake-word listener armed.")
}

$("connectBtn").addEventListener("click",connectJarvis);
$("cameraBtn").addEventListener("click",startHandTracking);
$("wakeBtn").addEventListener("click",toggleWakeWord);
