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
const WOMEN = "women"; // špeciálny filter "Pre ženy"
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

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

// Jeden riadok tagov: vľavo popis ("Oblečenie"), vpravo samotné tagy
function tagLine(label, content) {
  const line = el("div", "tag-line");
  line.append(el("span", "tag-label", label), content);
  return line;
}

function createTypes(store) {
  const wrap = el("div", "tags");
  for (const key of store.categories) {
    if (!CATEGORIES[key]) continue;
    const type = el("span", "type");
    type.append(icon(key), el("span", "", CATEGORIES[key].label));
    wrap.append(type);
  }
  if (!wrap.children.length) wrap.append(el("span", "empty", "zatiaľ nevieme"));
  return wrap;
}

function createBrands(store) {
  const wrap = el("div", "tags");
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

function createPassword(password) {
  const wrap = el("div", "password");
  const code = el("code", "", password);
  const button = el("button", "copy-btn", "Kopírovať");
  button.type = "button";
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(password);
      button.textContent = "Skopírované ✓";
    } catch {
      // Schránka nefunguje napr. na http:// – aspoň označíme text
      getSelection().selectAllChildren(code);
      button.textContent = "Ctrl+C";
    }
    setTimeout(() => (button.textContent = "Kopírovať"), 1500);
  });
  wrap.append("🔒 Heslo:", code, button);
  return wrap;
}

function createRow(store) {
  const row = el("article", "row");
  if (store.pinned) row.classList.add("pinned");

  // Ľavý stĺpec: názov, info, poznámka, heslo
  const main = el("div", "row-main");
  main.append(el("h2", "", store.name));
  const meta = [formatAlbums(store.albums), getDomain(store.url)].filter(Boolean);
  main.append(el("p", "meta", meta.join(" · ")));
  if (store.note) main.append(el("p", "note", store.note));
  if (store.password) main.append(createPassword(store.password));

  // Stredný stĺpec: hore oblečenie, dole značky, potom sekcie
  const tags = el("div", "row-tags");
  tags.append(tagLine("Oblečenie", createTypes(store)));
  if (store.women) {
    tags.append(tagLine("Pre ženy", el("span", "women", "♀ " + store.women)));
  }
  if (store.brands && store.brands.length > 0) {
    tags.append(tagLine("Značky", createBrands(store)));
  }
  if (store.sections && store.sections.length > 0) {
    const links = el("div", "sections");
    for (const section of store.sections) links.append(createLink(section.url, section.label));
    tags.append(tagLine("Sekcie", links));
  }

  // Pravý stĺpec: tlačidlo
  const action = el("div", "row-action");
  action.append(createLink(store.url, "Otvoriť →", "open-btn"));

  row.append(main, tags, action);
  return row;
}

function matchesSearch(store, query) {
  if (!query) return true;
  const labels = store.categories.map((k) => CATEGORIES[k]?.label || k);
  const haystack = [
    store.name,
    store.url,
    store.note || "",
    store.women ? store.women + " ženy dámske damske" : "",
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
  if (activeCategory === ALL) return true;
  if (activeCategory === WOMEN) return Boolean(store.women);
  return store.categories.includes(activeCategory);
}

function renderGroup(title, list) {
  if (list.length === 0) return;
  storesEl.append(el("h3", "group-title", title));
  const group = el("div", "group-list");
  for (const store of list) group.append(createRow(store));
  storesEl.append(group);
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
    renderGroup("Odporúčané", visible.filter((s) => s.pinned));
    renderGroup("Ďalšie obchody", visible.filter((s) => !s.pinned));
  }

  countEl.textContent = `Zobrazené: ${visible.length} z ${stores.length}`;
}

function renderFilters() {
  // Ukáž len kategórie, ktoré má aspoň jeden obchod, v poradí podľa CATEGORIES
  const used = new Set(stores.flatMap((s) => s.categories));
  const keys = Object.keys(CATEGORIES).filter((k) => used.has(k));

  filtersEl.replaceChildren();
  const womenCount = stores.filter((s) => s.women).length;
  const all = womenCount > 0 ? [ALL, ...keys, WOMEN] : [ALL, ...keys];

  for (const key of all) {
    const button = el("button", "chip");
    button.type = "button";
    if (key === ALL) {
      button.textContent = "Všetko";
    } else if (key === WOMEN) {
      button.textContent = `♀ Pre ženy (${womenCount})`;
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
    // Pripnuté ostávajú v poradí zo stores.json; ostatné podľa veľkosti,
    // zaheslované bez známeho hesla na koniec
    const group = (s) => (s.pinned ? 0 : s.locked && !s.password ? 2 : 1);
    stores.sort(
      (a, b) =>
        group(a) - group(b) ||
        (group(a) === 1 ? (b.albums || 0) - (a.albums || 0) : 0)
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
