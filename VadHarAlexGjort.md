# Teknisk överlämning – Sydvatten KPI-komponenter

## 1. Översikt

Dashboardens tre KPI-komponenter har uppdaterats för att använda en gemensam, återanvändbar komponent: **`MetricCard.tsx`**.

Tidigare hade varje KPI en egen JSX-struktur för att visa information. Det innebar duplicerad kod och gjorde det svårare att hålla designen konsekvent.

Den nya lösningen separerar **datahantering från presentation**.

- `MetricCard.tsx` ansvarar för design, värden, procentuell förändring, statusindikatorer och historiska diagram.
- `VattenNivaCard.tsx` ansvarar för att hämta och bearbeta vattennivåer.
- `LatestFlowCard.tsx` ansvarar för att hämta och beräkna vattenflöden.
- `ElectricityPerRecievedWater.tsx` ansvarar för att hämta och bearbeta elförbrukning.

Komponenterna använder fortfarande befintliga API-anrop från `Services/APIClient.ts`.

## 2. MetricCard – gemensam presentationskomponent

`MetricCard` är en generell komponent som kan användas för olika nyckeltal (KPI:er).

Den innehåller:

- Titel och valfri ikon.
- Senaste uppmätta värde och enhet.
- Datum för senaste mätningen.
- Dynamisk procentuell förändring med uppåt- eller nedåtpil.
- Färgkodad Badge beroende på förändringens riktning och betydelse.
- Ett kompakt stapeldiagram med de 14 senaste mätvärdena.

### Props

| Prop            | Typ              | Beskrivning                                 |
| --------------- | ---------------- | ------------------------------------------- |
| `title`         | `string`         | Namn på nyckeltalet                         |
| `value`         | `number \| null` | Senaste uppmätta värde                      |
| `unit`          | `string`         | Måttenhet, exempelvis kWh                   |
| `date`          | `string \| null` | Senaste mätdatum                            |
| `icon`          | `ReactNode`      | Ikon som visas i kortet                     |
| `change`        | `number`         | Procentuell förändring, valfri              |
| `history`       | `number[]`       | Historiska mätvärden                        |
| `lowerIsBetter` | `boolean`        | Anger om en minskning ska visas som positiv |

### Dynamisk Badge

Förändringsindikatorn fungerar automatiskt utifrån värdet som skickas genom `change`.

Som standard innebär ökande värden en grön Badge och minskande värden en röd Badge.

För exempelvis elförbrukning används `lowerIsBetter={true}`. Då blir en minskning grön och en ökning röd.

Pilens riktning visar alltid den faktiska förändringen, medan färgen representerar den valda tolkningen.

Om `change` saknas visas ingen Badge. Vid oförändrat värde visas en neutral indikator.

### Historiskt diagram

`MetricCard` tar emot en array med historiska mätvärden via `history`.

Komponenten:

1. Filtrerar bort värden som inte är ändliga tal.
2. Väljer de 14 sista mätvärdena.
3. Identifierar periodens lägsta och högsta värde.
4. Beräknar stapelhöjder relativt intervallet.
5. Markerar den senaste stapeln med en mörkare färg.

**Viktigt:** Historiken måste skickas i kronologisk ordning, från äldst till senast. Diagrammet visar de 14 senaste _mätningarna_, inte nödvändigtvis 14 dagar.

Grafen använder en relativ skala för att tydliggöra små variationer. Den visar därför inte värden från noll.

Diagrammet visas endast när minst två giltiga mätvärden finns.

## 3. De tre KPI-komponenterna

### VattenNivaCard.tsx

**Datakälla:** `fetchAPI.getLakeLevel(location.id)`

Komponenten hämtar vattennivådata för den aktuella sjön.

Efter API-anropet filtreras ogiltiga vattennivåer bort och mätningarna sorteras i datumordning.

Därefter används:

- `waterLevel` för senaste vattennivån.
- `latestDate` för senaste mätdatumet.
- `history` för samtliga giltiga historiska vattennivåer.

Dessa skickas vidare till `MetricCard`.

Komponenten visar för närvarande ingen procentuell förändring eftersom `change` inte skickas in.

### LatestFlowCard.tsx

**Datakälla:** `flowAPI.getData()`

Denna komponent kräver mer bearbetning eftersom vattenflödet kan beräknas utifrån flera mätare.

Den befintliga funktionen `meterWeight()` har behållits.

Arbetsflödet är:

1. Hämta vattenflödesdata.
2. Filtrera fram relevanta mätare med `meterWeight()`.
3. Gruppera mätningar med samma tidsstämpel i en JavaScript `Map`.
4. Summera viktade flöden för respektive tidpunkt.
5. Sortera tidpunkterna kronologiskt.
6. Hämta senaste och föregående summerade flöde.
7. Beräkna procentuell förändring.
8. Skicka värde, datum, historik och förändring till `MetricCard`.

Procentuell förändring beräknas enligt:

**((senaste − föregående) / |föregående|) × 100**

Om det saknas ett föregående värde, eller om föregående värde är noll, visas ingen procentuell förändring.

Observera att grupperingen använder exakta tidsstämplar. Om mätarna rapporterar vid olika tidpunkter kan jämförelserna bli missvisande. En framtida förbättring är att aggregera värden per gemensamt tidsintervall.

### ElectricityPerRecievedWater.tsx

**Datakälla:** `fetchAPI.getPowerData()`

Elkomponenten har ändrats från ett statiskt kort till ett kort som hämtar eldata via API:et.

API-objekten använder följande fält:

- `location` – anläggningens namn.
- `timestamp` – mättidpunkt.
- `usage` – uppmätt värde.

Eftersom anläggningsnamnen i API:et inte är identiska med sidornas `location.id` används en konfiguration:

| location.id | API-namn      |
| ----------- | ------------- |
| `vomb`      | Vombverket    |
| `ringsjon`  | Ringsjöverket |

Mätningarna filtreras efter anläggning, sorteras kronologiskt och används för senaste värde, historik och procentuell förändring.

Komponenten skickar även `lowerIsBetter={true}` till `MetricCard`, eftersom minskad elförbrukning i det här sammanhanget ska presenteras med grön Badge.

**Observera:** API-fältet `usage` presenteras för närvarande i kWh, men enheten och mätperioden behöver verifieras mot datakällan. Bolmen har ännu ingen definierad mappning för elförbrukning.

## 4. Hur komponenterna används

På en platssida, exempelvis `Vomb.tsx`, kan de tre komponenterna renderas tillsammans:

```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
  <VattenNivaCard location={location} />
  <LatestFlowCard location={location} />
  <ElectricityPerRecievedWater location={location} />
</div>
```

Samtliga komponenter förväntar sig ett `location`-objekt som följer projektets `Location`-interface.

Objektet innehåller bland annat `id`, som används för att identifiera platsen. `LatestFlowCard` använder även `meterId` för att identifiera relevanta vattenflödesmätare.

**För att skapa ett nytt KPI-kort:**

1. Skapa en ny komponent som ansvarar för API-hämtningen.
2. Definiera lämpliga TypeScript-typer för API-svaret.
3. Använd `useState` för senaste värde, datum, historik och eventuell förändring.
4. Använd `useEffect` för datahämtningen.
5. Filtrera och sortera mätningarna innan de skickas vidare.
6. Returnera `MetricCard` med relevanta props.

Den nya KPI-komponenten behöver inte implementera en egen kortdesign eller ett separat stapeldiagram.

## 5. Dataflöde och ansvarsfördelning

**FastAPI / PostgreSQL → APIClient → KPI-komponent → MetricCard**

`APIClient.ts` innehåller funktionerna som kommunicerar med backend.

KPI-komponenterna sköter API-anrop, filtrering, sortering, beräkningar och state.

`MetricCard.tsx` presenterar den färdigbearbetade informationen.

Det betyder exempelvis att en ändring av diagrammets utseende kan göras på ett enda ställe i `MetricCard`, utan att ändra API-logiken i varje KPI-komponent.
