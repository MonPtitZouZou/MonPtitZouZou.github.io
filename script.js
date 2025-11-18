document.addEventListener("DOMContentLoaded", () => {
  const start = document.getElementById('startBtn');
  const reveal = document.getElementById('reveal');
  const card = document.getElementById('card');

  start.addEventListener('click', () => {
    start.disabled = true;
    start.textContent = "Vérification en cours…";

    // Simuler vérification 3 secondes
    setTimeout(() => {
      reveal.classList.add('show');   // afficher le prank
      start.textContent = "Lancer la vérification";
      start.disabled = false;
      spawnConfetti(40);              // lancer confettis

      // Rendre le bouton "Retour" insaisissable
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

// Bouton retour simple (si vraiment cliqué)
function closePrank() {
  const reveal = document.getElementById('reveal');
  reveal.classList.remove('show');
}

// Fonction pour rendre le bouton "Retour" insaisissable
function makeButtonUncatchable(button) {
  button.style.position = "relative"; // reste dans sa box
  button.style.transition = "transform 0.2s";

  button.addEventListener("mouseenter", () => {
    // Déplacement aléatoire léger à l'intérieur de sa boîte
    const moveX = (Math.random() - 0.5) * 50; // ±25px
    const moveY = (Math.random() - 0.5) * 20; // ±10px
    button.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  button.addEventListener("mouseleave", () => {
    // Revenir à sa position d'origine
    button.style.transform = `translate(0,0)`;
  });

  // Optionnel : si on clique vraiment dessus (rare)
  // Optionnel : si on clique vraiment dessus (rare)
  button.addEventListener("click", () => {
    alert("Tu as réussi à cliquer !");
    document.getElementById('reveal').classList.remove("show");
  });
}
