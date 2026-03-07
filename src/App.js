import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/globals.css";

// Pages
import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";
import CarDetailPage from "./pages/CarDetailPage";
import InfoPage from "./pages/InfoPage";
import AgencyLogin from "./pages/AgencyLogin";
import DashboardLayout from "./components/Dashboardlayout ";
import DashboardOverview from "./pages/dashboard/DashOverview";
import DashboardVoitures from "./pages/dashboard/DashVoitures";
import DashboardReservations from "./pages/dashboard/DashReservations";
import DashboardPaiements from "./pages/dashboard/DashPaiements";
import DashboardBlacklist from "./pages/dashboard/DashBlacklist";
import DashboardProfil from "./pages/dashboard/DashProfil";

export default function App() {
  return (
    <BrowserRouter>
      <div className="font-sora bg-dark-bg text-cream min-h-screen overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars" element={<ResultsPage />} />
          <Route path="/car/:id" element={<CarDetailPage />} />
          <Route path="/info/:slug" element={<InfoPage />} />
          <Route path="/agence" element={<AgencyLogin />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="voitures" element={<DashboardVoitures />} />
            <Route path="reservations" element={<DashboardReservations />} />
            <Route path="paiements" element={<DashboardPaiements />} />
            <Route path="blacklist" element={<DashboardBlacklist />} />
            <Route path="profil" element={<DashboardProfil />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}