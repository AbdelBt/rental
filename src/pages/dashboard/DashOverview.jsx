import { Link } from "react-router-dom";
import {
  overviewStats,
  reservations,
  agencyCars,
  agency,
} from "../../data/dashboardData";

const S_COLOR = {
  confirmed: "#22c55e",
  pending: "#f59e0b",
  completed: "#6366f1",
  cancelled: "#ef4444",
};
const S_LABEL = {
  confirmed: "Confirmée",
  pending: "En attente",
  completed: "Terminée",
  cancelled: "Annulée",
};

function StatCard({ icon, label, value, sub, trend, color = "#d4a853", link }) {
  const isNegative = trend < 0;
  return (
    <Link to={link || "#"} className="no-underline block">
      <div className="bg-dark border border-white/[0.07] rounded-[20px] p-7 flex flex-col gap-4 transition-all duration-200 cursor-pointer hover:border-gold/30 hover:-translate-y-0.5">
        <div className="flex justify-between items-start">
          <div className="text-[32px] bg-gold/10 w-12 h-12 rounded-[14px] flex items-center justify-center">
            {icon}
          </div>
          {trend !== undefined && (
            <span
              className={`text-[13px] font-semibold px-3 py-1 rounded-full tracking-wide ${
                isNegative
                  ? "text-red-500 bg-red-500/10"
                  : "text-green-500 bg-green-500/10"
              }`}
            >
              {isNegative ? "↓" : "↑"} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <div>
          <div className="text-[32px] font-extrabold leading-tight" style={{ color }}>
            {value}
          </div>
          <div className="text-sm text-cream/60 mt-1.5 font-medium">
            {label}
          </div>
          {sub && (
            <div className="text-xs text-cream/35 mt-1">
              {sub}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function MiniChart({ data }) {
  const max = Math.max(...data.map((d) => d.rev));
  return (
    <div className="flex items-end gap-2 h-[90px] mt-3">
      {data.map((d, i) => {
        const h = Math.round((d.rev / max) * 100);
        const isLast = i === data.length - 1;
        return (
          <div
            key={d.month}
            className="flex-1 flex flex-col items-center gap-2 h-full"
          >
            <div className="flex-1 flex items-end w-full">
              <div
                className="w-full rounded-t-md transition-all duration-500 min-h-[4px] hover:bg-gold"
                style={{
                  height: `${h}%`,
                  background: isLast ? "#d4a853" : "rgba(212,168,83,0.2)",
                }}
              />
            </div>
            <div className="text-[10px] text-cream/45 font-medium">
              {d.month}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function DashOverview() {
  const s = overviewStats;
  const revTrend = Math.round(
    ((s.revenueMonth - s.revenueLastMonth) / s.revenueLastMonth) * 100,
  );
  const resTrend = Math.round(
    ((s.reservationsMonth - s.reservationsLastMonth) /
      s.reservationsLastMonth) *
      100,
  );
  const recent = reservations.slice(0, 5);
  const topCars = [...agencyCars]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="mb-2">
        <div className="w-12 h-0.5 bg-gold rounded mb-5" />
        <h1 className="font-playfair text-[clamp(1.8rem,4vw,2.4rem)] font-bold mb-2 tracking-tight">
          Bonjour, {agency.name} 👋
        </h1>
        <p className="text-cream/55 text-base max-w-[600px]">
          Voici un aperçu de votre activité ce mois-ci.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
        <StatCard
          icon="💰"
          label="Revenus ce mois"
          value={`${s.revenueMonth.toLocaleString()}€`}
          sub={`vs ${s.revenueLastMonth.toLocaleString()}€ le mois dernier`}
          trend={revTrend}
          link="/dashboard/paiements"
        />
        <StatCard
          icon="📅"
          label="Réservations"
          value={s.reservationsMonth}
          sub={`${s.reservationsLastMonth} le mois dernier`}
          trend={resTrend}
          color="#f0eeea"
          link="/dashboard/reservations"
        />
        <StatCard
          icon="🚗"
          label="Voitures actives"
          value={`${s.activeCars} / ${s.totalCars}`}
          sub="1 en maintenance"
          color="#f0eeea"
          link="/dashboard/voitures"
        />
        <StatCard
          icon="⭐"
          label="Note moyenne"
          value={`${s.avgRating}/5`}
          sub={`${agency.totalReviews} avis`}
          color="#d4a853"
          link="/dashboard/profil"
        />
      </div>

      {/* Revenue chart + payouts */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
        {/* Chart */}
        <div className="bg-dark border border-white/[0.07] rounded-3xl p-7">
          <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
            <div>
              <div className="font-bold text-lg">Revenus mensuels</div>
              <div className="text-[13px] text-cream/45 mt-1">
                6 derniers mois
              </div>
            </div>
            <div className="text-[28px] font-extrabold text-gold bg-gold/10 py-2 px-4 rounded-full leading-none">
              {s.revenueMonth.toLocaleString()}€
            </div>
          </div>
          <MiniChart data={s.revenueChart} />
        </div>

        {/* Paiements summary */}
        <div className="bg-dark border border-white/[0.07] rounded-3xl p-7 flex flex-col gap-5">
          <div className="font-bold text-lg flex items-center gap-2">
            <span className="text-2xl">💳</span> Paiements
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-[18px] p-5">
              <div className="text-xs text-green-500 font-bold uppercase tracking-wider mb-2">
                ✓ Reçus
              </div>
              <div className="text-[28px] font-extrabold text-green-500">
                {s.completedPayouts.toLocaleString()}€
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-[18px] p-5">
              <div className="text-xs text-amber-500 font-bold uppercase tracking-wider mb-2">
                ⏳ En attente
              </div>
              <div className="text-[28px] font-extrabold text-amber-500">
                {s.pendingPayouts.toLocaleString()}€
              </div>
            </div>
          </div>
          <Link
            to="/dashboard/paiements"
            className="text-center text-sm text-gold no-underline font-semibold py-3 px-3 rounded-xl bg-gold/10 border border-gold/20 transition-all mt-2 hover:bg-gold/15 hover:border-gold"
          >
            Voir détails →
          </Link>
        </div>
      </div>

      {/* Recent reservations */}
      <div className="bg-dark border border-white/[0.07] rounded-3xl p-7">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="font-bold text-lg">Réservations récentes</div>
          <Link
            to="/dashboard/reservations"
            className="text-sm text-gold no-underline font-semibold py-2 px-4 rounded-full bg-gold/10 transition-colors hover:bg-gold/15"
          >
            Voir tout →
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {recent.map((r) => (
            <Link
              key={r.id}
              to="/dashboard/reservations"
              className="no-underline"
            >
              <div className="flex justify-between items-center py-4 px-5 bg-white/[0.02] rounded-2xl gap-4 flex-wrap transition-all border border-white/[0.03] hover:bg-white/[0.05] hover:border-gold/20">
                <div className="flex gap-4 items-center">
                  <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-gold to-[#b38d3f] flex items-center justify-center text-[15px] font-extrabold text-[#0a0a0f] shrink-0">
                    {r.client
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-[15px] text-cream">
                      {r.client}
                    </div>
                    <div className="text-[13px] text-cream/50 mt-1">
                      {r.carName} · {r.from} → {r.to}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-extrabold text-gold text-base">
                    {r.total}€
                  </div>
                  <span
                    className="text-xs font-semibold py-1.5 px-3.5 rounded-full tracking-wide"
                    style={{
                      color: S_COLOR[r.status],
                      background: `${S_COLOR[r.status]}15`,
                    }}
                  >
                    {S_LABEL[r.status]}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Top cars */}
      <div className="bg-dark border border-white/[0.07] rounded-3xl p-7">
        <div className="font-bold text-lg mb-6 flex items-center gap-2">
          <span className="text-2xl">🏆</span> Meilleures performances
        </div>
        <div className="flex flex-col gap-4">
          {topCars.map((c, i) => {
            const maxRev = topCars[0].revenue;
            return (
              <Link
                key={c.id}
                to="/dashboard/voitures"
                className="no-underline"
              >
                <div
                  className={`flex items-center gap-4 p-3 rounded-2xl transition-colors hover:bg-gold/10 ${
                    i === 0 ? "bg-gold/5" : ""
                  }`}
                >
                  <div
                    className={`font-extrabold text-xl w-9 shrink-0 text-center ${
                      i === 0 ? "text-gold" : "text-cream/25"
                    }`}
                  >
                    #{i + 1}
                  </div>
                  <img
                    src={c.img}
                    alt={c.name}
                    className="w-16 h-11 object-cover rounded-xl shrink-0 border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[15px] text-cream whitespace-nowrap overflow-hidden text-ellipsis mb-2">
                      {c.name}
                    </div>
                    <div className="h-2 bg-white/[0.06] rounded overflow-hidden">
                      <div
                        className="h-full rounded transition-[width] duration-700"
                        style={{
                          width: `${Math.round((c.revenue / maxRev) * 100)}%`,
                          background: i === 0 ? "#d4a853" : "rgba(212,168,83,0.5)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="font-extrabold text-gold shrink-0 text-base bg-gold/10 py-1.5 px-3.5 rounded-full">
                    {c.revenue.toLocaleString()}€
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
