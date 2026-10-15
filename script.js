const symbolen = ["🎮", "🚀", "⚡", "🔥", "💎", "🎧", "🎸", "💻", "🌈", "🦊", "🍕", "👾"];
const kaartenPerLevel = [0, 4, 8, 12, 20, 24];

const bord = document.querySelector("#bord");
const bericht = document.querySelector("#bericht");
const pauzeKnop = document.querySelector("#pauzeKnop");
const volgendeKnop = document.querySelector("#volgendeKnop");

let eersteKaart = null;
let wachten = false;
let pauze = false;
let zetten = 0;
let paren = 0;
let tijd = 0;
let level = 1;
let timer;

function toonRecords() {
  document.querySelector("#hoogsteScore").textContent = localStorage.getItem("score") || 0;
  document.querySelector("#hoogsteLevel").textContent = localStorage.getItem("level") || 1;
}

function startLevel(nieuwLevel) {
  clearInterval(timer);
  level = nieuwLevel;
  zetten = 0;
  paren = 0;
  eersteKaart = null;
  wachten = false;
  pauze = false;

  pauzeKnop.textContent = "Pauze";
  pauzeKnop.hidden = false;
  volgendeKnop.hidden = true;

  const aantalParen = kaartenPerLevel[level] / 2;
  const parenSymbolen = symbolen.slice(0, aantalParen);
  const kaarten = parenSymbolen.concat(parenSymbolen);

  kaarten.sort(function () {
    return Math.random() - 0.5;
  });

  tijd = 30 + aantalParen * 15;
  document.querySelector("#levelTitel").textContent = "Level " + level;
  document.querySelector("#zetten").textContent = zetten;
  document.querySelector("#tijd").textContent = tijd;
  bericht.textContent = "";
  document.querySelector("#homePagina").hidden = true;
  document.querySelector("#spelPagina").hidden = false;
  bord.innerHTML = "";

  kaarten.forEach(function (symbool) {
    const kaart = document.createElement("button");
    kaart.className = "kaart";
    kaart.textContent = "?";
    kaart.dataset.symbool = symbool;
    kaart.onclick = function () {
      klikKaart(kaart);
    };
    bord.appendChild(kaart);
  });

  timer = setInterval(aftellen, 1000);
}

function aftellen() {
  if (pauze) return;

  tijd--;
  document.querySelector("#tijd").textContent = tijd;

  if (tijd <= 0) {
    clearInterval(timer);
    wachten = true;
    pauzeKnop.hidden = true;
    bericht.textContent = "Tijd is om! Probeer het opnieuw.";
  }
}

function klikKaart(kaart) {
  if (pauze || wachten || kaart.classList.contains("open")) return;

  kaart.classList.add("open");
  kaart.textContent = kaart.dataset.symbool;

  if (eersteKaart === null) {
    eersteKaart = kaart;
    return;
  }

  zetten++;
  document.querySelector("#zetten").textContent = zetten;

  if (eersteKaart.dataset.symbool === kaart.dataset.symbool) {
    eersteKaart.classList.add("gevonden");
    kaart.classList.add("gevonden");
    eersteKaart = null;
    paren++;

    if (paren === kaartenPerLevel[level] / 2) {
      clearInterval(timer);
      gewonnen();
    }
  } else {
    wachten = true;
    const kaart1 = eersteKaart;
    eersteKaart = null;

    setTimeout(function () {
      kaart1.classList.remove("open");
      kaart.classList.remove("open");
      kaart1.textContent = "?";
      kaart.textContent = "?";
      wachten = false;
    }, 1000);
  }
}

function gewonnen() {
  const score = paren * 100 + tijd * 10;
  bericht.textContent = "Level gehaald! Je score is " + score;
  pauzeKnop.hidden = true;
  volgendeKnop.hidden = level === 5;

  if (level === 5) bericht.textContent += " Je hebt alle levels gehaald!";

  if (score > Number(localStorage.getItem("score") || 0)) {
    localStorage.setItem("score", score);
  }

  if (level > Number(localStorage.getItem("level") || 0)) {
    localStorage.setItem("level", level);
  }

  toonRecords();
}

document.querySelectorAll(".levelKnop").forEach(function (knop) {
  knop.onclick = function () {
    startLevel(Number(knop.dataset.level));
  };
});

pauzeKnop.onclick = function () {
  pauze = !pauze;
  pauzeKnop.textContent = pauze ? "Verder" : "Pauze";
  bericht.textContent = pauze ? "Pauze" : "";
};

volgendeKnop.onclick = function () {
  startLevel(level + 1);
};

document.querySelector("#terugKnop").onclick = function () {
  clearInterval(timer);
  document.querySelector("#spelPagina").hidden = true;
  document.querySelector("#homePagina").hidden = false;
};

toonRecords();