import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDays } from "../data";
import DateRangeButton from "./DateRangeButton";

export default function SearchWidget({ isMobile = false }) {
  const [pickupDate, setPickupDate] = useState(addDays(new Date(), 2));
  const [returnDate, setReturnDate] = useState(addDays(new Date(), 5));
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
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
          <input className="input-field" defaultValue="Maroc" />
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
