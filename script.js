(function() {
  // Intersection Observer para revelar los .week-block al hacer scroll
  const weeks = document.querySelectorAll('.week-block');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.2 });
  weeks.forEach(block => observer.observe(block));

  // Función que actualiza el DEFCON a partir de la tabla de la semana actual (la primera)
  function updateDefconFromCurrentWeek() {
    const currentTable = document.querySelector('#currentWeekTable tbody');
    if (!currentTable) return;
    const rows = currentTable.querySelectorAll('tr');
    if (rows.length < 2) return;

    const energyRow = rows[0];   // ENERGY
    const techRow = rows[1];     // TECHNOLOGY

    const energyValCell = energyRow.querySelector('td:nth-child(3)'); // Perf W
    const techValCell = techRow.querySelector('td:nth-child(3)');

    if (!energyValCell || !techValCell) return;

    let energyVal = parseFloat(energyValCell.innerText);
    let techVal = parseFloat(techValCell.innerText);
    if (isNaN(energyVal) || isNaN(techVal)) return;

    let level = 3; // DEFCON 3 por defecto
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

  updateDefconFromCurrentWeek();
})();