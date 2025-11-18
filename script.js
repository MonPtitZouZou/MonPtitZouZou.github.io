document.addEventListener("DOMContentLoaded", () => {
  const start = document.getElementById('startBtn');
  const reveal = document.getElementById('reveal');
  const card = document.getElementById('card');

  start.addEventListener('click', () => {
    start.disabled = true;
    start.textContent = "Vérification en cours…";

    setTimeout(() => {
      reveal.classList.add('show');   // afficher le prank
      start.textContent = "Lancer la vérification";
      start.disabled = false;
      spawnConfetti(40);              // lancer confettis

      // rendre le bouton "Retour" fuyant
      const retourBtn = reveal.querySelector(".white-btn");
      makeButtonUncatchable(retourBtn);

    }, 3000);
  });
});

// Fonction confettis
function spawnConfetti(n) {
  const colors = ['#ff5c8a','#ffd166','#7ae582','#7cc7ff','#b399ff'];
  const card = document.getElementById('card');

  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = (10 + Math.random() * 80) + '%';
    el.style.top = (Math.random() * 30) + '%';
    el.style.background = colors[i % colors.length];
    el.style.transform = `translateY(-40px) rotate(${Math.random()*360}deg)`;
    el.style.animationDelay = (Math.random() * 800) + 'ms';
    el.style.width = (6 + Math.random()*12) + 'px';
    el.style.height = (8 + Math.random()*16) + 'px';
    card.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }
}

// Fonction partage
function share() {
  const text = "Je viens de me faire avoir par un petit prank 😈 (tkt, c'était drôle)";
  if (navigator.share) {
    navigator.share({ text }).catch(() => alert("Impossible de partager."));
  } else {
    navigator.clipboard.writeText(text).then(() => alert("Texte copié !"));
  }
}

// Fonction bouton "Retour" fuyant
function makeButtonUncatchable(button) {
  const container = button.parentElement.parentElement; // .reveal
  button.style.position = "absolute";

  // placer bouton au centre au départ
  button.style.left = "50%";
  button.style.top = "50%";
  button.style.transform = "translate(-50%, -50%)";

  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    const btnWidth = button.offsetWidth;
    const btnHeight = button.offsetHeight;

    // position souris relative au container
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const btnRect = button.getBoundingClientRect();
    const btnX = btnRect.left - rect.left + btnWidth/2;
    const btnY = btnRect.top - rect.top + btnHeight/2;

    const distX = btnX - mouseX;
    const distY = btnY - mouseY;
    const dist = Math.sqrt(distX*distX + distY*distY);

    // si la souris est trop proche, bouger le bouton
    if (dist < 120) {
      let moveX = (distX/dist)*80; // force proportionnelle
      let moveY = (distY/dist)*80;

      // limiter le bouton à la zone visible
      let newX = Math.min(Math.max(btnX + moveX, btnWidth/2), rect.width - btnWidth/2);
      let newY = Math.min(Math.max(btnY + moveY, btnHeight/2), rect.height - btnHeight/2);

      button.style.left = newX + "px";
      button.style.top = newY + "px";
      button.style.transform = "translate(-50%, -50%)";
    }
  });

  // si l'utilisateur clique vraiment dessus
  button.addEventListener("click", () => {
    alert("Tu as réussi à cliquer !");
    container.classList.remove("show");
  });
}
