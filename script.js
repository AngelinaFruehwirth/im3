// Globales Objekt für die Daten nach Borough
let boroughData = {};
const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];



// Daten vom Backend abrufen

async function getByDate(date) {
  const url = `https://im3.angelina-fruehwirth.ch/backend/api/getByDate.php?date=${date}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Rohdaten vom Backend:', data);

    filterByBorough(data);

  } catch (error) {
    console.error('Fehler beim Abrufen:', error);
  }
}

const date_picker = document.querySelector('#datepicker');
date_picker.addEventListener('input', async function() {
    const date = date_picker.value;
    const byDate = await getByDate(date);
    console.log('byDate', byDate);
})


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
        type: 'line',
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