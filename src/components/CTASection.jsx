import { useEffect, useState } from "react";

function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: width < 640 };
}

export default function CTASection() {
  const { isMobile } = useBreakpoint();

  return (
    <section
      style={{
        padding: `clamp(60px, 10vw, 100px) clamp(20px, 4vw, 40px)`,
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(212,168,83,0.1) 0%, transparent 70%)",
        }}
      />

      <div style={{ position: "relative", maxWidth: "640px", margin: "0 auto" }}>
        <h2 className="section-title" style={{ marginBottom: "20px" }}>
          Prêt à prendre la route ?
        </h2>
        <p
          style={{
            color: "rgba(240,238,234,0.55)",
            fontSize: "clamp(14px, 2vw, 16px)",
            lineHeight: "1.8",
            marginBottom: "36px",
          }}
        >
          Réservez en 2 minutes. Aucune caution pour la plupart des véhicules.
          Annulation gratuite jusqu'à 24h avant.
        </p>
        <div
          style={{
            display: "flex",
            gap: "14px",
            justifyContent: "center",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
          }}
        >
          <button
            className="btn-primary"
            style={{
              padding: "16px 40px",
              fontSize: "15px",
              width: isMobile ? "100%" : "auto",
            }}
          >
            Voir tous les véhicules
          </button>
          <button
            className="btn-ghost"
            style={{
              padding: "16px 40px",
              fontSize: "15px",
              width: isMobile ? "100%" : "auto",
            }}
          >
            Contacter l'équipe
          </button>
        </div>
      </div>
    </section>
  );
}
