import { useEffect, useState } from "react";
import {
  PLANTS,
  getDailyProduction,
  getPopulation,
  getYearlyDelivery,
  type DailyProductionRow,
  type PopulationRow,
  type YearlyDeliveryRow,
} from "@/api/sydvatten";
import ComponentCard from "@/components/TailAdminComponents//common/ComponentCard";
import MunicipalityComparisonChart from "@/components/sydvatten/production/MunicipalityComparisonChart";
import PerInhabitantChart from "@/components/sydvatten/production/PerInhabitantChart";
import ProductionOverTimeChart from "@/components/sydvatten/production/ProductionOverTimeChart";
import SeasonChart from "@/components/sydvatten/production/SeasonChart";
import TrendForecastChart from "@/components/sydvatten/production/TrendForecastChart";
import YearComparisonChart from "@/components/sydvatten/production/YearComparisonChart";
import { ALL_PLANTS, completeYears, monthlyProduction } from "@/utils/production";
import PageMeta from "@/components/TailAdminComponents/common/PageMeta";
import PageBreadcrumb from "@/components/TailAdminComponents/common/PageBreadCrumb";

// Fetch everything from this date. The API only returns days that have data.
const FROM_DATE = "2000-01-01";

interface PageData {
  production: DailyProductionRow[];
  delivery: YearlyDeliveryRow[];
  population: PopulationRow[];
}

export default function ProductionDelivery() {
  const [data, setData] = useState<PageData | null>(null);
  const [error, setError] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState(ALL_PLANTS);
  
  // All charts use the same data, so it is fetched once for the whole page.
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const thisYear = new Date().getFullYear();

    Promise.all([
      Promise.all(PLANTS.map((plant) => getDailyProduction(plant, FROM_DATE, today))),
      getYearlyDelivery(2000, thisYear),
      getPopulation(),
    ])
      .then(([productionPerPlant, delivery, population]) =>
        setData({ production: productionPerPlant.flat(), delivery, population }),
      )
      .catch((err: Error) =>
        setError(`Kunde inte hämta data. Är API:t igång? (${err.message})`),
      );
  }, []);

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!data) {
    return <p className="text-sm text-gray-500">Laddar...</p>;
  }

  // Production per month, per plant and for all plants together.
  const monthly = {
    [ALL_PLANTS]: monthlyProduction(data.production),
    ...Object.fromEntries(
      PLANTS.map((plant) => [
        plant,
        monthlyProduction(data.production.filter((row) => row.plant === plant)),
      ]),
    ),
  };

  // Only whole years are compared, so a half year does not look like a drop.
  const years = completeYears(monthly[ALL_PLANTS]);
  const municipalities = [...new Set(data.delivery.map((row) => row.municipality))].sort();

  return (
    
    <div className="space-y-6">
      <PageMeta title="Verköversikt | Sydvatten" description="Jämförelsevy av produktionen för olika verk" />
      <PageBreadcrumb pageTitle='Produktionsöversikt'/>
      <ComponentCard
        title="Produktion per verk"
        desc="m³ per månad. Bara hela månader visas."
      >
        <ProductionOverTimeChart monthly={monthly} />
      </ComponentCard>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="min-w-0">
          <ComponentCard
            title="Jämför år"
            desc="Produktion per månad (m³). Senaste året i blått, tidigare år i grått."
          >
            <YearComparisonChart monthly={monthly} />
          </ComponentCard>
        </div>

        <div className="min-w-0">
          <ComponentCard
            title="Produktion per säsong"
            desc="m³ per säsong. Vinter = dec–feb (december räknas till nästa år), vår = mar–maj, sommar = jun–aug, höst = sep–nov. Bara hela säsonger visas."
          >
            <SeasonChart monthly={monthly} />
          </ComponentCard>
        </div>
      </div>

      <ComponentCard
        title="Produktion per invånare"
        desc="Alla verk, delat med befolkningen i kommunerna Sydvatten levererar till. Liter per invånare och dygn."
      >
        <PerInhabitantChart
          monthlyTotal={monthly[ALL_PLANTS]}
          population={data.population}
          municipalities={municipalities}
        />
      </ComponentCard>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-5">
          <ComponentCard
            title="Leverans per invånare, per kommun"
            desc="Liter per invånare och dygn. Klicka på en kommun för att se dess trend."
          >
            <MunicipalityComparisonChart
              delivery={data.delivery}
              population={data.population}
              years={years}
              selected={selectedMunicipality}
              onSelect={setSelectedMunicipality}
            />
          </ComponentCard>
        </div>

        <div className="min-w-0 xl:col-span-7">
          <ComponentCard
            title="Trend och prognos"
            desc="Hela år, liter per invånare och dygn. Tabellen visar befolkningen som används."
          >
            <TrendForecastChart
              delivery={data.delivery}
              population={data.population}
              monthlyTotal={monthly[ALL_PLANTS]}
              municipalities={municipalities}
              years={years}
              selected={selectedMunicipality}
              onSelect={setSelectedMunicipality}
            />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
