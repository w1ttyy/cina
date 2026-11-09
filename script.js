// Typy oblečenia: kľúč v stores.json -> názov a ikonka (SVG cesty, 24x24)
const CATEGORIES = {
  tricka: {
    label: "Tričká",
    icon: '<path d="M8 3 3 6l2 4 3-1v12h8V9l3 1 2-4-5-3c-.6 1.6-2.1 2.5-4 2.5S8.6 4.6 8 3Z"/>',
  },
  mikiny: {
    label: "Mikiny",
    icon: '<path d="M9 3c0 2 1.3 3.5 3 3.5S15 5 15 3"/><path d="M9 3 4.5 5.5 2 17h3l1.5-6V21h11V11l1.5 6h3L19.5 5.5 15 3"/><path d="M8.5 16h7v3h-7z"/><path d="M11 6.5V9M13 6.5V9"/>',
  },
  bundy: {
    label: "Bundy",
    icon: '<path d="M9 3 4.5 5.5 2 17h3l1.5-6V21h11V11l1.5 6h3L19.5 5.5 15 3"/><path d="M9 3l3 3 3-3"/><path d="M12 6v15"/><path d="M7.5 14h2.5M14 14h2.5"/>',
  },
  nohavice: {
    label: "Nohavice",
    icon: '<path d="M6 3h12l1 18h-5l-2-11-2 11H5L6 3Z"/><path d="M6 6h12"/>',
  },
  sortky: {
    label: "Šortky",
    icon: '<path d="M5 6h14l1.2 11H14l-2-5-2 5H3.8L5 6Z"/><path d="M5 9h14"/>',
  },
  topanky: {
    label: "Topánky",
    icon: '<path d="M2 18v-5l4-6 3.5 3 3-1 6 3.5c2 .8 3.5 2 3.5 3.5v2H2Z"/><path d="M2 15.5h20"/><path d="M10 11.5l1.5 1.5M12.5 10.5 14 12"/>',
  },
  ciapky: {
    label: "Čiapky",
    icon: '<path d="M4 15a8 7 0 0 1 16 0Z"/><path d="M12 15h9.5c0 1.4-1 2-2.5 2H12"/><path d="M12 8V6.5"/>',
  },
  tasky: {
    label: "Tašky",
    icon: '<path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  },
  doplnky: {
    label: "Doplnky",
    icon: '<circle cx="12" cy="12" r="4.5"/><path d="M12 10v2l1.5 1"/><path d="M9.5 8.2 10.3 3h3.4l.8 5.2M9.5 15.8l.8 5.2h3.4l.8-5.2"/>',
  },
};

const ALL = "all";
const VISIBLE_BRANDS = 10;

const storesEl = document.querySelector("#stores");
const filtersEl = document.querySelector("#filters");
const searchEl = document.querySelector("#search");
const countEl = document.querySelector("#count");

let stores = [];
let activeCategory = ALL;

// Vytvorí element s triedou a textom. textContent (nie innerHTML) = bezpečné aj pre dáta z JSON.
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Ikonky sú naše konštanty (nie dáta od používateľa), preto tu innerHTML nevadí.
function icon(categoryKey) {
  const span = el("span", "icon");
  span.setAttribute("aria-hidden", "true");
  span.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${CATEGORIES[categoryKey].icon}</svg>`;
  return span;
}

function createLink(url, text, className) {
  const a = el("a", className, text);
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  return a;
}

function formatAlbums(count) {
  if (!count) return "";
  return count.toLocaleString("sk-SK") + " albumov";
}

function createBrands(store) {
  const wrap = el("div", "brands");
  const brands = store.brands || [];

  brands.forEach((brand, index) => {
    const chip = el("button", "brand", brand);
    chip.type = "button";
    chip.title = `Hľadať ${brand}`;
    if (index >= VISIBLE_BRANDS) chip.hidden = true;
    chip.addEventListener("click", () => {
      searchEl.value = brand;
      activeCategory = ALL;
      renderFilters();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    wrap.append(chip);
  });

  const hiddenCount = brands.length - VISIBLE_BRANDS;
  if (hiddenCount > 0) {
    const more = el("button", "brand more", `+${hiddenCount}`);
    more.type = "button";
    more.addEventListener("click", () => {
      wrap.querySelectorAll(".brand[hidden]").forEach((b) => (b.hidden = false));
      more.remove();
    });
    wrap.append(more);
  }
  return wrap;
}

function createCard(store) {
  const card = el("article", store.locked ? "card locked" : "card");

  const head = el("div", "card-head");
  head.append(el("h2", "", store.name));
  if (store.locked) head.append(el("span", "badge", "🔒 heslo"));
  else if (store.albums) head.append(el("span", "badge", formatAlbums(store.albums)));
  card.append(head);

  if (store.categories.length > 0) {
    const types = el("div", "types");
    for (const key of store.categories) {
      if (!CATEGORIES[key]) continue;
      const type = el("span", "type");
      type.title = CATEGORIES[key].label;
      type.append(icon(key), el("span", "type-label", CATEGORIES[key].label));
      types.append(type);
    }
    card.append(types);
  }

  if (store.brands && store.brands.length > 0) {
    card.append(createBrands(store));
  }

  if (store.note) card.append(el("p", "note", store.note));

  if (store.sections && store.sections.length > 0) {
    const sections = el("div", "sections");
    sections.append(el("span", "sections-title", "Priamo do sekcie:"));
    for (const section of store.sections) {
      sections.append(createLink(section.url, section.label));
    }
    card.append(sections);
  }

  card.append(createLink(store.url, "Otvoriť obchod", "open-btn"));
  return card;
}

function matchesSearch(store, query) {
  if (!query) return true;
  const labels = store.categories.map((k) => CATEGORIES[k]?.label || k);
  const haystack = [
    store.name,
    store.url,
    store.note || "",
    ...store.categories,
    ...labels,
    ...(store.brands || []),
    ...(store.sections || []).map((s) => s.label),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function matchesCategory(store) {
  return activeCategory === ALL || store.categories.includes(activeCategory);
}

function render() {
  const query = searchEl.value.trim().toLowerCase();
  const visible = stores.filter(
    (store) => matchesCategory(store) && matchesSearch(store, query)
  );

  storesEl.replaceChildren();
  if (visible.length === 0) {
    storesEl.append(el("p", "message", "Nič sa nenašlo."));
  } else {
    for (const store of visible) storesEl.append(createCard(store));
  }

  countEl.textContent = `Zobrazené: ${visible.length} z ${stores.length}`;
}

function renderFilters() {
  // Ukáž len kategórie, ktoré má aspoň jeden obchod, v poradí podľa CATEGORIES
  const used = new Set(stores.flatMap((s) => s.categories));
  const keys = Object.keys(CATEGORIES).filter((k) => used.has(k));

  filtersEl.replaceChildren();
  for (const key of [ALL, ...keys]) {
    const button = el("button", "chip");
    button.type = "button";
    if (key === ALL) {
      button.textContent = "Všetko";
    } else {
      const count = stores.filter((s) => s.categories.includes(key)).length;
      button.append(icon(key), el("span", "", `${CATEGORIES[key].label} (${count})`));
    }
    if (key === activeCategory) button.classList.add("active");
    button.addEventListener("click", () => {
      activeCategory = key;
      renderFilters();
      render();
    });
    filtersEl.append(button);
  }
}

async function init() {
  try {
    const response = await fetch("stores.json");
    if (!response.ok) throw new Error("HTTP " + response.status);
    stores = await response.json();
    // Zaheslované obchody na koniec, ostatné podľa veľkosti katalógu
    stores.sort(
      (a, b) => Number(!!a.locked) - Number(!!b.locked) || (b.albums || 0) - (a.albums || 0)
    );
  } catch (error) {
    storesEl.append(
      el("p", "message", "Nepodarilo sa načítať stores.json (" + error.message + ").")
    );
    console.error(error);
    return;
  }

  renderFilters();
  render();
  searchEl.addEventListener("input", render);
}

init();
