# Popup Funnel Analytics

Kis Vue 3 + TypeScript app, ami popup kampányok **lépés szintű** funnel teljesítményét
mutatja meg, és kiemeli, **hol a legnagyobb lemorzsolódás**. Az adat statikus JSON-ből
jön, a számítás teljes egészében a kliensen történik.

## Előfeltételek

- Node.js **>= 20.19** (fejlesztve: v22)
- npm

## Indítás

```bash
npm install
npm run dev
```

Nyisd meg a terminálban kiírt URL-t (alapból **http://localhost:5173**).

## További parancsok

| Parancs | Mit csinál |
|---|---|
| `npm run build` | Típusellenőrzés (`vue-tsc`) + produkciós build |
| `npm run test:run` | Unit tesztek egyszer lefuttatva (funnel matek + szabály motor) |
| `npm run test` | Tesztek watch módban |
| `npm run preview` | A produkciós build helyi kiszolgálása |

## Felépítés (röviden)

- `src/utils/` – tiszta, Vue mentes logika: `funnel.ts` (funnel matek), `insights.ts`
  (szabály-alapú javaslatok), `format.ts` (formázás). Ezt fedik a unit tesztek.
- `src/components/` – megjelenítő komponensek (kampánylista, funnel nézet, lépés sáv,
  javaslatok, jelmagyarázat).
- `src/data/campaigns.ts` – tipizált adat hozzáférés (a `data.json` egyetlen belépési pontja).
- `src/types/types.ts` – közös típusok.

---

# Write-up

## Hogyan értettem meg a problémát

A merchant látja a kampány **össz konverzióját** (pl. 5%), de nem azt, **melyik
lépés** viszi el a teljesítményt egy többlépéses popup folyamatban. A cél tehát nem
egy újabb összesített szám, hanem a **lépésenkénti** rálátás, és annak egyértelmű
kiemelése, **hol a legnagyobb lemorzsolódás**.

Az adat átnézésekor egy fontos dolgot rögzítettem: a `proceeds` (egy lépésen tovább
lépők) pontosan megegyezik a következő lépés `views` értékével vagyis a funnel
belsőleg konzisztens, és a **lépés szintű konverzió = `proceeds / views`**.

## Mit építettem v1-ben (és mit hagytam ki)

**Benne:**
- Kampánylista + kiválasztott kampány **lépésenkénti funnel nézete** (sávok, a kezdő
  közönséghez viszonyított arány, lépésenkénti konverzió és "elveszik X ember” drop).
- A **problémás lépés** vizuális kiemelése (piros sáv + figyelmeztető sáv felül).
- **Köznyelvi jelmagyarázat** a nem technikai felhasználónak (összecsukható).
- **Szabályalapú javaslatok** (prioritizálva, max. 3).
- **Unit tesztek** (Vitest) a TDD fontossága miatt.

**Kihagytam (lásd v2):** valódi backend/API, adatbázis, auth, időbeli trendek,
kampány összevetés, LLM alapú javaslatok, komponens/E2E tesztek.

**A legfontosabb logikai döntés:** a "problémás lépés” = a **legrosszabb lépés szintű
konverziójú** lépés (ott szivárog arányosan a legtöbb ember azokból, akik odáig
eljutottak), de **mellette megmutatom az abszolút vesztett emberek számát** is. Így a
marketer az *arányt* és a *volument* együtt látja nem bünteti igazságtalanul az első
lépést (amit eleve mindenki lát), de a priorizáláshoz megvan a darabszám is. Az
összkonverziót az utolsó lépésen továbblépők / első lépés nézői aránnyal számolom.

## A megoldás (architektúra, fő komponensek)

Frontendonly **Vue 3 + TypeScript + Vite**, Tailwind stílussal. A statikus adatot
közvetlenül importáljuk — a feladathoz nem indokolt a backend.

- **`src/utils/`** – tiszta, Vue mentes logika: `funnel.ts` (funnel matek és a
  problémás lépés kiválasztása), `insights.ts` (szabály motor), `format.ts`. Ezt
  **unit tesztek** fedik, mert itt a legfontosabb a helyesség.
- **`src/components/`** – prezentációs komponensek "props lefelé, események felfelé”
  elven (`CampaignList`, `FunnelView`, `FunnelStep`, `InsightsPanel`, `FunnelLegend`).
  Az állapot (kiválasztott kampány) az `App`-ban él.
- **`src/data/campaigns.ts`** – egyetlen, tipizált belépési pont az adathoz (v2-ben
  egy API hívásra cserélhető a UI érintése nélkül).
- **`src/types/types.ts`** – közös típusok (nyers `Campaign`/`Step` vs. számított
  `ComputedStep`/`ComputedFunnel`, hogy a komponensek sose számoljanak, csak megjelenítsenek).

## Hogyan használtam AI-t

AI asszisztenst pair programming módban használtam: segített ötletelni a
metrika definíciókról és azok kompromisszumairól, kód és teszt vázlatokat adni, és
csiszolni a felhasználói szövegeket és jelmagyarázatot és a md-t olvashatóbbra formázni. A termék és scope döntéseket
én hoztam (problémás lépés definíciója, mit hagyok ki, hard coded szabályok LLM
helyett), a kódot teljesen értem, a lényegi logikát pedig tesztek fedik, amiket
el tudok magyarázni.

## v2 — ha több időm lenne

- **Robusztusabb szabályok szélső adatra:** egészséges funnelnél ne "kiáltson farkast”
  (küszöbhöz kötött probléma jelölés)
- **Backend/API** mögé tett adat, perzisztencia.
- **Időbeli trendek** és **kampány összevetés**.
- **LLM alapú javaslatok** a szabály motor kiegészítéseként (a determinisztikus
  szabályok megtartásával).
- **Komponens/E2E tesztek**, és a most fix küszöbök **konfigurálhatóvá** tétele. Bővítés Playwright tesztekkel.
- **Tooltip-ek** Egyszerűbb magyarázatok ha ráviszi a felhasználó pl az egerét az adott elemre.

