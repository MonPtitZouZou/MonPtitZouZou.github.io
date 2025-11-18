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
      spawnConfetti(40);              // lancer les confettis

      const prankReturnBtn = reveal.querySelector(".white-btn");
      makeButtonUncatchable(prankReturnBtn, reveal);

    }, 3000);
  });
});

// Confettis
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

// Partage
function share() {
  const text = "Je viens de me faire avoir par un petit prank 😈 (tkt, c'était drôle)";
  if (navigator.share) {
    navigator.share({ text }).catch(() => alert("Impossible de partager."));
  } else {
    navigator.clipboard.writeText(text).then(() => alert("Texte copié !"));
  }
}

// Retour prank
function closePrank() {
  const reveal = document.getElementById('reveal');
  reveal.classList.remove('show');
}

// Bouton insaisissable
function makeButtonUncatchable(button, container) {
  // container doit être positionné pour que absolute fonctionne
  container.style.position = "relative";
  button.style.position = "absolute";
  button.style.top = "50%";
  button.style.left = "50%";

  button.addEventListener("mouseenter", () => {
    const maxX = container.clientWidth - button.offsetWidth;
    const maxY = container.clientHeight - button.offsetHeight;

    button.style.left = Math.random() * maxX + "px";
    button.style.top = Math.random() * maxY + "px";
  });
}
