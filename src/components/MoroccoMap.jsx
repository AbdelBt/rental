import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cities } from "../data";
import useBreakpoint from "../hooks/useBreakpoint";

// Simplified Morocco SVG path
const MOROCCO_PATH =
  "M 10 8 L 45 5 L 52 8 L 55 15 L 50 20 L 48 28 L 52 35 L 50 42 L 45 50 L 42 58 L 38 65 L 32 72 L 25 78 L 18 80 L 12 75 L 8 68 L 6 58 L 5 48 L 7 38 L 8 28 L 6 18 L 10 8 Z";

export default function MoroccoMap() {
  const { isMobile } = useBreakpoint();
  const [hoveredCity, setHoveredCity] = useState(null);
  const navigate = useNavigate();

  return (
    <section
      style={{
        padding: `clamp(48px,8vw,80px) clamp(20px,4vw,40px)`,
        background: "#0a0a0f",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
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
              marginBottom: "12px",
            }}
          >
            Disponible dans tout le Maroc
          </h2>
          <p
            style={{
              color: "rgba(240,238,234,0.45)",
              fontSize: "15px",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            Des véhicules disponibles dans les principales villes. Cliquez sur
            une ville pour voir les voitures disponibles.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "48px",
            alignItems: "center",
          }}
        >
          {/* Map */}
          <div
            style={{
              position: "relative",
              aspectRatio: "1",
              maxWidth: "480px",
              margin: "0 auto",
              width: "100%",
            }}
          >
            {/* Glowing background */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse 80% 80% at 40% 50%, rgba(212,168,83,0.06) 0%, transparent 70%)",
                borderRadius: "50%",
              }}
            />

            {/* SVG Map */}
            <svg
              viewBox="0 0 60 90"
              style={{
                width: "100%",
                height: "100%",
                filter: "drop-shadow(0 8px 32px rgba(212,168,83,0.15))",
              }}
            >
              {/* Morocco shape */}
              <path
                d={MOROCCO_PATH}
                fill="rgba(212,168,83,0.08)"
                stroke="rgba(212,168,83,0.3)"
                strokeWidth="0.5"
              />

              {/* Grid lines */}
              {[20, 40, 60, 80].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="60"
                  y2={y}
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="0.3"
                />
              ))}
              {[15, 30, 45].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="90"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="0.3"
                />
              ))}

              {/* City pins */}
              {cities.map((city) => {
                const isHovered = hoveredCity === city.name;
                return (
                  <g
                    key={city.name}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/cars?city=${city.name}`)}
                    onMouseEnter={() => setHoveredCity(city.name)}
                    onMouseLeave={() => setHoveredCity(null)}
                  >
                    {/* Pulse ring */}
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={isHovered ? 5 : 3.5}
                      fill="rgba(212,168,83,0.15)"
                      style={{ transition: "r 0.25s" }}
                    />
                    {/* Dot */}
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r="2"
                      fill={isHovered ? "#d4a853" : "rgba(212,168,83,0.7)"}
                      style={{ transition: "all 0.2s" }}
                    />
                    {/* Label */}
                    <text
                      x={city.x + 3.5}
                      y={city.y + 1}
                      fontSize="3"
                      fill={isHovered ? "#d4a853" : "rgba(240,238,234,0.7)"}
                      fontFamily="Sora, sans-serif"
                      fontWeight={isHovered ? "700" : "500"}
                      style={{ transition: "fill 0.2s" }}
                    >
                      {city.name}
                    </text>
                    <text
                      x={city.x + 3.5}
                      y={city.y + 4.5}
                      fontSize="2.2"
                      fill="rgba(212,168,83,0.6)"
                      fontFamily="Sora, sans-serif"
                    >
                      {city.count} voitures
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* City cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}
          >
            {cities.map((city) => {
              const isActive = hoveredCity === city.name;
              return (
                <div
                  key={city.name}
                  onClick={() => navigate(`/cars?city=${city.name}`)}
                  onMouseEnter={() => setHoveredCity(city.name)}
                  onMouseLeave={() => setHoveredCity(null)}
                  style={{
                    background: isActive
                      ? "rgba(212,168,83,0.1)"
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? "rgba(212,168,83,0.5)" : "rgba(255,255,255,0.07)"}`,
                    borderRadius: "14px",
                    padding: "20px",
                    cursor: "pointer",
                    transition: "all 0.25s",
                    transform: isActive ? "translateY(-3px)" : "none",
                  }}
                >
                  <div style={{ fontSize: "22px", marginBottom: "8px" }}>
                    📍
                  </div>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "15px",
                      marginBottom: "3px",
                    }}
                  >
                    {city.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(240,238,234,0.45)",
                      marginBottom: "10px",
                    }}
                  >
                    {city.desc}
                  </div>
                  <div
                    style={{
                      fontWeight: "800",
                      color: "#d4a853",
                      fontSize: "20px",
                    }}
                  >
                    {city.count}
                  </div>
                  <div
                    style={{ fontSize: "11px", color: "rgba(240,238,234,0.4)" }}
                  >
                    véhicules disponibles
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
