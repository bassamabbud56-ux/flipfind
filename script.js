const goedGeluid = new Audio("sounds/goed.wav");
const verliesGeluid = new Audio("sounds/khsar.wav");
 // dit zorgt ervoor dat de geluiden worden geladen en afgespeeld bij het klikken op de kaarten
goedGeluid.volume = 0.8;
verliesGeluid.volume = 0.8;
 // dit zorgt dat de volume van de geluiden wordt ingesteld op 80% van het maximale volume
const symbolen = [
  "😭", "😜", "🥶", "🥸", "🤗", "😈",
  "🤮", "🤬", "👹", "🦊", "😍", "😇"
];
 // dit zorgt ervoor dat de symbolen worden opgeslagen in een array en dat ze gebruikt worden om de kaarten te maken
const kaartenPerLevel = [0, 4, 8, 12, 20, 24];
 // dit zijn de aantal kaarten die we per level krijgen
const startPagina = document.querySelector("#startPagina");
const startKnop = document.querySelector("#startKnop");
const homePagina = document.querySelector("#homePagina");
const spelPagina = document.querySelector("#spelPagina");
const bord = document.querySelector("#bord");
const bericht = document.querySelector("#bericht");
const pauzeKnop = document.querySelector("#pauzeKnop");
const volgendeKnop = document.querySelector("#volgendeKnop");
const geluidKnop = document.querySelector("#geluidKnop");
const terugKnop = document.querySelector("#terugKnop");
 // dit zorgt ervoor dat de elementen van de pagina worden geselecteerd en opgeslagen in variabelen
let eersteKaart = null;
let wachten = false;
let pauze = false;
 
let geluidAan = true;
let zetten = 0;
let paren = 0;
let tijd = 0;
let level = 1;
let timer;
 // dit zijn de variabelen die worden gebruikt om de staat van het spel bij te houden zoals welke kaart eerst gekozen is
function speelGeluid(geluid) {
  if (geluidAan) {
    geluid.currentTime = 0;
 
    geluid.play().catch(function (fout) {
      console.log("Geluid kon niet worden afgespeeld:", fout);
    });
  }
}
 // dit zorgt ervoor dat het geluid wordt afgespeeld als het geluid aan staat en geeft aan wanneer het niet kan worden afgespeeld in console
function toonRecords() {
  document.querySelector("#hoogsteScore").textContent =
    localStorage.getItem("score") || 0;
 
  document.querySelector("#hoogsteLevel").textContent =
    localStorage.getItem("level") || 1;
}
 // dit zorgt ervoor dat de hoogste score en het hoogste level worden weergegeven op de pagina
startKnop.onclick = function () {
  startPagina.hidden = true;
  homePagina.hidden = false;
};
 // dit zorgt ervoor dat als de speler op de startknop klikt, de startpagina wordt verborgen en de homepagina wordt weergegeven
geluidKnop.onclick = function () {
  geluidAan = !geluidAan;
 // dit zorgt ervoor dat als de speler op de geluidknop klikt, het geluid aan gaat
  if (geluidAan) {
    geluidKnop.textContent = "🔊";
    geluidKnop.title = "Geluid uitzetten";
  } else {
    geluidKnop.textContent = "🔇";
    geluidKnop.title = "Geluid aanzetten";
  }
};
 // dit zorgt ervoor dat als de speler op de geluidknop klikt, het geluid aan of uit wordt gezet met die symbool
function startLevel(nieuwLevel) {
  clearInterval(timer);
 
  level = nieuwLevel;
  zetten = 0;
  paren = 0;
  eersteKaart = null;
  wachten = false;
  pauze = false;
 // dit zorgt ervoor dat als de speler een nieuw level start, de timer wordt gestopt en de variabelen worden gereset
  pauzeKnop.textContent = "⏸️";
  pauzeKnop.hidden = false;
  volgendeKnop.hidden = true;
  geluidKnop.hidden = false;
 // dit zorgt ervoor dat de pauzeknop en geluidknop zichtbaar zijn en de volgendeknop verborgen is bij het starten van nieuw level
  const aantalParen = kaartenPerLevel[level] / 2;
  const parenSymbolen = symbolen.slice(0, aantalParen);
  const kaarten = parenSymbolen.concat(parenSymbolen);
 // dit zorgt ervoor dat het aantal paren wordt berekend op basis van level en dat de symbolen worden verdubbeld enzo
  kaarten.sort(function () {
    return Math.random() - 0.5;
  });
// dit zorgt ervoor dat de kaarten worden geschud zodat ze in een willekeurige volgorde worden weergegeven
  if (level === 1) {
  tijd = 15;
} else if (level === 2) {
  tijd = 30;
} else if (level === 3) {
  tijd = 60;
} else if (level === 4) {
  tijd = 95;
} else {
  tijd = 130;
}
// dit zorgt ervoor dat de tijd voor elk level wordt ingesteld op basis van het levelnummer.
 
 
  document.querySelector("#levelTitel").textContent =
    "Level " + level;
  document.querySelector("#zetten").textContent = zetten;
  document.querySelector("#tijd").textContent = tijd;
 // dit zorgt ervoor dat de tijd en zetten worden aangegeven op de pagina
  bericht.textContent = "";
 
  homePagina.hidden = true;
  spelPagina.hidden = false;
  bord.innerHTML = "";
 // dit zorgt ervoor dat de homepagina wordt verborgen en de speelpagina wordt weergegeven
  kaarten.forEach(function (symbool) {
    const kaart = document.createElement("button");
 
    kaart.className = "kaart";
    kaart.textContent = "?";
    kaart.dataset.symbool = symbool;
 
    kaart.onclick = function () {
      klikKaart(kaart);
    };
 // dit zorgt ervoor dat elke kaart wordt weergegeven als een knop met een vraagteken en dat het symbool van de kaart wordt opgeslagen
    bord.appendChild(kaart);
  });
 
  timer = setInterval(aftellen, 1000);
}// dit zorgt ervoor dat de timer wordt gestart en elke seconde wordt afgeteld
 
function aftellen() {
  if (pauze || wachten) {
    return;
  }
 
  tijd--;
  document.querySelector("#tijd").textContent = tijd;
 
  if (tijd <= 0) {
    clearInterval(timer);
    wachten = true;
    pauzeKnop.hidden = true;
 
    bericht.textContent = "Tijd is om! Probeer het opnieuw.";
    speelGeluid(verliesGeluid);
  }
}
// dit zorgt ervoor dat de tijd wordt afgeteld en dat het spel stopt als de tijd op is
 
function klikKaart(kaart) {
  if (
    pauze ||
    wachten ||
    kaart.classList.contains("open") ||
    kaart.classList.contains("gevonden")
  ) {
    return;
  }
  // dit zorgt ervoor dat de kaart alleen kan worden geklikt als het spel niet gepauzeerd is, er geen andere kaarten open zijn
 
  kaart.classList.add("open");
  kaart.textContent = kaart.dataset.symbool;
 
  if (eersteKaart === null) {
    eersteKaart = kaart;
    return;
  }
 // dit zorgt ervoor dat de eerste kaart wordt opgeslagen als er nog geen andere kaart open is
  zetten++;
  document.querySelector("#zetten").textContent = zetten;
 // dit zorgt ervoor dat het aantal zetten wordt verhoogd en weergegeven op de pagina
  if (eersteKaart.dataset.symbool === kaart.dataset.symbool) {
    speelGeluid(goedGeluid);
 
    eersteKaart.classList.add("gevonden");
    kaart.classList.add("gevonden");
 
    eersteKaart = null;
    paren++;
 
    if (paren === kaartenPerLevel[level] / 2) {
      clearInterval(timer);
      gewonnen();
    }
  } else {
    speelGeluid(verliesGeluid);
 
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
// dit zorgt ervoor dat als de twee kaarten hetzelfde symbool hebben, ze als gevonden worden gemarkeerd en het aantal paren wordt
 
function gewonnen() {
  const score = paren * 100 + tijd * 10;
 
  bericht.textContent = "Level gehaald! Je score is " + score;
 
  pauzeKnop.hidden = true;
  volgendeKnop.hidden = level === 5;
 
  if (level === 5) {
    bericht.textContent += " Je hebt alle levels gehaald!";
  }
 
  if (score > Number(localStorage.getItem("score") || 0)) {
    localStorage.setItem("score", score);
  }
 
  if (level > Number(localStorage.getItem("level") || 0)) {
    localStorage.setItem("level", level);
  }
 
  toonRecords();
}
// dit zorgt ervoor dat als de speler van het level wint, de score wordt berekend en opgeslagen in de lokale opslag
 
document.querySelectorAll(".levelKnop").forEach(function (knop) {
  knop.onclick = function () {
    const gekozenLevel = Number(knop.dataset.level);
 
    if (gekozenLevel >= 1 && gekozenLevel <= 5) {
      startLevel(gekozenLevel);
    }
  };
});
 // dit zorgt ervoor dat als de speler op een levelknop klikt, het gekozen level opstart
pauzeKnop.onclick = function () {
  if (wachten && tijd <= 0) {
    return;
  }
 
  pauze = !pauze;
  pauzeKnop.textContent = pauze ? "▶️" : "⏸️";
  bericht.textContent = pauze ? "Spel gepauzeerd" : "";
};
 // dit zorgt ervoor dat als de speler op de pauzeknop klikt, het spel wordt gepauzeerd of hervat
volgendeKnop.onclick = function () {
  if (level < 5) {
    startLevel(level + 1);
  }
};
 // dit zorgt ervoor dat als de speler op de volgende knop klikt, het volgende level wordt gestart
terugKnop.onclick = function () {
  clearInterval(timer);
 
  pauze = false;
  wachten = false;
  eersteKaart = null;
 
  spelPagina.hidden = true;
  homePagina.hidden = false;
  pauzeKnop.textContent = "⏸️";
};
 // dit zorgt ervoor dat als de speler op de terugknop klikt, het spel wordt gestopt en de speler teruggaat naar het startscherm
ToonRecords();
// dit zorgt ervoor dat de hoogste score en het hoogste level worden weergegeven bij het laden van de pagina