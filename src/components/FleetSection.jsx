import { useState, useEffect } from "react";
import { cars, categories, addDays } from "../data";
import CarCard from "./CarCard";

function useBreakpoint() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: width < 640, isTablet: width >= 640 && width < 1024, isDesktop: width >= 1024 };
}

export default function FleetSection() {
  const [activeCategory, setActiveCategory] = useState("Toutes");
  const [searchQuery, setSearchQuery] = useState("");
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const days = Math.max(1, Math.round((addDays(new Date(), 5) - addDays(new Date(), 2)) / 86400000));

  const filtered = cars.filter(
    (c) =>
      (activeCategory === "Toutes" || c.category === activeCategory) &&
      (searchQuery === "" || c.name.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const gridCols = isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(280px, 1fr))";

  return (
    <section id="fleet" className="px-5 md:px-10 pb-20">
      <div className="max-w-[1200px] mx-auto">
        <div className={`flex ${isMobile ? "flex-col" : "flex-row"} justify-between ${isMobile ? "items-start" : "items-end"} gap-4 mb-10`}>
          <div>
            <div className="gold-line" />
            <h2 className="section-title">Notre flotte</h2>
          </div>
          <input
            className="input-field"
            placeholder="Rechercher un modèle..."
            style={{ width: isMobile ? "100%" : "260px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              className={`cat-btn ${activeCategory === c ? "active" : ""} ${isMobile ? "py-1.5 px-3.5 text-xs" : "py-2 px-5 text-[13px]"}`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length > 0 && (
          <p className="text-cream/35 text-[13px] mb-5 font-medium">
            {filtered.length} véhicule{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}
          </p>
        )}

        {filtered.length > 0 ? (
          <div className="grid gap-4 md:gap-5 items-start" style={{ gridTemplateColumns: gridCols }}>
            {filtered.map((car, i) => (
              <div key={car.id} className="relative">
                <CarCard car={car} days={days} index={i} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-cream/30 text-lg">
            Aucun véhicule trouvé dans cette catégorie.
          </div>
        )}
      </div>
    </section>
  );
}
