import { useEffect, useState } from "react";
import { brands } from "../data";

function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
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

export default function BrandsSection() {
  const { isMobile, isTablet } = useBreakpoint();

  // mobile: 3×2  |  tablet: 3×2  |  desktop: 6×1
  const cols = isMobile ? "repeat(3, 1fr)" : isTablet ? "repeat(3, 1fr)" : "repeat(6, 1fr)";

  return (
    <section
      style={{
        padding: `clamp(48px, 8vw, 80px) clamp(20px, 4vw, 40px)`,
        background: "linear-gradient(180deg, #0a0a0f 0%, #0f0f17 100%)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? "32px" : "48px" }}>
          <div className="gold-line" style={{ margin: "0 auto 20px" }} />
          <h2 className="section-title">Véhicules par marque</h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            gap: isMobile ? "10px" : "14px",
          }}
        >
          {brands.map((b) => (
            <div key={b.name} className="brand-chip" style={{ padding: isMobile ? "14px 10px" : "16px 24px" }}>
              <div style={{ fontWeight: "700", fontSize: isMobile ? "13px" : "15px", marginBottom: "4px" }}>
                {b.name}
              </div>
              <div style={{ color: "#d4a853", fontSize: isMobile ? "11px" : "12px", fontWeight: "600" }}>
                {b.count} voitures
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
