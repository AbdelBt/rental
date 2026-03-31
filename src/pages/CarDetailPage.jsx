import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { cars as staticCars, addDays } from "../data";
import { supabase } from "../lib/supabaseClient";
import useBreakpoint from "../hooks/useBreakpoint";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingModal from "../components/BookingModal";
import DateRangePicker from "../components/DateRangePicker";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isMobile, isTablet } = useBreakpoint();
  const [car, setCar] = useState(null);
  const [carsLoading, setCarsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setCarsLoading(true);
      // Supabase car: id starts with "sb-"
      if (id.startsWith("sb-")) {
        const numId = id.replace("sb-", "");
        const { data, error } = await supabase
          .from("cars")
          .select(
            "*, agencies(name, address, city, phone, delivery, delivery_zones)",
          )
          .eq("id", numId)
          .maybeSingle();
        if (!cancelled) {
          if (!error && data) {
            setCar({
              id: `sb-${data.id}`,
              name: data.name,
              brand: data.brand,
              year: data.year,
              category: data.category,
              price: data.price,
              priceWeek: data.price_week ?? null,
              priceMonth: data.price_month ?? null,
              img: data.img,
              imgs: [
                data.img,
                ...(Array.isArray(data.imgs) ? data.imgs : []),
              ].filter(Boolean),
              badge: null,
              fuel: data.fuel,
              seats: data.seats,
              transmission: data.transmission,
              mileage: data.mileage ?? "Illimité",
              deposit: data.deposit_amount > 0,
              rating: 4.8,
              reviews: 0,
              description: data.description ?? "",
              features: (() => {
                const EQUIP_LABELS = {
                  ac:             "❄️ Climatisation",
                  bluetooth:      "🎵 Bluetooth / CarPlay",
                  rear_camera:    "📷 Caméra de recul",
                  cruise_control: "🚀 Régulateur de vitesse",
                  sunroof:        "🌤️ Toit ouvrant",
                  usb_charger:    "🔌 Chargeur USB / Type-C",
                  android_auto:   "📱 Android Auto / CarPlay",
                  wifi:           "📶 Wi-Fi embarqué",
                  roof_rack:      "🧳 Galerie / Porte-bagages",
                  spare_tire:     "🔧 Roue de secours",
                };
                return [
                  data.gps      && "🗺️ GPS intégré",
                  data.babyseat && "🪑 Siège bébé",
                  ...(Array.isArray(data.equipments)
                    ? data.equipments.map(k => EQUIP_LABELS[k]).filter(Boolean)
                    : []),
                ].filter(Boolean);
              })(),
              available: true,
              agency: data.agencies ?? null,
              damageRules: Array.isArray(data.damage_rules) ? data.damage_rules : [],
            });
          }
          setCarsLoading(false);
        }
      } else {
        // Static car
        const found = staticCars.find((c) => c.id === Number(id));
        if (!cancelled) {
          setCar(found ?? null);
          setCarsLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const [activeImg, setActiveImg] = useState(0);
  const [pickupDate, setPickupDate] = useState(addDays(new Date(), 2));
  const [returnDate, setReturnDate] = useState(addDays(new Date(), 5));
  const [activeTab, setActiveTab] = useState("specs"); // "specs" | "features" | "reviews"
  const [showBookingModal, setShowBookingModal] = useState(false);

  if (carsLoading) {
    return (
      <div className="font-sora bg-dark-bg text-cream min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="font-sora bg-dark-bg text-cream min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">🚗</div>
        <div className="text-xl font-bold">Véhicule introuvable</div>
        <Link to="/cars" className="text-gold no-underline font-semibold">
          ← Retour aux résultats
        </Link>
      </div>
    );
  }

  const days = Math.max(1, Math.round((returnDate - pickupDate) / 86400000));

  // Tarif optimal selon la durée
  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;
  const useMonthly = car.priceMonth && days >= 30;
  const useWeekly = !useMonthly && car.priceWeek && days >= 7;

  let total, rateLabel, rateDetail;
  if (useMonthly) {
    const months = Math.floor(days / 30);
    const leftDays = days % 30;
    total = months * car.priceMonth + leftDays * car.price;
    rateLabel = `${car.priceMonth} €/mois`;
    rateDetail = leftDays > 0
      ? `${months} mois × ${car.priceMonth} € + ${leftDays} j × ${car.price} €`
      : `${months} mois × ${car.priceMonth} €`;
  } else if (useWeekly) {
    total = weeks * car.priceWeek + remainingDays * car.price;
    rateLabel = `${car.priceWeek} €/semaine`;
    rateDetail = remainingDays > 0
      ? `${weeks} sem × ${car.priceWeek} € + ${remainingDays} j × ${car.price} €`
      : `${weeks} sem × ${car.priceWeek} €`;
  } else {
    total = car.price * days;
    rateLabel = `${car.price} €/jour`;
    rateDetail = `${car.price} € × ${days} jour${days > 1 ? "s" : ""}`;
  }

  const stacked = isMobile || isTablet;

  // Similar cars
  const similar = staticCars
    .filter((c) => c.category === car.category && c.id !== car.id)
    .slice(0, 3);

  return (
    <div className="font-sora bg-dark-bg text-cream min-h-screen">
      <Navbar />

      <div className="max-w-[1200px] mx-auto pt-[100px] px-[clamp(20px,4vw,40px)] pb-20">
        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 mb-8 text-[13px] text-cream/40">
          <Link to="/" className="text-cream/40 no-underline">
            Accueil
          </Link>
          <span>›</span>
          <Link to="/cars" className="text-cream/40 no-underline">
            Véhicules
          </Link>
          <span>›</span>
          <span className="text-gold">{car.name}</span>
        </div>

        {/* ── Main content grid ── */}
        <div
          className={`grid gap-10 items-start ${stacked ? "grid-cols-1" : "grid-cols-[1fr_380px]"}`}
        >
          {/* ── LEFT: gallery + info ── */}
          <div>
            {/* Main image */}
            <div className="relative rounded-[20px] overflow-hidden mb-3 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
              <img
                src={car.imgs[activeImg]}
                alt={car.name}
                className="w-full object-cover block transition-opacity duration-300"
                style={{ height: isMobile ? "240px" : "420px" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,10,15,0.5) 0%, transparent 50%)",
                }}
              />

              {/* Nav arrows */}
              {car.imgs.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImg(
                        (i) => (i - 1 + car.imgs.length) % car.imgs.length,
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-dark-bg/70 border-none text-cream w-9 h-9 rounded-full cursor-pointer text-base flex items-center justify-center"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setActiveImg((i) => (i + 1) % car.imgs.length)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-dark-bg/70 border-none text-cream w-9 h-9 rounded-full cursor-pointer text-base flex items-center justify-center"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Badge */}
              {car.badge && (
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-gold/20 text-gold border border-gold/35 px-3 py-1 rounded-[20px] text-xs font-semibold tracking-[0.08em] uppercase">
                    {car.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2.5">
              {car.imgs.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className="w-20 h-14 rounded-[10px] overflow-hidden cursor-pointer shrink-0 transition-all duration-200"
                  style={{
                    border: `2px solid ${activeImg === i ? "#d4a853" : "transparent"}`,
                    opacity: activeImg === i ? 1 : 0.5,
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* ── Title + rating ── */}
            <div className="mt-8 mb-6">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="text-xs text-gold font-semibold tracking-[0.15em] uppercase mb-1.5">
                    {car.brand} · {car.category} · {car.year}
                  </div>
                  <h1 className="font-playfair text-[clamp(1.8rem,4vw,2.6rem)] font-bold leading-tight">
                    {car.name}
                  </h1>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gold text-lg">
                      {"★".repeat(Math.round(car.rating))}
                    </span>
                    <span className="font-bold text-base">{car.rating}</span>
                  </div>
                  <div className="text-xs text-cream/40 mt-0.5">
                    {car.reviews} avis
                  </div>
                </div>
              </div>

              <p className="text-cream/55 leading-[1.8] mt-4 text-[15px]">
                {car.description}
              </p>
            </div>

            {/* ── Tabs ── */}
            <div className="border-b border-white/10 mb-6">
              <div className="flex gap-0">
                {[
                  { key: "specs", label: "Caractéristiques" },
                  { key: "features", label: "Équipements" },
                  { key: "reviews", label: "Avis" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`py-3 px-5 bg-transparent border-none font-sora text-sm font-semibold cursor-pointer transition-all duration-200 ${activeTab === t.key ? "text-gold" : "text-cream/45"}`}
                    style={{
                      borderBottom: `2px solid ${activeTab === t.key ? "#d4a853" : "transparent"}`,
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            {activeTab === "specs" && (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
                {[
                  { icon: "👤", label: "Places", val: `${car.seats} places` },
                  { icon: "⚙️", label: "Transmission", val: car.transmission },
                  { icon: "⛽", label: "Carburant", val: car.fuel },
                  { icon: "🛣️", label: "Kilométrage", val: car.mileage },
                  { icon: "📅", label: "Année", val: car.year },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4"
                  >
                    <div className="text-xl mb-2">{s.icon}</div>
                    <div className="text-[11px] text-cream/40 uppercase tracking-[0.1em] mb-1">
                      {s.label}
                    </div>
                    <div className="font-bold text-sm">{s.val}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "features" && (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5">
                {car.features.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2.5 py-3 px-4 bg-gold/5 border border-gold/20 rounded-[10px]"
                  >
                    <span className="text-gold font-bold">✓</span>
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="flex flex-col gap-4">
                {[
                  {
                    name: "Marie L.",
                    rating: 5,
                    date: "Il y a 3 jours",
                    text: "Voiture impeccable, livraison à l'heure, aucun souci. Je recommande vivement !",
                  },
                  {
                    name: "Thomas B.",
                    rating: 5,
                    date: "Il y a 1 semaine",
                    text: "Excellent rapport qualité-prix, véhicule en parfait état. Le service client est très réactif.",
                  },
                  {
                    name: "Sophie M.",
                    rating: 4,
                    date: "Il y a 2 semaines",
                    text: "Très bon véhicule, confortable pour les longs trajets. Petit bémol sur le temps de livraison.",
                  },
                ].map((r, i) => (
                  <div
                    key={i}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5"
                  >
                    <div className="flex justify-between mb-2.5">
                      <div>
                        <div className="font-bold text-sm">{r.name}</div>
                        <div className="text-gold text-[13px] mt-0.5">
                          {"★".repeat(r.rating)}
                        </div>
                      </div>
                      <div className="text-xs text-cream/30">{r.date}</div>
                    </div>
                    <p className="text-cream/60 text-sm leading-[1.7]">
                      {r.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: booking widget ── */}
          <div className={stacked ? "static" : "sticky top-[84px]"}>
            <div className="bg-dark border border-white/10 rounded-[20px] p-7 shadow-[0_24px_48px_rgba(0,0,0,0.3)]">
              {/* Price header */}
              <div className="flex items-end gap-2 mb-6 pb-6 border-b border-white/[0.06]">
                <span className="text-[38px] font-extrabold text-gold leading-none">
                  {car.price} €
                </span>
                <span className="text-sm text-cream/40 mb-1.5">/jour</span>
                <div className="ml-auto text-right flex flex-col gap-0.5">
                  {car.priceWeek && <div className="text-[12px] text-cream/50">{car.priceWeek} €<span className="text-cream/35">/sem</span></div>}
                  {car.priceMonth && <div className="text-[12px] text-cream/50">{car.priceMonth} €<span className="text-cream/35">/mois</span></div>}
                </div>
              </div>

              {/* Date range picker */}
              <div className="mb-5 bg-white/[0.02] border border-white/[0.07] rounded-xl p-4">
                <DateRangePicker
                  pickupDate={pickupDate}
                  returnDate={returnDate}
                  onChange={({ start, end }) => {
                    if (start !== undefined) setPickupDate(start);
                    if (end !== undefined)
                      setReturnDate(end ?? addDays(start ?? pickupDate, 3));
                  }}
                />
              </div>

              {/* Summary */}
              <div className="bg-gold/[0.06] border border-gold/20 rounded-xl p-4 mb-5">
                {(useWeekly || useMonthly) && (
                  <div className="flex items-center gap-1.5 mb-3 bg-gold/10 rounded-lg px-2.5 py-1.5">
                    <span className="text-[11px]">🏷️</span>
                    <span className="text-[11px] font-semibold text-gold">Tarif {useMonthly ? "mensuel" : "hebdomadaire"} appliqué</span>
                  </div>
                )}
                <div className="flex justify-between mb-2">
                  <span className="text-[13px] text-cream/55">{rateDetail}</span>
                  <span className="text-[13px] font-semibold">{total} €</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-[13px] text-cream/55">Frais de service</span>
                  <span className="text-[13px] font-semibold">0 €</span>
                </div>
                <div className="border-t border-white/10 pt-2.5 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-extrabold text-lg text-gold">{total} €</span>
                </div>
              </div>

              {/* Pickup & Delivery */}
              {car.agency && (
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 mb-5">
                  <div className="text-[11px] font-bold text-gold tracking-widest uppercase mb-3">
                    📍 Retrait & Livraison
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex gap-2.5">
                      <span className="text-base">🏢</span>
                      <div>
                        <div className="text-[13px] font-semibold text-cream/90">
                          {car.agency.name}
                        </div>
                        {(car.agency.address || car.agency.city) && (
                          <div className="text-[12px] text-cream/45 mt-0.5">
                            {[car.agency.address, car.agency.city]
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                    {car.agency.delivery && (
                      <div className="flex gap-2.5">
                        <span className="text-base">🚗</span>
                        <div>
                          <div className="text-[13px] font-semibold text-green-400">
                            Livraison disponible
                          </div>
                          {car.agency.delivery_zones && (
                            <div className="text-[12px] text-cream/45 mt-0.5">
                              {car.agency.delivery_zones}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {car.agency.phone && (
                      <div className="flex gap-2.5 items-center">
                        <span className="text-base">📞</span>
                        <span className="text-[13px] text-cream/60">
                          {car.agency.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Politique d'annulation */}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 mb-5 flex flex-col gap-2.5">
                <div className="text-[11px] font-bold text-gold tracking-widest uppercase mb-1">
                  Politique d'annulation
                </div>
                <div className="flex gap-2.5">
                  <span className="text-base shrink-0">❌</span>
                  <span className="text-[12px] text-cream/60">
                    Réservation{" "}
                    <span className="text-cream/90 font-semibold">
                      non remboursable
                    </span>
                  </span>
                </div>
                <div className="flex gap-2.5">
                  <span className="text-base shrink-0">✈️</span>
                  <span className="text-[12px] text-cream/60">
                    Exception :{" "}
                    <span className="text-cream/90 font-semibold">
                      vol annulé
                    </span>{" "}
                    (justificatif requis)
                  </span>
                </div>
                {!car.agency?.delivery && (
                  <div className="flex gap-2.5">
                    <span className="text-base shrink-0">📍</span>
                    <span className="text-[12px] text-cream/60">
                      Retrait en agence uniquement
                    </span>
                  </div>
                )}
              </div>

              {/* Franchises & dommages */}
              {car.damageRules && car.damageRules.length > 0 && (
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 mb-5">
                  <div className="text-[11px] font-bold text-gold tracking-widest uppercase mb-3">
                    🛡️ En cas de dommage
                  </div>
                  <div className="flex flex-col gap-2">
                    {car.damageRules.map((rule, i) => (
                      <div key={i} className="flex items-center justify-between gap-2">
                        <span className="text-[12px] text-cream/65">{rule.item}</span>
                        <span className="text-[12px] font-semibold text-cream/90 shrink-0">{rule.price} €</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-cream/35 mt-3">
                    Ces frais s'appliquent si un dommage est constaté au retour du véhicule.
                  </p>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={async () => {
                  const {
                    data: { session },
                  } = await supabase.auth.getSession();
                  if (!session) {
                    navigate(`/compte?redirect=/car/${id}`);
                    return;
                  }
                  setShowBookingModal(true);
                }}
                className="w-full bg-gold text-dark-bg border-none py-4 rounded-[10px] font-sora font-extrabold text-[15px] tracking-[0.08em] uppercase cursor-pointer transition-all duration-[0.25s] hover:bg-[#e8be6a] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(212,168,83,0.4)]"
              >
                Réserver maintenant
              </button>

              <button className="w-full bg-transparent text-cream/60 border border-white/10 py-3 rounded-[10px] font-sora font-semibold text-[13px] cursor-pointer mt-2.5 transition-all duration-200 hover:border-gold hover:text-gold">
                Contactez-nous
              </button>
            </div>
          </div>
        </div>

        {/* ── Similar vehicles ── */}
        {similar.length > 0 && (
          <div className="mt-20">
            <div className="w-12 h-[3px] bg-gold rounded-sm mb-4" />
            <h2 className="font-playfair text-[clamp(1.6rem,3vw,2.2rem)] font-bold mb-8">
              Véhicules similaires
            </h2>
            <div
              className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}
            >
              {similar.map((c) => (
                <Link
                  key={c.id}
                  to={`/car/${c.id}`}
                  className="no-underline text-inherit"
                >
                  <SimilarCard car={c} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />

      {showBookingModal && (
        <BookingModal
          car={car}
          pickupDate={pickupDate}
          returnDate={returnDate}
          days={days}
          total={total}
          deposit={Math.round(total * 0.4)}
          backendUrl={BACKEND}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
}

function SimilarCard({ car }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className="bg-dark rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 ease-[cubic-bezier(.22,.68,0,1.2)]"
      style={{
        border: `1px solid ${h ? "rgba(212,168,83,0.4)" : "rgba(255,255,255,0.06)"}`,
        transform: h ? "translateY(-6px)" : "none",
        boxShadow: h ? "0 20px 40px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <img
        src={car.img}
        alt={car.name}
        className="w-full h-40 object-cover block transition-transform duration-500"
        style={{ transform: h ? "scale(1.04)" : "scale(1)" }}
      />
      <div className="p-4">
        <div className="font-bold mb-1">{car.name}</div>
        <div className="text-xs text-cream/40 mb-3">{car.category}</div>
        <div className="flex justify-between items-center">
          <span className="font-extrabold text-gold">
            {car.price} €
            <span className="text-[11px] font-normal text-cream/40 ml-0.5">
              /jour
            </span>
          </span>
          <span className="text-gold text-[13px]">★ {car.rating}</span>
        </div>
      </div>
    </div>
  );
}
