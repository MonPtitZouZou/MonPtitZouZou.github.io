// --- Liste des utilisateurs ---
const users = [
  { pseudo: "MonPtitZouZou", avatar: "https://cdn.discordapp.com/avatars/763055060678213652/9457b7812017bee62a8edd6cce1d9034.webp?size=256", birthday: { day: 10, month: 10, hour:0, minute:0, second:0, year:2002 } },
  { pseudo: "MecKaeL", avatar: "https://cdn.discordapp.com/avatars/644934592901414932/355a8d8592a487ca18e7e142c3ef8746.webp", birthday: { day: 25, month: 7, hour:0, minute:0, second:0, year:2004 } },
  { pseudo: "Printillie", avatar: "https://cdn.discordapp.com/avatars/689781399661838347/69c0bb311a7baab4f82cd260b8ebab3b.webp", birthday: { day: 21, month: 2, hour:0, minute:0, second:0, year:2005 } },
  { pseudo: "Anaïs", avatar: "https://cdn.discordapp.com/avatars/459373865932685324/fd079e443979b0979e03cf0b44ab40e1.webp", birthday: { day: 31, month: 11, hour:0, minute:0, second:0, year:2005 } },
  { pseudo: "Marie", avatar: "https://cdn.discordapp.com/avatars/760428505149997056/61e4defc2121796de1d11886e1b41947.webp", birthday: { day: 22, month: 9, hour:0, minute:0, second:0, year:2005 } },
  { pseudo: "Timo", avatar: "https://cdn.discordapp.com/avatars/384046505042116610/200188c1a9447615b9d8e73fda7ce564.webp", birthday: { day: 19, month: 10, hour:0, minute:0, second:0, year:2005 } },
  { pseudo: "Rocco", avatar: "https://cdn.discordapp.com/avatars/706514911643172884/0fb4b0fd6b244df4dfcdc6b4ba9a724a.webp", birthday: { day: 24, month: 4, hour:0, minute:0, second:0, year:2008 } },
  { pseudo: "Mathys", avatar: "https://cdn.discordapp.com/avatars/836362324532658257/0b8b2d16f61c370962618ca46e03698c.webp", birthday: { day: 24, month: 4, hour:0, minute:0, second:0, year:2008 } },
  { pseudo: "Ramata", avatar: "https://cdn.discordapp.com/avatars/689561679364620361/6f3e4f3110ed14ad87fd80c8f8f33a7e.webp", birthday: { day: 16, month: 5, hour:0, minute:0, second:0, year:2005 } },
  { pseudo: "Thibault", avatar: "https://cdn.discordapp.com/avatars/418451864716312581/a374f0ee19300c10d07f6b42533b48e6.webp", birthday: { day: 23, month: 8, hour:0, minute:0, second:0, year:2004 } },
  { pseudo: "Mitrion", avatar: "data:image/jpeg;base64,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", birthday: { day: 20, month: 3, hour:0, minute:0, second:0, year:2004 } },
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
