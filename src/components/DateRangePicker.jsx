import { useState } from "react";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function startOfDay(d) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isBetween(d, start, end) {
  if (!start || !end) return false;
  const [s, e] = start <= end ? [start, end] : [end, start];
  return d > s && d < e;
}

export default function DateRangePicker({ pickupDate, returnDate, onChange }) {
  const today = startOfDay(new Date());

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selecting, setSelecting] = useState(null); // "start" | "end"
  const [hovered, setHovered] = useState(null);

  function getDays(year, month) {
    const firstDay = new Date(year, month, 1);
    // Monday = 0 in our grid
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function handleClick(day) {
    if (!day) return;
    if (day < today) return;

    if (!selecting || selecting === "start") {
      onChange({ start: day, end: null });
      setSelecting("end");
    } else {
      // selecting end
      if (day <= pickupDate) {
        // clicked before start → restart
        onChange({ start: day, end: null });
        setSelecting("end");
      } else {
        onChange({ start: pickupDate, end: day });
        setSelecting(null);
      }
    }
  }

  const cells = getDays(viewYear, viewMonth);

  // Determine range for highlight
  const rangeEnd = selecting === "end" && hovered ? hovered : returnDate;

  return (
    <div className="select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-cream/60 hover:text-gold hover:border-gold/40 transition-all cursor-pointer text-base"
        >
          ‹
        </button>
        <span className="font-semibold text-[15px]">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-cream/60 hover:text-gold hover:border-gold/40 transition-all cursor-pointer text-base"
        >
          ›
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold tracking-widest uppercase text-cream/30 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;

          const isPast     = day < today;
          const isToday    = sameDay(day, today);
          const isStart    = pickupDate && sameDay(day, pickupDate);
          const isEnd      = returnDate && sameDay(day, returnDate);
          const inRange    = pickupDate && isBetween(day, pickupDate, rangeEnd);
          const isHovEnd   = selecting === "end" && hovered && sameDay(day, hovered);
          const isWeekend  = day.getDay() === 0 || day.getDay() === 6;

          let bg = "transparent";
          let textColor = isPast ? "text-cream/20" : isWeekend ? "text-amber-400/70" : "text-cream/85";
          let borderRadius = "rounded-lg";
          let cursor = isPast ? "cursor-not-allowed" : "cursor-pointer";
          let rangeHighlight = "";

          if (isStart || isEnd) {
            bg = "#d4a853";
            textColor = "text-[#0a0a0f]";
          } else if (inRange) {
            rangeHighlight = "bg-gold/10";
            textColor = "text-cream";
          }

          if (isStart && (returnDate || (selecting === "end" && hovered))) {
            borderRadius = "rounded-l-lg rounded-r-none";
          } else if (isEnd || isHovEnd) {
            borderRadius = "rounded-r-lg rounded-l-none";
          } else if (inRange) {
            borderRadius = "rounded-none";
          }

          return (
            <div
              key={day.toISOString()}
              className={`relative h-9 flex items-center justify-center text-[13px] font-medium transition-all duration-100 ${rangeHighlight} ${borderRadius} ${textColor} ${cursor}`}
              style={isStart || isEnd ? { background: bg } : undefined}
              onClick={() => handleClick(day)}
              onMouseEnter={() => selecting === "end" && !isPast && setHovered(day)}
              onMouseLeave={() => setHovered(null)}
            >
              {isToday && !isStart && !isEnd && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold rounded-full" />
              )}
              {day.getDate()}
            </div>
          );
        })}
      </div>

      {/* Status text */}
      <div className="mt-3 text-[11px] text-cream/35 text-center">
        {!pickupDate && "Sélectionnez la date de prise en charge"}
        {pickupDate && !returnDate && "Sélectionnez la date de retour"}
        {pickupDate && returnDate && (() => {
          const days = Math.max(1, Math.round((returnDate - pickupDate) / 86400000));
          return `${days} jour${days > 1 ? "s" : ""} · du ${pickupDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} au ${returnDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`;
        })()}
      </div>
    </div>
  );
}
