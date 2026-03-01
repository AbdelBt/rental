import { useEffect, useState } from "react";
import SearchWidget from "./SearchWidget";

export default function Hero() {
  const [visible,  setVisible]  = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    const onResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth < 1024 && window.innerWidth >= 640);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => { clearTimeout(t); window.removeEventListener("resize", onResize); };
  }, []);

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
        padding: isMobile
          ? "90px 20px 60px"
          : isTablet
          ? "100px 32px 72px"
          : "100px 40px 80px",
      }}
    >
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage:
          "linear-gradient(rgba(240,238,234,1) 1px, transparent 1px), linear-gradient(90deg, rgba(240,238,234,1) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "20%",
        left: stacked ? "50%" : "55%",
        width: isMobile ? "360px" : "600px",
        height: isMobile ? "360px" : "600px",
        background: "radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)",
        transform: stacked ? "translateX(-50%)" : "none",
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
        display: "grid",
        gridTemplateColumns: stacked ? "1fr" : "1fr 1fr",
        gap: stacked ? "48px" : "80px",
        alignItems: "center",
      }}>

        {/* ── Left: copy + search ── */}
        <div style={anim(0)}>
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ width: "8px", height: "8px", background: "#d4a853", borderRadius: "50%", flexShrink: 0 }} />
            <span style={{
              fontSize: "11px", fontWeight: "600", letterSpacing: "0.2em",
              textTransform: "uppercase", color: "#d4a853",
            }}>
              Location de véhicules premium
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? "clamp(2.2rem, 10vw, 3rem)" : "clamp(2.8rem, 5vw, 4.5rem)",
            fontWeight: "700",
            lineHeight: "1.05",
            marginBottom: "20px",
            textAlign: stacked ? "center" : "left",
          }}>
            Conduisez <em style={{ color: "#d4a853", fontStyle: "italic" }}>libre</em>,
            <br />voyagez
            <br />sans limites.
          </h1>

          <p style={{
            color: "rgba(240,238,234,0.55)",
            fontSize: isMobile ? "15px" : "16px",
            lineHeight: "1.8",
            marginBottom: "36px",
            maxWidth: stacked ? "100%" : "440px",
            textAlign: stacked ? "center" : "left",
          }}>
            Des milliers de véhicules disponibles à la journée ou au mois. Aucune
            caution sur la plupart des réservations. Livraison à domicile incluse.
          </p>

          <SearchWidget isMobile={isMobile} />

          {/* Trust badges */}
          <div style={{
            display: "flex",
            gap: isMobile ? "12px" : "24px",
            marginTop: "24px",
            flexWrap: "wrap",
            justifyContent: stacked ? "center" : "flex-start",
          }}>
            {["🛡️ Sans caution", "🚗 1200+ véhicules", "📞 24/7"].map(t => (
              <span key={t} style={{ fontSize: "12px", color: "rgba(240,238,234,0.5)", fontWeight: "500" }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right: hero image ── */}
        <div style={{ ...anim(stacked ? 0 : 0.2), position: "relative" }}>
          <div style={{
            borderRadius: "20px", overflow: "hidden", position: "relative",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,168,83,0.15)",
          }}>
            <img
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=700&q=85"
              alt="Hero car"
              style={{
                width: "100%",
                height: isMobile ? "240px" : isTablet ? "300px" : "380px",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(10,10,15,0.9) 0%, transparent 55%)",
            }} />
            <div style={{ position: "absolute", bottom: "20px", left: "20px", right: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <span className="badge" style={{ marginBottom: "8px", display: "inline-block" }}>Premium</span>
                  <div style={{ fontSize: isMobile ? "16px" : "22px", fontWeight: "700" }}>BMW Série 5</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "10px", color: "rgba(240,238,234,0.5)", marginBottom: "2px" }}>à partir de</div>
                  <div style={{ fontSize: isMobile ? "22px" : "28px", fontWeight: "800", color: "#d4a853" }}>450€</div>
                  <div style={{ fontSize: "10px", color: "rgba(240,238,234,0.4)" }}>/ jour</div>
                </div>
              </div>
            </div>
          </div>

          {/* Rating badge — hidden on very small screens */}
          {!isMobile && (
            <div style={{
              position: "absolute", top: "-16px", right: "-16px",
              background: "#d4a853", color: "#0a0a0f",
              borderRadius: "12px", padding: "12px 18px",
              boxShadow: "0 8px 24px rgba(212,168,83,0.4)",
            }}>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>4.9★</div>
              <div style={{ fontSize: "11px", fontWeight: "600", opacity: 0.7 }}>2,400+ avis</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
