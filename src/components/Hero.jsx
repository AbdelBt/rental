import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchWidget from "./SearchWidget";

const RECENT = [
  { id: 10, name: "Peugeot 208", category: "Économique", brand: "Peugeot", price: 60, city: "Tanger", badge: "Nouveau", rating: 4.7, seats: 5, transmission: "Auto", fuel: "Essence", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700&q=85" },
  { id: 9, name: "Dacia Duster", category: "SUV", brand: "Dacia", price: 120, city: "Agadir", badge: "Nouveau", rating: 4.6, seats: 5, transmission: "Manuel", fuel: "Diesel", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=700&q=85" },
  { id: 7, name: "Mercedes GLE", category: "Luxe", brand: "Mercedes", price: 650, city: "Marrakech", badge: null, rating: 4.9, seats: 5, transmission: "Auto", fuel: "Diesel", img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=700&q=85" },
  { id: 6, name: "Tesla Model 3", category: "Électrique", brand: "Tesla", price: 195, city: "Tanger", badge: "Éco", rating: 4.9, seats: 5, transmission: "Auto", fuel: "Électrique", img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=700&q=85" },
  { id: 5, name: "Ford Mustang", category: "Sport", brand: "Ford", price: 750, city: "Marrakech", badge: "Sport", rating: 4.8, seats: 4, transmission: "Manuel", fuel: "Essence", img: "https://images.unsplash.com/photo-1584345604476-8ec5f82d718e?w=700&q=85" },
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
    return () => { clearTimeout(t); window.removeEventListener("resize", onResize); };
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSlide((i) => (i + 1) % RECENT.length), 4000);
    return () => clearInterval(t);
  }, [paused]);

  const stacked = isMobile || isTablet;
  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : "translateY(40px)",
    transition: `all 0.8s cubic-bezier(.22,.68,0,1) ${delay}s`,
  });

  return (
    <section
      className={`min-h-screen flex items-center bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(212,168,83,0.12)_0%,transparent_60%),#0a0a0f] relative overflow-hidden w-full box-border ${
        isMobile ? "py-[90px] px-5 pb-[60px]" : isTablet ? "py-[100px] px-8 pb-[72px]" : "py-[100px] px-10 pb-20"
      }`}
    >
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(240,238,234,1)_1px,transparent_1px),linear-gradient(90deg,rgba(240,238,234,1)_1px,transparent_1px)] bg-[length:60px_60px]" />

      <div className={`absolute top-[20%] left-1/2 -translate-x-1/2 pointer-events-none ${
        isMobile ? "w-full h-[360px]" : "w-[600px] h-[600px]"
      }`} style={{ background: "radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)" }} />

      <div className={`max-w-[1500px] mx-auto w-full grid items-center ${
        stacked ? "grid-cols-1 gap-12" : "grid-cols-2 gap-20"
      }`}
      >
        <div style={anim(0)}>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-2 h-2 bg-gold rounded-full shrink-0" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold">
              Location de véhicules premium
            </span>
          </div>

          <h1 className={`font-playfair font-bold leading-tight mb-5 ${
            isMobile ? "text-[clamp(2.2rem,10vw,3rem)]" : "text-[clamp(2.8rem,5vw,4.5rem)]"
          } ${stacked ? "text-center" : "text-left"}`}>
            Conduisez <em className="text-gold italic">libre</em>,
            <br />voyagez
            <br />sans limites.
          </h1>

          <p className={`text-cream/55 leading-relaxed mb-9 max-w-[440px] ${
            isMobile ? "text-[15px]" : "text-base"
          } ${stacked ? "text-center max-w-full" : "text-left"}`}>
            Des milliers de véhicules disponibles à la journée ou au mois.
            Livraison à domicile incluse.
          </p>

          <SearchWidget isMobile={isMobile} />

          <div className={`flex gap-3 md:gap-6 mt-6 flex-wrap ${stacked ? "justify-center" : "justify-start"}`}>
            {["🚗 1200+ véhicules", "📞 24/7"].map((t) => (
              <span key={t} className="text-xs text-cream/50 font-medium">{t}</span>
            ))}
          </div>
        </div>

        <div style={{ ...anim(stacked ? 0 : 0.2), position: "relative" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="w-8 h-0.5 bg-gold rounded mb-2.5" />
              <div className={`font-playfair font-bold ${isMobile ? "text-lg" : "text-[22px]"}`}>
                Récemment ajoutés
              </div>
              <div className="text-xs text-cream/40 mt-0.5">Les dernières arrivées sur la plateforme</div>
            </div>
            <Link to="/cars" className="text-xs text-gold no-underline font-semibold opacity-80 hover:opacity-100 transition-opacity">
              Voir tout →
            </Link>
          </div>

          <Link to={`/car/${RECENT[slide].id}`} className="no-underline text-inherit block">
            <div className="rounded-2xl overflow-hidden relative shadow-[0_40px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(212,168,83,0.15)] cursor-pointer">
              <img
                key={RECENT[slide].id}
                src={RECENT[slide].img}
                alt={RECENT[slide].name}
                className={`w-full block object-cover transition-opacity duration-400 ${
                  isMobile ? "h-[240px]" : isTablet ? "h-[300px]" : "h-[380px]"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/92 to-transparent" />

              {RECENT[slide].badge && (
                <div className="absolute top-3.5 left-3.5">
                  <span className="bg-gold text-dark-bg py-1 px-3 rounded-full text-[10px] font-extrabold tracking-widest uppercase">
                    ✦ {RECENT[slide].badge}
                  </span>
                </div>
              )}

              <div className="absolute top-3.5 right-3.5">
                <span className="bg-dark-bg/70 backdrop-blur-md text-cream/80 py-1 px-3 rounded-full text-[11px] font-semibold border border-white/10">
                  📍 {RECENT[slide].city}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] text-gold font-semibold tracking-[0.15em] uppercase mb-1">
                      {RECENT[slide].category} · {RECENT[slide].brand}
                    </div>
                    <div className={`font-bold leading-tight ${isMobile ? "text-base" : "text-xl"}`}>
                      {RECENT[slide].name}
                    </div>
                    <div className="flex gap-2.5 mt-1.5 flex-wrap">
                      {[`👤 ${RECENT[slide].seats}p`, `⚙️ ${RECENT[slide].transmission}`, `⛽ ${RECENT[slide].fuel}`].map((s) => (
                        <span key={s} className="text-[11px] text-cream/55">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-cream/45 mb-0.5">à partir de</div>
                    <div className={`font-extrabold text-gold leading-none ${isMobile ? "text-[22px]" : "text-[26px]"}`}>
                      {RECENT[slide].price} €
                    </div>
                    <div className="text-[10px] text-cream/40">/ jour</div>
                  </div>
                </div>
              </div>

              {["‹", "›"].map((arrow, idx) => (
                <button
                  key={arrow}
                  onClick={(e) => { e.preventDefault(); setSlide((i) => idx === 0 ? (i - 1 + RECENT.length) % RECENT.length : (i + 1) % RECENT.length); }}
                  className={`absolute top-1/2 -translate-y-1/2 bg-dark-bg/65 backdrop-blur-sm border border-white/10 text-cream w-8 h-8 rounded-full cursor-pointer text-lg flex items-center justify-center transition-all hover:bg-gold hover:text-dark-bg ${
                    idx === 0 ? "left-2.5" : "right-2.5"
                  }`}
                >
                  {arrow}
                </button>
              ))}
            </div>
          </Link>

          <div className="flex justify-center gap-1.5 mt-3">
            {RECENT.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-1.5 rounded-sm border-none cursor-pointer p-0 transition-all duration-300 ${
                  slide === i ? "w-6 bg-gold" : "w-1.5 bg-cream/20"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2 mt-2.5 justify-center">
            {RECENT.map((c, i) => (
              <div
                key={c.id}
                onClick={() => setSlide(i)}
                className={`overflow-hidden cursor-pointer shrink-0 transition-all duration-300 ${
                  isMobile ? "w-[52px] h-9" : "w-16 h-11"
                } rounded-lg border-2 ${slide === i ? "border-gold opacity-100" : "border-transparent opacity-40"}`}
              >
                <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
