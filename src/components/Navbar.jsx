import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "Véhicules", href: "/cars" },
  { label: "Luxe", href: "/cars?category=Luxe" },
  { label: "Longue durée", href: "/cars" },
  { label: "Blog", href: "#" },
  { label: "FAQ", href: "/#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };
    onResize();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        .nav-link-mob {
          color: rgba(240,238,234,0.75);
          text-decoration: none;
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.01em;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: block;
          transition: color 0.2s;
        }
        .nav-link-mob:hover { color: #d4a853; }
        .burger-line {
          display: block;
          width: 22px;
          height: 2px;
          background: #f0eeea;
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(.22,.68,0,1.2);
          transform-origin: center;
        }
      `}</style>

      {/* ── Main bar ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          padding: "0 clamp(20px, 4vw, 40px)",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            scrolled || menuOpen ? "rgba(10,10,15,0.97)" : "transparent",
          backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
          borderBottom:
            scrolled || menuOpen ? "1px solid rgba(255,255,255,0.06)" : "none",
          transition:
            "background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease",
        }}
      >
        <Logo size={32} />

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            {NAV_LINKS.map((l) => (
              <Link key={l.label} to={l.href} className="nav-link">
                {l.label}
              </Link>
            ))}
            <button
              className="btn-primary"
              style={{ padding: "10px 22px", fontSize: "12px" }}
            >
              Se connecter
            </button>
          </div>
        )}

        {/* Hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              width: "40px",
              height: "40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              padding: "8px",
            }}
          >
            <span
              className="burger-line"
              style={{
                transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="burger-line"
              style={{
                opacity: menuOpen ? 0 : 1,
                transform: menuOpen ? "scaleX(0)" : "none",
              }}
            />
            <span
              className="burger-line"
              style={{
                transform: menuOpen
                  ? "translateY(-7px) rotate(-45deg)"
                  : "none",
              }}
            />
          </button>
        )}
      </nav>

      {/* ── Mobile drawer ── */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 190,
            background: "rgba(10,10,15,0.98)",
            backdropFilter: "blur(24px)",
            padding: "32px clamp(20px, 6vw, 40px) 40px",
            display: "flex",
            flexDirection: "column",
            transform: menuOpen ? "translateY(0)" : "translateY(-10px)",
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? "all" : "none",
            transition:
              "transform 0.35s cubic-bezier(.22,.68,0,1), opacity 0.25s ease",
            overflowY: "auto",
          }}
        >
          <nav style={{ flex: 1 }}>
            {NAV_LINKS.map((l, i) => (
              <Link
                key={l.label}
                to={l.href}
                className="nav-link-mob"
                onClick={() => setMenuOpen(false)}
                style={{
                  transform: menuOpen ? "translateX(0)" : "translateX(-16px)",
                  opacity: menuOpen ? 1 : 0,
                  transition: `color 0.2s, transform 0.35s cubic-bezier(.22,.68,0,1) ${i * 0.05}s, opacity 0.3s ease ${i * 0.05}s`,
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div
            style={{
              marginTop: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <button
              className="btn-primary"
              style={{ width: "100%", padding: "16px", fontSize: "14px" }}
            >
              Se connecter
            </button>
            <button
              className="btn-ghost"
              style={{ width: "100%", padding: "16px", fontSize: "14px" }}
            >
              Créer un compte
            </button>
          </div>

          <div
            style={{
              marginTop: "28px",
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            {["🛡️ Sans caution", "🚗 1200+ véhicules", "📞 24/7"].map((t) => (
              <span
                key={t}
                style={{
                  fontSize: "12px",
                  color: "rgba(240,238,234,0.4)",
                  fontWeight: "500",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
