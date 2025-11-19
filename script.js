const USER_ID = "763055060678213652"; // ← ton ID

const avatarEl = document.getElementById("avatar");
const usernameEl = document.getElementById("username");
const tagEl = document.getElementById("discriminator");
const statusIndicator = document.getElementById("status-indicator");
const statusText = document.getElementById("status-text");
const voiceInfo = document.getElementById("voice-info");
const notVoice = document.getElementById("not-voice");
const channelName = document.getElementById("channel-name");
const minutesEl = document.getElementById("minutes");
let voiceStartTime = null;

// AFFICHAGE IMMÉDIAT AU CHARGEMENT (plus jamais 15 min d'attente)
fetch(`https://api.lanyard.rest/v1/users/${USER_ID}`)
  .then(r => r.json())
  .then(data => {
    if (data.success) updatePresence({ d: data.data });
  });

// FONCTIONS
function updatePresence(data) {
  if (!data?.d) return;
  const p = data.d;
  const user = p.discord_user;

  avatarEl.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=256`;
  usernameEl.textContent = user.global_name || user.username;
  tagEl.textContent = user.discriminator === "0" ? "" : `#${user.discriminator}`;

  const status = p.discord_status;
  statusIndicator.className = `status ${status}`;
  statusText.textContent = status === "online" ? "En ligne" :
                          status === "idle" ? "Absent" :
                          status === "dnd" ? "Ne pas déranger" : "Hors ligne";

  const voice = p.activities?.find(a => a.type === 2 && a.name !== "Spotify");
  if (voice) {
    voiceInfo.classList.remove("hidden");
    notVoice.classList.add("hidden");
    channelName.textContent = voice.state || "Salon vocal privé";
    voiceStartTime = voice.timestamps?.start || Date.now();
    updateDuration();
    setInterval(updateDuration, 30000);
  } else {
    voiceInfo.classList.add("hidden");
    notVoice.classList.remove("hidden");
    voiceStartTime = null;
  }
}

function updateDuration() {
  if (!voiceStartTime) return;
  const minutes = Math.floor((Date.now() - voiceStartTime) / 60000);
  minutesEl.textContent = minutes;
}

// WEBSOCKET POUR LES MISES À JOUR EN LIVE
const ws = new WebSocket("wss://api.lanyard.rest/socket");

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.op === 1) {
    ws.send(JSON.stringify({
      op: 2,
      d: { subscribe_to_id: USER_ID }
    }));
    setInterval(() => ws.send(JSON.stringify({ op: 3 })), data.d.heartbeat_interval);
  }

  if (data.op === 0 && data.t === "PRESENCE_UPDATE") {
    updatePresence(data);
  }
};
