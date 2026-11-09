# Reps zoznam
   **👉 Stránka: https://w1ttyy.github.io/cina/**

**👉 Stránka: https://w1ttyy.github.io/cina/**

Zoznam Yupoo obchodov s oblečením. Stránka beží na GitHub Pages a všetky dáta sú v súbore [`stores.json`](stores.json).

## Ako pridať alebo upraviť obchod

1. Na GitHube otvor `stores.json` a klikni na ikonu ceruzky (Edit).
2. Skopíruj jeden blok `{ ... }` a uprav ho:

```json
{
  "name": "Názov obchodu",
  "url": "https://nieco.x.yupoo.com/albums",
  "albums": 1200,
  "categories": ["mikiny", "tricka"],
  "brands": ["Nike", "Stüssy"],
  "sections": [
    { "label": "Mikiny", "url": "https://nieco.x.yupoo.com/categories/12345" }
  ],
  "note": "Rýchlo odpovedá, dobrá kvalita",
  "locked": false
}
```

3. Dole klikni **Commit changes**. Asi o minútu sa zmena objaví na stránke.

| Pole | Čo tam patrí |
|------|--------------|
| `name` | Názov, ktorý sa zobrazí na karte |
| `url` | Hlavný link na obchod |
| `albums` | Počet albumov v katalógu, zobrazí sa na karte (voliteľné, `null` ak nevieš) |
| `categories` | Typy oblečenia, len z povolených kľúčov nižšie |
| `brands` | Značky. Na stránke sa dajú kliknúť a vyhľadajú sa |
| `sections` | Priame linky na sekcie v obchode, napr. len mikiny (voliteľné) |
| `note` | Krátka poznámka (voliteľné) |
| `locked` | `true`, ak je katalóg zaheslovaný |
| `women` | Čo majú pre ženy. Zobrazí sa ako riadok „Pre ženy“ a obchod sa ukáže vo filtri ♀ Pre ženy |
| `password` | Heslo ku katalógu. Zobrazí sa pri obchode s tlačidlom Kopírovať |
| `pinned` | `true` = obchod je navrchu so ⭐. Pripnuté obchody idú v poradí, v akom sú v súbore |

Prázdne polia nechaj ako `[]` alebo `""`.

### Povolené kategórie (každá má vlastnú ikonku)

| Kľúč | Zobrazí sa ako |
|------|----------------|
| `tricka` | Tričká |
| `mikiny` | Mikiny (aj svetre) |
| `bundy` | Bundy |
| `nohavice` | Nohavice (aj džínsy) |
| `sortky` | Šortky |
| `topanky` | Topánky |
| `ciapky` | Čiapky a šiltovky |
| `tasky` | Tašky |
| `doplnky` | Doplnky (opasky, hodinky, ponožky…) |

Neznámy kľúč sa ignoruje. Novú kategóriu pridáš do objektu `CATEGORIES` na začiatku `script.js` (názov a SVG ikonka).

### Ako nájsť link na sekciu

Otvor obchod, klikni na kategóriu v ľavom menu (napr. „Hoodie“) a skopíruj adresu z prehliadača. Vyzerá napr. takto: `https://nieco.x.yupoo.com/categories/12345`.

### Časté chyby v JSON

- Za posledným blokom v zozname **nesmie byť čiarka**.
- Používaj len dvojité úvodzovky `"`, nie `'`.
- JSON nepodporuje komentáre.
- Ak sa stránka nenačíta, vlož obsah súboru do [jsonlint.com](https://jsonlint.com) a ukáže ti, kde je chyba.

## Lokálne spustenie

Otvorenie `index.html` dvojklikom nefunguje, pretože prehliadač nepovolí `fetch` zo súboru. Spusti stránku cez Live Server vo VS Code alebo príkazom `python -m http.server` a otvor `http://localhost:8000`.

## Zapnutie GitHub Pages

Settings → Pages → Source: **Deploy from a branch** → Branch: `main`, priečinok `/ (root)` → Save.
