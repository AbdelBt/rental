import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { recentCars } from "../data";
import useBreakpoint from "../hooks/useBreakpoint";

export default function RecentSlideshow() {
  const { isMobile, isTablet } = useBreakpoint();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance every 4s
  useEffect(() => {
    if (paused) return;
    const t = setInterval(
      () => setActive((i) => (i + 1) % recentCars.length),
      4000,
    );
    return () => clearInterval(t);
  }, [paused]);

  const car = recentCars[active];
  const visibleDots = recentCars.length;

  return (
    <section
      style={{
        padding: `clamp(48px,8vw,80px) clamp(20px,4vw,40px)`,
        background: "#0f0f17",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "40px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <div
              style={{
                width: "48px",
                height: "3px",
                background: "#d4a853",
                borderRadius: "2px",
                marginBottom: "16px",
              }}
            />
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(1.8rem,4vw,2.8rem)",
                fontWeight: "700",
              }}
            >
              Récemment ajoutés
            </h2>
            <p
              style={{
                color: "rgba(240,238,234,0.45)",
                marginTop: "8px",
                fontSize: "14px",
              }}
            >
              Les dernières arrivées sur notre plateforme
            </p>
          </div>
          <Link
            to="/cars"
            style={{
              color: "#d4a853",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Voir tout →
          </Link>
        </div>

        {/* Main slide */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            position: "relative",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
            cursor: "pointer",
          }}
        >
          <Link
            to={`/car/${car.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img
              key={car.id}
              src={car.img}
              alt={car.name}
              style={{
                width: "100%",
                height: isMobile ? "280px" : isTablet ? "380px" : "500px",
                objectFit: "cover",
                display: "block",
                transition: "opacity 0.4s",
              }}
            />
            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(10,10,15,0.92) 0%, rgba(10,10,15,0.2) 50%, transparent 100%)",
              }}
            />

            {/* "Nouveau" badge */}
            <div style={{ position: "absolute", top: "20px", left: "20px" }}>
              <span
                style={{
                  background: "#d4a853",
                  color: "#0a0a0f",
                  padding: "5px 14px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "800",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                ✦ Nouveau
              </span>
            </div>

            {/* City badge */}
            <div style={{ position: "absolute", top: "20px", right: "20px" }}>
              <span
                style={{
                  background: "rgba(10,10,15,0.75)",
                  backdropFilter: "blur(8px)",
                  color: "rgba(240,238,234,0.85)",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                📍 {car.city}
              </span>
            </div>

            {/* Car info */}
            <div
              style={{
                position: "absolute",
                bottom: "28px",
                left: "28px",
                right: "28px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#d4a853",
                      fontWeight: "600",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    {car.category} · {car.brand}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: isMobile ? "24px" : "32px",
                      fontWeight: "700",
                      lineHeight: "1.1",
                    }}
                  >
                    {car.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      marginTop: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    {[
                      `👤 ${car.seats} places`,
                      `⚙️ ${car.transmission}`,
                      `⛽ ${car.fuel}`,
                    ].map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: "12px",
                          color: "rgba(240,238,234,0.6)",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "rgba(240,238,234,0.45)",
                      marginBottom: "2px",
                    }}
                  >
                    à partir de
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? "28px" : "36px",
                      fontWeight: "800",
                      color: "#d4a853",
                      lineHeight: 1,
                    }}
                  >
                    {car.price}€
                  </div>
                  <div
                    style={{ fontSize: "12px", color: "rgba(240,238,234,0.4)" }}
                  >
                    /jour
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Arrow nav */}
          {["‹", "›"].map((arrow, idx) => (
            <button
              key={arrow}
              onClick={(e) => {
                e.preventDefault();
                setActive((i) =>
                  idx === 0
                    ? (i - 1 + recentCars.length) % recentCars.length
                    : (i + 1) % recentCars.length,
                );
              }}
              style={{
                position: "absolute",
                top: "50%",
                [idx === 0 ? "left" : "right"]: "16px",
                transform: "translateY(-50%)",
                background: "rgba(10,10,15,0.7)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#f0eeea",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                backdropFilter: "blur(4px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#d4a853";
                e.currentTarget.style.color = "#0a0a0f";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(10,10,15,0.7)";
                e.currentTarget.style.color = "#f0eeea";
              }}
            >
              {arrow}
            </button>
          ))}
        </div>

        {/* Dot indicators + thumbnail strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginTop: "20px",
          }}
        >
          {recentCars.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: active === i ? "32px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: active === i ? "#d4a853" : "rgba(240,238,234,0.2)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Thumbnail strip */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "16px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {recentCars.map((c, i) => (
            <div
              key={c.id}
              onClick={() => setActive(i)}
              style={{
                flexShrink: 0,
                width: "100px",
                height: "68px",
                borderRadius: "10px",
                overflow: "hidden",
                cursor: "pointer",
                border: `2px solid ${active === i ? "#d4a853" : "transparent"}`,
                opacity: active === i ? 1 : 0.4,
                transition: "all 0.25s",
              }}
            >
              <img
                src={c.img}
                alt={c.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
