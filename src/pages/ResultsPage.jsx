import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { cars, categories, addDays } from "../data";
import useBreakpoint from "../hooks/useBreakpoint";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ── Helpers ──────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "price_asc",    label: "Prix croissant" },
  { value: "price_desc",   label: "Prix décroissant" },
  { value: "rating_desc",  label: "Mieux notés" },
  { value: "name_asc",     label: "Nom A→Z" },
];

const FUELS        = ["Tous", "Essence", "Diesel", "Électrique"];
const TRANSMISSIONS = ["Toutes", "Auto", "Manuel"];

export default function ResultsPage() {
  const { isMobile, isTablet } = useBreakpoint();
  const [searchParams]         = useSearchParams();

  // Filters state
  const [category,     setCategory]     = useState(searchParams.get("category") || "Toutes");
  const [sort,         setSort]         = useState("price_asc");
  const [fuel,         setFuel]         = useState("Tous");
  const [transmission, setTransmission] = useState("Toutes");
  const [maxPrice,     setMaxPrice]     = useState(1000);
  const [depositOnly,  setDepositOnly]  = useState(false);
  const [view,         setView]         = useState("grid"); // "grid" | "list"
  const [filtersOpen,  setFiltersOpen]  = useState(false);

  // Derived list
  const filtered = useMemo(() => {
    let list = [...cars];
    if (category !== "Toutes")       list = list.filter(c => c.category === category);
    if (fuel !== "Tous")             list = list.filter(c => c.fuel === fuel);
    if (transmission !== "Toutes")   list = list.filter(c => c.transmission === transmission);
    if (depositOnly)                 list = list.filter(c => !c.deposit);
    list = list.filter(c => c.price <= maxPrice);

    switch (sort) {
      case "price_asc":   list.sort((a, b) => a.price - b.price); break;
      case "price_desc":  list.sort((a, b) => b.price - a.price); break;
      case "rating_desc": list.sort((a, b) => b.rating - a.rating); break;
      case "name_asc":    list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [category, sort, fuel, transmission, maxPrice, depositOnly]);

  const gridCols = view === "list" || isMobile
    ? "1fr"
    : isTablet
    ? "repeat(2, 1fr)"
    : "repeat(3, 1fr)";

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: "#0a0a0f", color: "#f0eeea", minHeight: "100vh" }}>
      <Navbar />

      {/* ── Page header ── */}
      <div style={{
        paddingTop: "100px",
        padding: "100px clamp(20px,4vw,40px) 40px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", fontSize: "13px", color: "rgba(240,238,234,0.4)" }}>
          <Link to="/" style={{ color: "rgba(240,238,234,0.4)", textDecoration: "none" }}>Accueil</Link>
          <span>›</span>
          <span style={{ color: "#d4a853" }}>Résultats</span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ width: "48px", height: "3px", background: "#d4a853", borderRadius: "2px", marginBottom: "16px" }} />
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "700", lineHeight: "1.1" }}>
              Tous les véhicules
            </h1>
            <p style={{ color: "rgba(240,238,234,0.45)", marginTop: "8px", fontSize: "14px" }}>
              {filtered.length} véhicule{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* View toggle + sort */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {!isMobile && (
              <div style={{ display: "flex", gap: "4px" }}>
                {["grid", "list"].map(v => (
                  <button key={v} onClick={() => setView(v)} style={{
                    width: "36px", height: "36px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)",
                    background: view === v ? "#d4a853" : "transparent",
                    color: view === v ? "#0a0a0f" : "rgba(240,238,234,0.5)",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
                    transition: "all 0.2s",
                  }}>
                    {v === "grid" ? "⊞" : "☰"}
                  </button>
                ))}
              </div>
            )}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                color: "#f0eeea", padding: "9px 14px", borderRadius: "8px",
                fontFamily: "'Sora', sans-serif", fontSize: "13px", cursor: "pointer", outline: "none",
              }}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ background: "#13131a" }}>{o.label}</option>)}
            </select>

            {/* Mobile filter toggle */}
            {isMobile && (
              <button onClick={() => setFiltersOpen(o => !o)} style={{
                background: filtersOpen ? "#d4a853" : "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: filtersOpen ? "#0a0a0f" : "#f0eeea",
                padding: "9px 16px", borderRadius: "8px", fontFamily: "'Sora', sans-serif",
                fontSize: "13px", fontWeight: "600", cursor: "pointer",
              }}>
                ⚙ Filtres
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 clamp(20px,4vw,40px) 80px",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "240px 1fr",
        gap: "32px",
        alignItems: "start",
      }}>

        {/* ── Sidebar filters ── */}
        {(!isMobile || filtersOpen) && (
          <aside style={{
            background: "#13131a",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
            padding: "24px",
            position: isMobile ? "static" : "sticky",
            top: "84px",
          }}>
            <h3 style={{ fontWeight: "700", fontSize: "15px", marginBottom: "24px", color: "#d4a853", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Filtres
            </h3>

            {/* Category */}
            <FilterBlock title="Catégorie">
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {categories.map(c => (
                  <label key={c} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", color: category === c ? "#d4a853" : "rgba(240,238,234,0.65)" }}>
                    <input type="radio" name="category" checked={category === c} onChange={() => setCategory(c)}
                      style={{ accentColor: "#d4a853" }} />
                    {c}
                  </label>
                ))}
              </div>
            </FilterBlock>

            {/* Max price */}
            <FilterBlock title={`Prix max : ${maxPrice}€/j`}>
              <input type="range" min={45} max={1000} step={5} value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#d4a853" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "rgba(240,238,234,0.35)", marginTop: "4px" }}>
                <span>45€</span><span>1000€</span>
              </div>
            </FilterBlock>

            {/* Fuel */}
            <FilterBlock title="Carburant">
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {FUELS.map(f => (
                  <label key={f} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", color: fuel === f ? "#d4a853" : "rgba(240,238,234,0.65)" }}>
                    <input type="radio" name="fuel" checked={fuel === f} onChange={() => setFuel(f)}
                      style={{ accentColor: "#d4a853" }} />
                    {f}
                  </label>
                ))}
              </div>
            </FilterBlock>

            {/* Transmission */}
            <FilterBlock title="Transmission">
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {TRANSMISSIONS.map(t => (
                  <label key={t} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", color: transmission === t ? "#d4a853" : "rgba(240,238,234,0.65)" }}>
                    <input type="radio" name="trans" checked={transmission === t} onChange={() => setTransmission(t)}
                      style={{ accentColor: "#d4a853" }} />
                    {t}
                  </label>
                ))}
              </div>
            </FilterBlock>

            {/* No deposit */}
            <FilterBlock title="Caution" last>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", color: "rgba(240,238,234,0.65)" }}>
                <input type="checkbox" checked={depositOnly} onChange={e => setDepositOnly(e.target.checked)}
                  style={{ accentColor: "#d4a853", width: "16px", height: "16px" }} />
                Sans caution uniquement
              </label>
            </FilterBlock>

            {/* Reset */}
            <button onClick={() => { setCategory("Toutes"); setSort("price_asc"); setFuel("Tous"); setTransmission("Toutes"); setMaxPrice(1000); setDepositOnly(false); }}
              style={{ marginTop: "8px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(240,238,234,0.4)", padding: "8px 16px", borderRadius: "8px", fontFamily: "'Sora',sans-serif", fontSize: "12px", cursor: "pointer", width: "100%", transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.borderColor = "#d4a853"; e.target.style.color = "#d4a853"; }}
              onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.color = "rgba(240,238,234,0.4)"; }}>
              Réinitialiser les filtres
            </button>
          </aside>
        )}

        {/* ── Results grid ── */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(240,238,234,0.3)" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <div style={{ fontSize: "18px" }}>Aucun véhicule ne correspond à vos filtres.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: "20px" }}>
              {filtered.map((car, i) => (
                <ResultCard key={car.id} car={car} listView={view === "list"} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

// ── Filter block wrapper ─────────────────────────────────────
function FilterBlock({ title, children, last = false }) {
  return (
    <div style={{ marginBottom: last ? 0 : "24px", paddingBottom: last ? 0 : "24px", borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ fontWeight: "600", fontSize: "13px", color: "rgba(240,238,234,0.7)", marginBottom: "12px", letterSpacing: "0.05em" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

// ── Result car card ──────────────────────────────────────────
function ResultCard({ car, listView, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/car/${car.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#13131a",
          border: `1px solid ${hovered ? "rgba(212,168,83,0.4)" : "rgba(255,255,255,0.06)"}`,
          borderRadius: "16px",
          overflow: "hidden",
          display: listView ? "flex" : "block",
          transition: "all 0.3s cubic-bezier(.22,.68,0,1.2)",
          transform: hovered ? "translateY(-6px)" : "none",
          boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.4)" : "none",
          animation: `fadeUp 0.35s ease ${index * 0.05}s both`,
          cursor: "pointer",
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", overflow: "hidden", flexShrink: 0, width: listView ? "220px" : "100%" }}>
          <img
            src={car.img}
            alt={car.name}
            style={{
              width: "100%",
              height: listView ? "100%" : "200px",
              minHeight: listView ? "160px" : undefined,
              objectFit: "cover",
              display: "block",
              transition: "transform 0.5s ease",
              transform: hovered ? "scale(1.04)" : "scale(1)",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,15,0.6) 0%, transparent 50%)" }} />
          {car.badge && (
            <div style={{ position: "absolute", top: "12px", left: "12px" }}>
              <span style={{ display: "inline-block", background: "rgba(212,168,83,0.18)", color: "#d4a853", border: "1px solid rgba(212,168,83,0.35)", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {car.badge}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: listView ? "20px 24px" : "16px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
              <div style={{ fontWeight: "700", fontSize: listView ? "18px" : "16px" }}>{car.name}</div>
              <div style={{ fontSize: "12px", color: "rgba(240,238,234,0.4)", background: "rgba(255,255,255,0.05)", padding: "3px 10px", borderRadius: "20px" }}>{car.category}</div>
            </div>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
              <span style={{ color: "#d4a853", fontSize: "13px" }}>{"★".repeat(Math.round(car.rating))}</span>
              <span style={{ fontSize: "12px", fontWeight: "600" }}>{car.rating}</span>
              <span style={{ fontSize: "12px", color: "rgba(240,238,234,0.35)" }}>({car.reviews} avis)</span>
            </div>

            {/* Specs */}
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: listView ? "12px" : 0 }}>
              {[
                { icon: "👤", val: `${car.seats} places` },
                { icon: "⚙️", val: car.transmission },
                { icon: "⛽", val: car.fuel },
                { icon: "🛣️", val: car.mileage },
              ].map(s => (
                <span key={s.val} style={{ fontSize: "12px", color: "rgba(240,238,234,0.45)", display: "flex", alignItems: "center", gap: "4px" }}>
                  {s.icon} {s.val}
                </span>
              ))}
            </div>

            {/* Description - list view only */}
            {listView && (
              <p style={{ fontSize: "13px", color: "rgba(240,238,234,0.45)", lineHeight: "1.7", marginTop: "10px", maxWidth: "500px" }}>
                {car.description}
              </p>
            )}
          </div>

          {/* Price + CTA */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
            <div>
              <span style={{ fontSize: "22px", fontWeight: "800", color: "#d4a853" }}>{car.price}€</span>
              <span style={{ fontSize: "12px", color: "rgba(240,238,234,0.4)", marginLeft: "4px" }}>/jour</span>
            </div>
            <span style={{
              background: hovered ? "#d4a853" : "transparent",
              color: hovered ? "#0a0a0f" : "#d4a853",
              border: "1px solid #d4a853",
              padding: "8px 18px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "all 0.2s",
            }}>
              Voir →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
