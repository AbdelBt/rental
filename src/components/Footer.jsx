import { useEffect, useState } from "react";
import { footerColumns } from "../data";
import Logo from "./Logo";

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

export default function Footer() {
  const { isMobile, isTablet } = useBreakpoint();

  // mobile: single column stack
  // tablet: brand full-width top, then 3 link cols below
  // desktop: brand + 3 cols side by side
  const gridCols = isMobile
    ? "1fr"
    : isTablet
    ? "1fr 1fr 1fr"
    : "2fr 1fr 1fr 1fr";

  return (
    <footer
      style={{
        background: "#060608",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: `clamp(36px, 6vw, 48px) clamp(20px, 4vw, 40px)`,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Brand block — always full-width on mobile & tablet */}
        {(isMobile || isTablet) && (
          <div style={{ marginBottom: "36px", paddingBottom: "32px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ marginBottom: "12px" }}>
              <Logo size={28} />
            </div>
            <p style={{ color: "rgba(240,238,234,0.4)", fontSize: "14px", lineHeight: "1.8", maxWidth: "320px" }}>
              La location de voiture réinventée. Simple, transparente, et disponible partout.
            </p>
          </div>
        )}

        {/* Link columns grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridCols,
            gap: isMobile ? "28px" : "40px",
            marginBottom: "40px",
          }}
        >
          {/* Brand column — desktop only (already rendered above on mobile/tablet) */}
          {!isMobile && !isTablet && (
            <div>
              <div style={{ marginBottom: "16px" }}>
                <Logo size={28} />
              </div>
              <p style={{ color: "rgba(240,238,234,0.4)", fontSize: "14px", lineHeight: "1.8", maxWidth: "280px" }}>
                La location de voiture réinventée. Simple, transparente, et disponible partout.
              </p>
            </div>
          )}

          {footerColumns.map((col) => (
            <FooterColumn key={col.title} {...col} />
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: "24px",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: "8px",
          }}
        >
          <span style={{ color: "rgba(240,238,234,0.3)", fontSize: "13px" }}>
            © Drivo SAS, 2026. Tous droits réservés.
          </span>
          <span style={{ color: "rgba(240,238,234,0.3)", fontSize: "13px" }}>
            Assistance : support@drivo.fr
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <div
        style={{
          fontWeight: "700",
          fontSize: "13px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#d4a853",
          marginBottom: "16px",
        }}
      >
        {title}
      </div>
      {links.map((l) => (
        <div
          key={l}
          style={{
            color: "rgba(240,238,234,0.45)",
            fontSize: "14px",
            marginBottom: "10px",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#f0eeea")}
          onMouseLeave={(e) => (e.target.style.color = "rgba(240,238,234,0.45)")}
        >
          {l}
        </div>
      ))}
    </div>
  );
}
