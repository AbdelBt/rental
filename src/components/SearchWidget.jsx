import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDays } from "../data";

export default function SearchWidget({ isMobile = false }) {
  const [pickupDate, setPickupDate] = useState(addDays(new Date(), 2));
  const [returnDate, setReturnDate] = useState(addDays(new Date(), 5));
  const navigate = useNavigate();

  const handleSearch = () => navigate("/cars");

  const labelClasses = "text-[11px] font-semibold text-gold tracking-[0.15em] uppercase block mb-2";

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-md">
      {isMobile ? (
        <div className="flex flex-col gap-3">
          <div>
            <label className={labelClasses}>Lieu de prise en charge</label>
            <input className="input-field" defaultValue="Paris, CDG" />
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1">
              <label className={`${labelClasses} text-[10px] mb-1`}>Du</label>
              <input
                className="input-field h-[38px] text-sm"
                type="date"
                value={pickupDate.toISOString().split("T")[0]}
                onChange={(e) => setPickupDate(new Date(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <label className={`${labelClasses} text-[10px] mb-1`}>Jusqu'au</label>
              <input
                className="input-field h-[38px] text-sm"
                type="date"
                value={returnDate.toISOString().split("T")[0]}
                onChange={(e) => setReturnDate(new Date(e.target.value))}
              />
            </div>
          </div>
          <button className="btn-primary h-[46px] w-full" onClick={handleSearch}>
            Rechercher
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div>
            <label className={labelClasses}>Lieu de prise en charge</label>
            <input className="input-field" defaultValue="Paris, CDG" />
          </div>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <div>
              <label className={labelClasses}>Du</label>
              <input
                className="input-field"
                type="date"
                defaultValue={pickupDate.toISOString().split("T")[0]}
                onChange={(e) => setPickupDate(new Date(e.target.value))}
              />
            </div>
            <div>
              <label className={labelClasses}>Jusqu'au</label>
              <input
                className="input-field"
                type="date"
                defaultValue={returnDate.toISOString().split("T")[0]}
                onChange={(e) => setReturnDate(new Date(e.target.value))}
              />
            </div>
            <button className="btn-primary h-[46px] whitespace-nowrap" onClick={handleSearch}>
              Rechercher
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
