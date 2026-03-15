/**
 * app.js  —  StrangerLink v2
 * ──────────────────────────
 * ✅ Next Stranger button
 * ✅ Typing indicator
 * ✅ WebRTC video chat
 * ✅ Online users counter
 * ✅ Report & ban system
 */

// ── DOM refs ──────────────────────────────────────────────────────────────────
const landingScreen   = document.getElementById("landingScreen");
const chatScreen      = document.getElementById("chatScreen");
const bannedScreen    = document.getElementById("bannedScreen");
const bannedMsg       = document.getElementById("bannedMsg");

const localVideo      = document.getElementById("localVideo");
const remoteVideo     = document.getElementById("remoteVideo");
const remoteStatus    = document.getElementById("remoteStatus");

const chatMessages    = document.getElementById("chatMessages");
const chatInput       = document.getElementById("chatInput");
const chatStatusLabel = document.getElementById("chatStatusLabel");
const typingIndicator = document.getElementById("typingIndicator");

const btnStart        = document.getElementById("btnStart");
const btnSend         = document.getElementById("btnSend");
const btnNext         = document.getElementById("btnNext");       // ✅ Next Stranger
const btnStop         = document.getElementById("btnStop");
const btnReport       = document.getElementById("btnReport");     // ✅ Report
const btnReportCancel = document.getElementById("btnReportCancel");
const btnReportSubmit = document.getElementById("btnReportSubmit");
const reportModal     = document.getElementById("reportModal");

const statusDot       = document.getElementById("statusDot");
const statusText      = document.getElementById("statusText");
const onlineCountEl   = document.getElementById("onlineCount");  // ✅ Online counter
const toast           = document.getElementById("toast");

const modeBtns        = document.querySelectorAll(".mode-btn");
const modeInputs      = document.querySelectorAll("input[name='mode']");

// ── State ─────────────────────────────────────────────────────────────────────
let socket         = null;
let localStream    = null;
let peerConnection = null;
let isInitiator    = false;
let currentMode    = "video";
let typingTimer    = null;
let isTyping       = false;

// ── ICE / STUN config ─────────────────────────────────────────────────────────
const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" }
  ]
};

// ── Toast helper ──────────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg, type = "") {
  toast.textContent = msg;
  toast.className = "toast show " + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = "toast"; }, 3000);
}

// ── Status helpers ────────────────────────────────────────────────────────────
function setStatus(state, label) {
  statusDot.className = "status-dot " + state;
  statusText.textContent = label;
}

// ── Message helpers ───────────────────────────────────────────────────────────
function sysMsg(text) {
  const el = document.createElement("div");
  el.className = "sys-msg";
  el.textContent = text;
  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendMsg(text, self = true) {
  const el = document.createElement("div");
  el.className = "msg " + (self ? "self" : "stranger");
  el.textContent = text;
  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ── Screen switchers ──────────────────────────────────────────────────────────
function showLanding() {
  chatScreen.classList.remove("active");
  bannedScreen.classList.remove("active");
  landingScreen.classList.add("active");
  setStatus("", "OFFLINE");
}

function showChat() {
  landingScreen.classList.remove("active");
  bannedScreen.classList.remove("active");
  chatScreen.classList.add("active");
  chatScreen.classList.toggle("text-only", currentMode === "text");
}

function showBanned(msg) {
  landingScreen.classList.remove("active");
  chatScreen.classList.remove("active");
  bannedScreen.classList.add("active");
  if (msg) bannedMsg.textContent = msg;
}

// ── Enable / disable chat input ───────────────────────────────────────────────
function enableChat(on) {
  chatInput.disabled = !on;
  btnSend.disabled   = !on;
  btnReport.disabled = !on;
  if (on) chatInput.focus();
}

// ── Typing indicator ──────────────────────────────────────────────────────────
// Emit typing_start when user begins typing, typing_stop after 1.5s of inactivity
chatInput.addEventListener("input", () => {
  if (!socket || chatInput.disabled) return;

  if (!isTyping) {
    isTyping = true;
    socket.emit("typing_start");
  }

  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    isTyping = false;
    socket.emit("typing_stop");
  }, 1500);
});

// ── Send message ──────────────────────────────────────────────────────────────
function sendMessage() {
  const text = chatInput.value.trim();
  if (!text || !socket) return;

  // Stop typing indicator when message is sent
  clearTimeout(typingTimer);
  isTyping = false;
  socket.emit("typing_stop");

  socket.emit("chat_message", text);
  appendMsg(text, true);
  chatInput.value = "";
}

// ── WebRTC ────────────────────────────────────────────────────────────────────
async function getLocalStream() {
  if (localStream) return localStream;
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
    return localStream;
  } catch (e) {
    sysMsg("⚠ Camera/mic denied — switching to text-only.");
    currentMode = "text";
    chatScreen.classList.add("text-only");
    return null;
  }
}

function stopLocalStream() {
  if (localStream) {
    localStream.getTracks().forEach(t => t.stop());
    localStream = null;
    localVideo.srcObject = null;
  }
}

function closeWebRTC() {
  if (peerConnection) { peerConnection.close(); peerConnection = null; }
}

async function setupWebRTC() {
  closeWebRTC();
  const stream = await getLocalStream();

  peerConnection = new RTCPeerConnection(ICE_SERVERS);

  if (stream) stream.getTracks().forEach(t => peerConnection.addTrack(t, stream));

  peerConnection.ontrack = (e) => {
    remoteVideo.srcObject = e.streams[0];
    remoteStatus.classList.add("hidden");
  };

  peerConnection.onicecandidate = (e) => {
    if (e.candidate) socket.emit("webrtc_ice_candidate", e.candidate);
  };

  peerConnection.onconnectionstatechange = () => {
    const s = peerConnection?.connectionState;
    if (s === "disconnected" || s === "failed" || s === "closed") {
      remoteStatus.textContent = "Connection lost.";
      remoteStatus.classList.remove("hidden");
    }
  };

  if (isInitiator) {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("webrtc_offer", offer);
  }
}

// ── Report modal ──────────────────────────────────────────────────────────────
btnReport.addEventListener("click", () => reportModal.classList.add("open"));
btnReportCancel.addEventListener("click", () => reportModal.classList.remove("open"));

btnReportSubmit.addEventListener("click", () => {
  const selected = document.querySelector("input[name='reason']:checked");
  const reason   = selected ? selected.value : "Other";
  socket.emit("report_user", { reason });
  reportModal.classList.remove("open");
});

// Close modal on overlay click
reportModal.addEventListener("click", (e) => {
  if (e.target === reportModal) reportModal.classList.remove("open");
});

// ── Mode buttons ──────────────────────────────────────────────────────────────
modeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    modeBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});
modeInputs.forEach(input => {
  input.addEventListener("change", () => { currentMode = input.value; });
});

// ── Connect to Socket.io ──────────────────────────────────────────────────────
function connectSocket() {
  if (socket && socket.connected) return;
  socket = io();

  socket.on("connect", () => setStatus("online", "CONNECTED"));
  socket.on("disconnect", () => setStatus("", "OFFLINE"));

  // ✅ Online counter
  socket.on("online_count", (count) => {
    onlineCountEl.textContent = count;
  });

  // ── Matchmaking ────────────────────────────────────────────────────────────
  socket.on("waiting", () => {
    setStatus("waiting", "SEARCHING…");
    chatStatusLabel.textContent = "● SEARCHING FOR STRANGER…";
    sysMsg("Looking for someone to talk to…");
    enableChat(false);
    typingIndicator.classList.remove("visible");
  });

  socket.on("matched", async ({ initiator }) => {
    isInitiator = initiator;
    setStatus("chatting", "CHATTING");
    chatStatusLabel.textContent = "● STRANGER CONNECTED";
    sysMsg("✓ Stranger connected! Say hello.");
    remoteStatus.classList.remove("hidden");
    remoteStatus.textContent = "waiting for video…";
    enableChat(true);

    if (currentMode === "video") await setupWebRTC();
  });

  socket.on("partner_disconnected", () => {
    sysMsg("Stranger has disconnected.");
    chatStatusLabel.textContent = "● STRANGER LEFT";
    setStatus("online", "IDLE");
    enableChat(false);
    closeWebRTC();
    remoteVideo.srcObject = null;
    remoteStatus.classList.remove("hidden");
    remoteStatus.textContent = "Stranger disconnected.";
    typingIndicator.classList.remove("visible");
  });

  socket.on("stopped", () => {
    enableChat(false);
    closeWebRTC();
    stopLocalStream();
    typingIndicator.classList.remove("visible");
    showLanding();
  });

  // ── WebRTC signaling ───────────────────────────────────────────────────────
  socket.on("webrtc_offer", async (offer) => {
    if (!peerConnection) await setupWebRTC();
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("webrtc_answer", answer);
  });

  socket.on("webrtc_answer", async (answer) => {
    if (peerConnection) await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  });

  socket.on("webrtc_ice_candidate", async (candidate) => {
    if (peerConnection) {
      try { await peerConnection.addIceCandidate(new RTCIceCandidate(candidate)); } catch {}
    }
  });

  // ── Chat ───────────────────────────────────────────────────────────────────
  socket.on("chat_message", ({ text }) => {
    appendMsg(text, false);
    typingIndicator.classList.remove("visible"); // hide typing when msg arrives
  });

  // ✅ Typing indicator events
  socket.on("typing_start", () => typingIndicator.classList.add("visible"));
  socket.on("typing_stop",  () => typingIndicator.classList.remove("visible"));

  // ✅ Report acknowledgment
  socket.on("report_ack", ({ success, msg }) => {
    showToast(msg, success ? "success" : "error");
  });

  // ✅ Ban notification
  socket.on("banned", (msg) => {
    closeWebRTC();
    stopLocalStream();
    showBanned(msg);
  });
}

// ── Button events ─────────────────────────────────────────────────────────────

// Start
btnStart.addEventListener("click", async () => {
  const active = document.querySelector("input[name='mode']:checked");
  currentMode  = active ? active.value : "video";

  connectSocket();
  showChat();
  chatMessages.innerHTML = "";
  sysMsg("Connecting you to a random stranger…");

  if (currentMode === "video") await getLocalStream();
  socket.emit("find_stranger");
});

// Send
btnSend.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

// ✅ Next Stranger — disconnect current, auto-find new one
btnNext.addEventListener("click", () => {
  if (!socket) return;
  chatMessages.innerHTML = "";
  closeWebRTC();
  remoteVideo.srcObject = null;
  remoteStatus.classList.remove("hidden");
  remoteStatus.textContent = "waiting for connection…";
  typingIndicator.classList.remove("visible");
  enableChat(false);
  sysMsg("Finding a new stranger…");
  socket.emit("skip");
});

// Stop
btnStop.addEventListener("click", () => {
  if (!socket) return;
  socket.emit("stop");
  closeWebRTC();
  stopLocalStream();
  typingIndicator.classList.remove("visible");
  showLanding();
});
