import { Route, BrowserRouter as Router, Routes } from "react-router";
import { ScrollToTop } from "./components/TailAdminComponents/common/ScrollToTop";
import AppLayout from "./layout/AppLayout";
import BarChart from "./pages/TailAdminPages/Charts/BarChart";
import LineChart from "./pages/TailAdminPages/Charts/LineChart";
import Home from "./pages/Home"
import Blank from "./pages/TailAdminPages/OtherPage/Blank";
import NotFound from "./pages/TailAdminPages/OtherPage/NotFound";
import Badges from "./pages/TailAdminPages/UiElements/Badges";
import Buttons from "./pages/TailAdminPages/UiElements/Buttons";
import Bolmen from "./pages/Locations/Bolmen";
import Vomb from "./pages/Locations/Vomb";
import Ringsjon from "./pages/Locations/Ringsjon";
import Vombverket from "./pages/Locations/Vombverket";
import Ringsjoverket from "./pages/Locations/Ringsjoverket";
import Kommuner from "./pages/Kommuner/Kommuner";
import Malmo from "./pages/Kommuner/Malmo";
import Lund from "./pages/Kommuner/Lund";
import ElOverview from "./pages/Electricity/ElOverview";
import { AllaMatare } from "./pages/Electricity/AllaMatare";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* locationOverview */}
            <Route path="/bolmen" element={<Bolmen/>} />
            <Route path="/vomb" element={<Vomb/>} />
            <Route path="/ringsjon" element={<Ringsjon/>} />
            <Route path="/vombverket" element={<Vombverket/>} />
            <Route path="/ringsjoverket" element={<Ringsjoverket/>} />
            <Route path="/kommuner" element={<Kommuner/>} />
            <Route path="/malmo" element={<Malmo/>}/>
            <Route path="/lund" element={<Lund/>}/>
            <Route path="/kommun/malmo" element={<Malmo/>}/>
            <Route path="/kommun/lund" element={<Lund/>}/>
            {/* Others Page */}
            <Route path="/blank" element={<Blank />} />

            {/* Electricity Overview */}
            <Route path="/elOverview" element={<ElOverview />} />
            <Route path="/el_alla" element={<AllaMatare/>} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/el" element={<ElOverview/>}/>
            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
