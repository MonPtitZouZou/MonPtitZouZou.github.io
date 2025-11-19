// CHANGE UNIQUEMENT CETTE LIGNE
const USER_ID = "TON_USER_ID_ICI";   // ← Mets ton vrai User ID ici !

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

function updatePresence(data) {
  if (!data || !data.data) return;
  const p = data.data;
  const user = p.discord_user;

  // Avatar + pseudo
  avatarEl.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=256`;
  usernameEl.textContent = user.global_name || user.username;
  tagEl.textContent = `#${user.discriminator}`;

  // Statut global
  const status = p.discord_status;
  statusIndicator.className = `status ${status}`;
  statusText.textContent = status === "online" ? "En ligne" :
                          status === "idle" ? "Absent" :
                          status === "dnd" ? "Ne pas déranger" : "Hors ligne";

  // Recherche activité vocale (type === 2)
  const voice = p.activities?.find(a => a.type === 2);

  if (voice) {
    voiceInfo.classList.remove("hidden");
    notVoice.classList.add("hidden");
    channelName.textContent = voice.state || "Salon vocal privé";
    
    if (voice.timestamps?.start) {
      voiceStartTime = voice.timestamps.start;
      updateDuration();
      setInterval(updateDuration, 30000); // toutes les 30s
    }
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

// Fetch toutes les 5 secondes
setInterval(() => {
  fetch(`https://api.lanyard.rest/v1/users/${USER_ID}`)
    .then(r => r.json())
    .then(updatePresence);
}, 5000);

// Premier chargement
fetch(`https://api.lanyard.rest/v1/users/${USER_ID}`).then(r => r.json()).then(updatePresence);
