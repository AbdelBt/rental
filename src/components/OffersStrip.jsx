import { useEffect, useState } from "react";
import { offers } from "../data";

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
  };
}

export default function OffersStrip() {
  const { isMobile, isTablet } = useBreakpoint();
  const cols = isMobile || isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)";

  return (
    <section
      style={{
        background: "#07070c",
        borderTop: "1px solid rgba(212,168,83,0.15)",
        padding: `clamp(36px, 5vw, 56px) clamp(20px, 4vw, 40px)`,
        position: "relative",
      }}
    >
      {/* Subtle gold glow along the top border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(212,168,83,0.5), transparent)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: cols,
          gap: isMobile ? "12px" : "16px",
        }}
      >
        {offers.map((o) => (
          <OfferCard key={o.label} {...o} isMobile={isMobile} />
        ))}
      </div>
    </section>
  );
}

function OfferCard({ icon, label, sub, isMobile }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px",
        padding: isMobile ? "18px 16px" : "24px",
        cursor: "pointer",
        transition: "all 0.25s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(212,168,83,0.45)";
        e.currentTarget.style.background = "rgba(212,168,83,0.07)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.transform = "none";
      }}
    >
      <div
        style={{ fontSize: isMobile ? "22px" : "28px", marginBottom: "10px" }}
      >
        {icon}
      </div>
      <div
        style={{
          fontWeight: "700",
          fontSize: isMobile ? "13px" : "15px",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: "#d4a853",
          fontSize: isMobile ? "12px" : "13px",
          fontWeight: "500",
        }}
      >
        {sub}
      </div>
    </div>
  );
}
