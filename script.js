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

const boroughColors = {
  'MANHATTAN': 'rgba(255, 99, 132, 1)',
  'BROOKLYN': 'rgba(54, 162, 235, 1)',
  'QUEENS': 'rgba(255, 206, 86, 1)',
  'BRONX': 'rgba(75, 192, 192, 1)',
  'STATEN ISLAND': 'rgba(153, 102, 255, 1)'
};

function prepareLineChartData() {
  const hours = Array.from({ length: 12 }, (_, i) => i * 2);
  const labels = hours.map(h => `${h === 0 ? 12 : h > 12 ? h - 12 : h}${h < 12 ? ' AM' : ' PM'}`);
  const boroughs = ['MANHATTAN', 'BROOKLYN', 'QUEENS', 'BRONX', 'STATEN ISLAND'];
  const boroughCounts = Object.fromEntries(boroughs.map(b => [b, Array(12).fill(0)]));

data.forEach(item => {
  const b = item.borough?.trim().toUpperCase();
  if (!boroughCounts[b]) return;

  const t = new Date(item.timestamp);
  let hour = t.getUTCHours() - 4; // New York = UTC-4
  if (hour < 0) hour += 24;       // falls negativ, auf 24h-Skala korrigieren

  const i = Math.floor(hour / 2);
  boroughCounts[b][i]++;
});




  /*data.forEach(item => {
    const b = item.borough?.trim().toUpperCase();
    const t = new Date(item.timestamp);
    const i = Math.floor(t.getHours() / 2);
    if (boroughCounts[b]) boroughCounts[b][i]++;
  }); */

  return {
    labels,
    datasets: boroughs.map(b => ({
      label: b,
      data: boroughCounts[b],
      borderColor: boroughColors[b],
      fill: false,
      tension: 0.3
    }))
  };
}

let lineChart;
function updateLineChart() {
  const ctx = document.querySelector('#canvas');
  const chartData = prepareLineChartData();

  if (lineChart) lineChart.destroy();
  lineChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      scales: { y: { beginAtZero: true } },
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

date_picker.addEventListener('input', async () => updateLineChart());

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