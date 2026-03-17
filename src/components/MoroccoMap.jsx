import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cities } from "../data";
import useBreakpoint from "../hooks/useBreakpoint";

// Morocco outline (Natural Earth 110m, GeoJSON → SVG path) — viewBox 0 0 60 90
const MOROCCO_PATH =
  "M 56.05 3.71 L 57.48 7.73 L 57.70 11.55 L 59.01 18.18 L 60.00 19.51 L 59.31 21.95 L 54.37 23.01 L 52.66 25.33 L 50.48 25.88 L 50.31 30.52 L 45.90 33.01 L 44.46 36.15 L 41.37 37.84 L 37.60 38.79 L 31.50 43.43 L 31.54 50.86 L 30.96 50.86 L 31.05 54.22 L 28.71 54.43 L 27.50 55.85 L 25.78 55.85 L 24.42 55.04 L 21.24 55.71 L 20.01 60.61 L 18.83 61.06 L 17.06 68.98 L 11.81 75.75 L 10.57 84.42 L 9.02 87.24 L 8.57 89.50 L 0.07 90.00 L 0.00 89.99 L 0.18 87.08 L 1.63 85.37 L 2.86 82.10 L 2.62 79.98 L 3.92 75.55 L 6.02 71.56 L 7.29 70.55 L 8.29 66.88 L 8.38 63.54 L 9.74 59.66 L 12.25 57.37 L 14.65 50.96 L 14.72 50.88 L 16.61 48.47 L 20.12 47.77 L 23.10 43.48 L 24.99 41.81 L 28.14 36.57 L 27.20 28.76 L 28.63 23.36 L 29.14 20.06 L 31.57 15.82 L 35.35 12.95 L 38.15 10.35 L 40.68 3.85 L 41.86 0.00 L 44.64 0.03 L 46.92 2.69 L 50.51 2.26 L 54.41 3.65 L 56.05 3.71 Z";

// Bounds du path (Natural Earth 110m) → projection viewBox 0 0 60 90
const BOUNDS = { minLng: -17.02, maxLng: -1.12, minLat: 21.42, maxLat: 35.76 };
function latLngToView(lat, lng) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 60;
  const y = 90 - ((lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 90;
  return { x, y };
}

export default function MoroccoMap() {
  const { isMobile } = useBreakpoint();
  const [hoveredCity, setHoveredCity] = useState(null);
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-20 px-5 md:px-10 bg-dark-bg">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <div className="w-12 h-0.5 bg-gold rounded mx-auto mb-5" />
          <h2 className="font-playfair text-[clamp(1.8rem,4vw,2.8rem)] font-bold mb-3">
            Disponible dans tout le Maroc
          </h2>
          <p className="text-cream/45 text-[15px] max-w-[500px] mx-auto">
            Des véhicules disponibles dans les principales villes. Cliquez sur une ville pour voir les voitures disponibles.
          </p>
        </div>

        <div className={`grid gap-12 items-center ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
          <div className="relative aspect-[2/3] max-w-[380px] mx-auto w-full animate-map-reveal">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(212,168,83,0.06)_0%,transparent_70%)]" />
            <svg
              viewBox="-6 -10 72 104"
              className="w-full h-full drop-shadow-[0_8px_32px_rgba(212,168,83,0.12)]"
              aria-hidden="true"
            >
              {/* Morocco territory */}
              <path
                d={MOROCCO_PATH}
                fill="rgba(212,168,83,0.08)"
                stroke="rgba(212,168,83,0.35)"
                strokeWidth="0.6"
                className="transition-all duration-500"
              />
              {/* Cities (position computed from lat/lng) */}
              {cities.map((city) => {
                const { x, y } = latLngToView(city.lat, city.lng);
                const isHovered = hoveredCity === city.name;
                return (
                  <g
                    key={city.name}
                    className="cursor-pointer"
                    onClick={() => navigate(`/cars?city=${city.name}`)}
                    onMouseEnter={() => setHoveredCity(city.name)}
                    onMouseLeave={() => setHoveredCity(null)}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 5.5 : 4}
                      fill="rgba(212,168,83,0.2)"
                      className="transition-all duration-300"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="2.2"
                      fill={isHovered ? "#d4a853" : "rgba(212,168,83,0.75)"}
                      className="transition-all duration-200"
                    />
                    <text
                      x={x + 3.8}
                      y={y + 1.2}
                      fontSize="3"
                      fill={isHovered ? "#d4a853" : "rgba(240,238,234,0.75)"}
                      fontFamily="Sora, sans-serif"
                      fontWeight={isHovered ? "700" : "500"}
                      className="transition-colors duration-200"
                    >
                      {city.name}
                    </text>
                    <text
                      x={x + 3.8}
                      y={y + 4.8}
                      fontSize="2.2"
                      fill="rgba(212,168,83,0.65)"
                      fontFamily="Sora, sans-serif"
                    >
                      {city.count} voitures
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {cities.map((city) => {
              const isActive = hoveredCity === city.name;
              return (
                <div
                  key={city.name}
                  onClick={() => navigate(`/cars?city=${city.name}`)}
                  onMouseEnter={() => setHoveredCity(city.name)}
                  onMouseLeave={() => setHoveredCity(null)}
                  className={`rounded-[14px] p-5 cursor-pointer transition-all duration-300 ${
                    isActive ? "bg-gold/10 border border-gold/50 -translate-y-1" : "bg-white/[0.03] border border-white/[0.07]"
                  }`}
                >
                  <div className="text-[22px] mb-2">📍</div>
                  <div className="font-bold text-[15px] mb-0.5">{city.name}</div>
                  <div className="text-xs text-cream/45 mb-2.5">{city.desc}</div>
                  <div className="font-extrabold text-gold text-xl">{city.count}</div>
                  <div className="text-[11px] text-cream/40">véhicules disponibles</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
