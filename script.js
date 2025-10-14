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

const canvas = document.querySelector('#canvas');
//hier code reinkopieren von leas template


console.log('hoi');

const data = [
    {
        label: 'Bananen',
        value: 20
    },
    {
        label: 'Karotten',
        value: 40
    },
    {
        label: 'Birnen',
        value: 10
    }
];

const labels = data.map(item => {
    return item.label;
})
const numbers = data.map(item => {
    return item.value;
})

const canvas = document.querySelector('#canvas');
const chart = new Chart(canvas, {
        type: 'bar',
        data: {
        labels: labels,
        datasets: [{
            label: 'Verfügbarkeiten',
            data: numbers,
            borderWidth: 1
        }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });