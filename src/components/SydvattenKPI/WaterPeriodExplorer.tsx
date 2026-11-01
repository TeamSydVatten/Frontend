import { useState } from "react"
import { vombDailySummaries } from "@/data/vombDailySummaries"
import WaterPeriodSummary from "./WaterPeriodSummary"

const WaterPeriodExplorer = () => {
    const [selectedIndex, setSelectedIndex] = useState(
        vombDailySummaries.length -1,
    );

    const summary = vombDailySumaries[]
}