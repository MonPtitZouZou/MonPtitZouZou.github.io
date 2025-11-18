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

      // rendre le bouton "Retour" insaisissable
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

// Fonction bouton "Retour" insaisissable
function makeButtonUncatchable(button) {
  button.style.position = "relative";       // reste dans sa boîte
  button.style.transition = "transform 0.2s";

  button.addEventListener("mouseenter", () => {
    const maxX = 80;  // déplacement horizontal max
    const maxY = 30;  // déplacement vertical max
    const moveX = (Math.random() - 0.5) * maxX * 2; // ±maxX px
    const moveY = (Math.random() - 0.5) * maxY * 2; // ±maxY px
    button.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = `translate(0,0)`; // revient au centre
  });

  // Si l'utilisateur clique vraiment dessus
  button.addEventListener("click", () => {
    alert("Tu as réussi à cliquer !");
    document.getElementById('reveal').classList.remove("show");
  });
}
