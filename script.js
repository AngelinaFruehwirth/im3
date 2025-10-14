// Daten vom Backend abrufen ->bleibt fix als Container worin die Daten gesammelt werden
let data = null;
async function getByDate(date) {
  const url = `https://im3.angelina-fruehwirth.ch/backend/api/getByDate.php?date=${date}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fehler beim Abrufen:', error);
  }
}

// Datepicker
const date_picker = document.querySelector('#datepicker');
date_picker.addEventListener('input', async function() {
    const date = date_picker.value;
    data = await getByDate(date);
    console.log('byDate',data);
})


// Funktion die anzeigt, wie viele Beschwerden es pro Viertel gibt in Prozent
function updateBoroughStats() {
    if (!data || data.length === 0) {
        document.querySelector('#borough-stats').innerText = "Keine Daten für diesen Tag.";
        return;
    }

    const boroughOrder = ['MANHATTAN','BROOKLYN','QUEENS','BRONX','STATEN ISLAND'];
    const boroughData = Object.fromEntries(boroughOrder.map(b => [b, 0]));

    data.forEach(item => {
        const key = item.borough?.trim().toUpperCase();
        if (key && boroughData[key] !== undefined) boroughData[key]++;
    });

    const total = Object.values(boroughData).reduce((a,b)=>a+b,0);

    const boroughPercentages = Object.fromEntries(
        Object.entries(boroughData).map(([b,c]) => [b, total ? ((c/total)*100).toFixed(2) : 0])
    );

    const html = `
        <ul>
            ${boroughOrder.map(b => `<li>${b}: ${boroughPercentages[b]}%</li>`).join('')}
        </ul>
    `;
    document.querySelector('#borough-stats').innerHTML = html;

    console.log('Boroughs:', boroughData);
    console.log('Prozentwerte:', boroughPercentages);
}

date_picker.addEventListener('input', async function() {
    if (data) updateBoroughStats(); 
});



// Liniendiagramm



/*console.log('hoi');

const data_test = [
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

const labels = data_test.map(item => {
    return item.label;
})
const numbers = data_test.map(item => {
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
    });*/