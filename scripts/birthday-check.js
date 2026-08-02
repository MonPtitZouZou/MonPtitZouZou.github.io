'use strict';

/*
 * Vérifie si quelqu'un fête son anniversaire aujourd'hui (heure de Paris)
 * et poste un message dans le salon Discord via le webhook.
 *
 * Usage :
 *   DISCORD_WEBHOOK=https://discord.com/api/webhooks/... node scripts/birthday-check.js
 *
 * Pour tester avec une date précise (format JJ/MM) :
 *   TEST_DATE=05/08 DISCORD_WEBHOOK=... node scripts/birthday-check.js
 */

const fs = require('fs');
const path = require('path');

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK;
if (!WEBHOOK_URL) {
  console.error('❌ La variable DISCORD_WEBHOOK est manquante.');
  console.error('   Sur GitHub : Settings → Secrets and variables → Actions → New repository secret');
  process.exit(1);
}

/* ---- Date du jour, fuseau Europe/Paris ---- */
function getTodayParis() {
  const override = process.env.TEST_DATE; // ex: "05/08"
  if (override) {
    const [d, m] = override.split('/').map(Number);
    if (!d || !m) {
      console.error('❌ TEST_DATE invalide, format attendu : JJ/MM (ex: 05/08)');
      process.exit(1);
    }
    console.log(`🧪 Mode test : date forcée au ${override}`);
    return { day: d, month: m, year: new Date().getFullYear() };
  }
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  return { day: get('day'), month: get('month'), year: get('year'), hour: get('hour') };
}

/* ---- Garde-fou minuit ----
 * Le cron tourne à 22h ET 23h UTC (pour couvrir heure d'été/hiver).
 * Sur un run planifié, on ne continue que si c'est bien 00h à Paris :
 * un seul des deux runs passe ce filtre selon la saison. */

/* ---- Chargement de la liste ---- */
const dataPath = path.join(__dirname, '..', 'birthdays.json');
const users = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const today = getTodayParis();

if (process.env.STRICT_MIDNIGHT === 'true' && !process.env.TEST_DATE && today.hour !== 0) {
  console.log(`⏭️  Il est ${today.hour}h à Paris (pas minuit) — ce run se retire, l'autre horaire prendra le relais.`);
  process.exit(0);
}

const celebrants = users.filter((u) => u.birthday.day === today.day && u.birthday.month === today.month);

if (celebrants.length === 0) {
  console.log(`✅ ${String(today.day).padStart(2, '0')}/${String(today.month).padStart(2, '0')} — aucun anniversaire aujourd'hui. Rien à envoyer.`);
  process.exit(0);
}

/* ---- Construction du message ---- */
const WEEKDAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

function ordinal(n) {
  return n === 1 ? '1er' : `${n}`;
}

function buildEmbed(user, weekdayIndex) {
  const age = user.birthday.year != null ? today.year - user.birthday.year : null;
  const dateStr = `${WEEKDAYS[weekdayIndex]} ${ordinal(today.day)} ${MONTHS[today.month - 1]} ${today.year}`;

  return {
    author: {
      name: '誕生日スペシャル · Anniversaires',
    },
    title: `🎂  Joyeux anniversaire, ${user.prenom} !`,
    description:
      age !== null
        ? `${user.prenom} fête ses **${age} ans** aujourd'hui ! 🎉\nPassez lui souhaiter un bon anniversaire 💌`
        : `C'est l'anniversaire de ${user.prenom} aujourd'hui ! 🎉\nPassez lui souhaiter un bon anniversaire 💌`,
    color: 0xe8332e,
    fields:
      age !== null
        ? [{ name: 'Âge', value: `${age} ans`, inline: true }]
        : [],
    footer: {
      text: dateStr.charAt(0).toUpperCase() + dateStr.slice(1),
    },
    timestamp: new Date().toISOString(),
  };
}

const payload = {
  content: `🎉 C'est l'anniversaire de **${celebrants.map((u) => u.prenom).join(' et de ')}** aujourd'hui !`,
  embeds: celebrants.map((u) => buildEmbed(u, new Date().getDay())),
};

/* ---- Envoi ---- */
(async () => {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ Discord a répondu ${res.status} : ${text}`);
      process.exit(1);
    }
    console.log(`🎂 Message envoyé pour : ${celebrants.map((u) => u.prenom).join(', ')}`);
  } catch (err) {
    console.error('❌ Échec de l\'envoi :', err.message);
    process.exit(1);
  }
})();
