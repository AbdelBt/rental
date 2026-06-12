import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDays } from "../data";
import DateRangeButton from "./DateRangeButton";
import { supabase } from "../lib/supabaseClient";

export default function SearchWidget({ isMobile }) {
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
          const unique = [
            ...new Set(data.map((r) => r.city).filter(Boolean)),
          ].sort();
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

  const labelClasses =
    "text-[11px] font-semibold text-gold tracking-[0.15em] uppercase block mb-2";

  return (
    <div className="bg-card/95 border border-border/40 rounded-[28px] p-4 md:p-6 shadow-[0_24px_72px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-4">
        <div>
          <label className={labelClasses}>Lieu de prise en charge</label>
          <select
            className={`input-field cursor-pointer shadow-sm relative z-10 appearance-auto ${
              city ? "border border-gold/50" : "border border-border/30"
            }`}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="" className="bg-card text-foreground">
              Toutes les villes
            </option>
            {cities.map((c) => (
              <option key={c} value={c} className="bg-card text-foreground">
                {c}
              </option>
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
        <button
          type="button"
          className="btn-primary h-[46px] w-full border border-border cursor-pointer relative z-10 hover:bg-gold/10 hover:text-black"
          onClick={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          Rechercher
        </button>
      </div>
    </div>
  );
}
