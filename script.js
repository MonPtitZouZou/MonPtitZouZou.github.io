// --- Liste des utilisateurs ---
const users = [
  { pseudo: "MonPtitZouZou", avatar: "https://cdn.discordapp.com/avatars/763055060678213652/9457b7812017bee62a8edd6cce1d9034.webp?size=256", birthday: { day: 10, month: 10, hour:0, minute:0, second:0, year:2002 } },
  { pseudo: "MecKaeL", avatar: "https://cdn.discordapp.com/avatars/644934592901414932/355a8d8592a487ca18e7e142c3ef8746.webp", birthday: { day: 25, month: 7, hour:0, minute:0, second:0, year:2004 } },
  { pseudo: "Printillie", avatar: "https://cdn.discordapp.com/avatars/689781399661838347/69c0bb311a7baab4f82cd260b8ebab3b.webp", birthday: { day: 21, month: 2, hour:0, minute:0, second:0, year:2005 } },
  { pseudo: "Anaïs", avatar: "https://cdn.discordapp.com/avatars/459373865932685324/fd079e443979b0979e03cf0b44ab40e1.webp", birthday: { day: 31, month: 11, hour:0, minute:0, second:0, year:2005 } },
  { pseudo: "Marie", avatar: "https://cdn.discordapp.com/avatars/760428505149997056/61e4defc2121796de1d11886e1b41947.webp", birthday: { day: 22, month: 9, hour:0, minute:0, second:0, year:2005 } },
  { pseudo: "Timo", avatar: "https://cdn.discordapp.com/avatars/384046505042116610/200188c1a9447615b9d8e73fda7ce564.webp", birthday: { day: 19, month: 10, hour:0, minute:0, second:0, year:2005 } },
  { pseudo: "Rocco", avatar: "https://cdn.discordapp.com/avatars/706514911643172884/0fb4b0fd6b244df4dfcdc6b4ba9a724a.webp", birthday: { day: 24, month: 4, hour:0, minute:0, second:0, year:2008 } },
  { pseudo: "Mathys", avatar: "https://cdn.discordapp.com/avatars/836362324532658257/0b8b2d16f61c370962618ca46e03698c.webp", birthday: { day: 24, month: 4, hour:0, minute:0, second:0, year:2007 } },
];

// --- Confettis ---
const confettiCount = 150;
for(let i=0;i<confettiCount;i++){
  const div = document.createElement('div');
  div.className = 'confetti';
  div.style.left = Math.random()*100+'vw';
  div.style.backgroundColor = ['#FFD700','#FF69B4','#00FFFF','#FF4500'][Math.floor(Math.random()*4)];
  div.style.animationDuration = (3 + Math.random()*5)+'s';
  div.style.setProperty("--round", Math.random() > 0.5 ? 1 : 0);
  document.body.appendChild(div);
}

// --- Temps avant anniversaire ---
function timeUntilBirthday(birthday){
  const now = new Date();
  const parisNow = new Date(now.toLocaleString("en-US",{timeZone:"Europe/Paris"}));
  let nextBirthday = new Date(parisNow.getFullYear(), birthday.month, birthday.day, birthday.hour||0, birthday.minute||0, birthday.second||0);

  if(parisNow.getDate() === birthday.day && parisNow.getMonth() === birthday.month){
    return 0;
  }
  if(parisNow > nextBirthday) nextBirthday.setFullYear(nextBirthday.getFullYear()+1);
  return nextBirthday - parisNow;
}

// --- Trier ---
users.sort((a,b)=>timeUntilBirthday(a.birthday)-timeUntilBirthday(b.birthday));

// --- Génération HTML ---
const container = document.getElementById("users-container");

users.forEach((user, index) => {
  const div = document.createElement("div");
  div.className = "user-container";

  const now = new Date();
  const parisNow = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  const b = user.birthday;

  // 🔹 Date complète sous le pseudo (jour + mois + année ou X)
  const monthNames = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const birthDateHtml = `<div class="birth-date" style="font-size:0.9em; margin-bottom:5px;">
    ${b.day} ${monthNames[b.month] || ''} ${b.year || 'X'}
  </div>`;

  // 🔹 Texte âge si connu
  let ageTextHtml = '';
  if (b.year) {
    let ageBefore = parisNow.getFullYear() - b.year;
    // Si l'anniversaire n'est pas encore passé cette année, on retire 1
    if (parisNow.getMonth() < b.month || (parisNow.getMonth() === b.month && parisNow.getDate() < b.day)) {
    ageBefore--;
}
let ageAfter = ageBefore + 1;
ageTextHtml = `<p class="age">${ageBefore} ans -> ${ageAfter} ans</p>`;
  } else {
    ageTextHtml = `<p class="age">X ans -> X ans</p>`;
  }

  div.innerHTML = `
    <img id="avatar${index}" class="avatar" src="${user.avatar}" alt="Avatar"/>
    <h1 id="username${index}">${user.pseudo}</h1>
    ${birthDateHtml}
    ${ageTextHtml}
    <div id="status-indicator${index}" class="status offline" style="visibility:hidden;">
      <span id="status-text${index}">&nbsp;</span>
    </div>
    <h2>Prochain anniversaire 🎉</h2>
    <div id="birthday-countdown${index}" class="birthday-countdown">0 jours 0 h 0 min 0 s</div>
  `;
  container.appendChild(div);
});

// --- Mise à jour ---
function updateCountdowns(){
  const now=new Date();
  const parisNow=new Date(now.toLocaleString("en-US",{timeZone:"Europe/Paris"}));

  users.forEach((user,index)=>{
    const b = user.birthday;
    const countdown = document.getElementById(`birthday-countdown${index}`);
    const ageText = document.getElementById(`username${index}`).nextElementSibling.nextElementSibling; // sauter birth-date
    const h2 = countdown.previousElementSibling;
    const userBox = document.getElementById(`avatar${index}`).parentElement;

    if(parisNow.getDate() === b.day && parisNow.getMonth() === b.month){
      if(h2) h2.style.visibility='hidden';
      if(countdown) countdown.textContent="Joyeux anniversaire 🎉";
      if(ageText){
        if(b.year){
            ageText.textContent = `Fête son ${parisNow.getFullYear()-b.year}ème anniversaire 🎉`;
        } else {
            ageText.textContent = `Fête son Xème anniversaire 🎉`;
        }
      }

      // Glow et confettis
      userBox.classList.add('birthday');

      return;
    } else {
      userBox.classList.remove('birthday');
    }

    // Compte à rebours normal
    let nextBirthday=new Date(parisNow.getFullYear(),b.month,b.day,0,0,0);
    if(parisNow>nextBirthday) nextBirthday.setFullYear(nextBirthday.getFullYear()+1);
    const diff=nextBirthday-parisNow;
    const totalSeconds=Math.floor(diff/1000);
    const days=Math.floor(totalSeconds/86400);
    const hours=Math.floor(totalSeconds/3600)%24;
    const minutes=Math.floor(totalSeconds/60)%60;
    const seconds=totalSeconds%60;

    if(countdown) countdown.textContent=`${days} jours ${hours} h ${minutes} min ${seconds} s`;
  });
}

updateCountdowns();
setInterval(updateCountdowns,1000);
