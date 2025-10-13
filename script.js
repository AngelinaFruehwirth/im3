// Globales Objekt für die Daten nach Borough
let boroughData = {};
const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];

// Referenz zum bestehenden Datepicker
const datepicker = document.querySelector('#datepicker');
const resultsContainer = document.getElementById('results');

// Event: Datum auswählen
datepicker.addEventListener('change', () => {
  const date = datepicker.value;
  if (date) getByDate(date);
});

// -------------------------
// Daten vom Backend abrufen
// -------------------------
async function getByDate(date) {
  const url = `https://im3.angelina-fruehwirth.ch/backend/api/getByDate.php?date=${encodeURIComponent(date)}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Rohdaten vom Backend:', data);

    filterByBorough(data);

  } catch (error) {
    console.error('Fehler beim Abrufen:', error);
  }
}

// -------------------------
// Daten nach Borough filtern
// -------------------------
function filterByBorough(data) {
  boroughData = {};
  boroughs.forEach(b => {
    // Filter für jeden Borough
    boroughData[b] = data.filter(item => item.borough === b);
  });

  console.log('Gefilterte Daten nach Borough:', boroughData);
}

// -------------------------
// Optional: Daten im Frontend anzeigen
// -------------------------
function displayData(borough) {
  const data = boroughData[borough] || [];
  resultsContainer.innerHTML = `<h3>${borough} (${data.length} Einträge)</h3>`;

  if (data.length === 0) {
    resultsContainer.innerHTML += '<p>Keine Daten gefunden.</p>';
    return;
  }

  const list = document.createElement('ul');
  data.forEach(item => {
    const li = document.createElement('li');
    li.textContent = JSON.stringify(item);
    list.appendChild(li);
  });
  resultsContainer.appendChild(list);
}

// -------------------------
// Event: Borough Buttons
// -------------------------
document.querySelectorAll('#boroughButtons button').forEach(btn => {
  btn.addEventListener('click', () => {
    const borough = btn.dataset.borough;
    displayData(borough);
  });
});
