// Globales Objekt für die Daten nach Borough
let boroughData = {};
const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];



// Daten vom Backend abrufen

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


