import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function useBreakpoint() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
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
    <section className="py-16 md:py-24 px-5 md:px-10 relative overflow-hidden text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_50%,rgba(212,168,83,0.1)_0%,transparent_70%)]" />

      <div className="relative max-w-[640px] mx-auto">
        <h2 className="section-title mb-5">Prêt à prendre la route ?</h2>
        <p className="text-cream/55 text-[clamp(14px,2vw,16px)] leading-relaxed mb-9">
          Réservez en 2 minutes. Annulation gratuite jusqu'à 24h avant.
        </p>
        <div
          className={`flex gap-3.5 justify-center items-center ${
            isMobile ? "flex-col" : "flex-row"
          }`}
        >
          <Link
            to="/cars"
            className={`btn-primary py-4 px-10 text-[15px] ${isMobile ? "w-full" : ""}`}
          >
            Voir tous les véhicules
          </Link>
          <Link
            to="/info/solutions-sur-mesure"
            className={`btn-ghost py-4 px-10 text-[15px] ${isMobile ? "w-full" : ""}`}
          >
            Contacter l'équipe
          </Link>
        </div>
      </div>
    </section>
  );
}
