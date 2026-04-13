import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDays } from "../data";
import DateRangeButton from "./DateRangeButton";
import { supabase } from "../lib/supabaseClient";

export default function SearchWidget() {
  const [pickupDate, setPickupDate] = useState(addDays(new Date(), 2));
  const [returnDate, setReturnDate] = useState(addDays(new Date(), 5));
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("cars")
      .select("city")
      .not("city", "is", null)
      .then(({ data }) => {
        if (data) {
          const unique = [...new Set(data.map((r) => r.city).filter(Boolean))].sort();
          setCities(unique);
        }
      });
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (pickupDate) params.set("from", pickupDate.toISOString().split("T")[0]);
    if (returnDate) params.set("to", returnDate.toISOString().split("T")[0]);
    navigate(`/cars?${params.toString()}`);
  };

  const labelClasses = "text-[11px] font-semibold text-gold tracking-[0.15em] uppercase block mb-2";

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-md">
      <div className="flex flex-col gap-3">
        <div>
          <label className={labelClasses}>Lieu de prise en charge</label>
          <select
            className="input-field cursor-pointer"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ background: "#0a0a0f", color: "#f5f0e8" }}
          >
            <option value="" style={{ background: "#0a0a0f", color: "#f5f0e8" }}>Toutes les villes</option>
            {cities.map((c) => (
              <option key={c} value={c} style={{ background: "#0a0a0f", color: "#f5f0e8" }}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses}>Dates</label>
          <DateRangeButton
            pickupDate={pickupDate}
            returnDate={returnDate}
            onChange={({ start, end }) => {
              if (start !== undefined) setPickupDate(start);
              if (end !== undefined) setReturnDate(end);
            }}
          />
        </div>
        <button className="btn-primary h-[46px] w-full" onClick={handleSearch}>
          Rechercher
        </button>
      </div>
    </div>
  );
}
