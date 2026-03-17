import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useClientAuth } from "../../hooks/useClientAuth";

function daysUntil(dateStr) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr); target.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function diffDays(start, end) {
  return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
}

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

const STATUS_MAP = {
  confirmed: { label: "Confirmée",  cls: "bg-green-500/15 text-green-400 border-green-500/30" },
  pending:   { label: "En attente", cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  active:    { label: "En cours",   cls: "bg-blue-500/15 text-blue-400 border-blue-500/30"   },
  completed: { label: "Terminée",   cls: "bg-white/[0.06] text-cream/40 border-white/[0.08]" },
  cancelled: { label: "Annulée",    cls: "bg-red-500/15 text-red-400 border-red-500/30"       },
};

const FILTERS = [
  { key: "all",       label: "Toutes"    },
  { key: "upcoming",  label: "À venir"   },
  { key: "active",    label: "En cours"  },
  { key: "completed", label: "Terminées" },
];

const FALLBACK_IMG = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80";

export default function ClientReservations() {
  const { client } = useClientAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState("all");

  useEffect(() => {
    if (!client?.id) return;
    supabase
      .from("reservations")
      .select("*, cars(name, brand, img, imgs, category, fuel, seats, transmission)")
      .eq("customer_id", client.id)
      .order("start_date", { ascending: false })
      .then(({ data }) => {
        setReservations(data ?? []);
        setLoading(false);
      });
  }, [client?.id]);

  const count = (key) =>
    reservations.filter((r) => {
      if (key === "upcoming")  return ["confirmed", "pending"].includes(r.status);
      if (key === "active")    return r.status === "active";
      if (key === "completed") return r.status === "completed";
      return false;
    }).length;

  const filtered = reservations.filter((r) => {
    if (filter === "upcoming")  return ["confirmed", "pending"].includes(r.status);
    if (filter === "active")    return r.status === "active";
    if (filter === "completed") return r.status === "completed";
    return true;
  });

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="font-playfair text-2xl font-bold mb-1">Mes réservations</h1>
        <p className="text-cream/45 text-sm">Historique complet de vos locations.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
              filter === key
                ? "bg-gold text-[#0a0a0f] border-gold"
                : "bg-transparent border-white/[0.1] text-cream/50 hover:border-white/[0.2] hover:text-cream/80"
            }`}
          >
            {label}
            {key !== "all" && <span className="ml-1.5 opacity-70">({count(key)})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-56 bg-white/[0.03] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🚗</div>
          <p className="text-cream/50 text-sm mb-5">Aucune réservation dans cette catégorie.</p>
          <Link to="/cars" className="btn-primary py-2.5 px-6 text-xs inline-block">
            Explorer les véhicules
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r, i) => {
            const days     = daysUntil(r.start_date);
            const duration = diffDays(r.start_date, r.end_date);
            const isUpcoming = days >= 0 && ["confirmed", "pending", "active"].includes(r.status);
            const s = STATUS_MAP[r.status] ?? STATUS_MAP.pending;
            const carImg = r.cars?.img || FALLBACK_IMG;
            const carName = r.cars
              ? `${r.cars.brand ? r.cars.brand + " " : ""}${r.cars.name}`
              : "Véhicule";

            return (
              <div
                key={r.id ?? i}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  r.status === "active"
                    ? "border-blue-500/25"
                    : isUpcoming && days <= 3
                    ? "border-amber-500/25"
                    : "border-white/[0.07]"
                }`}
              >
                {/* Car image banner */}
                <div className="relative h-44 bg-white/[0.04]">
                  <img
                    src={carImg}
                    alt={carName}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = FALLBACK_IMG; }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/40 to-transparent" />

                  {/* Status badge top-right */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${s.cls}`}>
                      {s.label}
                    </span>
                  </div>

                  {/* Category top-left */}
                  {r.cars?.category && (
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-black/40 border border-white/[0.15] text-cream/70 backdrop-blur-sm">
                        {r.cars.category}
                      </span>
                    </div>
                  )}

                  {/* Car name over image */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="font-playfair text-xl font-bold text-white leading-tight">
                      {carName}
                    </div>
                    {r.cars && (
                      <div className="flex gap-3 mt-1">
                        {r.cars.fuel && (
                          <span className="text-[11px] text-cream/55">{r.cars.fuel}</span>
                        )}
                        {r.cars.seats && (
                          <span className="text-[11px] text-cream/55">· {r.cars.seats} places</span>
                        )}
                        {r.cars.transmission && (
                          <span className="text-[11px] text-cream/55">· {r.cars.transmission}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Details section */}
                <div className="bg-[#0d0d16] px-4 py-4">
                  {/* Dates row */}
                  <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
                    <div className="flex items-center gap-3 text-[13px]">
                      <div className="text-center">
                        <div className="text-[10px] text-cream/35 uppercase tracking-widest mb-0.5">Départ</div>
                        <div className="font-semibold text-cream/90">{fmt(r.start_date)}</div>
                      </div>
                      <div className="flex items-center gap-1.5 text-cream/25">
                        <div className="w-8 h-px bg-cream/20" />
                        <span className="text-[10px] text-cream/40 font-semibold">{duration}j</span>
                        <div className="w-8 h-px bg-cream/20" />
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-cream/35 uppercase tracking-widest mb-0.5">Retour</div>
                        <div className="font-semibold text-cream/90">{fmt(r.end_date)}</div>
                      </div>
                    </div>

                    {/* Countdown */}
                    {isUpcoming && days >= 0 && (
                      <div className="text-right shrink-0">
                        {days === 0 ? (
                          <span className="text-green-400 font-bold text-sm">Aujourd'hui !</span>
                        ) : (
                          <>
                            <span className={`font-playfair text-3xl font-bold ${days <= 3 ? "text-amber-400" : "text-gold"}`}>
                              {days}
                            </span>
                            <span className="text-[11px] text-cream/40 ml-1">
                              {days === 1 ? "jour" : "jours"}
                            </span>
                            <div className="text-[10px] text-cream/30">avant le départ</div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Extra info pills */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {r.pickup_location && (
                      <span className="text-[11px] text-cream/45 bg-white/[0.04] border border-white/[0.07] px-2.5 py-1 rounded-full">
                        📍 {r.pickup_location}
                      </span>
                    )}
                    {r.total_price != null && (
                      <span className="text-[11px] font-semibold text-gold bg-gold/[0.08] border border-gold/20 px-2.5 py-1 rounded-full">
                        {Number(r.total_price).toLocaleString("fr-FR")} MAD
                      </span>
                    )}
                    {r.deposit_paid && (
                      <span className="text-[11px] text-green-400 bg-green-500/[0.08] border border-green-500/20 px-2.5 py-1 rounded-full">
                        ✓ Acompte payé
                      </span>
                    )}
                  </div>

                  {/* Countdown bar */}
                  {isUpcoming && days >= 0 && days <= 14 && (
                    <div className="mt-3 pt-3 border-t border-white/[0.05]">
                      <div className="flex justify-between text-[10px] text-cream/30 mb-1.5">
                        <span>Aujourd'hui</span>
                        <span>Départ dans {days} jour{days > 1 ? "s" : ""}</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            days <= 3
                              ? "bg-gradient-to-r from-amber-500 to-amber-400"
                              : "bg-gradient-to-r from-gold to-[#f5c518]"
                          }`}
                          style={{ width: `${Math.max(5, Math.min(100, ((14 - days) / 14) * 100))}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
