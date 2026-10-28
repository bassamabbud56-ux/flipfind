const goedGeluid = new Audio("sounds/goed.wav");
const verliesGeluid = new Audio("sounds/khsar.wav");

goedGeluid.volume = 0.8;
verliesGeluid.volume = 0.8;

const symbolen = [
  "😭", "😜", "🥶", "🥸", "🤗", "😈",
  "🤮", "🤬", "👹", "🦊", "😍", "😇"
];

const kaartenPerLevel = [0, 4, 8, 12, 20, 24];

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

let eersteKaart = null;
let wachten = false;
let pauze = false;
let geluidAan = true;
let zetten = 0;
let paren = 0;
let tijd = 0;
let level = 1;
let timer;

function speelGeluid(geluid) {
  if (geluidAan) {
    geluid.currentTime = 0;

    geluid.play().catch(function (fout) {
      console.log("Geluid kon niet worden afgespeeld:", fout);
    });
  }
}

function toonRecords() {
  document.querySelector("#hoogsteScore").textContent =
    localStorage.getItem("score") || 0;

  document.querySelector("#hoogsteLevel").textContent =
    localStorage.getItem("level") || 1;
}

startKnop.onclick = function () {
  startPagina.hidden = true;
  homePagina.hidden = false;
};

geluidKnop.onclick = function () {
  geluidAan = !geluidAan;

  if (geluidAan) {
    geluidKnop.textContent = "🔊";
    geluidKnop.title = "Geluid uitzetten";
  } else {
    geluidKnop.textContent = "🔇";
    geluidKnop.title = "Geluid aanzetten";
  }
};

function startLevel(nieuwLevel) {
  clearInterval(timer);

  level = nieuwLevel;
  zetten = 0;
  paren = 0;
  eersteKaart = null;
  wachten = false;
  pauze = false;

  pauzeKnop.textContent = "⏸️";
  pauzeKnop.hidden = false;
  volgendeKnop.hidden = true;
  geluidKnop.hidden = false;

  const aantalParen = kaartenPerLevel[level] / 2;
  const parenSymbolen = symbolen.slice(0, aantalParen);
  const kaarten = parenSymbolen.concat(parenSymbolen);

  kaarten.sort(function () {
    return Math.random() - 0.5;
  });

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

  document.querySelector("#levelTitel").textContent =
    "Level " + level;
  document.querySelector("#zetten").textContent = zetten;
  document.querySelector("#tijd").textContent = tijd;

  bericht.textContent = "";

  homePagina.hidden = true;
  spelPagina.hidden = false;
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
  if (pauze || wachten) {
    return;
  }

  let tijd;
  document.querySelector("#tijd").textContent = tijd;

  if (tijd <= 0) {
    clearInterval(timer);
    wachten = true;
    pauzeKnop.hidden = true;

    bericht.textContent = "Tijd is om! Probeer het opnieuw.";
    speelGeluid(verliesGeluid);
  }
}

function klikKaart(kaart) {
  if (
    pauze ||
    wachten ||
    kaart.classList.contains("open") ||
    kaart.classList.contains("gevonden")
  ) {
    return;
  }

  kaart.textContent = kaart.dataset.symbool;

  if (eersteKaart === null) {
    eersteKaart = kaart;
    return;
  }

  zetten++;
  document.querySelector("#zetten").textContent = zetten;

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

document.querySelectorAll(".levelKnop").forEach(function (knop) {
  knop.onclick = function () {
    const gekozenLevel = Number(knop.dataset.level);

    if (gekozenLevel >= 1 && gekozenLevel <= 5) {
      startLevel(gekozenLevel);
    }
  };
});

pauzeKnop.onclick = function () {
  if (wachten && tijd <= 0) {
    return;
  }

  pauze = !pauze;
  pauzeKnop.textContent = pauze ? "▶️" : "⏸️";
  bericht.textContent = pauze ? "Spel gepauzeerd" : "";
};

volgendeKnop.onclick = function () {
  if (level < 5) {
    startLevel(level + 1);
  }
};

terugKnop.onclick = function () {
  clearInterval(timer);

  pauze = false;
  wachten = false;
  eersteKaart = null;

  spelPagina.hidden = true;
  homePagina.hidden = false;
  pauzeKnop.textContent = "⏸️";
};

toonRecords();
