/* ──────────────────────────────────────────────────────────────────────────────
   style.css  —  StrangerLink v2
   New: typing indicator, report modal, online counter, next stranger btn, ban screen
   ────────────────────────────────────────────────────────────────────────── */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:          #07090f;
  --bg2:         #0d1120;
  --bg3:         #111829;
  --surface:     #141c2e;
  --border:      #1e2d4a;
  --accent:      #00ffe0;
  --accent-dim:  #00ffe040;
  --accent2:     #ff3c6e;
  --accent2-dim: #ff3c6e30;
  --text:        #c8d8f0;
  --text-dim:    #5a7099;
  --green:       #00ff88;
  --yellow:      #f0c060;
  --orange:      #ff8c42;
  --font-mono:   'Share Tech Mono', monospace;
  --font-display:'Rajdhani', sans-serif;
  --radius:      4px;
  --transition:  .18s ease;
}

html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-mono); font-size: 14px; overflow: hidden; }

/* ── Scanlines ───────────────────────────────────────────────────────────── */
.scanlines { pointer-events: none; position: fixed; inset: 0; z-index: 9999; background: repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,.06) 2px, rgba(0,0,0,.06) 4px); }

/* ── Header ──────────────────────────────────────────────────────────────── */
header { display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; border-bottom: 1px solid var(--border); background: var(--bg2); height: 52px; }

.logo { font-family: var(--font-display); font-weight: 700; font-size: 22px; letter-spacing: .12em; }
.logo-bracket { color: var(--text-dim); }
.logo-accent  { color: var(--accent); }

.status-bar { display: flex; align-items: center; gap: 8px; font-size: 11px; letter-spacing: .08em; color: var(--text-dim); }
.sep { opacity: .3; }

/* ✅ Online counter */
.online-badge { display: flex; align-items: center; gap: 6px; }
.online-pulse { width: 7px; height: 7px; border-radius: 50%; background: var(--green); box-shadow: 0 0 6px var(--green); animation: pulse 2s ease infinite; }

.status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text-dim); transition: background var(--transition), box-shadow var(--transition); }
.status-dot.online   { background: var(--green);  box-shadow: 0 0 6px var(--green); }
.status-dot.waiting  { background: var(--yellow); box-shadow: 0 0 6px var(--yellow); animation: pulse 1.2s ease infinite; }
.status-dot.chatting { background: var(--accent);  box-shadow: 0 0 6px var(--accent); }

@keyframes pulse { 0%,100%{opacity:1}50%{opacity:.3} }

/* ── Screens ─────────────────────────────────────────────────────────────── */
.screen { display: none; height: calc(100vh - 52px); }
.screen.active { display: flex; }

/* ── Banned Screen ───────────────────────────────────────────────────────── */
#bannedScreen { align-items: center; justify-content: center; }
.banned-content { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.banned-icon { font-size: 64px; }
.banned-content h2 { font-family: var(--font-display); font-size: 32px; color: var(--accent2); letter-spacing: .1em; }
.banned-content p { color: var(--text-dim); font-size: 13px; max-width: 320px; line-height: 1.6; }

/* ── Landing ─────────────────────────────────────────────────────────────── */
#landingScreen { position: relative; align-items: center; justify-content: center; overflow: hidden; }

.landing-bg-grid { position: absolute; inset: 0; background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 40px 40px; opacity: .35; mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%); }

.landing-content { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 24px; text-align: center; padding: 40px 24px; }

h1.glitch { font-family: var(--font-display); font-size: clamp(32px, 6vw, 72px); font-weight: 700; letter-spacing: .08em; color: var(--text); position: relative; }
h1.glitch::before, h1.glitch::after { content: attr(data-text); position: absolute; inset: 0; clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%); }
h1.glitch::before { color: var(--accent2); animation: glitch-top 4s infinite; }
h1.glitch::after  { clip-path: polygon(0 66%, 100% 66%, 100% 100%, 0 100%); color: var(--accent); animation: glitch-bot 4s infinite; }

@keyframes glitch-top { 0%,90%,100%{transform:translateX(0);opacity:0} 92%{transform:translateX(-3px);opacity:.8} 94%{transform:translateX(3px);opacity:.8} 96%{transform:translateX(0);opacity:0} }
@keyframes glitch-bot { 0%,91%,100%{transform:translateX(0);opacity:0} 93%{transform:translateX(4px);opacity:.7} 95%{transform:translateX(-2px);opacity:.7} 97%{transform:translateX(0);opacity:0} }

.tagline { color: var(--text-dim); font-size: 13px; letter-spacing: .18em; text-transform: uppercase; }

.mode-select { display: flex; gap: 12px; }
.mode-btn { cursor: pointer; display: flex; align-items: center; gap: 8px; padding: 10px 20px; border: 1px solid var(--border); border-radius: var(--radius); color: var(--text-dim); font-family: var(--font-mono); font-size: 12px; letter-spacing: .08em; transition: all var(--transition); background: var(--surface); user-select: none; }
.mode-btn.active, .mode-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }

/* ── Buttons ─────────────────────────────────────────────────────────────── */
.btn { cursor: pointer; border: none; outline: none; font-family: var(--font-mono); letter-spacing: .1em; border-radius: var(--radius); transition: all var(--transition); }

.btn-start { display: flex; align-items: center; gap: 12px; padding: 16px 40px; background: var(--accent); color: var(--bg); font-size: 15px; font-weight: bold; box-shadow: 0 0 30px var(--accent-dim); }
.btn-start:hover { background: #fff; box-shadow: 0 0 50px rgba(0,255,224,.4); transform: translateY(-2px); }
.btn-start .btn-arrow { font-size: 20px; transition: transform var(--transition); }
.btn-start:hover .btn-arrow { transform: translateX(4px); }

.disclaimer { color: var(--text-dim); font-size: 10px; max-width: 340px; line-height: 1.6; letter-spacing: .04em; }

/* ── Chat Screen ─────────────────────────────────────────────────────────── */
#chatScreen { flex-direction: row; }

/* ── Video Panel ─────────────────────────────────────────────────────────── */
.video-panel { flex: 1; display: flex; flex-direction: column; background: #000; border-right: 1px solid var(--border); overflow: hidden; position: relative; }

.video-wrap { position: relative; flex: 1; overflow: hidden; background: #050810; }
.video-wrap.self { position: absolute; bottom: 16px; right: 16px; width: 180px; height: 135px; border: 1px solid var(--accent); border-radius: var(--radius); box-shadow: 0 0 20px rgba(0,255,224,.15); z-index: 10; flex: none; }

video { width: 100%; height: 100%; object-fit: cover; display: block; }

.video-label { position: absolute; top: 10px; left: 12px; font-size: 10px; letter-spacing: .12em; color: var(--accent); background: rgba(0,0,0,.6); padding: 2px 8px; border-radius: 2px; border: 1px solid var(--accent-dim); }
.video-wrap.self .video-label { font-size: 9px; }

.video-status { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: var(--text-dim); font-size: 12px; letter-spacing: .1em; background: rgba(5,8,16,.8); }
.video-status.hidden { display: none; }

/* ── Chat Panel ──────────────────────────────────────────────────────────── */
.chat-panel { width: 340px; display: flex; flex-direction: column; background: var(--bg2); flex-shrink: 0; }

.chat-header { padding: 10px 14px; border-bottom: 1px solid var(--border); font-size: 11px; letter-spacing: .12em; color: var(--text-dim); display: flex; align-items: center; justify-content: space-between; }

/* ✅ Report button */
.btn-report { background: transparent; border: 1px solid var(--border); color: var(--text-dim); font-size: 10px; padding: 4px 10px; letter-spacing: .06em; }
.btn-report:hover:not(:disabled) { border-color: var(--accent2); color: var(--accent2); background: var(--accent2-dim); }
.btn-report:disabled { opacity: .3; cursor: not-allowed; }

/* Messages */
.chat-messages { flex: 1; overflow-y: auto; padding: 14px 12px 8px; display: flex; flex-direction: column; gap: 8px; scroll-behavior: smooth; }
.chat-messages::-webkit-scrollbar { width: 4px; }
.chat-messages::-webkit-scrollbar-track { background: transparent; }
.chat-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.msg { max-width: 85%; padding: 8px 12px; border-radius: var(--radius); font-size: 13px; line-height: 1.5; animation: msgIn .15s ease-out; word-break: break-word; }
@keyframes msgIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

.msg.self     { align-self: flex-end; background: var(--accent-dim); border: 1px solid rgba(0,255,224,.2); color: var(--accent); }
.msg.stranger { align-self: flex-start; background: var(--surface); border: 1px solid var(--border); color: var(--text); }

.sys-msg { align-self: center; font-size: 10px; color: var(--text-dim); letter-spacing: .08em; padding: 4px 0; text-align: center; }

/* ✅ Typing indicator */
.typing-indicator { display: none; align-items: center; gap: 6px; padding: 6px 14px; font-size: 11px; color: var(--text-dim); border-top: 1px solid var(--border); min-height: 32px; }
.typing-indicator.visible { display: flex; }

.typing-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); opacity: .4; animation: typingBounce 1.2s ease infinite; }
.typing-dot:nth-child(2) { animation-delay: .2s; }
.typing-dot:nth-child(3) { animation-delay: .4s; }

@keyframes typingBounce { 0%,60%,100%{transform:translateY(0);opacity:.4} 30%{transform:translateY(-4px);opacity:1} }

.typing-label { font-size: 11px; letter-spacing: .06em; }

/* Input row */
.chat-input-row { display: flex; padding: 10px 12px; gap: 8px; border-top: 1px solid var(--border); background: var(--bg); }

#chatInput { flex: 1; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text); font-family: var(--font-mono); font-size: 13px; padding: 8px 12px; outline: none; transition: border-color var(--transition); }
#chatInput:focus { border-color: var(--accent); }
#chatInput::placeholder { color: var(--text-dim); }
#chatInput:disabled { opacity: .4; cursor: not-allowed; }

.btn-send { background: var(--accent); color: var(--bg); font-size: 11px; padding: 8px 14px; }
.btn-send:hover:not(:disabled) { background: #fff; }
.btn-send:disabled { opacity: .35; cursor: not-allowed; }

/* ✅ Action buttons */
.chat-actions { display: flex; gap: 8px; padding: 10px 12px 14px; }

.btn-next { flex: 2; padding: 10px; font-size: 11px; letter-spacing: .06em; background: var(--accent-dim); border: 1px solid var(--accent); color: var(--accent); }
.btn-next:hover { background: var(--accent); color: var(--bg); box-shadow: 0 0 20px var(--accent-dim); }

.btn-stop { flex: 1; padding: 10px; font-size: 11px; letter-spacing: .08em; border: 1px solid var(--border); background: var(--surface); color: var(--text-dim); }
.btn-stop:hover { border-color: var(--accent2); color: var(--accent2); }

/* ✅ Report Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.7); display: none; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
.modal-overlay.open { display: flex; }

.modal { background: var(--bg2); border: 1px solid var(--border); border-radius: 6px; padding: 28px; width: 340px; max-width: 90vw; box-shadow: 0 0 40px rgba(0,0,0,.6); animation: modalIn .2s ease; }
@keyframes modalIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }

.modal-title { font-family: var(--font-display); font-size: 20px; font-weight: 700; letter-spacing: .1em; margin-bottom: 8px; }
.modal-desc { color: var(--text-dim); font-size: 12px; margin-bottom: 18px; line-height: 1.5; }

.report-reasons { display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px; }
.reason-opt { display: flex; align-items: center; gap: 10px; color: var(--text); font-size: 13px; cursor: pointer; padding: 8px 12px; border: 1px solid var(--border); border-radius: var(--radius); transition: all var(--transition); }
.reason-opt:hover { border-color: var(--accent2); color: var(--accent2); background: var(--accent2-dim); }
.reason-opt input { accent-color: var(--accent2); }

.modal-actions { display: flex; gap: 10px; }
.btn-cancel { flex: 1; padding: 10px; background: var(--surface); border: 1px solid var(--border); color: var(--text-dim); font-size: 12px; }
.btn-cancel:hover { border-color: var(--text-dim); color: var(--text); }
.btn-report-submit { flex: 2; padding: 10px; background: var(--accent2); color: #fff; border: none; font-size: 12px; font-weight: bold; }
.btn-report-submit:hover { background: #ff6b8e; box-shadow: 0 0 20px var(--accent2-dim); }

/* ✅ Toast */
.toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(20px); background: var(--surface); border: 1px solid var(--border); color: var(--text); padding: 10px 24px; border-radius: 30px; font-size: 12px; letter-spacing: .08em; opacity: 0; pointer-events: none; transition: all .3s ease; z-index: 2000; white-space: nowrap; }
.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
.toast.success { border-color: var(--green); color: var(--green); }
.toast.error   { border-color: var(--accent2); color: var(--accent2); }

/* ── Text-only mode ─────────────────────────────────────────────────────── */
#chatScreen.text-only .video-panel { display: none; }
#chatScreen.text-only .chat-panel  { width: 100%; }

/* ── Responsive ─────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  #chatScreen { flex-direction: column-reverse; }
  .video-panel { height: 220px; border-right: none; border-bottom: 1px solid var(--border); flex: none; }
  .chat-panel { width: 100%; flex: 1; }
  .video-wrap.self { width: 90px; height: 68px; bottom: 8px; right: 8px; }
}
