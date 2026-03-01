import { useEffect, useState } from "react";
import { features } from "../data";

function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
  };
}

export default function WhyUs() {
  const { isMobile, isTablet } = useBreakpoint();
  const stacked = isMobile || isTablet;

  return (
    <section style={{ padding: `clamp(48px, 8vw, 80px) clamp(20px, 4vw, 40px)` }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: stacked ? "1fr" : "1fr 1fr",
          gap: stacked ? "40px" : "80px",
          alignItems: "center",
        }}
      >
        {/* ── Left: features list ── */}
        <div>
          <div className="gold-line" />
          <h2 className="section-title" style={{ marginBottom: "24px" }}>
            Pourquoi choisir Drivo ?
          </h2>
          <p style={{ color: "rgba(240,238,234,0.55)", lineHeight: "1.8", marginBottom: "36px" }}>
            Nous rendons la location de voiture simple, transparente et accessible.
            100% digital, sans files d'attente, sans mauvaises surprises.
          </p>
          {features.map((f) => (
            <FeatureRow key={f.title} {...f} />
          ))}
        </div>

        {/* ── Right: image + stat ── */}
        <div style={{ position: "relative" }}>
          <img
            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=85"
            alt="Feature"
            style={{
              width: "100%",
              borderRadius: "20px",
              objectFit: "cover",
              height: isMobile ? "260px" : isTablet ? "360px" : "480px",
            }}
          />
          {/* Floating stat card — tucked in on mobile so it doesn't overflow */}
          <div
            style={{
              position: "absolute",
              bottom: isMobile ? "-14px" : "-20px",
              left: isMobile ? "12px" : "-20px",
              background: "#0a0a0f",
              border: "1px solid rgba(212,168,83,0.3)",
              borderRadius: "14px",
              padding: isMobile ? "14px 18px" : "20px 24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ fontSize: isMobile ? "26px" : "32px", fontWeight: "800", color: "#d4a853" }}>
              50K+
            </div>
            <div style={{ fontSize: "13px", color: "rgba(240,238,234,0.6)", fontWeight: "500" }}>
              clients satisfaits
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureRow({ icon, title, desc }) {
  return (
    <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
      <div
        style={{
          width: "44px",
          height: "44px",
          background: "rgba(212,168,83,0.1)",
          border: "1px solid rgba(212,168,83,0.2)",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: "700", marginBottom: "4px" }}>{title}</div>
        <div style={{ color: "rgba(240,238,234,0.5)", fontSize: "14px" }}>{desc}</div>
      </div>
    </div>
  );
}
