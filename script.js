const symbolen = ["🎮", "🚀", "⚡", "🔥", "💎", "🎧", "🎸", "💻", "🌈", "🦊", "🍕", "👾"];

const kaartenPerLevel = { 1: 4, 2: 8, 3: 12, 4: 20, 5: 24 };

let eersteKaart = null; 
let wachten = false;   
let pauze = false;      
let zetten = 0;
let paren = 0;
let tijd = 0;
let level = 1;
let timer;

let pauzeKnop = document.querySelector("#pauzeKnop");
let volgendeKnop = document.querySelector("#volgendeKnop");

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

  let aantalParen = kaartenPerLevel[level] / 2;
  let gekozen = symbolen.slice(0, aantalParen);
  let kaarten = gekozen.concat(gekozen);

  kaarten.sort(function () {
    return Math.random() - 0.5;
  });

  tijd = 30 + aantalParen * 15;

  document.querySelector("#levelTitel").textContent = "Level " + level;
  document.querySelector("#zetten").textContent = zetten;
  document.querySelector("#tijd").textContent = tijd;
  document.querySelector("#bericht").textContent = "";

  document.querySelector("#homePagina").hidden = true;
  document.querySelector("#spelPagina").hidden = false;

  let bord = document.querySelector("#bord");
  bord.innerHTML = "";

  for (let i = 0; i < kaarten.length; i++) {
    let kaart = document.createElement("button");
    kaart.className = "kaart";
    kaart.textContent = "?";
    kaart.dataset.symbool = kaarten[i];
    kaart.onclick = function () {
      klikKaart(kaart);
    };
    bord.appendChild(kaart);
  }
  timer = setInterval(aftellen, 1000);
}
function aftellen() {

  if (pauze) {
    return;
  }

  tijd--;
  document.querySelector("#tijd").textContent = tijd;

  if (tijd <= 0) {
    clearInterval(timer);
    wachten = true;
    pauzeKnop.hidden = true;
    document.querySelector("#bericht").textContent = "Tijd is om! Probeer het opnieuw.";
  }
}

function klikKaart(kaart) {

  if (pauze || wachten || kaart.classList.contains("open")) {
    return;
  }
  kaart.classList.add("open");
  kaart.textContent = kaart.dataset.symbool;

  if (eersteKaart == null) {
    eersteKaart = kaart;
    return;
  }
  zetten++;
  document.querySelector("#zetten").textContent = zetten;

  if (eersteKaart.dataset.symbool == kaart.dataset.symbool) {
  
    eersteKaart.classList.add("gevonden");
    kaart.classList.add("gevonden");
    eersteKaart = null;
    paren++;

    if (paren == kaartenPerLevel[level] / 2) {
      clearInterval(timer);
      gewonnen();
    }
  } else {
    wachten = true;
    let kaart1 = eersteKaart;
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
  let score = paren * 100 + tijd * 10;
  document.querySelector("#bericht").textContent = "Level gehaald! Je score is " + score;
  pauzeKnop.hidden = true;

  if (level < 5) {
    volgendeKnop.hidden = false;
  }

  if (score > Number(localStorage.getItem("score"))) {
    localStorage.setItem("score", score);
  }
  if (level > Number(localStorage.getItem("level"))) {
    localStorage.setItem("level", level);
  }

  toonRecords();
}

let levelKnoppen = document.querySelectorAll(".levelKnop");
for (let i = 0; i < levelKnoppen.length; i++) {
  levelKnoppen[i].onclick = function () {
    startLevel(Number(levelKnoppen[i].dataset.level));
  };
}

pauzeKnop.onclick = function () {
  if (pauze) {
    pauze = false;
    pauzeKnop.textContent = "Pauze";
    document.querySelector("#bericht").textContent = "";
  } else {
    pauze = true;
    pauzeKnop.textContent = "Verder";
    document.querySelector("#bericht").textContent = "Pauze";
  }
};

volgendeKnop.onclick = function () {
  startLevel(level + 1);
};

document.querySelector("#terugKnop").onclick = function () {
  clearInterval(timer);
  document.querySelector("#spelPagina").hidden = true;
  document.querySelector("#homePagina").hidden = false;
  toonRecords();
};

toonRecords();