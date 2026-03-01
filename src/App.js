import "./styles/globals.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import OffersStrip from "./components/OffersStrip";
import FleetSection from "./components/FleetSection";
import BrandsSection from "./components/BrandsSection";
import WhyUs from "./components/WhyUs";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div
      style={{
        fontFamily: "'Sora', sans-serif",
        background: "#0a0a0f",
        color: "#f0eeea",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Navbar />
      <Hero />
      <OffersStrip />
      <FleetSection />
      <BrandsSection />
      <WhyUs />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
