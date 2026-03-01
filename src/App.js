import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/globals.css";

// Pages
import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";
import CarDetailPage from "./pages/CarDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{
        fontFamily: "'Sora', sans-serif",
        background: "#0a0a0f",
        color: "#f0eeea",
        minHeight: "100vh",
        overflowX: "hidden",
      }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars" element={<ResultsPage />} />
          <Route path="/car/:id" element={<CarDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}