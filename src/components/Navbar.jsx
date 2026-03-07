import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Véhicules", href: "/cars" },
];

const SUBMENU_LINKS = [
  { label: "FAQ", href: "/info/faq", icon: "❓" },
  { label: "Pourquoi nous ?", href: "/info/pourquoi-nous", icon: "⭐" },
  { label: "Conduire au Maroc", href: "/info/maroc-infos", icon: "🇲🇦" },
  { label: "Solutions sur mesure", href: "/info/solutions-sur-mesure", icon: "💡" },
  { label: "Paiement sécurisé", href: "/info/paiement-securise", icon: "🔐" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

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
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[200] px-5 md:px-10 h-16 flex items-center justify-between transition-all duration-300 ${
          scrolled || menuOpen
            ? "bg-dark-bg/97 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <Logo size={32} />

        {!isMobile && (
          <div className="flex gap-8 items-center relative">
            {NAV_LINKS.map((l) => (
              <Link key={l.label} to={l.href} className="nav-link">
                {l.label}
              </Link>
            ))}
            <div
              className="relative"
              onMouseEnter={() => setInfoOpen(true)}
              onMouseLeave={() => setInfoOpen(false)}
            >
              <div className="nav-link cursor-pointer">Infos ▾</div>
              <div
                className={`absolute top-full left-0 bg-[#0f0f14]/98 backdrop-blur-xl border border-white/[0.08] rounded-xl py-3 min-w-[220px] flex flex-col gap-1 ${
                  infoOpen ? "flex" : "hidden"
                }`}
              >
                {SUBMENU_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    to={l.href}
                    className="py-2.5 px-4 no-underline text-cream/80 hover:text-gold transition-colors text-sm block"
                  >
                    {l.icon} {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <button className="btn-primary py-2.5 px-5 text-xs">
              Se connecter
            </button>
          </div>
        )}

        {isMobile && (
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            className="bg-transparent border-none cursor-pointer w-10 h-10 flex flex-col items-center justify-center gap-1 p-2"
          >
            <span
              className="block w-[22px] h-0.5 bg-cream rounded transition-all duration-300 origin-center"
              style={{ transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none" }}
            />
            <span
              className="block w-[22px] h-0.5 bg-cream rounded transition-all duration-300"
              style={{ opacity: menuOpen ? 0 : 1, transform: menuOpen ? "scaleX(0)" : "none" }}
            />
            <span
              className="block w-[22px] h-0.5 bg-cream rounded transition-all duration-300 origin-center"
              style={{ transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none" }}
            />
          </button>
        )}
      </nav>

      {isMobile && (
        <div
          className={`fixed top-16 left-0 right-0 bottom-0 z-[190] bg-dark-bg/98 backdrop-blur-2xl p-8 md:p-10 flex flex-col transition-all duration-300 overflow-y-auto ${
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"
          }`}
        >
          <nav className="flex-1">
            {[...NAV_LINKS, ...SUBMENU_LINKS].map((l, i) => (
              <Link
                key={l.label}
                to={l.href}
                className="block text-cream/75 no-underline text-[22px] font-semibold tracking-tight py-3.5 border-b border-white/[0.06] hover:text-gold transition-colors"
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

          <div className="mt-8 flex flex-col gap-3">
            <button className="btn-primary w-full py-4 text-sm">Se connecter</button>
            <button className="btn-ghost w-full py-4 text-sm">Créer un compte</button>
          </div>

          <div className="mt-7 flex justify-center gap-5 flex-wrap">
            {["🛡️ Sans caution", "🚗 1200+ véhicules", "📞 24/7"].map((t) => (
              <span key={t} className="text-xs text-cream/40 font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
