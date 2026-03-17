import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useClientAuthContext as useClientAuth } from "../../hooks/ClientAuthContext";

function CancelModal({ reservation, onClose, onConfirmed }) {
  const [cancelling, setCancelling] = useState(false);
  const carName = reservation.cars
    ? `${reservation.cars.brand ? reservation.cars.brand + " " : ""}${reservation.cars.name}`
    : "ce véhicule";

  const handleConfirm = async () => {
    setCancelling(true);
    const { error } = await supabase
      .from("reservations")
      .update({ status: "cancelled" })
      .eq("id", reservation.id);
    setCancelling(false);
    if (!error) onConfirmed(reservation.id);
    else alert("Erreur lors de l'annulation. Veuillez réessayer.");
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0f0e1a] border border-white/[0.1] rounded-2xl p-6 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <h3 className="font-playfair text-lg font-bold text-cream">Annuler la réservation</h3>
            <p className="text-[12px] text-cream/45 mt-0.5">{carName}</p>
          </div>
        </div>

        {/* Cancellation policy */}
        <div className="bg-amber-500/[0.07] border border-amber-500/20 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-400 text-sm">⚠️</span>
            <span className="text-[12px] font-bold text-amber-400 uppercase tracking-wider">Politique d'annulation</span>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-[12px] text-amber-300/80">
              <span className="shrink-0 mt-0.5">•</span>
              <span>L'acompte versé <strong className="text-amber-300">n'est pas remboursable</strong> en cas d'annulation.</span>
            </li>
            <li className="flex items-start gap-2 text-[12px] text-amber-300/80">
              <span className="shrink-0 mt-0.5">•</span>
              <span>En cas de force majeure documentée, un <strong className="text-amber-300">avoir</strong> peut être accordé.</span>
            </li>
            <li className="flex items-start gap-2 text-[12px] text-amber-300/80">
              <span className="shrink-0 mt-0.5">•</span>
              <span>Les modifications de dates sont possibles <strong className="text-amber-300">sous conditions</strong>.</span>
            </li>
          </ul>
          <Link
            to="/info/paiement-securise"
            className="inline-flex items-center gap-1 mt-3 text-[11px] text-gold no-underline hover:underline"
            onClick={onClose}
          >
            Lire les conditions complètes →
          </Link>
        </div>

        <p className="text-[13px] text-cream/60 mb-6">
          Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/[0.1] text-[13px] text-cream/60 hover:text-cream transition-colors bg-transparent cursor-pointer"
          >
            Garder
          </button>
          <button
            onClick={handleConfirm}
            disabled={cancelling}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[13px] font-semibold border border-red-500 transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelling ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Annulation…
              </span>
            ) : "Confirmer l'annulation"}
          </button>
        </div>
      </div>
    </div>
  );
}

function daysUntil(dateStr) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function diffDays(start, end) {
  return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
}

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const STATUS_MAP = {
  confirmed: {
    label: "Confirmée",
    cls: "bg-green-500/15 text-green-400 border-green-500/30",
  },
  pending: {
    label: "En attente",
    cls: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  active: {
    label: "En cours",
    cls: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  completed: {
    label: "Terminée",
    cls: "bg-white/[0.06] text-cream/40 border-white/[0.08]",
  },
  cancelled: {
    label: "Annulée",
    cls: "bg-red-500/15 text-red-400 border-red-500/30",
  },
};

const FILTERS = [
  { key: "all", label: "Toutes" },
  { key: "upcoming", label: "À venir" },
  { key: "active", label: "En cours" },
  { key: "completed", label: "Terminées" },
];

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80";

export default function ClientReservations() {
  const { client } = useClientAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => {
    if (!client?.id) return;
    supabase
      .from("reservations")
      .select(
        "*, cars(name, brand, img, imgs, category, fuel, seats, transmission, mileage, year, price, price_week, price_month, deposit_amount, gps, babyseat, min_age, description)",
      )
      .eq("customer_id", client.id)
      .order("date_from", { ascending: false })
      .then(({ data }) => {
        setReservations(data ?? []);
        setLoading(false);
      });
  }, [client?.id]);

  const count = (key) =>
    reservations.filter((r) => {
      if (key === "upcoming")
        return ["confirmed", "pending"].includes(r.status);
      if (key === "active") return r.status === "active";
      if (key === "completed") return r.status === "completed";
      return false;
    }).length;

  const filtered = reservations.filter((r) => {
    if (filter === "upcoming")
      return ["confirmed", "pending"].includes(r.status);
    if (filter === "active") return r.status === "active";
    if (filter === "completed") return r.status === "completed";
    return true;
  });

  const handleCancelled = (id) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r)),
    );
    setCancelTarget(null);
  };

  return (
    <div className="space-y-5 max-w-3xl">
      {cancelTarget && (
        <CancelModal
          reservation={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirmed={handleCancelled}
        />
      )}
      <div>
        <h1 className="font-playfair text-2xl font-bold mb-1">
          Mes réservations
        </h1>
        <p className="text-cream/45 text-sm">
          Historique complet de vos locations.
        </p>
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
            {key !== "all" && (
              <span className="ml-1.5 opacity-70">({count(key)})</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-56 bg-white/[0.03] rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🚗</div>
          <p className="text-cream/50 text-sm mb-5">
            Aucune réservation dans cette catégorie.
          </p>
          <Link
            to="/cars"
            className="btn-primary py-2.5 px-6 text-xs inline-block"
          >
            Explorer les véhicules
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r, i) => {
            const days = daysUntil(r.date_from);
            const duration = diffDays(r.date_from, r.date_to);
            const isUpcoming =
              days >= 0 && ["confirmed", "pending"].includes(r.status);
            const s = STATUS_MAP[r.status] ?? STATUS_MAP.pending;
            const carImg = r.cars?.img || FALLBACK_IMG;
            const carName = r.cars
              ? `${r.cars.brand ? r.cars.brand + " " : ""}${r.cars.name}`
              : "Véhicule";

            return (
              <div
                key={r.id ?? i}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isUpcoming && days <= 3
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
                    onError={(e) => {
                      e.target.src = FALLBACK_IMG;
                    }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/40 to-transparent" />

                  {/* Status badge top-right — hidden for cancelled (shown below instead) */}
                  {r.status !== "cancelled" && (
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${s.cls}`}
                      >
                        {s.label}
                      </span>
                    </div>
                  )}

                  {/* Category top-left */}
                  {r.cars?.category && (
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-black/40 border border-white/[0.15] text-cream/70 backdrop-blur-sm">
                        {r.cars.category}
                      </span>
                    </div>
                  )}

                  {/* Car name + year over image */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="font-playfair text-xl font-bold text-white leading-tight">
                      {carName}
                    </div>
                    {r.cars?.year && (
                      <div className="text-[11px] text-cream/50 mt-0.5">
                        {r.cars.year}
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
                        <div className="text-[10px] text-cream/35 uppercase tracking-widest mb-0.5">
                          Départ
                        </div>
                        <div className="font-semibold text-cream/90">
                          {fmt(r.date_from)}
                        </div>
                        {r.time_from && (
                          <div className="text-[11px] text-gold/80 mt-0.5">
                            ⏱ {r.time_from}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-cream/25">
                        <div className="w-8 h-px bg-cream/20" />
                        <span className="text-[10px] text-cream/40 font-semibold">
                          {duration}j
                        </span>
                        <div className="w-8 h-px bg-cream/20" />
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-cream/35 uppercase tracking-widest mb-0.5">
                          Retour
                        </div>
                        <div className="font-semibold text-cream/90">
                          {fmt(r.date_to)}
                        </div>
                        {r.time_to && (
                          <div className="text-[11px] text-cream/45 mt-0.5">
                            ⏱ {r.time_to}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Countdown */}
                    {isUpcoming && days >= 0 && (
                      <div className="text-right shrink-0">
                        {days === 0 ? (
                          <span className="text-green-400 font-bold text-sm">
                            Aujourd'hui !
                          </span>
                        ) : (
                          <>
                            <span
                              className={`font-playfair text-3xl font-bold ${days <= 3 ? "text-amber-400" : "text-gold"}`}
                            >
                              {days}
                            </span>
                            <span className="text-[11px] text-cream/40 ml-1">
                              {days === 1 ? "jour" : "jours"}
                            </span>
                            <div className="text-[10px] text-cream/30">
                              avant le départ
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Vehicle specs */}
                  {r.cars &&
                    (() => {
                      const specs = [
                        { icon: "⛽", label: "Carburant", val: r.cars.fuel },
                        {
                          icon: "👤",
                          label: "Places",
                          val: r.cars.seats ? `${r.cars.seats} places` : null,
                        },
                        {
                          icon: "⚙️",
                          label: "Boîte",
                          val: r.cars.transmission,
                        },
                        {
                          icon: "🛣️",
                          label: "Kilométrage",
                          val: r.cars.mileage,
                        },
                        { icon: "📅", label: "Année", val: r.cars.year },
                        {
                          icon: "🔞",
                          label: "Âge min.",
                          val: r.cars.min_age ? `${r.cars.min_age} ans` : null,
                        },
                      ].filter((s) => s.val);
                      const extras = [
                        r.cars.gps && "GPS",
                        r.cars.babyseat && "Siège bébé",
                      ].filter(Boolean);
                      return (
                        <>
                          {specs.length > 0 && (
                            <div className="grid grid-cols-3 gap-1.5 mb-3">
                              {specs.map((s) => (
                                <div
                                  key={s.label}
                                  className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-2.5 py-2 text-center"
                                >
                                  <div className="text-[11px] text-cream/35 mb-0.5">
                                    {s.icon}
                                  </div>
                                  <div className="text-[11px] font-semibold text-cream/80 leading-tight">
                                    {s.val}
                                  </div>
                                  <div className="text-[9px] text-cream/30 mt-0.5 uppercase tracking-wide">
                                    {s.label}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {(extras.length > 0 || r.cars.deposit_amount) && (
                            <div className="flex gap-2 flex-wrap mb-3">
                              {extras.map((e) => (
                                <span
                                  key={e}
                                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300"
                                >
                                  ✓ {e}
                                </span>
                              ))}
                              {r.cars.deposit_amount > 0 && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-cream/45">
                                  Caution :{" "}
                                  {Number(r.cars.deposit_amount).toLocaleString(
                                    "fr-FR",
                                  )}{" "}
                                  €
                                </span>
                              )}
                            </div>
                          )}
                          {r.cars.description && (
                            <p className="text-[11px] text-cream/35 leading-relaxed mb-3 line-clamp-2">
                              {r.cars.description}
                            </p>
                          )}
                        </>
                      );
                    })()}

                  {/* Extra info pills + cancelled badge bottom-right */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {r.city && (
                        <span className="text-[11px] text-cream/45 bg-white/[0.04] border border-white/[0.07] px-2.5 py-1 rounded-full">
                          📍 {r.city}
                        </span>
                      )}
                      {r.total != null && (
                        <span className="text-[11px] font-semibold text-gold bg-gold/[0.08] border border-gold/20 px-2.5 py-1 rounded-full">
                          {Number(r.total).toLocaleString("fr-FR")} €
                        </span>
                      )}
                      {r.deposit_paid && (
                        <span className="text-[11px] text-green-400 bg-green-500/[0.08] border border-green-500/20 px-2.5 py-1 rounded-full">
                          ✓ Acompte payé
                        </span>
                      )}
                    </div>
                    {r.status === "cancelled" ? (
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-red-600 text-white border border-red-500 shrink-0">
                        ✕ Annulée
                      </span>
                    ) : ["confirmed", "pending"].includes(r.status) ? (
                      <button
                        onClick={() => setCancelTarget(r)}
                        className="text-[11px] font-semibold px-3 py-1 rounded-full bg-transparent border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                      >
                        Annuler
                      </button>
                    ) : null}
                  </div>

                  {/* Countdown bar */}
                  {isUpcoming && days >= 0 && days <= 14 && (
                    <div className="mt-3 pt-3 border-t border-white/[0.05]">
                      <div className="flex justify-between text-[10px] text-cream/30 mb-1.5">
                        <span>Aujourd'hui</span>
                        <span>
                          Départ dans {days} jour{days > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            days <= 3
                              ? "bg-gradient-to-r from-amber-500 to-amber-400"
                              : "bg-gradient-to-r from-gold to-[#f5c518]"
                          }`}
                          style={{
                            width: `${Math.max(5, Math.min(100, ((14 - days) / 14) * 100))}%`,
                          }}
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
