# Teknisk överlämning – Sydvatten Dashboard

## 1. Översikt

Vi har vidareutvecklat Sydvattens dashboard med dynamiska KPI-komponenter för vattennivåer, vattenflöden och elförbrukning. Vi har även byggt en ny energiöversikt med historiska diagram, periodjämförelser och datadrivna insikter.

Arbetet bygger på React, TypeScript, Tailwind CSS och TailAdmin. Mätvärden hämtas från vår FastAPI-backend via `APIClient.ts`.

Den viktigaste förändringen är att vi har **separerat datahantering från presentation**. Varje KPI-komponent ansvarar för att hämta och bearbeta sin data, medan gemensamma komponenter används för att presentera informationen.

## 2. Filstruktur

Vi har huvudsakligen arbetat i följande delar av projektet:

```text
src/
├── components/
│   └── SydvattenKPI/
│       ├── ElectricityLineChart.tsx
│       ├── ElectricityPerRecievedWater.tsx
│       ├── LatestFlowCard.tsx
│       ├── MetricCard.tsx
│       └── VattenNivaCard.tsx
│
└── pages/
    ├── Electricity/
    │   └── ElOverview.tsx
    └── Home.tsx
```

Vi har även återanvänt befintliga filer som `ElectricityConsum.tsx`, `electricityData.ts`, `APIClient.ts` och `meters.ts`.

## 3. Nya och uppdaterade komponenter

### MetricCard.tsx

En gemensam presentationskomponent som används för flera typer av KPI:er.

Den visar:

- Titel, ikon och senaste mätvärde.
- Måttenhet och datum för senaste mätningen.
- Procentuell förändring med färgkodad pil.
- Ett minidiagram med de 14 senaste mätvärdena.

Komponenten tar emot färdigbearbetad data och gör inga egna API-anrop.

**Exempel på användning:**

```tsx
<MetricCard
  title="Elförbrukning"
  value={electricity}
  unit="kWh"
  date={latestDate}
  history={history}
  change={change}
  lowerIsBetter={true}
  icon={<MdElectricBolt className="size-6" />}
/>
```

`lowerIsBetter` styr hur förändringen färgkodas. För elförbrukning innebär en minskning grön nedåtpil och en ökning röd uppåtpil.

`history` ska vara sorterad från äldsta till senaste mätningen. Om färre än två giltiga värden finns visas inget minidiagram.

### VattenNivaCard.tsx

Hämtar vattennivåer för aktuell sjö genom:

```tsx
fetchAPI.getLakeLevel(location.id)
```

Komponenten filtrerar ogiltiga värden, sorterar mätningarna efter datum och skickar senaste vattennivån samt historiken till `MetricCard`.

**Användning:**

```tsx
<VattenNivaCard location={location} />
```

### LatestFlowCard.tsx

Hämtar vattenflödesdata genom:

```tsx
flowAPI.getData()
```

Den använder `meterWeight()` från `config/meters` för att identifiera och vikta relevanta mätare.

Mätningar med samma tidsstämpel grupperas och summeras. Därefter beräknas senaste flödet, historiken och procentuell förändring.

Resultatet skickas till `MetricCard`.

**Användning:**

```tsx
<LatestFlowCard location={location} />
```

Observera att komponenten grupperar efter exakta tidsstämplar, vilket förutsätter att relevanta mätare rapporterar vid jämförbara tidpunkter.

### ElectricityPerRecievedWater.tsx

Hämtar eldata för den aktuella anläggningen genom:

```tsx
fetchAPI.getPowerData()
```

API-svaret innehåller fälten `location`, `timestamp` och `usage`.

Eftersom frontend använder andra plats-ID:n än API:et används en mappning, exempelvis:

```tsx
const powerLocations = {
  vomb: "Vombverket",
  ringsjon: "Ringsjöverket",
};
```

Komponenten filtrerar mätningarna efter anläggning, sorterar dem kronologiskt och beräknar förändringen mellan de två senaste mätningarna.

Datan presenteras genom `MetricCard` med `lowerIsBetter={true}`.

**Användning:**

```tsx
<ElectricityPerRecievedWater location={location} />
```

### ElectricityLineChart.tsx

Ett återanvändbart linjediagram byggt med TailAdmins diagramteknik, `react-apexcharts` och ApexCharts.

Diagrammet visar historisk elförbrukning med datum på X-axeln och uppmätt förbrukning på Y-axeln.

Vi har anpassat färgerna till ett energitema:

- Amber `#F59E0B` för huvudlinjen.
- Gul `#FBBF24` för mätpunkter.
- Mörk amber `#D97706` för konturer.

Diagrammet tar emot data i följande format:

```tsx
const chartData = [
  { date: "2026-09-01", usage: 420 },
  { date: "2026-09-02", usage: 450 },
  { date: "2026-09-03", usage: null },
];
```

**Användning:**

```tsx
<ElectricityLineChart data={chartData} />
```

`null` används för dagar utan mätningar. Diagramkomponenten hämtar inte data själv.

## 4. ElOverview.tsx – ny energiöversikt

`ElOverview.tsx` ligger under `pages/Electricity/` och fungerar som den övergripande sidan för Sydvattens energianvändning.

Tidigare bestod sidan huvudsakligen av sju statiskt renderade anläggningskort. Vi har byggt ut den med följande delar:

| Sektion              | Funktion                                                   |
| -------------------- | ---------------------------------------------------------- |
| Sammanfattningskort  | Antal anläggningar, registrerad förbrukning och förändring |
| Periodväljare        | Växla mellan 7 och 30 dagar                                |
| Förbrukning över tid | Linjediagram med valbar anläggning                         |
| Jämför anläggningar  | Horisontella staplar för registrerad förbrukning           |
| Energiinsikter       | Automatisk klassificering av förändringar                  |
| Anläggningskort      | Information om respektive vattenverk och pumpstation       |

### Datahantering

Sidan hämtar data genom `getPowerData()` och lagrar den med `useState`.

Därefter används bland annat:

- `useMemo()` för att bearbeta och filtrera mätdata.
- `getPowerLocation()` för att matcha frontend-ID mot API-namn.
- `sumUsage()` för att summera mätvärden.
- `dataKey()` för att hantera kalenderdatum.
- `buildDailySeries()` för att skapa dagliga tidsserier.

`buildDailySeries()` grupperar mätningarna per dag och använder `null` för dagar där data saknas.

Den bearbetade tidsserien skickas vidare till `ElectricityLineChart`.

Periodvalet utgår från den senaste tillgängliga mätningen, inte nödvändigtvis dagens datum.

### Dynamiska anläggningskort

Anläggningarna hämtas från `electricityDataById`:

```tsx
const facilities = Object.values(electricityDataById);
```

Därefter renderas befintliga `ElectricityConsum`-kort med `.map()`.

Det innebär att nya anläggningar automatiskt kan läggas till i översikten genom datakonfigurationen, utan att varje komponent måste skrivas ut manuellt.

API-mappningen behöver dock uppdateras om den nya anläggningen har ett annat namn i backend.

## 5. Energiinsikter och färgkodning

Vi har även arbetat med att göra energiöversikten mer lättolkad genom visuella indikatorer.

Energirelaterade diagram och jämförelsestaplar använder amber/gult för att identifiera kategorin energi.

Förändringar får däremot statusfärger:

| Förändring                  | Visning                |
| --------------------------- | ---------------------- |
| Minskad förbrukning         | Grön nedåtpil          |
| Ökad förbrukning            | Röd uppåtpil           |
| Relativt stabil förbrukning | Grå neutral symbol     |
| Saknad jämförbar data       | Informationsmeddelande |

Vi har tagit fram en utökad `insights`-lösning där anläggningarna kan klassificeras som `decrease`, `increase`, `stable` eller `missing`.

Den kan även visa antalet anläggningar i respektive kategori och procentuell förändring per anläggning.

En förändring på minst 5 % används tills vidare som gräns för en tydlig ökning eller minskning. Detta är en preliminär gräns.

Den utökade visuella lösningen behöver kontrolleras mot den aktuella koden vid överlämningen.

## 6. Hur komponenterna samverkar

### Vanliga KPI-kort

```text
FastAPI / PostgreSQL
        ↓
APIClient.ts
        ↓
VattenNivaCard /
LatestFlowCard /
ElectricityPerRecievedWater
        ↓
MetricCard.tsx
        ↓
Visualisering
```

### Energiöversikten

```text
FastAPI / PostgreSQL
        ↓
APIClient.ts
        ↓
ElOverview.tsx
        │
        ├── Sammanfattningskort
        ├── ElectricityLineChart
        ├── Anläggningsjämförelser
        ├── Energiinsikter
        └── ElectricityConsum
```

Principen är att **sidkomponenter och datakomponenter ansvarar för databehandling**, medan presentationskomponenter ansvarar för utseendet.
