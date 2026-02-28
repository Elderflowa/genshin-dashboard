// ==============================
// BANNERS
// ==============================

async function loadBanners() {
  const res = await fetch("https://api.ennead.cc/mihoyo/genshin/calendar");
  const data = await res.json();

  const now = Math.floor(Date.now() / 1000);

  const activeBanners = data.banners.filter(b =>
    b.characters.length > 0 &&
    now >= b.start_time &&
    now <= b.end_time &&
    b.name.includes("Character Event Wish")
  );

  const container = document.getElementById("banners");
  container.innerHTML = "";

  activeBanners.forEach(banner => {
    const fiveStar = banner.characters.find(c => c.rarity === 5);

    const elementIcon = `./icons/Element_${fiveStar.element}.webp`;

    const div = document.createElement("div");
    div.className = "banner";

    div.innerHTML = `
      <div class="banner-header">
        <img src="${fiveStar.icon}" alt="${fiveStar.name}">
        <div>
          <h3>${fiveStar.name}</h3>
          <img 
            src="${elementIcon}" 
            alt="${fiveStar.element}" 
            style="width:28px; margin-top:6px;"
          >
        </div>
      </div>
      <div class="countdown" id="countdown-${banner.id}"></div>
    `;

    container.appendChild(div);

    startCountdown(banner.id, banner.end_time);
  });
}

function startCountdown(id, endTime) {
  const el = document.getElementById(`countdown-${id}`);

  function update() {
    const now = Math.floor(Date.now() / 1000);
    const diff = endTime - now;

    if (diff <= 0) {
      el.innerText = "Banner ended.";
      return;
    }

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    el.innerText = `Ends in: ${days}d ${hours}h ${minutes}m`;
  }

  update();
  setInterval(update, 60000);
}

// ==============================
// DAILY CHECKLIST (unchanged)
// ==============================

const RESET_HOUR = 2;

const defaultTasks = [
  "Resin (Artifacts, XP, Mora)",
  "Expedition",
  "Battle Pass Quests",
  "Serenitea: Claim Currency/Friendship, Buy Speed",
  "Serenitea: Buy Speed Elixir",
  "Daily Commissions",
  "Sign in Hoyolab",
  "Buy Milk and Wheat and Meat"
];

function getResetTime() {
  const now = new Date();
  const reset = new Date();
  reset.setHours(RESET_HOUR, 0, 0, 0);

  if (now < reset) {
    reset.setDate(reset.getDate() - 1);
  }

  return reset.getTime();
}

function checkReset() {
  const lastReset = localStorage.getItem("lastReset");
  const resetTime = getResetTime();

  if (!lastReset || Number(lastReset) < resetTime) {
    const freshTasks = defaultTasks.map(name => ({ name, done: false }));
    localStorage.setItem("tasks", JSON.stringify(freshTasks));
    localStorage.setItem("lastReset", Date.now());
  }
}

function loadChecklist() {
  checkReset();

  let tasks = JSON.parse(localStorage.getItem("tasks"));
  if (!tasks) {
    tasks = defaultTasks.map(name => ({ name, done: false }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  const container = document.getElementById("checklist");
  container.innerHTML = "";

  tasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;

    checkbox.addEventListener("change", () => {
      tasks[index].done = checkbox.checked;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      updateProgress(tasks);
    });

    const label = document.createElement("label");
    label.innerText = task.name;

    div.appendChild(checkbox);
    div.appendChild(label);
    container.appendChild(div);
  });

  updateProgress(tasks);
}

function updateProgress(tasks) {
  const done = tasks.filter(t => t.done).length;
  const percent = Math.round((done / tasks.length) * 100);

  document.getElementById("dailyTitle").innerText =
    `Daily (${percent}%)`;
}

// ==============================
// INIT
// ==============================

loadBanners();
loadChecklist();