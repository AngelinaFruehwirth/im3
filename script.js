// Daten vom Backend abrufen -> bleibt fix als Container worin die Daten gesammelt werden
let data = null;

async function getByDate(date) {
  const url = `https://im3.angelina-fruehwirth.ch/backend/api/getByDate.php?date=${date}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fehler beim Abrufen:", error);
    return [];
  }
}

function toTitleCase(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getBoroughStatsFromData(rows) {
  const boroughOrder = ["MANHATTAN", "BROOKLYN", "QUEENS", "BRONX", "STATEN ISLAND"];
  const boroughCounts = Object.fromEntries(boroughOrder.map((b) => [b, 0]));

  for (const item of rows || []) {
    const key = item.borough?.trim().toUpperCase();
    if (key && boroughCounts[key] !== undefined) boroughCounts[key]++;
  }

  const total = Object.values(boroughCounts).reduce((a, b) => a + b, 0);

  const boroughPercentages = Object.fromEntries(
    boroughOrder.map((b) => [b, total ? (boroughCounts[b] / total) * 100 : 0])
  );

  return { boroughOrder, boroughCounts, boroughPercentages, total };
}

function getBoroughDomIds(boroughName) {
  if (boroughName === "STATEN ISLAND") {
    return { shapeId: "STATEN_ISLAND", textId: "STATEN_ISLAND-text" };
  }
  return { shapeId: boroughName, textId: `${boroughName}-text` };
}

function renderLegend() {
  const legendHTML = `
    <div class="legend">
      <span class="legend-item" id="legend-MANHATTAN"><i class="dot manhattan"></i>Manhattan</span>
      <span class="legend-item" id="legend-BROOKLYN"><i class="dot brooklyn"></i>Brooklyn</span>
      <span class="legend-item" id="legend-QUEENS"><i class="dot queens"></i>Queens</span>
      <span class="legend-item" id="legend-BRONX"><i class="dot bronx"></i>Bronx</span>
      <span class="legend-item" id="legend-STATEN_ISLAND"><i class="dot staten"></i>Staten Island</span>
    </div>
  `;
  const el = document.querySelector("#borough-stats");
  if (el) el.innerHTML = legendHTML;
}


function wireLegendHover() {
  const boroughIds = ["MANHATTAN", "BROOKLYN", "QUEENS", "BRONX", "STATEN_ISLAND"];

  boroughIds.forEach((id) => {
    const shape = document.getElementById(id);
    const legend = document.getElementById("legend-" + id);
    if (!shape || !legend) return;

    shape.addEventListener("mouseenter", () => {
      legend.classList.add("active");
    });

    shape.addEventListener("mouseleave", () => {
      legend.classList.remove("active");
    });
  });
}


function updateBoroughMap() {
  const { boroughOrder, boroughCounts, boroughPercentages, total } =
    getBoroughStatsFromData(data);

  // reset / no data
  if (!data || data.length === 0 || total === 0) {
    boroughOrder.forEach((b) => {
      const { shapeId, textId } = getBoroughDomIds(b);

      const t = document.getElementById(textId);
      if (t) t.textContent = "0%";

      const shape = document.getElementById(shapeId);
      if (shape) shape.setAttribute("title", `${b}: 0 complaints`);
    });
    return;
  }

  boroughOrder.forEach((b) => {
    const pct = boroughPercentages[b];
    const pctText = `${pct.toFixed(1)}%`;

    const { shapeId, textId } = getBoroughDomIds(b);

    const t = document.getElementById(textId);
    if (t) t.textContent = pctText;

    const shape = document.getElementById(shapeId);
    if (shape) {
      shape.setAttribute(
        "title",
        `${b}: ${boroughCounts[b]} complaints (${pct.toFixed(1)}%)`
      );
    }
  });
}


function updateTopComplaints() {
  const podium = document.querySelector("#top3-podium");
  if (!podium) return;

  if (!data?.length) {
    podium.style.display = "none";
    return;
  }

  podium.style.display = "flex";

  const counts = {};

  for (const item of data) {
    const rawType = item.complaint_type?.trim();
    const rawDesc = item.descriptor?.trim();

    if (!rawType) continue;

    const type = toTitleCase(rawType);
    const desc = rawDesc ? toTitleCase(rawDesc) : null;

    const key = desc ? `${type} | ${desc}` : type;
    counts[key] = (counts[key] || 0) + 1;
  }

  const top3 = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const slots = ["first", "second", "third"];

  if (top3.length === 0) {
    slots.forEach((cls) => {
      const div = podium.querySelector("." + cls);
      if (div) div.innerHTML = `<strong>–</strong><br>No complaint data`;
    });
    return;
  }

  top3.forEach(([label, count], i) => {
    const div = podium.querySelector("." + slots[i]);
    if (!div) return;

    div.innerHTML = `<strong>${count}</strong><br>${label}`;
  });

  for (let i = top3.length; i < 3; i++) {
    const div = podium.querySelector("." + slots[i]);
    if (div) div.innerHTML = `<strong>–</strong><br>Not enough data`;
  }
}

// Datepicker Eventlistener
const date_picker = document.querySelector("#datepicker");

// Legende direkt anzeigen
renderLegend();
wireLegendHover();

date_picker.addEventListener("input", async function () {
  const date = date_picker.value;
  data = await getByDate(date);
  console.log("byDate", data);

  updateBoroughMap();
  updateTopComplaints();
});
