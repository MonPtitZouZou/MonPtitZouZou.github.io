// script.js — comportement de la blague
(function(){
  const fake = document.getElementById('fake-screen');
  const reveal = document.getElementById('reveal');
  const secEl = document.getElementById('sec');
  const againBtn = document.getElementById('again');
  const niceBtn = document.getElementById('nice');

  let countdown = 5;
  let timer;

  function startCountdown(){
    // montrer la fausse erreur au départ
    fake.classList.remove('hidden');
    reveal.classList.add('hidden');
    countdown = 5;
    secEl.textContent = countdown;
    clearInterval(timer);
    timer = setInterval(() => {
      countdown--;
      secEl.textContent = countdown;
      if(countdown <= 0){
        clearInterval(timer);
        showReveal();
      }
    }, 1000);
  }

  function showReveal(){
    // petite animation de "révélation"
    fake.classList.add('hidden');
    reveal.classList.remove('hidden');
    // ajouter un petit flash
    document.body.animate([{filter:'brightness(1.2)'},{filter:'brightness(1)'}], {duration:400});
  }

  // boutons
  againBtn.addEventListener('click', () => startCountdown());
  niceBtn.addEventListener('click', () => {
    // ouvre une boîte de dialogue amicale (pas de spam)
    const msg = "Hé, c'était une blague ! T'es trop cool :)";
    // Copie le message dans le presse-papiers pour que tu puisses l'envoyer rapidement
    if(navigator.clipboard){
      navigator.clipboard.writeText(msg).then(() => {
        alert("Message copié : collez-le pour l'envoyer à ton pote !");
      }).catch(() => {
        alert(msg);
      });
    } else {
      alert(msg);
    }
  });

  // démarrer automatiquement
  startCountdown();
})();
