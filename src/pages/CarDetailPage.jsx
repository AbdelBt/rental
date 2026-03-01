import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { cars, addDays } from "../data";
import useBreakpoint from "../hooks/useBreakpoint";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = cars.find((c) => c.id === Number(id));
  const { isMobile, isTablet } = useBreakpoint();

  const [activeImg, setActiveImg] = useState(0);
  const [pickupDate, setPickupDate] = useState(addDays(new Date(), 2));
  const [returnDate, setReturnDate] = useState(addDays(new Date(), 5));
  const [activeTab, setActiveTab] = useState("specs"); // "specs" | "features" | "reviews"

  if (!car) {
    return (
      <div
        style={{
          fontFamily: "'Sora',sans-serif",
          background: "#0a0a0f",
          color: "#f0eeea",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <div style={{ fontSize: "48px" }}>🚗</div>
        <div style={{ fontSize: "20px", fontWeight: "700" }}>
          Véhicule introuvable
        </div>
        <Link
          to="/cars"
          style={{
            color: "#d4a853",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          ← Retour aux résultats
        </Link>
      </div>
    );
  }

  const days = Math.max(1, Math.round((returnDate - pickupDate) / 86400000));
  const total = car.price * days;
  const stacked = isMobile || isTablet;

  // Similar cars
  const similar = cars
    .filter((c) => c.category === car.category && c.id !== car.id)
    .slice(0, 3);

  const labelStyle = {
    fontSize: "11px",
    fontWeight: "600",
    color: "#d4a853",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "8px",
  };

  return (
    <div
      style={{
        fontFamily: "'Sora',sans-serif",
        background: "#0a0a0f",
        color: "#f0eeea",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "100px clamp(20px,4vw,40px) 80px",
        }}
      >
        {/* ── Breadcrumb ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
            fontSize: "13px",
            color: "rgba(240,238,234,0.4)",
          }}
        >
          <Link
            to="/"
            style={{ color: "rgba(240,238,234,0.4)", textDecoration: "none" }}
          >
            Accueil
          </Link>
          <span>›</span>
          <Link
            to="/cars"
            style={{ color: "rgba(240,238,234,0.4)", textDecoration: "none" }}
          >
            Véhicules
          </Link>
          <span>›</span>
          <span style={{ color: "#d4a853" }}>{car.name}</span>
        </div>

        {/* ── Main content grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: stacked ? "1fr" : "1fr 380px",
            gap: "40px",
            alignItems: "start",
          }}
        >
          {/* ── LEFT: gallery + info ── */}
          <div>
            {/* Main image */}
            <div
              style={{
                position: "relative",
                borderRadius: "20px",
                overflow: "hidden",
                marginBottom: "12px",
                boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              }}
            >
              <img
                src={car.imgs[activeImg]}
                alt={car.name}
                style={{
                  width: "100%",
                  height: isMobile ? "240px" : "420px",
                  objectFit: "cover",
                  display: "block",
                  transition: "opacity 0.3s",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
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
                    style={{
                      position: "absolute",
                      left: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(10,10,15,0.7)",
                      border: "none",
                      color: "#f0eeea",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setActiveImg((i) => (i + 1) % car.imgs.length)
                    }
                    style={{
                      position: "absolute",
                      right: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(10,10,15,0.7)",
                      border: "none",
                      color: "#f0eeea",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ›
                  </button>
                </>
              )}

              {/* Badge */}
              {car.badge && (
                <div
                  style={{ position: "absolute", top: "16px", left: "16px" }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      background: "rgba(212,168,83,0.18)",
                      color: "#d4a853",
                      border: "1px solid rgba(212,168,83,0.35)",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {car.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div style={{ display: "flex", gap: "10px" }}>
              {car.imgs.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: "80px",
                    height: "56px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: `2px solid ${activeImg === i ? "#d4a853" : "transparent"}`,
                    opacity: activeImg === i ? 1 : 0.5,
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* ── Title + rating ── */}
            <div style={{ marginTop: "32px", marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#d4a853",
                      fontWeight: "600",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    {car.brand} · {car.category} · {car.year}
                  </div>
                  <h1
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: "clamp(1.8rem,4vw,2.6rem)",
                      fontWeight: "700",
                      lineHeight: "1.1",
                    }}
                  >
                    {car.name}
                  </h1>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span style={{ color: "#d4a853", fontSize: "18px" }}>
                      {"★".repeat(Math.round(car.rating))}
                    </span>
                    <span style={{ fontWeight: "700", fontSize: "16px" }}>
                      {car.rating}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(240,238,234,0.4)",
                      marginTop: "2px",
                    }}
                  >
                    {car.reviews} avis
                  </div>
                </div>
              </div>

              <p
                style={{
                  color: "rgba(240,238,234,0.55)",
                  lineHeight: "1.8",
                  marginTop: "16px",
                  fontSize: "15px",
                }}
              >
                {car.description}
              </p>
            </div>

            {/* ── Tabs ── */}
            <div
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", gap: "0" }}>
                {[
                  { key: "specs", label: "Caractéristiques" },
                  { key: "features", label: "Équipements" },
                  { key: "reviews", label: "Avis" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    style={{
                      padding: "12px 20px",
                      background: "transparent",
                      border: "none",
                      borderBottom: `2px solid ${activeTab === t.key ? "#d4a853" : "transparent"}`,
                      color:
                        activeTab === t.key
                          ? "#d4a853"
                          : "rgba(240,238,234,0.45)",
                      fontFamily: "'Sora',sans-serif",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            {activeTab === "specs" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))",
                  gap: "12px",
                }}
              >
                {[
                  { icon: "👤", label: "Places", val: `${car.seats} places` },
                  { icon: "⚙️", label: "Transmission", val: car.transmission },
                  { icon: "⛽", label: "Carburant", val: car.fuel },
                  { icon: "🛣️", label: "Kilométrage", val: car.mileage },
                  {
                    icon: "💳",
                    label: "Caution",
                    val: car.deposit ? "Requise" : "Non requise",
                  },
                  { icon: "📅", label: "Année", val: car.year },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "12px",
                      padding: "16px",
                    }}
                  >
                    <div style={{ fontSize: "20px", marginBottom: "8px" }}>
                      {s.icon}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "rgba(240,238,234,0.4)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: "4px",
                      }}
                    >
                      {s.label}
                    </div>
                    <div style={{ fontWeight: "700", fontSize: "14px" }}>
                      {s.val}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "features" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))",
                  gap: "10px",
                }}
              >
                {car.features.map((f) => (
                  <div
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 16px",
                      background: "rgba(212,168,83,0.05)",
                      border: "1px solid rgba(212,168,83,0.15)",
                      borderRadius: "10px",
                    }}
                  >
                    <span style={{ color: "#d4a853", fontWeight: "700" }}>
                      ✓
                    </span>
                    <span style={{ fontSize: "14px" }}>{f}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
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
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "12px",
                      padding: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "700", fontSize: "14px" }}>
                          {r.name}
                        </div>
                        <div
                          style={{
                            color: "#d4a853",
                            fontSize: "13px",
                            marginTop: "2px",
                          }}
                        >
                          {"★".repeat(r.rating)}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "rgba(240,238,234,0.3)",
                        }}
                      >
                        {r.date}
                      </div>
                    </div>
                    <p
                      style={{
                        color: "rgba(240,238,234,0.6)",
                        fontSize: "14px",
                        lineHeight: "1.7",
                      }}
                    >
                      {r.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: booking widget ── */}
          <div style={{ position: stacked ? "static" : "sticky", top: "84px" }}>
            <div
              style={{
                background: "#13131a",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "28px",
                boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
              }}
            >
              {/* Price header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "8px",
                  marginBottom: "24px",
                  paddingBottom: "24px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span
                  style={{
                    fontSize: "38px",
                    fontWeight: "800",
                    color: "#d4a853",
                    lineHeight: 1,
                  }}
                >
                  {car.price}€
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "rgba(240,238,234,0.4)",
                    marginBottom: "6px",
                  }}
                >
                  /jour
                </span>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <div
                    style={{ fontSize: "11px", color: "rgba(240,238,234,0.4)" }}
                  >
                    à partir de
                  </div>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "16px",
                      color: "rgba(240,238,234,0.7)",
                    }}
                  >
                    {car.priceMonth}€/mois
                  </div>
                </div>
              </div>

              {/* Date inputs */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <label style={labelStyle}>Date de prise en charge</label>
                  <input
                    type="date"
                    className="input-field"
                    value={pickupDate.toISOString().split("T")[0]}
                    onChange={(e) => setPickupDate(new Date(e.target.value))}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Date de retour</label>
                  <input
                    type="date"
                    className="input-field"
                    value={returnDate.toISOString().split("T")[0]}
                    onChange={(e) => setReturnDate(new Date(e.target.value))}
                  />
                </div>
              </div>

              {/* Summary */}
              <div
                style={{
                  background: "rgba(212,168,83,0.06)",
                  border: "1px solid rgba(212,168,83,0.15)",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      color: "rgba(240,238,234,0.55)",
                    }}
                  >
                    {car.price}€ × {days} jour{days > 1 ? "s" : ""}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: "600" }}>
                    {total}€
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      color: "rgba(240,238,234,0.55)",
                    }}
                  >
                    Frais de service
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: "600" }}>
                    0€
                  </span>
                </div>
                <div
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    paddingTop: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontWeight: "700" }}>Total</span>
                  <span
                    style={{
                      fontWeight: "800",
                      fontSize: "18px",
                      color: "#d4a853",
                    }}
                  >
                    {total}€
                  </span>
                </div>
              </div>

              {/* Perks */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginBottom: "24px",
                }}
              >
                {[
                  {
                    icon: !car.deposit ? "✅" : "⚠️",
                    text: car.deposit ? "Caution requise" : "Sans caution",
                  },
                  { icon: "🔄", text: "Annulation gratuite 24h avant" },
                  { icon: "📍", text: "Livraison à domicile disponible" },
                ].map((p) => (
                  <div
                    key={p.text}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "13px",
                      color: "rgba(240,238,234,0.6)",
                    }}
                  >
                    <span>{p.icon}</span>
                    <span>{p.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() =>
                  alert(`Réservation confirmée pour ${car.name} — ${total}€`)
                }
                style={{
                  width: "100%",
                  background: "#d4a853",
                  color: "#0a0a0f",
                  border: "none",
                  padding: "16px",
                  borderRadius: "10px",
                  fontFamily: "'Sora',sans-serif",
                  fontWeight: "800",
                  fontSize: "15px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.25s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#e8be6a";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 24px rgba(212,168,83,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#d4a853";
                  e.target.style.transform = "none";
                  e.target.style.boxShadow = "none";
                }}
              >
                Réserver maintenant
              </button>

              <button
                style={{
                  width: "100%",
                  background: "transparent",
                  color: "rgba(240,238,234,0.6)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "12px",
                  borderRadius: "10px",
                  fontFamily: "'Sora',sans-serif",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                  marginTop: "10px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#d4a853";
                  e.target.style.color = "#d4a853";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.color = "rgba(240,238,234,0.6)";
                }}
              >
                Contacter l'agence
              </button>
            </div>
          </div>
        </div>

        {/* ── Similar vehicles ── */}
        {similar.length > 0 && (
          <div style={{ marginTop: "80px" }}>
            <div
              style={{
                width: "48px",
                height: "3px",
                background: "#d4a853",
                borderRadius: "2px",
                marginBottom: "16px",
              }}
            />
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(1.6rem,3vw,2.2rem)",
                fontWeight: "700",
                marginBottom: "32px",
              }}
            >
              Véhicules similaires
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: "20px",
              }}
            >
              {similar.map((c) => (
                <Link
                  key={c.id}
                  to={`/car/${c.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <SimilarCard car={c} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function SimilarCard({ car }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: "#13131a",
        border: `1px solid ${h ? "rgba(212,168,83,0.4)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "14px",
        overflow: "hidden",
        transform: h ? "translateY(-6px)" : "none",
        boxShadow: h ? "0 20px 40px rgba(0,0,0,0.4)" : "none",
        transition: "all 0.3s cubic-bezier(.22,.68,0,1.2)",
        cursor: "pointer",
      }}
    >
      <img
        src={car.img}
        alt={car.name}
        style={{
          width: "100%",
          height: "160px",
          objectFit: "cover",
          display: "block",
          transition: "transform 0.5s",
          transform: h ? "scale(1.04)" : "scale(1)",
        }}
      />
      <div style={{ padding: "16px" }}>
        <div style={{ fontWeight: "700", marginBottom: "4px" }}>{car.name}</div>
        <div
          style={{
            fontSize: "12px",
            color: "rgba(240,238,234,0.4)",
            marginBottom: "12px",
          }}
        >
          {car.category}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "800", color: "#d4a853" }}>
            {car.price}€
            <span
              style={{
                fontSize: "11px",
                fontWeight: "400",
                color: "rgba(240,238,234,0.4)",
                marginLeft: "3px",
              }}
            >
              /jour
            </span>
          </span>
          <span style={{ color: "#d4a853", fontSize: "13px" }}>
            ★ {car.rating}
          </span>
        </div>
      </div>
    </div>
  );
}
