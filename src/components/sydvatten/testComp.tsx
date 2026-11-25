import { MultiApiLineChart, type SeriesSource } from "@/components/multi-api-line-chart"

type ExpensesJson = { data: { day: string; amount: number }[] }
type SignupsJson = { results: { timestamp: string; count: number }[] }

const sources: SeriesSource<any>[] = [
  { key: "revenue", label: "Revenue", url: "/api/revenue", color: "#2563eb" }, // already returns { x, y }[]
  {
    key: "expenses", label: "Expenses", url: "/api/expenses", color: "#e0702b",
    transform: (json: ExpensesJson) => json.data.map((d) => ({ x: d.day, y: d.amount })),
  },
  {
    key: "signups", label: "Signups", url: "/api/signups", color: "#0f9d76",
    transform: (json: SignupsJson) => json.results.map((r) => ({ x: r.timestamp.slice(0, 10), y: r.count })),
  },
]

export default function TestPage() {
  return <MultiApiLineChart title="Daily metrics" sources={sources} refreshInterval={30_000} />
}