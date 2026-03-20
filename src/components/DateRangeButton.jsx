import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import DateRangePicker from "./DateRangePicker";

export default function DateRangeButton({ pickupDate, returnDate, onChange, placeholder = "Sélectionner les dates" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const label = pickupDate
    ? returnDate
      ? `${format(pickupDate, "dd MMM", { locale: fr })} → ${format(returnDate, "dd MMM", { locale: fr })}`
      : `${format(pickupDate, "dd MMM", { locale: fr })} → ...`
    : placeholder;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-[13px] font-medium transition-all cursor-pointer ${
          open || pickupDate
            ? "border-gold/50 bg-gold/[0.07] text-cream"
            : "border-white/10 bg-white/[0.04] text-cream/50 hover:border-white/20 hover:text-cream/75"
        }`}
      >
        <CalendarIcon size={15} className={pickupDate ? "text-gold" : "text-cream/40"} />
        <span className="flex-1 text-left truncate">{label}</span>
        {(pickupDate || returnDate) && (
          <span
            onClick={(e) => { e.stopPropagation(); onChange({ start: null, end: null }); setOpen(false); }}
            className="text-cream/30 hover:text-cream/70 text-base leading-none cursor-pointer"
          >
            ✕
          </span>
        )}
      </button>

      {open && (
        <div className="absolute z-[200] top-full mt-2 left-1/2 -translate-x-1/2 bg-[#0f0e1a] border border-white/[0.1] rounded-2xl shadow-2xl p-4 w-[300px]">
          <DateRangePicker
            pickupDate={pickupDate}
            returnDate={returnDate}
            onChange={({ start, end }) => {
              onChange({ start, end });
              if (start && end) setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
