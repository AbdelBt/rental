import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cities, brands, categories } from "../data";
import useBreakpoint from "../hooks/useBreakpoint";

const TABS = [
  { id: "city", label: "📍 Par ville" },
  { id: "brand", label: "🏷️ Par marque" },
  { id: "category", label: "🚗 Par type" },
];

export default function SearchByCity() {
  const [tab, setTab] = useState("city");
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();

  return (
    <section
      style={{
        padding: `clamp(48px,8vw,80px) clamp(20px,4vw,40px)`,
        background: "#13131a",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              width: "48px",
              height: "3px",
              background: "#d4a853",
              borderRadius: "2px",
              margin: "0 auto 20px",
            }}
          />
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(1.8rem,4vw,2.8rem)",
              fontWeight: "700",
            }}
          >
            Trouvez votre véhicule
          </h2>
          <p
            style={{
              color: "rgba(240,238,234,0.45)",
              marginTop: "10px",
              fontSize: "15px",
            }}
          >
            Parcourez notre flotte par ville, marque ou type de véhicule
          </p>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "12px",
            padding: "4px",
            marginBottom: "32px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: "9px",
                background: tab === t.id ? "#d4a853" : "transparent",
                color: tab === t.id ? "#0a0a0f" : "rgba(240,238,234,0.55)",
                border: "none",
                fontFamily: "'Sora',sans-serif",
                fontWeight: "700",
                fontSize: isMobile ? "12px" : "13px",
                cursor: "pointer",
                transition: "all 0.25s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          style={{
            minHeight: isMobile ? "420px" : "250px",
            transition: "min-height 0.25s ease",
          }}
        >
          {/* City Tab */}
          {tab === "city" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)",
                gap: "14px",
              }}
            >
              {cities.map((city) => (
                <div
                  key={city.name}
                  onClick={() => navigate(`/cars?city=${city.name}`)}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "14px",
                    padding: "20px 16px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.25s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(212,168,83,0.5)";
                    e.currentTarget.style.background = "rgba(212,168,83,0.06)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.07)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>
                    🏙️
                  </div>
                  <div style={{ fontWeight: "700", fontSize: "14px" }}>
                    {city.name}
                  </div>
                  <div
                    style={{
                      color: "#d4a853",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginTop: "4px",
                    }}
                  >
                    {city.count} voitures
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "rgba(240,238,234,0.4)",
                      marginTop: "3px",
                    }}
                  >
                    {city.desc}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Brand Tab */}
          {tab === "brand" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2,1fr)"
                  : "repeat(3,1fr)",
                gap: "14px",
              }}
            >
              {brands.map((b) => (
                <div
                  key={b.name}
                  onClick={() => navigate(`/cars?brand=${b.name}`)}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "14px",
                    padding: "20px 24px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.25s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(212,168,83,0.5)";
                    e.currentTarget.style.background = "rgba(212,168,83,0.06)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.07)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div style={{ fontWeight: "700", fontSize: "15px" }}>
                    {b.name}
                  </div>
                  <div
                    style={{
                      color: "#d4a853",
                      fontWeight: "700",
                      fontSize: "14px",
                    }}
                  >
                    {b.count}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Category Tab */}
          {tab === "category" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2,1fr)"
                  : "repeat(4,1fr)",
                gap: "14px",
              }}
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
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "14px",
                        padding: "20px 16px",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.25s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(212,168,83,0.5)";
                        e.currentTarget.style.background =
                          "rgba(212,168,83,0.06)";
                        e.currentTarget.style.transform = "translateY(-3px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.07)";
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.03)";
                        e.currentTarget.style.transform = "none";
                      }}
                    >
                      <div style={{ fontSize: "28px", marginBottom: "8px" }}>
                        {icons[c] || "🚘"}
                      </div>
                      <div style={{ fontWeight: "700", fontSize: "14px" }}>
                        {c}
                      </div>
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
