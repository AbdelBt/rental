import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cities, brands, categories } from "../data";
import useBreakpoint from "../hooks/useBreakpoint";

const TABS = [
  { id: "city", label: "📍 Par ville" },
  { id: "brand", label: "🏷️ Par marque" },
  { id: "category", label: "🚗 Par type" },
];

const chipBase =
  "bg-white/[0.03] border border-white/[0.07] rounded-[14px] cursor-pointer transition-all duration-250 hover:border-gold/50 hover:bg-gold/5 hover:-translate-y-0.5";

export default function SearchByCity() {
  const [tab, setTab] = useState("city");
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-20 px-5 md:px-10 bg-dark">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-10">
          <div className="w-12 h-0.5 bg-gold rounded mx-auto mb-5" />
          <h2 className="font-playfair text-[clamp(1.8rem,4vw,2.8rem)] font-bold">
            Trouvez votre véhicule
          </h2>
          <p className="text-cream/45 mt-2.5 text-[15px]">
            Parcourez notre flotte par ville, marque ou type de véhicule
          </p>
        </div>

        <div className="flex bg-white/[0.04] rounded-xl p-1 mb-8 border border-white/[0.06]">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 px-4 rounded-lg border-none font-sora font-bold transition-all duration-250 cursor-pointer ${
                tab === t.id ? "bg-gold text-dark-bg" : "bg-transparent text-cream/55"
              } ${isMobile ? "text-xs" : "text-[13px]"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          className="transition-[min-height] duration-250 ease-out"
          style={{ minHeight: isMobile ? "420px" : "250px" }}
        >
          {tab === "city" && (
            <div
              className="grid gap-3.5"
              style={{ gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)" }}
            >
              {cities.map((city) => (
                <div
                  key={city.name}
                  onClick={() => navigate(`/cars?city=${city.name}`)}
                  className={`${chipBase} py-5 px-4 text-center`}
                >
                  <div className="text-[28px] mb-2">🏙️</div>
                  <div className="font-bold text-sm">{city.name}</div>
                  <div className="text-gold text-[13px] font-semibold mt-1">
                    {city.count} voitures
                  </div>
                  <div className="text-[11px] text-cream/40 mt-0.5">{city.desc}</div>
                </div>
              ))}
            </div>
          )}

          {tab === "brand" && (
            <div
              className="grid gap-3.5"
              style={{ gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)" }}
            >
              {brands.map((b) => (
                <div
                  key={b.name}
                  onClick={() => navigate(`/cars?brand=${b.name}`)}
                  className={`${chipBase} py-5 px-6 flex justify-between items-center`}
                >
                  <div className="font-bold text-[15px]">{b.name}</div>
                  <div className="text-gold font-bold text-sm">{b.count}</div>
                </div>
              ))}
            </div>
          )}

          {tab === "category" && (
            <div
              className="grid gap-3.5"
              style={{ gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)" }}
            >
              {categories
                .filter((c) => c !== "Toutes")
                .map((c) => {
                  const icons = {
                    Économique: "💰",
                    Standard: "🚗",
                    SUV: "🛻",
                    Premium: "⭐",
                    Luxe: "💎",
                    Sport: "🏎️",
                    Électrique: "⚡",
                  };
                  return (
                    <div
                      key={c}
                      onClick={() => navigate(`/cars?category=${c}`)}
                      className={`${chipBase} py-5 px-4 text-center`}
                    >
                      <div className="text-[28px] mb-2">{icons[c] || "🚘"}</div>
                      <div className="font-bold text-sm">{c}</div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
