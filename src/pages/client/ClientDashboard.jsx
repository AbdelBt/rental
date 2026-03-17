import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useClientAuth } from "../../hooks/useClientAuth";

function daysUntil(dateStr) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr); target.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function CountdownBadge({ days }) {
  if (days < 0)   return <span className="text-cream/40 text-xs">Terminée</span>;
  if (days === 0) return <span className="text-green-400 font-bold text-xs">Aujourd'hui !</span>;
  if (days <= 3)  return <span className="text-amber-400 font-bold text-xs">Dans {days} jour{days > 1 ? "s" : ""}</span>;
  return <span className="text-cream/60 text-xs">Dans {days} jours</span>;
}

function StatusBadge({ status }) {
  const map = {
    confirmed: { label: "Confirmée",  cls: "bg-green-500/15 text-green-400 border-green-500/30" },
    pending:   { label: "En attente", cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
    active:    { label: "En cours",   cls: "bg-blue-500/15 text-blue-400 border-blue-500/30"   },
    completed: { label: "Terminée",   cls: "bg-white/[0.06] text-cream/40 border-white/[0.08]" },
    cancelled: { label: "Annulée",    cls: "bg-red-500/15 text-red-400 border-red-500/30"       },
  };
  const s = map[status] ?? map.pending;
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${s.cls}`}>{s.label}</span>;
}

export default function ClientDashboard() {
  const { client } = useClientAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client?.id) return;
    supabase
      .from("reservations")
      .select("*, cars(name, brand, img, category)")
      .eq("customer_id", client.id)
      .order("start_date", { ascending: true })
      .then(({ data }) => {
        setReservations(data ?? []);
        setLoading(false);
      });
  }, [client?.id]);

  const upcoming = reservations.filter((r) =>
    ["confirmed", "pending", "active"].includes(r.status)
  );
  const next = upcoming[0] ?? null;
  const nextDays = next ? daysUntil(next.start_date) : null;

  const stats = [
    { label: "Total",     value: reservations.length,                                       sub: "toutes périodes"         },
    { label: "À venir",  value: upcoming.length,                                            sub: "confirmées / en attente" },
    { label: "Terminées",value: reservations.filter((r) => r.status === "completed").length, sub: "locations passées"       },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Welcome */}
      <div>
        <h1 className="font-playfair text-2xl md:text-3xl font-bold mb-1">
          Bonjour{client?.first_name ? `, ${client.first_name}` : ""} 👋
        </h1>
        <p className="text-cream/45 text-sm">Voici un aperçu de vos réservations.</p>
      </div>

      {/* Next reservation */}
      {loading ? (
        <div className="h-32 bg-white/[0.03] rounded-2xl animate-pulse" />
      ) : next ? (
        <div className="bg-gradient-to-br from-[#1a1830] to-[#0f0e1a] border border-gold/20 rounded-2xl p-5 md:p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gold/80 mb-1">
                Prochaine réservation
              </div>
              <div className="font-playfair text-xl font-bold mb-1">
                {next.car_name ?? next.vehicle ?? "Véhicule"}
              </div>
              <div className="text-cream/55 text-sm">
                {new Date(next.start_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                {" → "}
                {new Date(next.end_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              {next.pickup_location && (
                <div className="text-cream/40 text-xs mt-1">📍 {next.pickup_location}</div>
              )}
            </div>

            <div className="text-right">
              <StatusBadge status={next.status} />
              {nextDays !== null && nextDays >= 0 && (
                <div className="mt-3">
                  <div className={`font-playfair text-4xl font-bold ${nextDays <= 3 ? "text-amber-400" : "text-gold"}`}>
                    {nextDays === 0 ? "Auj." : nextDays}
                  </div>
                  <div className="text-[11px] text-cream/45 mt-0.5">
                    {nextDays === 0 ? "C'est aujourd'hui !" : nextDays === 1 ? "jour restant" : "jours restants"}
                  </div>
                </div>
              )}
            </div>
          </div>

          {nextDays !== null && nextDays >= 0 && nextDays <= 30 && (
            <div className="mt-5">
              <div className="flex justify-between text-[11px] text-cream/35 mb-1.5">
                <span>Aujourd'hui</span><span>J-{nextDays}</span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold to-[#f5c518] rounded-full transition-all"
                  style={{ width: `${Math.max(0, Math.min(100, ((30 - nextDays) / 30) * 100))}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 text-center">
          <div className="text-3xl mb-3">🚗</div>
          <p className="text-cream/50 text-sm mb-4">Aucune réservation à venir.</p>
          <Link to="/cars" className="btn-primary py-2.5 px-5 text-xs inline-block">
            Explorer les véhicules
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className="font-playfair text-2xl font-bold text-gold">{s.value}</div>
            <div className="text-[12px] font-semibold text-cream/70 mt-0.5">{s.label}</div>
            <div className="text-[11px] text-cream/35">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent reservations */}
      {!loading && reservations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[15px]">Réservations récentes</h2>
            <Link to="/client/reservations" className="text-xs text-gold hover:text-cream/90 transition-colors">
              Voir tout →
            </Link>
          </div>
          <div className="space-y-2">
            {reservations.slice(0, 3).map((r, i) => {
              const d = daysUntil(r.start_date);
              return (
                <div
                  key={r.id ?? i}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center text-sm shrink-0">
                      🚗
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-[13px] truncate">{r.cars?.name ?? "Véhicule"}</div>
                      <div className="text-[11px] text-cream/40">
                        {new Date(r.start_date).toLocaleDateString("fr-FR")} → {new Date(r.end_date).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <CountdownBadge days={d} />
                    <StatusBadge status={r.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
