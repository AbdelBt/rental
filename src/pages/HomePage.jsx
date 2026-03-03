import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import RecentSlideshow from "../components/RecentSlideshow";
import OffersStrip from "../components/OffersStrip";
import FleetSection from "../components/FleetSection";
import MoroccoMap from "../components/MoroccoMap";
import WhyUs from "../components/WhyUs";
import ReviewsSection from "../components/ReviewsSection";
import FAQSection from "../components/FAQSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <FleetSection />
      <OffersStrip />
      <MoroccoMap />
      <WhyUs />
      <ReviewsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
