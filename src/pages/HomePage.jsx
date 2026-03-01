import Navbar        from "../components/Navbar";
import Hero          from "../components/Hero";
import OffersStrip   from "../components/OffersStrip";
import FleetSection  from "../components/FleetSection";
import BrandsSection from "../components/BrandsSection";
import WhyUs         from "../components/WhyUs";
import FAQSection    from "../components/FAQSection";
import CTASection    from "../components/CTASection";
import Footer        from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <OffersStrip />
      <FleetSection />
      <BrandsSection />
      <WhyUs />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
