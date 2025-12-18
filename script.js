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

    shape.addEventListener("mouseenter", () => legend.classList.add("active"));
    shape.addEventListener("mouseleave", () => legend.classList.remove("active"));
  });
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function getBasePath() {
  const u = new URL(window.location.href);
  u.pathname = u.pathname.replace(/[^/]*$/, "");
  return u.href;
}

async function fetchInlineSvgNormalized(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`SVG nicht gefunden: ${url}`);

  const txt = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(txt, "image/svg+xml");
  const svg = doc.querySelector("svg");
  if (!svg) throw new Error(`Keine <svg> in Datei: ${url}`);

  const vb = svg.getAttribute("viewBox");
  const inner = document.createElementNS("http://www.w3.org/2000/svg", "g");

  [...svg.childNodes].forEach((n) => {
    inner.appendChild(n.cloneNode(true));
  });

  if (vb) {
    const [x, y] = vb.split(" ").map(Number);
    if (!Number.isNaN(x) && !Number.isNaN(y)) {
      inner.setAttribute("transform", `translate(${-x} ${-y})`);
    }
  }

  return inner;
}

function placeGroupIntoRect(g, rect) {
  const bbox = g.getBBox();
  if (!bbox.width || !bbox.height) return;

  const scale = Math.min(rect.w / bbox.width, rect.h / bbox.height);

  const targetCx = rect.x + rect.w / 2;
  const targetCy = rect.y + rect.h / 2;
  const bboxCx = bbox.x + bbox.width / 2;
  const bboxCy = bbox.y + bbox.height / 2;

  const tx = targetCx - bboxCx * scale;
  const ty = targetCy - bboxCy * scale;

  g.setAttribute("transform", `translate(${tx} ${ty}) scale(${scale})`);
}

const LABEL_OFFSETS = {
  MANHATTAN: { dx: -10, dy: 26 },
  QUEENS: { dx: 22, dy: -18 },
};

function positionLabelInGroup(outerGroup, innerGroup, textEl) {
  const bbox = innerGroup.getBBox();
  if (!bbox.width || !bbox.height) return;

  const id = outerGroup.getAttribute("id");
  const off = LABEL_OFFSETS[id] || { dx: 0, dy: 0 };

  const cx = bbox.x + bbox.width / 2 + off.dx;
  const cy = bbox.y + bbox.height / 2 + off.dy;

  textEl.setAttribute("x", cx);
  textEl.setAttribute("y", cy);
}

async function loadBoroughSvgsIntoMap() {
  const nycMap = document.getElementById("nyc-map");
  if (nycMap) {
    nycMap.setAttribute("viewBox", "0 0 900 900");
    nycMap.setAttribute("preserveAspectRatio", "xMidYMid meet");
  }

  const boroughLayer = document.getElementById("borough-layer");
  if (!boroughLayer) return;

  boroughLayer.innerHTML = "";

  const slots = {
    BRONX: { x: 520, y: 40, w: 300, h: 230 },
    MANHATTAN: { x: 460, y: 140, w: 140, h: 430 },
    QUEENS: { x: 610, y: 300, w: 320, h: 380 },
    BROOKLYN: { x: 420, y: 420, w: 320, h: 360 },
    STATEN_ISLAND: { x: 180, y: 560, w: 280, h: 220 },
  };

  const base = getBasePath();

  const files = {
    BRONX: `${base}bilder/Bronx.svg`,
    MANHATTAN: `${base}bilder/Manhattan.svg`,
    QUEENS: `${base}bilder/Queens.svg`,
    BROOKLYN: `${base}bilder/Brooklyn.svg`,
    STATEN_ISLAND: `${base}bilder/Staten_Island.svg`,
  };

  for (const id of Object.keys(files)) {
    const outer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    outer.setAttribute("id", id);
    outer.classList.add("borough");

    const innerWrap = document.createElementNS("http://www.w3.org/2000/svg", "g");
    innerWrap.classList.add("borough-inner");

    const inner = await fetchInlineSvgNormalized(files[id]);
    innerWrap.appendChild(inner);
    outer.appendChild(innerWrap);

    const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("id", `${id}-text`);
    t.classList.add("borough-text");
    t.textContent = "0%";
    outer.appendChild(t);

    boroughLayer.appendChild(outer);

    await nextFrame();
    placeGroupIntoRect(outer, slots[id]);

    await nextFrame();
    positionLabelInGroup(outer, innerWrap, t);
  }
}

function updateBoroughMap() {
  const { boroughOrder, boroughCounts, boroughPercentages, total } =
    getBoroughStatsFromData(data);

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

    const outer = document.getElementById(shapeId);
    const innerWrap = outer?.querySelector(".borough-inner");
    if (outer && innerWrap && t) positionLabelInGroup(outer, innerWrap, t);
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

(async function init() {
  try {
    await loadBoroughSvgsIntoMap();
    wireLegendHover();
  } catch (e) {
    console.error(e);
  }
})();

date_picker.addEventListener("input", async function () {
  const date = date_picker.value;
  data = await getByDate(date);
  console.log("byDate", data);

  updateBoroughMap();
  updateTopComplaints();
});
