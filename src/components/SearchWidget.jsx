import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDays } from "../data";

export default function SearchWidget({ isMobile = false }) {
  const [pickupDate, setPickupDate] = useState(addDays(new Date(), 2));
  const [returnDate, setReturnDate] = useState(addDays(new Date(), 5));
  const navigate = useNavigate();

  const handleSearch = () => navigate("/cars");

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px",
        padding: isMobile ? "16px" : "24px",
        backdropFilter: "blur(10px)",
      }}
    >
      {isMobile ? (
        // ── Mobile: full single-column stack ──
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={labelStyle}>Lieu de prise en charge</label>
            <input className="input-field" defaultValue="Paris, CDG" />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row", // ✅ colonne si mobile
              gap: "8px",
            }}
          >
            <div style={{ flex: 1 }}>
              <label
                style={{ ...labelStyle, fontSize: "10px", marginBottom: "4px" }}
              >
                Du
              </label>
              <input
                className="input-field"
                type="date"
                style={{ height: "38px", fontSize: "14px" }}
                value={pickupDate.toISOString().split("T")[0]}
                onChange={(e) => setPickupDate(new Date(e.target.value))}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label
                style={{ ...labelStyle, fontSize: "10px", marginBottom: "4px" }}
              >
                Jusqu'au
              </label>
              <input
                className="input-field"
                type="date"
                style={{ height: "38px", fontSize: "14px" }}
                value={returnDate.toISOString().split("T")[0]}
                onChange={(e) => setReturnDate(new Date(e.target.value))}
              />
            </div>
          </div>
          <button
            className="btn-primary"
            style={{ height: "46px", width: "100%" }}
            onClick={handleSearch}
          >
            Rechercher
          </button>
        </div>
      ) : (
        // ── Desktop: location full-width on top, dates + button on bottom ──
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={labelStyle}>Lieu de prise en charge</label>
            <input className="input-field" defaultValue="Paris, CDG" />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: "12px",
              alignItems: "end",
            }}
          >
            <div>
              <label style={labelStyle}>Du</label>
              <input
                className="input-field"
                type="date"
                defaultValue={pickupDate.toISOString().split("T")[0]}
                onChange={(e) => setPickupDate(new Date(e.target.value))}
              />
            </div>
            <div>
              <label style={labelStyle}>Jusqu'au</label>
              <input
                className="input-field"
                type="date"
                defaultValue={returnDate.toISOString().split("T")[0]}
                onChange={(e) => setReturnDate(new Date(e.target.value))}
              />
            </div>
            <button
              className="btn-primary"
              style={{ height: "46px", whiteSpace: "nowrap" }}
              onClick={handleSearch}
            >
              Rechercher
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  fontSize: "11px",
  fontWeight: "600",
  color: "#d4a853",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  display: "block",
  marginBottom: "8px",
};
