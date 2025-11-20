// --- Liste des utilisateurs ---
const users = [
  {
    pseudo: "MonPtitZouZou",
    avatar: "https://cdn.discordapp.com/avatars/763055060678213652/9457b7812017bee62a8edd6cce1d9034.webp?size=256",
    birthday: { day: 10, month: 10, hour: 0, minute: 0, second: 0, year: 2002 } // 10 novembre 2002
  },
  {
    pseudo: "MecKaeL",
    avatar: "https://images-ext-1.discordapp.net/external/370M3txhO5n7vlK_SZTfuZpgjUeDvaxzYGmQU1D4B54/https/cdn.discordapp.com/avatars/644934592901414932/355a8d8592a487ca18e7e142c3ef8746.webp?format=webp",
    birthday: { day: 25, month: 7, hour: 0, minute: 0, second: 0, year: 2004 } // 25 août 2005
  },
  {
    pseudo: "Printillie",
    avatar: "https://cdn.discordapp.com/avatars/689781399661838347/69c0bb311a7baab4f82cd260b8ebab3b.webp",
    birthday: { day: 21, month: 2, hour: 0, minute: 0, second: 0, year: 2005 } // 31 aout 2005
  },
  {
    pseudo: "Anaïs",
    avatar: "https://cdn.discordapp.com/avatars/459373865932685324/fd079e443979b0979e03cf0b44ab40e1.webp",
    birthday: { day: 31, month: 11, hour: 0, minute: 0, second: 0, year: 2005 } // 31 décembre 2005
  },
  {
    pseudo: "Marie",
    avatar: "https://cdn.discordapp.com/avatars/760428505149997056/61e4defc2121796de1d11886e1b41947.webp",
    birthday: { day: 22, month: 9, hour: 0, minute: 0, second: 0, year: 2005 } // 22 septembre 2005
  }
];

// Décor confettis
const confettiCount = 50;
for(let i=0;i<confettiCount;i++){
  const div = document.createElement('div');
  div.className = 'confetti';
  div.style.left = Math.random() * 100 + 'vw';
  div.style.backgroundColor = ['#FFD700','#FF69B4','#00FFFF','#FF4500'][Math.floor(Math.random()*4)];
  div.style.animationDuration = (3 + Math.random()*5) + 's';
  document.body.appendChild(div);
}


// --- Fonction pour calculer le temps restant ---
function timeUntilBirthday(birthday) {
  const now = new Date();
  const parisNow = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  let nextBirthday = new Date(parisNow.getFullYear(), birthday.month, birthday.day, birthday.hour || 0, birthday.minute || 0, birthday.second || 0);
  if(parisNow > nextBirthday) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  return nextBirthday - parisNow;
}

// --- Trier les utilisateurs par prochain anniversaire ---
users.sort((a,b) => timeUntilBirthday(a.birthday) - timeUntilBirthday(b.birthday));

// --- Génération HTML ---
const container = document.getElementById("users-container");

users.forEach((user, index) => {
  const div = document.createElement("div");
  div.className = "user-container";

  const now = new Date();
  const parisNow = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  let age = parisNow.getFullYear() - user.birthday.year;
  const nextBirthdayDate = new Date(parisNow.getFullYear(), user.birthday.month, user.birthday.day);
  if(parisNow > nextBirthdayDate) age += 1;

  let html = `
    <img id="avatar${index}" class="avatar" src="${user.avatar}" alt="Avatar" />
    <h1 id="username${index}">${user.pseudo}</h1>
    <p class="age"> ${age-1} ans -> ${age} ans</p>
  `;

  // Statut
  if(user.statut){
    html += `
      <div id="status-indicator${index}" class="status ${user.statut}">
        <span id="status-text${index}">${user.statut}</span>
      </div>
    `;
  } else {
    html += `
      <div id="status-indicator${index}" class="status offline" style="visibility:hidden;">
        <span id="status-text${index}">&nbsp;</span>
      </div>
    `;
  }

  html += `
    <h2>Prochain anniversaire 🎉</h2>
    <div id="birthday-countdown${index}" class="birthday-countdown">0 jours 0 h 0 min 0 s</div>
  `;

  div.innerHTML = html;
  container.appendChild(div);
});

// --- Mise à jour des comptes à rebours ---
function updateCountdowns() {
  const now = new Date();
  const parisNow = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Paris" }));

  users.forEach((user, index) => {
    const b = user.birthday;
    let nextBirthday = new Date(parisNow.getFullYear(), b.month, b.day, 0, 0, 0);
    if(parisNow > nextBirthday) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);

    if(parisNow.getDate() === b.day && parisNow.getMonth() === b.month) {
      document.getElementById(`birthday-countdown${index}`).textContent = "Joyeux anniversaire 🎉";
      return;
    }

    const diff = nextBirthday - parisNow;
    const totalSeconds = Math.floor(diff / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = totalSeconds % 60;

    document.getElementById(`birthday-countdown${index}`).textContent =
      `${days} jours ${hours} h ${minutes} min ${seconds} s`;
  });
}

// --- Lancer la mise à jour toutes les secondes ---
updateCountdowns();
setInterval(updateCountdowns, 1000);
