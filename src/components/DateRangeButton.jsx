import * as React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function DateRangeButton({
  pickupDate,
  returnDate,
  onChange,
  className,
}) {
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState({
    from: pickupDate ?? undefined,
    to: returnDate ?? undefined,
  });
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
    if (
      wasComplete.current &&
      selection.from &&
      selection.to &&
      selection.from.getTime() !== selection.to.getTime()
    ) {
      // Keep only the newly clicked "from", discard "to" so user picks end date
      const freshFrom =
        range.from && selection.from.getTime() !== range.from.getTime()
          ? selection.from
          : selection.to;
      setRange({ from: freshFrom, to: undefined });
      wasComplete.current = false;
      return;
    }

    setRange(selection);

    if (
      selection.from &&
      selection.to &&
      selection.from.getTime() !== selection.to.getTime()
    ) {
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
      <div className="relative">
        <PopoverTrigger asChild>
          <button
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-[13px] font-medium transition-all cursor-pointer",
              open || pickupDate
                ? "border-gold/50 bg-gold/10 text-foreground"
                : "border-border/20 bg-card/90 text-foreground/80 hover:border-border/30 hover:text-foreground hover:bg-border/10",
              className,
            )}
          >
            <CalendarIcon
              size={15}
              className={pickupDate ? "text-gold" : "text-foreground/40"}
            />
            <span className="flex-1 text-left truncate">
              {displayFrom ? (
                displayTo && displayFrom.getTime() !== displayTo.getTime() ? (
                  <>
                    {format(displayFrom, "dd MMM", { locale: fr })}
                    {" — "}
                    {format(displayTo, "dd MMM yyyy", { locale: fr })}
                  </>
                ) : (
                  <>
                    Départ :{" "}
                    {format(displayFrom, "dd MMM yyyy", { locale: fr })}
                  </>
                )
              ) : (
                "Sélectionner les dates"
              )}
            </span>
          </button>
        </PopoverTrigger>
        {(pickupDate || returnDate) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setRange({ from: undefined, to: undefined });
              onChange({ start: null, end: null });
              setOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f0eeea]/30 hover:text-[#f0eeea]/70 text-sm leading-none cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>
      <PopoverContent
        className="w-auto p-0 bg-card/95 border-border text-foreground shadow-xl"
        align="start"
      >
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
