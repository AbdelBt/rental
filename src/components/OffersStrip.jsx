import { useEffect, useState } from "react";
import { offers } from "../data";

function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
  };
}

export default function OffersStrip() {
  const { isMobile, isTablet } = useBreakpoint();

  // mobile: 2×2 grid  |  tablet: 2×2 grid  |  desktop: 1×4 row
  const cols = isMobile || isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)";

  return (
    <section
      style={{
        padding: `0 clamp(20px, 4vw, 40px)`,
        marginBottom: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: cols,
          gap: isMobile ? "12px" : "16px",
        }}
      >
        {offers.map((o) => (
          <OfferCard key={o.label} {...o} isMobile={isMobile} />
        ))}
      </div>
    </section>
  );
}

function OfferCard({ icon, label, sub, isMobile }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #13131a, #1a1a24)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "14px",
        padding: isMobile ? "18px 16px" : "24px",
        cursor: "pointer",
        transition: "all 0.25s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(212,168,83,0.4)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.transform = "none";
      }}
    >
      <div
        style={{ fontSize: isMobile ? "22px" : "28px", marginBottom: "10px" }}
      >
        {icon}
      </div>
      <div
        style={{
          fontWeight: "700",
          fontSize: isMobile ? "13px" : "15px",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: "#d4a853",
          fontSize: isMobile ? "12px" : "13px",
          fontWeight: "500",
        }}
      >
        {sub}
      </div>
    </div>
  );
}
