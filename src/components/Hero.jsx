import { useEffect, useState } from "react";
import SearchWidget from "./SearchWidget";

const RECENT = [
  {
    id: 10,
    name: "Peugeot 208",
    category: "Économique",
    brand: "Peugeot",
    price: 60,
    city: "Tanger",
    badge: "Nouveau",
    rating: 4.7,
    seats: 5,
    transmission: "Auto",
    fuel: "Essence",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700&q=85",
  },
  {
    id: 9,
    name: "Dacia Duster",
    category: "SUV",
    brand: "Dacia",
    price: 120,
    city: "Agadir",
    badge: "Nouveau",
    rating: 4.6,
    seats: 5,
    transmission: "Manuel",
    fuel: "Diesel",
    img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=700&q=85",
  },
  {
    id: 7,
    name: "Mercedes GLE",
    category: "Luxe",
    brand: "Mercedes",
    price: 650,
    city: "Marrakech",
    badge: null,
    rating: 4.9,
    seats: 5,
    transmission: "Auto",
    fuel: "Diesel",
    img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=700&q=85",
  },
  {
    id: 6,
    name: "Tesla Model 3",
    category: "Électrique",
    brand: "Tesla",
    price: 195,
    city: "Tanger",
    badge: "Éco",
    rating: 4.9,
    seats: 5,
    transmission: "Auto",
    fuel: "Électrique",
    img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=700&q=85",
  },
  {
    id: 5,
    name: "Ford Mustang",
    category: "Sport",
    brand: "Ford",
    price: 750,
    city: "Marrakech",
    badge: "Sport",
    rating: 4.8,
    seats: 4,
    transmission: "Manuel",
    fuel: "Essence",
    img: "https://images.unsplash.com/photo-1584345604476-8ec5f82d718e?w=700&q=85",
  },
];

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    const onResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth < 1024 && window.innerWidth >= 640);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSlide((i) => (i + 1) % RECENT.length), 4000);
    return () => clearInterval(t);
  }, [paused]);

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : "translateY(40px)",
    transition: `all 0.8s cubic-bezier(.22,.68,0,1) ${delay}s`,
  });

  const stacked = isMobile || isTablet; // single-column layout

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,168,83,0.12) 0%, transparent 60%), #0a0a0f",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        boxSizing: "border-box",
        padding: isMobile
          ? "90px 20px 60px"
          : isTablet
            ? "100px 32px 72px"
            : "100px 40px 80px",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage:
            "linear-gradient(rgba(240,238,234,1) 1px, transparent 1px), linear-gradient(90deg, rgba(240,238,234,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow — percentage-based width on mobile to avoid overflow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          width: isMobile ? "100%" : "600px",
          height: isMobile ? "360px" : "600px",
          background:
            "radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: stacked ? "1fr" : "1fr 1fr",
          gap: stacked ? "48px" : "80px",
          alignItems: "center",
        }}
      >
        {/* ── Left: copy + search ── */}
        <div style={anim(0)}>
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                background: "#d4a853",
                borderRadius: "50%",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#d4a853",
              }}
            >
              Location de véhicules premium
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile
                ? "clamp(2.2rem, 10vw, 3rem)"
                : "clamp(2.8rem, 5vw, 4.5rem)",
              fontWeight: "700",
              lineHeight: "1.05",
              marginBottom: "20px",
              textAlign: stacked ? "center" : "left",
            }}
          >
            Conduisez{" "}
            <em style={{ color: "#d4a853", fontStyle: "italic" }}>libre</em>,
            <br />
            voyagez
            <br />
            sans limites.
          </h1>

          <p
            style={{
              color: "rgba(240,238,234,0.55)",
              fontSize: isMobile ? "15px" : "16px",
              lineHeight: "1.8",
              marginBottom: "36px",
              maxWidth: stacked ? "100%" : "440px",
              textAlign: stacked ? "center" : "left",
            }}
          >
            Des milliers de véhicules disponibles à la journée ou au mois.
            Aucune caution sur la plupart des réservations. Livraison à domicile
            incluse.
          </p>

          <SearchWidget isMobile={isMobile} />

          {/* Trust badges */}
          <div
            style={{
              display: "flex",
              gap: isMobile ? "12px" : "24px",
              marginTop: "24px",
              flexWrap: "wrap",
              justifyContent: stacked ? "center" : "flex-start",
            }}
          >
            {["🛡️ Sans caution", "🚗 1200+ véhicules", "📞 24/7"].map((t) => (
              <span
                key={t}
                style={{
                  fontSize: "12px",
                  color: "rgba(240,238,234,0.5)",
                  fontWeight: "500",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right: slideshow des véhicules récents ── */}
        <div
          style={{ ...anim(stacked ? 0 : 0.2), position: "relative" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Main image */}
          <div
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              position: "relative",
              boxShadow:
                "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,168,83,0.15)",
            }}
          >
            <img
              key={RECENT[slide].id}
              src={RECENT[slide].img}
              alt={RECENT[slide].name}
              style={{
                width: "100%",
                height: isMobile ? "240px" : isTablet ? "300px" : "380px",
                objectFit: "cover",
                display: "block",
                transition: "opacity 0.4s ease",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(10,10,15,0.92) 0%, transparent 55%)",
              }}
            />

            {/* Nouveau badge */}
            {RECENT[slide].badge && (
              <div style={{ position: "absolute", top: "14px", left: "14px" }}>
                <span
                  style={{
                    background: "#d4a853",
                    color: "#0a0a0f",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "10px",
                    fontWeight: "800",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  ✦ {RECENT[slide].badge}
                </span>
              </div>
            )}

            {/* City */}
            <div style={{ position: "absolute", top: "14px", right: "14px" }}>
              <span
                style={{
                  background: "rgba(10,10,15,0.7)",
                  backdropFilter: "blur(8px)",
                  color: "rgba(240,238,234,0.8)",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "600",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                📍 {RECENT[slide].city}
              </span>
            </div>

            {/* Car info overlay */}
            <div
              style={{
                position: "absolute",
                bottom: "18px",
                left: "18px",
                right: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#d4a853",
                      fontWeight: "600",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    {RECENT[slide].category} · {RECENT[slide].brand}
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? "16px" : "20px",
                      fontWeight: "700",
                      lineHeight: 1.2,
                    }}
                  >
                    {RECENT[slide].name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "6px",
                      flexWrap: "wrap",
                    }}
                  >
                    {[
                      `👤 ${RECENT[slide].seats}p`,
                      `⚙️ ${RECENT[slide].transmission}`,
                      `⛽ ${RECENT[slide].fuel}`,
                    ].map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: "11px",
                          color: "rgba(240,238,234,0.55)",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "rgba(240,238,234,0.45)",
                      marginBottom: "2px",
                    }}
                  >
                    à partir de
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? "22px" : "26px",
                      fontWeight: "800",
                      color: "#d4a853",
                      lineHeight: 1,
                    }}
                  >
                    {RECENT[slide].price}€
                  </div>
                  <div
                    style={{ fontSize: "10px", color: "rgba(240,238,234,0.4)" }}
                  >
                    / jour
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow nav */}
            {["‹", "›"].map((arrow, idx) => (
              <button
                key={arrow}
                onClick={() =>
                  setSlide((i) =>
                    idx === 0
                      ? (i - 1 + RECENT.length) % RECENT.length
                      : (i + 1) % RECENT.length,
                  )
                }
                style={{
                  position: "absolute",
                  top: "50%",
                  [idx === 0 ? "left" : "right"]: "10px",
                  transform: "translateY(-50%)",
                  background: "rgba(10,10,15,0.65)",
                  backdropFilter: "blur(4px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#f0eeea",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#d4a853";
                  e.currentTarget.style.color = "#0a0a0f";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(10,10,15,0.65)";
                  e.currentTarget.style.color = "#f0eeea";
                }}
              >
                {arrow}
              </button>
            ))}
          </div>

          {/* Dot indicators */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "6px",
              marginTop: "12px",
            }}
          >
            {RECENT.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                style={{
                  width: slide === i ? "24px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: slide === i ? "#d4a853" : "rgba(240,238,234,0.2)",
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
              gap: "8px",
              marginTop: "10px",
              justifyContent: "center",
            }}
          >
            {RECENT.map((c, i) => (
              <div
                key={c.id}
                onClick={() => setSlide(i)}
                style={{
                  width: isMobile ? "52px" : "64px",
                  height: isMobile ? "36px" : "44px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  cursor: "pointer",
                  flexShrink: 0,
                  border: `2px solid ${slide === i ? "#d4a853" : "transparent"}`,
                  opacity: slide === i ? 1 : 0.4,
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
      </div>
    </section>
  );
}
