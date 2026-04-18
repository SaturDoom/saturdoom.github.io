(function() {
  // Datos ordenados de la MÁS RECIENTE a la MÁS ANTIGUA
  const weeksData = [
    { date: "2026-04-13", scan: "04-18", energy: 7.73, tech: -3.85 },
  ];

  let currentIndex = 0;

  const dateHeader = document.getElementById('weekDateHeader');
  const tableBody = document.getElementById('weekTableBody');
  const prevBtn = document.getElementById('prevWeekBtn');
  const nextBtn = document.getElementById('nextWeekBtn');

  // Determinar clase de color según comparación con semana anterior (índice+1)
  function getTrendClass(currentVal, prevVal) {
    if (prevVal === undefined) return 'neutral'; // sin dato previo
    if (currentVal > prevVal) return 'up';
    if (currentVal < prevVal) return 'down';
    return 'neutral';
  }

  function renderWeek(index) {
    const week = weeksData[index];
    if (!week) return;

    const prevWeek = weeksData[index + 1]; // semana anterior (más vieja)
    const energyTrend = getTrendClass(week.energy, prevWeek?.energy);
    const techTrend = getTrendClass(week.tech, prevWeek?.tech);

    dateHeader.innerHTML = `🪖 WEEK ${week.date} · SCAN ${week.scan}`;

    // Formatear valores con signo y sin flechas
    const energyDisplay = (week.energy > 0 ? `+${week.energy}%` : `${week.energy}%`);
    const techDisplay = (week.tech > 0 ? `+${week.tech}%` : `${week.tech}%`);

    // Ordenar por valor actual (mayor primero)
    const assets = [
      { name: "ENERGY", value: week.energy, display: energyDisplay, trendClass: energyTrend },
      { name: "TECHNOLOGY", value: week.tech, display: techDisplay, trendClass: techTrend }
    ];
    assets.sort((a, b) => b.value - a.value);

    tableBody.innerHTML = assets.map(asset => `
      <tr>
        <td class="asset">${asset.name}</td>
        <td class="${asset.trendClass}">${asset.display}</td>
      </tr>
    `).join('');

    // Cálculo DEFCON (usando valores actuales)
    const energyVal = week.energy;
    const techVal = week.tech;
    let level = 3;
    if (techVal < -2.5 && energyVal > 2.5) level = 1;
    else if (techVal < 0 && energyVal > 0) level = 2;
    else if (techVal < 0 && energyVal < 0) level = 3;
    else if (techVal > 0 && energyVal < 0) level = 4;
    else level = 5;

    const allLevels = document.querySelectorAll('.defcon-level');
    allLevels.forEach(el => el.classList.remove('active'));
    const activeLevel = document.querySelector(`.defcon-level[data-level="${level}"]`);
    if (activeLevel) activeLevel.classList.add('active');
  }

  function prevWeek() {
    if (currentIndex + 1 < weeksData.length) {
      currentIndex++;
      renderWeek(currentIndex);
    }
  }

  function nextWeek() {
    if (currentIndex - 1 >= 0) {
      currentIndex--;
      renderWeek(currentIndex);
    }
  }

  prevBtn.addEventListener('click', prevWeek);
  nextBtn.addEventListener('click', nextWeek);

  renderWeek(currentIndex);
})();


// ========================
// PANEL DE GIRO (Brent, WTI, USD)
// ========================

// Datos históricos (ordena de más reciente a más antigua)
// Los valores deben ser números (sin %), ej: brent_w: 3.2
const giroData = [
  { date: "2026-04-13", scan: "04-18",
    brent_w: -5.06, brent_m: -7.8,
    wti_w: -11.24, wti_m: -10.24,
    usd_w: -0.55, usd_m: -1.44 },
  // Agrega más semanas al inicio (más recientes) o al final, manteniendo orden cronológico descendente
];

let currentGiroIndex = 0;  // 0 = semana más reciente

function getGiroDirection(brent_w, wti_w, usd_w) {
  // Umbrales ajustables
  if (brent_w > 1.0 && usd_w > 0.5 && wti_w < -0.5) return 'right';   // giro inminente hacia Energy
  if (brent_w < -0.5 && usd_w < -0.5 && wti_w > 1.0) return 'left';    // giro hacia Tech
  return 'up';   // neutro
}

function renderGiro(index) {
  const w = giroData[index];
  if (!w) return;
  document.getElementById('giroDateHeader').innerHTML = `🪖 WEEK ${w.date} · SCAN ${w.scan}`;
  
  // Actualizar tabla
  const assets = [
    { name: "BRENT", w: w.brent_w, m: w.brent_m },
    { name: "WTI",   w: w.wti_w,   m: w.wti_m },
    { name: "USD",   w: w.usd_w,   m: w.usd_m }
  ];
  const tbody = document.getElementById('giroTableBody');
  tbody.innerHTML = assets.map(a => {
    const wClass = a.w > 0 ? 'up' : (a.w < 0 ? 'down' : 'neutral');
    const mClass = a.m > 0 ? 'up' : (a.m < 0 ? 'down' : 'neutral');
    return `
      <tr>
        <td class="asset">${a.name}</td>
        <td class="${wClass}">${a.w > 0 ? '+' : ''}${a.w}%</td>
        <td class="${mClass}">${a.m > 0 ? '+' : ''}${a.m}%</td>
      </tr>
    `;
  }).join('');

  // Actualizar flecha de dirección
  const arrowElem = document.getElementById('giroArrow');
  const direction = getGiroDirection(w.brent_w, w.wti_w, w.usd_w);
  arrowElem.className = `dir-arrow arrow-${direction}`;
  arrowElem.innerText = direction === 'left' ? '←' : (direction === 'right' ? '→' : '↑');
}

// Controles del carrusel de giro (independientes del DEFCON)
document.getElementById('prevGiroBtn').addEventListener('click', () => {
  if (currentGiroIndex + 1 < giroData.length) {
    currentGiroIndex++;
    renderGiro(currentGiroIndex);
  }
});
document.getElementById('nextGiroBtn').addEventListener('click', () => {
  if (currentGiroIndex - 1 >= 0) {
    currentGiroIndex--;
    renderGiro(currentGiroIndex);
  }
});

// Inicializar
renderGiro(currentGiroIndex);