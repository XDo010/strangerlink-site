/**
 * server.js  —  StrangerLink v2
 * ─────────────────────────────
 * New features:
 *  ✅ Next Stranger button (skip)
 *  ✅ Typing indicator
 *  ✅ WebRTC video signaling
 *  ✅ Online users counter
 *  ✅ Report & ban system
 */

const express = require("express");
const http    = require("http");
const { Server } = require("socket.io");
const path    = require("path");

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, "public")));

// ── State ─────────────────────────────────────────────────────────────────────
let waitingQueue  = [];               // socket IDs waiting for a match
const activePairs = new Map();        // socketId → partnerSocketId
const bannedIPs   = new Set();        // banned IP addresses
const reportLog   = new Map();        // socketId → { count, reporters: Set }
const BAN_THRESHOLD = 3;             // reports needed to auto-ban

// ── Helpers ───────────────────────────────────────────────────────────────────
function getOnlineCount() { return io.sockets.sockets.size; }

function broadcastOnlineCount() {
  io.emit("online_count", getOnlineCount());
}

function removeFromQueue(socketId) {
  waitingQueue = waitingQueue.filter(id => id !== socketId);
}

function pairSockets(sockA, sockB) {
  activePairs.set(sockA.id, sockB.id);
  activePairs.set(sockB.id, sockA.id);
  sockA.emit("matched", { initiator: true });
  sockB.emit("matched", { initiator: false });
  console.log(`✅ Paired  ${sockA.id.slice(0,6)} ↔ ${sockB.id.slice(0,6)}`);
}

function disconnectPartner(socket) {
  const partnerId = activePairs.get(socket.id);
  if (!partnerId) return;

  activePairs.delete(socket.id);
  activePairs.delete(partnerId);

  const partner = io.sockets.sockets.get(partnerId);
  if (partner) partner.emit("partner_disconnected");
}

function getIP(socket) {
  return socket.handshake.headers["x-forwarded-for"] ||
         socket.handshake.address;
}

// ── Socket Events ─────────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  const ip = getIP(socket);

  // Block banned IPs immediately
  if (bannedIPs.has(ip)) {
    socket.emit("banned", "You have been banned for violating community guidelines.");
    socket.disconnect(true);
    return;
  }

  console.log(`🟢 Connected  ${socket.id.slice(0,6)}  (${getOnlineCount()} online)`);
  broadcastOnlineCount();

  // ── find_stranger ──────────────────────────────────────────────────────────
  socket.on("find_stranger", () => {
    disconnectPartner(socket);
    removeFromQueue(socket.id);

    // Filter out disconnected sockets from queue
    waitingQueue = waitingQueue.filter(id => io.sockets.sockets.has(id));

    if (waitingQueue.length > 0) {
      const partnerId = waitingQueue.shift();
      const partner   = io.sockets.sockets.get(partnerId);
      if (partner) {
        pairSockets(socket, partner);
      } else {
        waitingQueue.push(socket.id);
        socket.emit("waiting");
      }
    } else {
      waitingQueue.push(socket.id);
      socket.emit("waiting");
    }
  });

  // ── skip / next stranger ───────────────────────────────────────────────────
  socket.on("skip", () => {
    disconnectPartner(socket);
    removeFromQueue(socket.id);
    // Auto re-queue
    waitingQueue = waitingQueue.filter(id => io.sockets.sockets.has(id));
    if (waitingQueue.length > 0) {
      const partnerId = waitingQueue.shift();
      const partner   = io.sockets.sockets.get(partnerId);
      if (partner) {
        pairSockets(socket, partner);
        return;
      }
    }
    waitingQueue.push(socket.id);
    socket.emit("waiting");
  });

  // ── stop ──────────────────────────────────────────────────────────────────
  socket.on("stop", () => {
    disconnectPartner(socket);
    removeFromQueue(socket.id);
    socket.emit("stopped");
  });

  // ── WebRTC signaling ───────────────────────────────────────────────────────
  socket.on("webrtc_offer", (data) => {
    const pid = activePairs.get(socket.id);
    if (pid) io.to(pid).emit("webrtc_offer", data);
  });

  socket.on("webrtc_answer", (data) => {
    const pid = activePairs.get(socket.id);
    if (pid) io.to(pid).emit("webrtc_answer", data);
  });

  socket.on("webrtc_ice_candidate", (data) => {
    const pid = activePairs.get(socket.id);
    if (pid) io.to(pid).emit("webrtc_ice_candidate", data);
  });

  // ── Chat message ───────────────────────────────────────────────────────────
  socket.on("chat_message", (text) => {
    if (typeof text !== "string" || text.trim().length === 0) return;
    if (text.length > 500) text = text.slice(0, 500);
    const pid = activePairs.get(socket.id);
    if (pid) io.to(pid).emit("chat_message", { text: text.trim() });
  });

  // ── Typing indicator ───────────────────────────────────────────────────────
  socket.on("typing_start", () => {
    const pid = activePairs.get(socket.id);
    if (pid) io.to(pid).emit("typing_start");
  });

  socket.on("typing_stop", () => {
    const pid = activePairs.get(socket.id);
    if (pid) io.to(pid).emit("typing_stop");
  });

  // ── Report system ──────────────────────────────────────────────────────────
  socket.on("report_user", ({ reason }) => {
    const partnerId = activePairs.get(socket.id);
    if (!partnerId) {
      socket.emit("report_ack", { success: false, msg: "No active stranger to report." });
      return;
    }

    const partner = io.sockets.sockets.get(partnerId);
    if (!partner) return;

    // Track reports against the partner
    if (!reportLog.has(partnerId)) {
      reportLog.set(partnerId, { count: 0, reporters: new Set() });
    }
    const record = reportLog.get(partnerId);

    if (record.reporters.has(socket.id)) {
      socket.emit("report_ack", { success: false, msg: "You already reported this user." });
      return;
    }

    record.reporters.add(socket.id);
    record.count++;

    console.log(`🚩 Report #${record.count} on ${partnerId.slice(0,6)} — Reason: ${reason}`);
    socket.emit("report_ack", { success: true, msg: "Report submitted. Thank you." });

    // Auto-ban after threshold
    if (record.count >= BAN_THRESHOLD) {
      const partnerIP = getIP(partner);
      bannedIPs.add(partnerIP);
      partner.emit("banned", "You have been banned for violating community guidelines.");
      partner.disconnect(true);
      console.log(`🔨 Auto-banned ${partnerId.slice(0,6)} (IP: ${partnerIP})`);
    }
  });

  // ── Disconnect ─────────────────────────────────────────────────────────────
  socket.on("disconnect", () => {
    disconnectPartner(socket);
    removeFromQueue(socket.id);
    reportLog.delete(socket.id);
    console.log(`🔴 Disconnected ${socket.id.slice(0,6)} (${getOnlineCount()-1} online)`);
    broadcastOnlineCount();
  });
});

// ── Start — uses PORT env variable (required by Railway/Render) ───────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🚀 Server running on port ${PORT}\n`);
});
