import { useEffect, useState } from "react";
import { footerColumns } from "../data";
import Logo from "./Logo";

function useBreakpoint() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
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

  const gridCols = isMobile ? "1fr" : isTablet ? "1fr 1fr 1fr" : "2fr 1fr 1fr 1fr";

  return (
    <footer className="bg-[#060608] border-t border-white/[0.06] py-9 md:py-12 px-5 md:px-10">
      <div className="max-w-[1200px] mx-auto">
        {(isMobile || isTablet) && (
          <div className="mb-9 pb-8 border-b border-white/[0.06]">
            <div className="mb-3">
              <Logo size={28} />
            </div>
            <p className="text-cream/40 text-sm leading-relaxed max-w-[320px]">
              La location de voiture réinventée. Simple, transparente, et disponible partout.
            </p>
          </div>
        )}

        <div
          className="grid gap-7 md:gap-10 mb-10"
          style={{ gridTemplateColumns: gridCols }}
        >
          {!isMobile && !isTablet && (
            <div>
              <div className="mb-4">
                <Logo size={28} />
              </div>
              <p className="text-cream/40 text-sm leading-relaxed max-w-[280px]">
                La location de voiture réinventée. Simple, transparente, et disponible partout.
              </p>
            </div>
          )}

          {footerColumns.map((col) => (
            <FooterColumn key={col.title} {...col} />
          ))}
        </div>

        <div className="border-t border-white/[0.05] pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <span className="text-cream/30 text-[13px]">© Drivo SAS, 2026. Tous droits réservés.</span>
          <span className="text-cream/30 text-[13px]">Assistance : support@drivo.fr</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <div className="font-bold text-[13px] tracking-[0.15em] uppercase text-gold mb-4">
        {title}
      </div>
      {links.map((l) => (
        <div
          key={l}
          className="text-cream/45 text-sm mb-2.5 cursor-pointer transition-colors hover:text-cream"
        >
          {l}
        </div>
      ))}
    </div>
  );
}
