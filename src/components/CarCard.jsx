import { useState } from "react";
import { Link } from "react-router-dom";

export default function CarCard({
  car,
  days = 3,
  index = 0,
  isMobile = false,
}) {
  const [hovered, setHovered] = useState(false);
  const horizontal = isMobile;

  return (
    <Link
      to={`/car/${car.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        className="car-card"
        style={{
          animation: `fadeUp 0.4s ease ${index * 0.06}s both`,
          display: horizontal ? "flex" : "block",
          flexDirection: horizontal ? "row" : undefined,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Image ── */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
            width: horizontal ? "130px" : "100%",
            height: horizontal ? "auto" : undefined,
            minHeight: horizontal ? "130px" : undefined,
          }}
        >
          <img
            src={car.img}
            alt={car.name}
            className="car-img"
            style={{
              width: "100%",
              height: horizontal ? "100%" : "200px",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: horizontal
                ? "linear-gradient(to right, rgba(10,10,15,0.5) 0%, transparent 60%)"
                : "linear-gradient(to top, rgba(10,10,15,0.7) 0%, transparent 50%)",
            }}
          />

          {/* Badge — hidden on horizontal to save space */}
          {car.badge && !horizontal && (
            <div style={{ position: "absolute", top: "14px", left: "14px" }}>
              <span className="badge">{car.badge}</span>
            </div>
          )}

          {/* Category chip — top-right, always shown */}
          {!horizontal && (
            <div
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                background: "rgba(10,10,15,0.75)",
                backdropFilter: "blur(8px)",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600",
                color: "rgba(240,238,234,0.7)",
              }}
            >
              {car.category}
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div
          style={{
            padding: horizontal ? "14px 16px" : "18px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: horizontal ? 1 : undefined,
            minWidth: 0,
          }}
        >
          {/* Name + category (horizontal only) */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  fontWeight: "700",
                  fontSize: horizontal ? "15px" : "17px",
                  whiteSpace: horizontal ? "nowrap" : undefined,
                  overflow: horizontal ? "hidden" : undefined,
                  textOverflow: horizontal ? "ellipsis" : undefined,
                }}
              >
                {car.name}
              </div>
              {horizontal && car.badge && (
                <span
                  className="badge"
                  style={{
                    fontSize: "10px",
                    padding: "2px 8px",
                    flexShrink: 0,
                  }}
                >
                  {car.badge}
                </span>
              )}
            </div>

            {/* Specs */}
            <div
              style={{
                display: "flex",
                gap: horizontal ? "10px" : "14px",
                marginBottom: horizontal ? "10px" : "16px",
                flexWrap: "wrap",
              }}
            >
              {[
                { icon: "👤", val: `${car.seats}p` },
                { icon: "⚙️", val: car.transmission },
                { icon: "⛽", val: car.fuel },
              ].map((s) => (
                <span
                  key={s.val}
                  style={{
                    fontSize: "11px",
                    color: "rgba(240,238,234,0.45)",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  {s.icon} {s.val}
                </span>
              ))}
            </div>
          </div>

          {/* Price + CTA */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: horizontal ? "20px" : "24px",
                  fontWeight: "800",
                  color: "#d4a853",
                }}
              >
                {car.price}€
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "rgba(240,238,234,0.4)",
                  marginLeft: "3px",
                }}
              >
                / jour
              </span>
            </div>
            <button
              className="btn-primary"
              style={{
                padding: horizontal ? "8px 14px" : "10px 18px",
                fontSize: "11px",
              }}
            >
              Réserver
            </button>
          </div>

          {hovered && !horizontal && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                color: "#d4a853",
                fontSize: "13px",
                fontWeight: "500",
                height: hovered && !horizontal ? "auto" : "0px",
                opacity: hovered && !horizontal ? 1 : 0,
                overflow: "hidden",
                transition: "opacity 0.25s ease, height 0.25s ease",
              }}
            >
              Total estimé : <strong>{car.price * days}€</strong> pour {days}{" "}
              jour{days > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
