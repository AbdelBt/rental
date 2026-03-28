import * as React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function DateRangeButton({ pickupDate, returnDate, onChange, className }) {
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState({ from: pickupDate ?? undefined, to: returnDate ?? undefined });
  // Track whether the previous state was a complete range (both dates selected)
  const wasComplete = React.useRef(!!(pickupDate && returnDate));

  React.useEffect(() => {
    if (!pickupDate && !returnDate) {
      setRange({ from: undefined, to: undefined });
      wasComplete.current = false;
    }
  }, [pickupDate, returnDate]);

  function handleSelect(selection) {
    if (!selection) {
      setRange({ from: undefined, to: undefined });
      wasComplete.current = false;
      return;
    }

    // If a complete range was already selected and user clicks a new date,
    // v9 creates a new valid range immediately — intercept and force fresh start
    if (wasComplete.current && selection.from && selection.to && selection.from.getTime() !== selection.to.getTime()) {
      // Keep only the newly clicked "from", discard "to" so user picks end date
      const freshFrom = range.from && selection.from.getTime() !== range.from.getTime()
        ? selection.from
        : selection.to;
      setRange({ from: freshFrom, to: undefined });
      wasComplete.current = false;
      return;
    }

    setRange(selection);

    if (selection.from && selection.to && selection.from.getTime() !== selection.to.getTime()) {
      wasComplete.current = true;
      onChange({ start: selection.from, end: selection.to });
      setOpen(false);
    } else {
      wasComplete.current = false;
    }
  }

  const displayFrom = range?.from;
  const displayTo = range?.to;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-[13px] font-medium transition-all cursor-pointer",
            open || pickupDate
              ? "border-[#d4a853]/50 bg-[#d4a853]/[0.07] text-[#f0eeea]"
              : "border-white/10 bg-white/[0.04] text-[#f0eeea]/50 hover:border-white/20 hover:text-[#f0eeea]/75",
            className
          )}
        >
          <CalendarIcon size={15} className={pickupDate ? "text-[#d4a853]" : "text-[#f0eeea]/40"} />
          <span className="flex-1 text-left truncate">
            {displayFrom ? (
              displayTo && displayFrom.getTime() !== displayTo.getTime() ? (
                <>
                  {format(displayFrom, "dd MMM", { locale: fr })}
                  {" — "}
                  {format(displayTo, "dd MMM yyyy", { locale: fr })}
                </>
              ) : (
                <>Départ : {format(displayFrom, "dd MMM yyyy", { locale: fr })}</>
              )
            ) : (
              "Sélectionner les dates"
            )}
          </span>
          {(pickupDate || returnDate) && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setRange({ from: undefined, to: undefined });
                onChange({ start: null, end: null });
                setOpen(false);
              }}
              className="text-[#f0eeea]/30 hover:text-[#f0eeea]/70 text-sm leading-none cursor-pointer shrink-0"
            >
              ✕
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-[#0f0e1a] border-white/10 text-[#f0eeea]" align="start">
        <Calendar
          mode="range"
          defaultMonth={displayFrom ?? new Date()}
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={{ before: new Date() }}
          locale={fr}
        />
      </PopoverContent>
    </Popover>
  );
}
