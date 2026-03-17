import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { cars, categories, addDays } from "../data";
import useBreakpoint from "../hooks/useBreakpoint";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SORT_OPTIONS = [
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "rating_desc", label: "Mieux notés" },
  { value: "name_asc", label: "Nom A→Z" },
];

const FUELS = ["Tous", "Essence", "Diesel", "Électrique"];
const TRANSMISSIONS = ["Toutes", "Auto", "Manuel"];

export default function ResultsPage() {
  const { isMobile, isTablet } = useBreakpoint();
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const [category, setCategory] = useState(
    searchParams.get("category") || "Toutes",
  );
  const [sort, setSort] = useState("price_asc");
  const [fuel, setFuel] = useState("Tous");
  const [transmission, setTransmission] = useState("Toutes");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [depositOnly, setDepositOnly] = useState(false);
  const [view, setView] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const filtered = useMemo(() => {
    let list = [...cars];
    if (category !== "Toutes")
      list = list.filter((c) => c.category === category);
    if (fuel !== "Tous") list = list.filter((c) => c.fuel === fuel);
    if (transmission !== "Toutes")
      list = list.filter((c) => c.transmission === transmission);
    if (depositOnly) list = list.filter((c) => !c.deposit);
    list = list.filter((c) => c.price <= maxPrice);

    switch (sort) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating_desc":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "name_asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return list;
  }, [category, sort, fuel, transmission, maxPrice, depositOnly]);

  const gridCols =
    view === "list" || isMobile
      ? "1fr"
      : isTablet
        ? "repeat(2, 1fr)"
        : "repeat(3, 1fr)";

  return (
    <div className="font-sora bg-dark-bg text-cream min-h-screen">
      <Navbar />

      <div className="pt-[100px] px-5 md:px-10 pb-10 max-w-[1200px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-[13px] text-cream/40">
          <Link to="/" className="text-cream/40 no-underline">
            Accueil
          </Link>
          <span>›</span>
          <span className="text-gold">Résultats</span>
        </div>

        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="w-12 h-0.5 bg-gold rounded mb-4" />
            <h1 className="font-playfair text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight">
              Tous les véhicules
            </h1>
            <p className="text-cream/45 mt-2 text-sm">
              {filtered.length} véhicule{filtered.length > 1 ? "s" : ""}{" "}
              disponible{filtered.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex gap-3 items-center">
            {!isMobile && (
              <div className="flex gap-1">
                {["grid", "list"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-base cursor-pointer transition-all ${
                      view === v
                        ? "bg-gold text-dark-bg"
                        : "bg-transparent text-cream/50"
                    }`}
                  >
                    {v === "grid" ? "⊞" : "☰"}
                  </button>
                ))}
              </div>
            )}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white/[0.05] border border-white/10 text-cream py-2 px-3.5 rounded-lg font-sora text-[13px] cursor-pointer outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-dark">
                  {o.label}
                </option>
              ))}
            </select>

            {isMobile && (
              <button
                onClick={() => setFiltersOpen((o) => !o)}
                className={`py-2 px-4 rounded-lg font-sora text-[13px] font-semibold cursor-pointer ${
                  filtersOpen
                    ? "bg-gold text-dark-bg"
                    : "bg-white/[0.05] border border-white/10 text-cream"
                }`}
              >
                ⚙ Filtres
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className={`max-w-[1200px] mx-auto px-5 md:px-10 pb-20 grid gap-8 items-start ${
          isMobile ? "grid-cols-1" : "grid-cols-[240px_1fr]"
        }`}
      >
        {(!isMobile || filtersOpen) && (
          <aside
            className={`bg-dark border border-white/[0.06] rounded-2xl p-6 ${
              isMobile ? "static" : "sticky top-[84px]"
            }`}
          >
            <h3 className="font-bold text-[15px] mb-6 text-gold tracking-widest uppercase">
              Filtres
            </h3>

            <FilterBlock title="Catégorie">
              <div className="flex flex-col gap-2">
                {categories.map((c) => (
                  <label
                    key={c}
                    className={`flex items-center gap-2.5 cursor-pointer text-sm ${
                      category === c ? "text-gold" : "text-cream/65"
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={category === c}
                      onChange={() => setCategory(c)}
                      className="accent-gold"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </FilterBlock>

            <FilterBlock title={`Prix max : ${maxPrice} €/j`}>
              <input
                type="range"
                min={45}
                max={1000}
                step={5}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold"
              />
              <div className="flex justify-between text-xs text-cream/35 mt-1">
                <span>45 €</span>
                <span>1000 €</span>
              </div>
            </FilterBlock>

            <FilterBlock title="Carburant">
              <div className="flex flex-col gap-2">
                {FUELS.map((f) => (
                  <label
                    key={f}
                    className={`flex items-center gap-2.5 cursor-pointer text-sm ${
                      fuel === f ? "text-gold" : "text-cream/65"
                    }`}
                  >
                    <input
                      type="radio"
                      name="fuel"
                      checked={fuel === f}
                      onChange={() => setFuel(f)}
                      className="accent-gold"
                    />
                    {f}
                  </label>
                ))}
              </div>
            </FilterBlock>

            <FilterBlock title="Transmission">
              <div className="flex flex-col gap-2">
                {TRANSMISSIONS.map((t) => (
                  <label
                    key={t}
                    className={`flex items-center gap-2.5 cursor-pointer text-sm ${
                      transmission === t ? "text-gold" : "text-cream/65"
                    }`}
                  >
                    <input
                      type="radio"
                      name="trans"
                      checked={transmission === t}
                      onChange={() => setTransmission(t)}
                      className="accent-gold"
                    />
                    {t}
                  </label>
                ))}
              </div>
            </FilterBlock>

            <FilterBlock title="Caution" last>
              <label className="flex items-center gap-2.5 cursor-pointer text-sm text-cream/65">
                <input
                  type="checkbox"
                  checked={depositOnly}
                  onChange={(e) => setDepositOnly(e.target.checked)}
                  className="accent-gold w-4 h-4"
                />
                Sans caution uniquement
              </label>
            </FilterBlock>

            <button
              onClick={() => {
                setCategory("Toutes");
                setSort("price_asc");
                setFuel("Tous");
                setTransmission("Toutes");
                setMaxPrice(1000);
                setDepositOnly(false);
              }}
              className="mt-2 bg-transparent border border-white/10 text-cream/40 py-2 px-4 rounded-lg font-sora text-xs cursor-pointer w-full transition-all hover:border-gold hover:text-gold"
            >
              Réinitialiser les filtres
            </button>
          </aside>
        )}

        <div>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-cream/30">
              <div className="text-5xl mb-4">🔍</div>
              <div className="text-lg">
                Aucun véhicule ne correspond à vos filtres.
              </div>
            </div>
          ) : (
            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: gridCols }}
            >
              {filtered.map((car, i) => (
                <ResultCard
                  key={car.id}
                  car={car}
                  listView={view === "list"}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function FilterBlock({ title, children, last = false }) {
  return (
    <div
      className={`mb-6 pb-6 border-b border-white/[0.06] ${last ? "mb-0 pb-0 border-b-0" : ""}`}
    >
      <div className="font-semibold text-[13px] text-cream/70 mb-3 tracking-wide">
        {title}
      </div>
      {children}
    </div>
  );
}

function ResultCard({ car, listView, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/car/${car.id}`} className="no-underline text-inherit">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`bg-dark rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer animate-[fadeUp_0.35s_ease_both] ${
          listView ? "flex" : "block"
        } ${hovered ? "border-gold/40 -translate-y-1.5 shadow-2xl" : "border border-white/[0.06]"}`}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div
          className={`relative overflow-hidden shrink-0 ${listView ? "w-[220px]" : "w-full"}`}
        >
          <img
            src={car.img}
            alt={car.name}
            className={`w-full block object-cover transition-transform duration-500 ${
              hovered ? "scale-[1.04]" : "scale-100"
            }`}
            style={{
              height: listView ? "100%" : "200px",
              minHeight: listView ? "160px" : undefined,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 to-transparent" />
          {car.badge && (
            <div className="absolute top-3 left-3">
              <span className="inline-block bg-gold/20 text-gold border border-gold/35 py-0.5 px-2.5 rounded-full text-[11px] font-semibold tracking-wider uppercase">
                {car.badge}
              </span>
            </div>
          )}
        </div>

        <div
          className={`flex flex-col justify-between flex-1 ${listView ? "py-5 px-6" : "py-4 px-4"}`}
        >
          <div>
            <div className="flex justify-between items-start mb-1.5">
              <div
                className={`font-bold ${listView ? "text-lg" : "text-base"}`}
              >
                {car.name}
              </div>
              <div className="text-xs text-cream/40 bg-white/[0.05] py-0.5 px-2.5 rounded-full">
                {car.category}
              </div>
            </div>

            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-gold text-[13px]">
                {"★".repeat(Math.round(car.rating))}
              </span>
              <span className="text-xs font-semibold">{car.rating}</span>
              <span className="text-xs text-cream/35">
                ({car.reviews} avis)
              </span>
            </div>

            <div className={`flex gap-3.5 flex-wrap ${listView ? "mb-3" : ""}`}>
              {[
                { icon: "👤", val: `${car.seats} places` },
                { icon: "⚙️", val: car.transmission },
                { icon: "⛽", val: car.fuel },
                { icon: "🛣️", val: car.mileage },
              ].map((s) => (
                <span
                  key={s.val}
                  className="text-xs text-cream/45 flex items-center gap-1"
                >
                  {s.icon} {s.val}
                </span>
              ))}
            </div>

            {listView && (
              <p className="text-[13px] text-cream/45 leading-relaxed mt-2.5 max-w-[500px]">
                {car.description}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="text-[22px] font-extrabold text-gold">
                {car.price} €
              </span>
              <span className="text-xs text-cream/40 ml-1">/jour</span>
            </div>
            <span
              className={`border border-gold py-2 px-4 rounded-md text-xs font-bold tracking-wider uppercase transition-all ${
                hovered ? "bg-gold text-dark-bg" : "bg-transparent text-gold"
              }`}
            >
              Voir →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
