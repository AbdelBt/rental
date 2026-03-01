import { useState } from "react";

export default function CarCard({ car, days = 3, index = 0 }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="car-card"
      style={{ animation: `fadeUp 0.4s ease ${index * 0.06}s both` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src={car.img} alt={car.name} className="car-img" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10,10,15,0.7) 0%, transparent 50%)",
          }}
        />
        {car.badge && (
          <div style={{ position: "absolute", top: "14px", left: "14px" }}>
            <span className="badge">{car.badge}</span>
          </div>
        )}
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
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px" }}>
        <div style={{ fontWeight: "700", fontSize: "17px", marginBottom: "6px" }}>{car.name}</div>

        {/* Specs */}
        <div style={{ display: "flex", gap: "14px", marginBottom: "16px" }}>
          {[
            { icon: "👤", val: `${car.seats} places` },
            { icon: "⚙️", val: car.transmission },
            { icon: "⛽", val: car.fuel },
          ].map((s) => (
            <span
              key={s.val}
              style={{
                fontSize: "12px",
                color: "rgba(240,238,234,0.45)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {s.icon} {s.val}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "24px", fontWeight: "800", color: "#d4a853" }}>
              {car.price}€
            </span>
            <span style={{ fontSize: "12px", color: "rgba(240,238,234,0.4)", marginLeft: "4px" }}>
              / jour
            </span>
          </div>
          <button className="btn-primary" style={{ padding: "10px 18px", fontSize: "12px" }}>
            Réserver
          </button>
        </div>

        {/* Hover: total estimate */}
        {hovered && (
          <div
            style={{
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              color: "#d4a853",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            Total estimé :{" "}
            <strong>
              {car.price * days}€
            </strong>{" "}
            pour {days} jour{days > 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
