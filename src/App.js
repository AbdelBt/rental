import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/globals.css";

// Public pages
import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";
import CarDetailPage from "./pages/CarDetailPage";
import InfoPage from "./pages/InfoPage";

// Auth
import AgencyLogin from "./pages/dashboard/AgencyLogin";
import ClientAuth from "./pages/ClientSignup";

// Agency dashboard
import DashboardLayout from "./components/Dashboardlayout ";
import DashboardOverview from "./pages/dashboard/DashOverview";
import DashboardVoitures from "./pages/dashboard/DashVoitures";
import DashboardReservations from "./pages/dashboard/DashReservations";
import DashboardPaiements from "./pages/dashboard/DashPaiements";
import DashboardBlacklist from "./pages/dashboard/DashBlacklist";
import DashboardProfil from "./pages/dashboard/DashProfil";
import ProtectedRoute from "./components/ProtectedRoute";

// Client portal
import ClientLayout from "./components/ClientLayout";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientReservations from "./pages/client/ClientReservations";
import ClientProfile from "./pages/client/ClientProfile";
import ClientProtectedRoute from "./components/ClientProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <div className="font-sora bg-dark-bg text-cream min-h-screen overflow-x-hidden">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/cars" element={<ResultsPage />} />
          <Route path="/car/:id" element={<CarDetailPage />} />
          <Route path="/info/:slug" element={<InfoPage />} />

          {/* Auth routes */}
          <Route path="/agence" element={<AgencyLogin />} />
          <Route path="/compte" element={<ClientAuth />} />

          {/* Agency dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="voitures" element={<DashboardVoitures />} />
            <Route path="reservations" element={<DashboardReservations />} />
            <Route path="paiements" element={<DashboardPaiements />} />
            <Route path="blacklist" element={<DashboardBlacklist />} />
            <Route path="profil" element={<DashboardProfil />} />
          </Route>

          {/* Client portal routes */}
          <Route
            path="/client"
            element={
              <ClientProtectedRoute>
                <ClientLayout />
              </ClientProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="reservations" element={<ClientReservations />} />
            <Route path="profil" element={<ClientProfile />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}