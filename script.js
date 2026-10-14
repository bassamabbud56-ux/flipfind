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
}