import { useEffect, useState } from "react";
import { brands } from "../data";

function useBreakpoint() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: width < 640, isTablet: width >= 640 && width < 1024 };
}

export default function BrandsSection() {
  const { isMobile, isTablet } = useBreakpoint();

  const cols = isMobile ? "repeat(3, 1fr)" : isTablet ? "repeat(3, 1fr)" : "repeat(6, 1fr)";

  return (
    <section className="py-12 md:py-20 px-5 md:px-10 bg-gradient-to-b from-dark-bg to-[#0f0f17]">
      <div className="max-w-[1200px] mx-auto">
        <div className={`text-center mb-8 md:mb-12`}>
          <div className="gold-line mx-auto mb-5" />
          <h2 className="section-title">Véhicules par marque</h2>
        </div>

        <div className="grid gap-2.5 md:gap-3.5" style={{ gridTemplateColumns: cols }}>
          {brands.map((b) => (
            <div
              key={b.name}
              className={`brand-chip ${isMobile ? "py-3.5 px-2.5" : "py-4 px-6"}`}
            >
              <div className={`font-bold mb-1 ${isMobile ? "text-[13px]" : "text-[15px]"}`}>
                {b.name}
              </div>
              <div className={`text-gold font-semibold ${isMobile ? "text-[11px]" : "text-xs"}`}>
                {b.count} voitures
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
