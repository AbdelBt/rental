import { useEffect, useState } from "react";
import { features } from "../data";

function useBreakpoint() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: width < 640, isTablet: width >= 640 && width < 1024 };
}

export default function WhyUs() {
  const { isMobile, isTablet } = useBreakpoint();
  const stacked = isMobile || isTablet;

  return (
    <section className="py-12 md:py-20 px-5 md:px-10">
      <div className={`max-w-[1200px] mx-auto grid items-center ${stacked ? "grid-cols-1 gap-10" : "grid-cols-2 gap-20"}`}>
        <div>
          <div className="gold-line" />
          <h2 className="section-title mb-6">Pourquoi choisir Drivo ?</h2>
          <p className="text-cream/55 leading-relaxed mb-9">
            Nous rendons la location de voiture simple, transparente et accessible.
            100% digital, sans files d'attente, sans mauvaises surprises.
          </p>
          {features.map((f) => (
            <FeatureRow key={f.title} {...f} />
          ))}
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=85"
            alt="Feature"
            className={`w-full rounded-2xl object-cover ${
              isMobile ? "h-[260px]" : isTablet ? "h-[360px]" : "h-[480px]"
            }`}
          />
          <div
            className={`absolute bg-dark-bg border border-gold/30 rounded-[14px] shadow-2xl ${
              isMobile ? "bottom-[-14px] left-3 py-3.5 px-4" : "bottom-[-20px] left-[-20px] py-5 px-6"
            }`}
          >
            <div className={`font-extrabold text-gold ${isMobile ? "text-[26px]" : "text-[32px]"}`}>50K+</div>
            <div className="text-[13px] text-cream/60 font-medium">clients satisfaits</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureRow({ icon, title, desc }) {
  return (
    <div className="flex gap-4 mb-5">
      <div className="w-11 h-11 bg-gold/10 border border-gold/20 rounded-[10px] flex items-center justify-center text-xl shrink-0">
        {icon}
      </div>
      <div>
        <div className="font-bold mb-1">{title}</div>
        <div className="text-cream/50 text-sm">{desc}</div>
      </div>
    </div>
  );
}
