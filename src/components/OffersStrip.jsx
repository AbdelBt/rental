import { useEffect, useState } from "react";
import { offers } from "../data";

function useBreakpoint() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: width < 640, isTablet: width >= 640 && width < 1024 };
}

export default function OffersStrip() {
  const { isMobile, isTablet } = useBreakpoint();
  const cols = isMobile || isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)";

  return (
    <section className="bg-[#07070c] border-t border-gold/15 py-9 md:py-14 px-5 md:px-10 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent pointer-events-none" />

      <div className="max-w-[1200px] mx-auto grid gap-3 md:gap-4" style={{ gridTemplateColumns: cols }}>
        {offers.map((o) => (
          <OfferCard key={o.label} {...o} isMobile={isMobile} />
        ))}
      </div>
    </section>
  );
}

function OfferCard({ icon, label, sub, isMobile }) {
  return (
    <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-4 md:p-6 cursor-pointer transition-all duration-300 hover:border-gold/45 hover:bg-gold/10 hover:-translate-y-1">
      <div className={`mb-2.5 ${isMobile ? "text-[22px]" : "text-[28px]"}`}>{icon}</div>
      <div className={`font-bold mb-1 ${isMobile ? "text-[13px]" : "text-[15px]"}`}>{label}</div>
      <div className={`text-gold font-medium ${isMobile ? "text-xs" : "text-[13px]"}`}>{sub}</div>
    </div>
  );
}
