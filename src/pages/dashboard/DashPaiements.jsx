import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

const S_COLOR = { paid: "#22c55e", pending: "#f59e0b" };
const S_LABEL = { paid: "Versé", pending: "En attente" };

function useBreakpoint(breakpoint = 768) {
  const [isBelow, setIsBelow] = useState(false);
  useEffect(() => {
    const check = () => setIsBelow(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isBelow;
}

export default function DashPaiements() {
  const [payments, setPayments] = useState([]);
  const [iban, setIban] = useState("—");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useBreakpoint(800);
  const isSmallMobile = useBreakpoint(600);

  // ── Fetch: deposit-paid reservations only ───────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: ag } = await supabase
          .from("agencies")
          .select("id, iban, commission")
          .eq("auth_user_id", user.id)
          .maybeSingle();
        if (!ag) return;

        if (ag.iban) setIban(ag.iban);

        const commission = ag.commission ?? 10;

        // Only reservations with a paid deposit are visible
        const { data: rows, error } = await supabase
          .from("reservations")
          .select(
            "id, client_name, date_from, total, deposit_amount, deposit_paid, cash_confirmed, car_id",
          )
          .eq("agency_id", ag.id)
          .eq("deposit_paid", true) // ← filtre principal
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Fetch car names
        const carIds = [
          ...new Set((rows || []).map((r) => r.car_id).filter(Boolean)),
        ];
        let carMap = {};
        if (carIds.length) {
          const { data: cars } = await supabase
            .from("cars")
            .select("id, name")
            .in("id", carIds);
          (cars || []).forEach((c) => {
            carMap[c.id] = c.name;
          });
        }

        const mapped = (rows || []).map((r) => {
          const amount = r.total || 0;
          const comm = Math.round((amount * commission) / 100);
          const net = amount - comm;
          // Paid = completed reservation (cash confirmed); pending otherwise
          const status = r.cash_confirmed ? "paid" : "pending";
          return {
            id: r.id,
            client: r.client_name,
            carName: carMap[r.car_id] || "—",
            date: r.date_from
              ? new Date(r.date_from).toLocaleDateString("fr-FR")
              : "—",
            amount,
            commission: comm,
            net,
            status,
          };
        });

        setPayments(mapped);
      } catch (err) {
        console.error("DashPaiements fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered =
    filter === "all" ? payments : payments.filter((p) => p.status === filter);
  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
  const totalCommission = payments.reduce((s, p) => s + p.commission, 0);
  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.net, 0);
  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + p.net, 0);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col gap-5 md:gap-8 max-w-[1400px] mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-1 md:mb-2">
        <div className="w-9 md:w-12 h-0.5 bg-gold rounded mb-4 md:mb-5" />
        <h1 className="font-playfair text-[clamp(1.5rem,5vw,2.4rem)] font-bold mb-1.5 md:mb-2 tracking-tight leading-tight">
          Paiements
        </h1>
        <p className="text-cream/55 text-[clamp(13px,2vw,16px)] max-w-[600px]">
          Suivi de vos revenus et versements Drivo.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3 md:gap-6">
        {[
          {
            icon: "💰",
            label: "Revenu total brut",
            value: `${totalRevenue.toLocaleString()} €`,
            color: "#f0eeea",
            bg: "rgba(240,238,234,0.1)",
          },
          {
            icon: "📊",
            label: "Commission Drivo (10%)",
            value: `−${totalCommission.toLocaleString()} €`,
            color: "#ef4444",
            bg: "rgba(239,68,68,0.1)",
          },
          {
            icon: "✅",
            label: "Net déjà versé",
            value: `${totalPaid.toLocaleString()} €`,
            color: "#22c55e",
            bg: "rgba(34,197,94,0.1)",
          },
          {
            icon: "⏳",
            label: "Net en attente",
            value: `${totalPending.toLocaleString()} €`,
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.1)",
          },
        ].map((c) => (
          <div
            key={c.label}
            className="bg-dark border border-white/[0.07] rounded-2xl md:rounded-3xl p-5 md:p-7 transition-all cursor-default hover:border-gold/30 hover:-translate-y-0.5"
          >
            <div
              className="text-3xl md:text-[32px] mb-3 md:mb-4 w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center"
              style={{ background: c.bg }}
            >
              {c.icon}
            </div>
            <div
              className="text-2xl md:text-[32px] font-extrabold leading-tight break-words"
              style={{ color: c.color }}
            >
              {c.value}
            </div>
            <div className="text-xs md:text-sm text-cream/60 mt-1.5 md:mt-2 font-medium">
              {c.label}
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/25 rounded-2xl md:rounded-3xl p-5 md:p-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[150px] md:w-[20vw] max-w-[150px] h-[150px] md:h-[20vw] max-h-[150px] bg-[radial-gradient(circle,rgba(212,168,83,0.15)_0%,transparent_70%)] rounded-full translate-x-1/2 -translate-y-1/3" />
        <div className="relative z-10">
          <div className="text-sm md:text-base font-bold text-gold mb-3 md:mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-xl md:text-2xl">💡</span>
            <span>Comment fonctionne le paiement ?</span>
          </div>
          <div className="text-xs md:text-sm text-cream/70 leading-relaxed">
            Le client paie{" "}
            <strong className="text-gold">l'acompte (40%)</strong> à Drivo lors
            de la réservation. Le{" "}
            <strong className="text-gold">solde restant (60%)</strong> est réglé
            par le client directement à votre agence sur place. Drivo vous verse
            votre <strong className="text-gold">part nette</strong> après
            déduction de la commission dans les 7 jours suivant la fin de la
            location.
          </div>
        </div>
      </div>

      {/* Filter */}
      <div
        className={`flex gap-2.5 border-b border-white/[0.08] pb-5 ${
          isSmallMobile ? "flex-col" : "flex-row"
        }`}
      >
        {isSmallMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="py-3 px-4 rounded-full border border-gold/30 bg-gold/10 text-gold font-sora text-sm font-semibold cursor-pointer flex items-center justify-between w-full"
          >
            <span>Filtrer par statut</span>
            <span className="text-lg">{isMobileMenuOpen ? "▲" : "▼"}</span>
          </button>
        )}
        <div
          className={`flex gap-2.5 w-full ${isSmallMobile && !isMobileMenuOpen ? "hidden" : "flex"} ${
            isSmallMobile ? "flex-col" : "flex-row"
          }`}
        >
          {[
            ["all", "Tous", payments.length],
            [
              "paid",
              "Versés",
              payments.filter((p) => p.status === "paid").length,
            ],
            [
              "pending",
              "En attente",
              payments.filter((p) => p.status === "pending").length,
            ],
          ].map(([val, label, count]) => (
            <button
              key={val}
              onClick={() => {
                setFilter(val);
                if (isSmallMobile) setIsMobileMenuOpen(false);
              }}
              className={`py-2.5 md:py-2.5 px-4 md:px-5 rounded-full font-sora font-semibold cursor-pointer flex items-center gap-2 transition-all ${
                filter === val
                  ? "border border-gold bg-gold/15 text-gold"
                  : "border border-white/10 text-cream/60 hover:bg-white/[0.05] hover:border-white/20"
              } ${isSmallMobile ? "justify-between w-full" : "justify-center"}`}
            >
              {label}
              <span
                className={`py-0.5 px-2 rounded-full text-xs font-bold ${
                  filter === val
                    ? "bg-gold text-[#0a0a0f]"
                    : "bg-white/10 text-cream/60"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Transactions table */}
      <div className="bg-dark border border-white/[0.07] rounded-2xl md:rounded-3xl overflow-hidden shadow-lg">
        {!isMobile ? (
          <>
            <div className="grid grid-cols-[1.2fr_1fr_100px_100px_100px_120px] gap-4 py-4 px-6 border-b border-white/[0.08] text-xs font-bold text-cream/45 uppercase tracking-wider bg-black/20">
              <span>Client</span>
              <span>Voiture</span>
              <span className="text-right">Brut</span>
              <span className="text-right">Commission</span>
              <span className="text-right">Net</span>
              <span className="text-right">Statut</span>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-[1.2fr_1fr_100px_100px_100px_120px] gap-4 py-5 px-6 border-b border-white/[0.04] items-center transition-colors cursor-default hover:bg-gold/5"
                >
                  <div>
                    <div className="font-semibold text-sm">{p.client}</div>
                    <div className="text-xs text-cream/45 mt-1">{p.date}</div>
                  </div>
                  <div className="text-sm text-cream/80 font-medium">
                    {p.carName}
                  </div>
                  <div className="text-right font-semibold text-[15px]">
                    {p.amount} €
                  </div>
                  <div className="text-right text-sm text-red-500 font-medium">
                    −{p.commission} €
                  </div>
                  <div className="text-right font-bold text-gold text-base">
                    {p.net} €
                  </div>
                  <div className="text-right">
                    <span
                      className="text-xs font-semibold py-1.5 px-3.5 rounded-full whitespace-nowrap"
                      style={{
                        color: S_COLOR[p.status],
                        background: `${S_COLOR[p.status]}15`,
                      }}
                    >
                      {S_LABEL[p.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[1.2fr_1fr_100px_100px_100px_120px] gap-4 py-5 px-6 border-t border-gold/20 bg-gold/10 items-center">
              <div className="font-bold text-sm col-span-2 text-gold uppercase tracking-wider">
                Total ({filtered.length} transaction
                {filtered.length > 1 ? "s" : ""})
              </div>
              <div className="text-right font-bold text-base">
                {filtered.reduce((s, p) => s + p.amount, 0)} €
              </div>
              <div className="text-right font-bold text-red-500 text-base">
                −{filtered.reduce((s, p) => s + p.commission, 0)} €
              </div>
              <div className="text-right font-extrabold text-gold text-lg">
                {filtered.reduce((s, p) => s + p.net, 0)} €
              </div>
              <div />
            </div>
          </>
        ) : (
          <div className="p-4">
            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-base">{p.client}</div>
                      <div className="text-xs text-cream/45 mt-0.5">
                        {p.date}
                      </div>
                    </div>
                    <span
                      className="text-[11px] font-semibold py-1 px-3 rounded-full"
                      style={{
                        color: S_COLOR[p.status],
                        background: `${S_COLOR[p.status]}15`,
                      }}
                    >
                      {S_LABEL[p.status]}
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm text-cream/80 mb-1">
                      {p.carName}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 bg-black/30 rounded-xl p-3">
                    <div>
                      <div className="text-[10px] text-cream/40">Brut</div>
                      <div className="font-bold text-sm">{p.amount} €</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-cream/40">
                        Commission
                      </div>
                      <div className="font-bold text-sm text-red-500">
                        −{p.commission} €
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-cream/40">Net</div>
                      <div className="font-extrabold text-base text-gold">
                        {p.net} €
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 bg-gold/10 rounded-2xl border border-gold/20">
              <div className="font-bold text-[13px] text-gold mb-3 uppercase">
                Total ({filtered.length} transaction
                {filtered.length > 1 ? "s" : ""})
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[11px] text-cream/50">Brut</div>
                  <div className="font-bold text-[15px]">
                    {filtered.reduce((s, p) => s + p.amount, 0)} €
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-cream/50">Commission</div>
                  <div className="font-bold text-[15px] text-red-500">
                    −{filtered.reduce((s, p) => s + p.commission, 0)} €
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-cream/50">Net</div>
                  <div className="font-extrabold text-lg text-gold">
                    {filtered.reduce((s, p) => s + p.net, 0)} €
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div
            className={`text-center text-cream/40 ${
              isSmallMobile
                ? "py-10 px-5 text-sm"
                : "py-[60px] px-10 text-[15px]"
            }`}
          >
            Aucun paiement trouvé pour ce filtre
          </div>
        )}
      </div>

      {/* IBAN info */}
      <div className="bg-dark border border-white/[0.07] rounded-2xl md:rounded-3xl p-5 md:p-7">
        <div className="font-bold mb-3 md:mb-4 text-sm md:text-base flex items-center gap-2 flex-wrap">
          <span className="text-xl md:text-2xl">🏦</span>
          <span>Vos coordonnées bancaires</span>
        </div>
        <div className="font-mono text-sm md:text-lg text-gold tracking-wide mb-3 md:mb-4 py-3 md:py-4 px-3 md:px-4 bg-gold/10 rounded-xl md:rounded-2xl border border-gold/20 break-all">
          {iban}
        </div>
        <div className="text-xs md:text-[13px] text-cream/50 leading-relaxed">
          Les versements sont effectués sous 7 jours ouvrés après la fin de
          chaque location. Pour modifier votre IBAN, contactez le support Drivo.
        </div>
      </div>
    </div>
  );
}
