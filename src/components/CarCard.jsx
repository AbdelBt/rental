import { useState } from "react";
import { Link } from "react-router-dom";

export default function CarCard({ car, days = 3, index = 0, isMobile = false }) {
  const [hovered, setHovered] = useState(false);
  const horizontal = isMobile;

  return (
    <Link to={`/car/${car.id}`} className="no-underline text-inherit">
      <div
        className={`car-card ${horizontal ? "flex flex-row" : "block"}`}
        style={{ animation: `fadeUp 0.4s ease ${index * 0.06}s both` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className={`relative overflow-hidden shrink-0 ${
            horizontal ? "w-[130px] min-h-[130px]" : "w-full"
          }`}
        >
          <img
            src={car.img}
            alt={car.name}
            className={`car-img w-full object-cover ${
              horizontal ? "h-full" : "h-[200px]"
            }`}
          />
          <div
            className="absolute inset-0"
            style={{
              background: horizontal
                ? "linear-gradient(to right, rgba(10,10,15,0.5) 0%, transparent 60%)"
                : "linear-gradient(to top, rgba(10,10,15,0.7) 0%, transparent 50%)",
            }}
          />

          {car.badge && !horizontal && (
            <div className="absolute top-3.5 left-3.5">
              <span className="badge">{car.badge}</span>
            </div>
          )}

          {!horizontal && (
            <div className="absolute top-3.5 right-3.5 bg-dark-bg/75 backdrop-blur-md py-1.5 px-3 rounded-full text-xs font-semibold text-cream/70">
              {car.category}
            </div>
          )}
        </div>

        <div
          className={`relative flex flex-col justify-between flex-1 min-w-0 ${
            horizontal ? "py-3.5 px-4" : "py-4 px-5"
          }`}
        >
          <div className="relative min-h-[72px]">
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`font-bold ${horizontal ? "text-[15px]" : "text-[17px]"} ${
                  horizontal ? "whitespace-nowrap overflow-hidden text-ellipsis" : ""
                }`}
              >
                {car.name}
              </div>
              {horizontal && car.badge && (
                <span className="badge text-[10px] py-0.5 px-2 shrink-0">{car.badge}</span>
              )}
            </div>

            <div className={`flex flex-wrap ${horizontal ? "gap-2.5 mb-2.5" : "gap-3.5 mb-4"}`}>
              {[
                { icon: "👤", val: `${car.seats}p` },
                { icon: "⚙️", val: car.transmission },
                { icon: "⛽", val: car.fuel },
              ].map((s) => (
                <span key={s.val} className="text-[11px] text-cream/45 flex items-center gap-0.5">
                  {s.icon} {s.val}
                </span>
              ))}
            </div>

            {hovered && !horizontal && (
              <div className="absolute inset-0 flex items-center justify-center bg-dark/95 rounded-t text-gold text-[10px] font-medium">
                Total estimé : <strong>{car.price * days} DH / {days} jour{days > 1 ? "s" : ""}</strong> 
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className={`font-extrabold text-gold ${horizontal ? "text-xl" : "text-2xl"}`}>
                {car.price} DH
              </span>
              <span className="text-[11px] text-cream/40 ml-0.5">/ jour</span>
            </div>
            <button className={`btn-primary shrink-0 ${horizontal ? "!py-2 !px-2.5 !text-[12px]" : " !py-2 !px-3 !text-[12px]"}`}>
              Réserver
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
