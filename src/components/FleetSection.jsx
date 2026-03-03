import { useState, useEffect } from "react";
import { cars, categories, addDays } from "../data";
import CarCard from "./CarCard";

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
    isDesktop: width >= 1024,
  };
}

export default function FleetSection() {
  const [activeCategory, setActiveCategory] = useState("Toutes");
  const [searchQuery, setSearchQuery] = useState("");
  const { isMobile, isTablet } = useBreakpoint();

  const days = Math.max(
    1,
    Math.round((addDays(new Date(), 5) - addDays(new Date(), 2)) / 86400000),
  );

  const filtered = cars.filter(
    (c) =>
      (activeCategory === "Toutes" || c.category === activeCategory) &&
      (searchQuery === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Grid columns: 1 on mobile, 2 on tablet, auto-fill on desktop
  const gridCols = isMobile
    ? "1fr"
    : isTablet
      ? "repeat(2, 1fr)"
      : "repeat(auto-fill, minmax(280px, 1fr))";

  return (
    <section id="fleet" style={{ padding: `0 clamp(20px, 4vw, 40px) 80px` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* ── Header row ── */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "flex-end",
            gap: isMobile ? "16px" : "0",
            marginBottom: "40px",
          }}
        >
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

        {/* ── Category pills (scrollable) ── */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "12px",
            marginBottom: "32px",
            // hide scrollbar visually but keep it functional
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {categories.map((c) => (
            <button
              key={c}
              className={`cat-btn${activeCategory === c ? " active" : ""}`}
              onClick={() => setActiveCategory(c)}
              style={{
                // slightly smaller on mobile
                padding: isMobile ? "6px 14px" : "8px 20px",
                fontSize: isMobile ? "12px" : "13px",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* ── Results count ── */}
        {filtered.length > 0 && (
          <p
            style={{
              color: "rgba(240,238,234,0.35)",
              fontSize: "13px",
              marginBottom: "20px",
              fontWeight: "500",
            }}
          >
            {filtered.length} véhicule{filtered.length > 1 ? "s" : ""}{" "}
            disponible
            {filtered.length > 1 ? "s" : ""}
          </p>
        )}

        {/* ── Car grid ── */}
        {filtered.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: gridCols,
              gap: isMobile ? "16px" : "20px",
              alignItems: "start",
            }}
          >
            {filtered.map((car, i) => (
              <div
                key={car.id}
                style={{
                  position: "relative", // <-- nécessaire pour le hover en absolute
                }}
              >
                <CarCard
                  key={car.id}
                  car={car}
                  days={days}
                  index={i}
                  isMobile={isMobile}
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "rgba(240,238,234,0.3)",
              fontSize: "18px",
            }}
          >
            Aucun véhicule trouvé dans cette catégorie.
          </div>
        )}
      </div>
    </section>
  );
}
