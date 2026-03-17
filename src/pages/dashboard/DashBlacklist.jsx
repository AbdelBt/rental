import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

const EMPTY = { name: "", email: "", phone: "", city: "", reason: "" };

const getScore = (b) =>
  b.score ?? 1 + (b.confirms?.length || 0) - (b.denies?.length || 0);

export default function DashBlacklist() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agencyId, setAgencyId] = useState(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);
  const [removed, setRemoved] = useState([]);
  const [voteMsg, setVoteMsg] = useState(null);

  const flash = (msg) => {
    setVoteMsg(msg);
    setTimeout(() => setVoteMsg(null), 3500);
  };

  // ── Charger agence + blacklist ──────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: ag } = await supabase
          .from("agencies")
          .select("id")
          .eq("auth_user_id", user.id)
          .maybeSingle();
        if (ag) setAgencyId(ag.id);

        await loadList();
      } catch (err) {
        console.error("Init blacklist:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const loadList = async () => {
    // Uses the blacklist_with_votes view which aggregates everything
    const { data, error } = await supabase
      .from("blacklist_with_votes")
      .select("*")
      .order("score", { ascending: false });

    if (error) {
      console.error("Load blacklist:", error);
      return;
    }

    // Normaliser le champ votes (array JSON → confirms/denies par agence)
    const normalized = (data || []).map((row) => ({
      ...row,
      confirms: (row.votes || [])
        .filter((v) => v.vote_type === "confirm")
        .map((v) => v.agency_id),
      denies: (row.votes || [])
        .filter((v) => v.vote_type === "deny")
        .map((v) => v.agency_id),
    }));
    setList(normalized);
  };

  // ── Ajouter un signalement ──────────────────────────────────
  const addToList = async () => {
    if (!form.name || !form.reason || !agencyId) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("blacklist_entries").insert([
        {
          name: form.name,
          phone: form.phone,
          email: form.email || null,
          city: form.city || null,
          reason: form.reason,
          reported_by_agency: agencyId,
        },
      ]);
      if (error) throw error;
      await loadList();
      setForm(EMPTY);
      setModal(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      flash(
        "❌ Erreur : " + (err.message || "Impossible d'ajouter le signalement"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Voter (confirm ou deny) ─────────────────────────────────
  const handleVote = async (entryId, voteType) => {
    if (!agencyId) return;

    const entry = list.find((b) => b.id === entryId);
    if (!entry) return;

    // Bloquer le vote sur son propre signalement
    if (entry.reported_by_agency === agencyId) {
      flash("❌ Vous ne pouvez pas voter sur votre propre signalement.");
      return;
    }

    const myCurrentVote = entry.confirms.includes(agencyId)
      ? "confirm"
      : entry.denies.includes(agencyId)
        ? "deny"
        : null;

    try {
      if (myCurrentVote === voteType) {
        // Clicking the same vote → cancel it
        await supabase
          .from("blacklist_votes")
          .delete()
          .eq("entry_id", entryId)
          .eq("agency_id", agencyId);
        flash("↩️ Vote annulé");
      } else {
        // Upsert — update or create the vote
        await supabase.from("blacklist_votes").upsert(
          {
            entry_id: entryId,
            agency_id: agencyId,
            vote_type: voteType,
          },
          { onConflict: "entry_id,agency_id" },
        );

        flash(
          voteType === "confirm"
            ? "✅ Confirmé — score mis à jour"
            : "⬇️ Infirmé — score mis à jour",
        );
      }

      // Reload to reflect the Supabase trigger (auto-delete if score <= 0)
      const prevList = [...list];
      await loadList();

      // Detect entries removed by the trigger
      setList((curr) => {
        const removed = prevList.filter(
          (b) => !curr.find((c) => c.id === b.id),
        );
        if (removed.length) {
          setRemoved((prev) => [...prev, ...removed]);
          flash(
            `🔓 "${removed.map((r) => r.name).join(", ")}" retiré automatiquement — score insuffisant`,
          );
        }
        return curr;
      });
    } catch (err) {
      flash("❌ Erreur vote : " + err.message);
    }
  };

  const myVote = (b) => {
    if (!agencyId) return null;
    if (b.confirms.includes(agencyId)) return "confirm";
    if (b.denies.includes(agencyId)) return "deny";
    return null;
  };

  const filtered = list.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.phone || "").includes(search) ||
      (b.email || "").toLowerCase().includes(search.toLowerCase()),
  );

  const inp = (label, key, opts = {}) => (
    <div>
      <label className="text-[11px] font-bold text-gold tracking-[0.12em] uppercase block mb-1.5">
        {label}
      </label>
      {opts.textarea ? (
        <textarea
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          placeholder={opts.placeholder}
          className="w-full bg-white/[0.04] border border-white/10 text-cream py-2 px-3 rounded-lg font-sora text-[13px] outline-none box-border resize-y min-h-[80px] font-sans"
        />
      ) : (
        <input
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          placeholder={opts.placeholder}
          className="w-full bg-white/[0.04] border border-white/10 text-cream py-2 px-3 rounded-lg font-sora text-[13px] outline-none box-border"
        />
      )}
    </div>
  );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <div className="w-9 h-0.5 bg-gold rounded mb-3" />
          <h1 className="font-playfair text-[clamp(1.5rem,3vw,2rem)] font-bold">
            Blacklist clients
          </h1>
          <p className="text-cream/45 text-sm mt-1">
            {list.length} client{list.length > 1 ? "s" : ""} signalé
            {list.length > 1 ? "s" : ""} · partagé entre toutes les agences
            Drivo
          </p>
        </div>
        <button
          onClick={() => {
            setForm(EMPTY);
            setModal(true);
          }}
          className="bg-red-500 text-white border-none py-2.5 px-5 rounded-lg font-sora font-bold text-[13px] cursor-pointer"
        >
          + Signaler un client
        </button>
      </div>

      {/* Explainer */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-[14px] py-4 px-5 flex gap-3 items-start">
        <span className="text-xl shrink-0">🛡️</span>
        <div className="text-[13px] text-cream/65 leading-relaxed">
          La blacklist est{" "}
          <strong className="text-cream">
            partagée entre toutes les agences Drivo
          </strong>
          . Vous ne pouvez pas supprimer un signalement directement — mais vous
          pouvez <span className="text-green-500 font-semibold">confirmer</span>{" "}
          (vous avez eu le même problème) ou
          <span className="text-amber-400 font-semibold"> infirmer</span> (vous
          avez loué sans problème). Un signalement est{" "}
          <strong className="text-cream">automatiquement retiré</strong> si son
          score tombe à 0 ou moins.
        </div>
      </div>

      {/* Score legend */}
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          {
            icon: "🟢",
            label: "Confirmer",
            sub: "Même problème rencontré",
            color: "text-green-500",
          },
          {
            icon: "🔴",
            label: "Infirmer",
            sub: "Loué sans aucun problème",
            color: "text-amber-400",
          },
          {
            icon: "⚡",
            label: "Auto-retrait",
            sub: "Score ≤ 0 → supprimé automatiquement",
            color: "text-cream/40",
          },
        ].map((c) => (
          <div
            key={c.label}
            className="bg-white/[0.03] border border-white/[0.06] rounded-xl py-3 px-3"
          >
            <div className="text-xl mb-1">{c.icon}</div>
            <div className={`text-xs font-bold ${c.color}`}>{c.label}</div>
            <div className="text-[11px] text-cream/35 mt-0.5">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Toast */}
      {(saved || voteMsg) && (
        <div className="bg-green-500/15 border border-green-500/25 rounded-[10px] py-3 px-4 text-green-400 text-[13px] font-semibold">
          {saved
            ? "✅ Client signalé avec succès. Toutes les agences Drivo ont été notifiées."
            : voteMsg}
        </div>
      )}
      {removed.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-[10px] py-3 px-4 text-amber-400 text-[13px]">
          🔓 {removed.length} signalement{removed.length > 1 ? "s" : ""} retiré
          {removed.length > 1 ? "s" : ""} automatiquement :{" "}
          {removed.map((r) => r.name).join(", ")}
        </div>
      )}

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍  Rechercher par nom, téléphone, email…"
        className="w-full bg-white/[0.04] border border-white/10 text-cream py-3 px-4 rounded-lg font-sora text-[13px] outline-none box-border"
      />

      {/* Table */}
      <div className="bg-dark border border-white/[0.07] rounded-2xl overflow-hidden">
        <div
          className="grid gap-4 py-3 px-5 border-b border-white/[0.08] bg-black/20 text-[11px] font-bold text-cream/40 uppercase tracking-wider"
          style={{ gridTemplateColumns: "2fr 1.2fr 1fr 1.4fr 120px 160px" }}
        >
          <span>Client</span>
          <span>Contact</span>
          <span>Date</span>
          <span>Motif</span>
          <span className="text-center">Score</span>
          <span className="text-center">Voter</span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {filtered.map((b) => {
            const score = getScore(b);
            const myV = myVote(b);
            const isOwner = b.reported_by_agency === agencyId;

            return (
              <div
                key={b.id}
                className="grid gap-4 py-4 px-5 items-center hover:bg-white/[0.025] transition-colors"
                style={{
                  gridTemplateColumns: "2fr 1.2fr 1fr 1.4fr 120px 160px",
                  borderLeft: "3px solid rgba(239,68,68,0.45)",
                }}
              >
                {/* Client */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-cream truncate">
                      {b.name}
                    </span>
                    {isOwner ? (
                      <span className="text-[10px] text-gold/60 bg-gold/[0.07] py-0.5 px-2 rounded-full shrink-0">
                        Votre signalement
                      </span>
                    ) : (
                      <span className="text-[10px] text-cream/35 bg-white/[0.04] py-0.5 px-2 rounded-full shrink-0">
                        via {b.agency_name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact */}
                <div className="min-w-0">
                  <div className="text-xs text-cream/70 truncate">
                    📞 {b.phone}
                  </div>
                  {b.email && (
                    <div className="text-[11px] text-cream/35 truncate mt-0.5">
                      ✉️ {b.email}
                    </div>
                  )}
                </div>

                {/* Date */}
                <div className="text-xs text-cream/50 whitespace-nowrap">
                  🗓 {new Date(b.created_at).toLocaleDateString("fr-FR")}
                </div>

                {/* Motif */}
                <div className="text-xs text-cream/60 leading-relaxed line-clamp-2">
                  {b.reason}
                </div>

                {/* Score */}
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={`text-base font-extrabold tabular-nums ${score > 2 ? "text-green-500" : score > 0 ? "text-amber-400" : "text-red-500"}`}
                  >
                    {score > 0 ? "+" : ""}
                    {score}
                  </span>
                  <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(4, (b.confirm_count / Math.max(1, b.confirm_count + b.deny_count + 1)) * 100))}%`,
                        background:
                          score > 2
                            ? "#22c55e"
                            : score > 0
                              ? "#f59e0b"
                              : "#ef4444",
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-cream/25 whitespace-nowrap">
                    {1 + (b.confirm_count || 0)} pour · {b.deny_count || 0}{" "}
                    contre
                  </span>
                </div>

                {/* Voter */}
                <div className="flex gap-1.5 justify-center">
                  {isOwner ? (
                    <span className="text-[11px] text-cream/25 italic">—</span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleVote(b.id, "confirm")}
                        title="Confirmer — j'ai eu le même problème"
                        className={`flex items-center gap-1 py-1.5 px-2.5 rounded-lg font-sora text-[11px] font-bold cursor-pointer transition-all border ${myV === "confirm" ? "bg-green-500 border-green-500 text-white" : "bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20"}`}
                      >
                        👍{" "}
                        {b.confirm_count > 0 && (
                          <span className="tabular-nums">
                            {b.confirm_count}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => handleVote(b.id, "deny")}
                        title="Infirmer — j'ai loué sans problème"
                        className={`flex items-center gap-1 py-1.5 px-2.5 rounded-lg font-sora text-[11px] font-bold cursor-pointer transition-all border ${myV === "deny" ? "bg-amber-500 border-amber-500 text-[#0a0a0f]" : "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"}`}
                      >
                        👎{" "}
                        {b.deny_count > 0 && (
                          <span className="tabular-nums">{b.deny_count}</span>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-cream/30 text-[15px]">
            <div className="text-4xl mb-3">✅</div>
            Aucun client blacklisté trouvé
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-5">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() => setModal(false)}
          />
          <div className="relative bg-dark border border-white/10 rounded-[20px] w-full max-w-[500px] p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-playfair text-xl font-bold">
                Signaler un client
              </h2>
              <button
                onClick={() => setModal(false)}
                className="bg-transparent border-none text-cream/50 text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg py-3 px-4 mb-5 text-[12px] text-amber-400 leading-relaxed">
              ⚠️ Un signalement <strong>ne peut pas être supprimé</strong>{" "}
              directement. Il sera retiré automatiquement si d'autres agences
              l'infirment et que le score tombe à 0. Signalez de façon
              responsable.
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              {inp("Nom complet", "name", { placeholder: "Prénom Nom" })}
              {inp("Téléphone / WhatsApp", "phone", {
                placeholder: "+32 4xx xx xx xx",
              })}
              {inp("Email", "email", { placeholder: "email@exemple.com" })}
              {inp("Ville", "city", { placeholder: "Casablanca, Tanger…" })}
              <div className="col-span-2">
                {inp("Motif du signalement", "reason", {
                  textarea: true,
                  placeholder:
                    "Décrivez précisément le comportement problématique, les dommages, les incidents…",
                })}
              </div>
            </div>
            <div className="flex gap-2.5 mt-6">
              <button
                onClick={addToList}
                disabled={submitting || !form.name || !form.reason}
                className="flex-1 bg-red-500 text-white border-none py-3.5 rounded-[10px] font-sora font-bold text-sm cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Envoi…" : "Signaler ce client"}
              </button>
              <button
                onClick={() => setModal(false)}
                className="bg-transparent border border-white/10 text-cream/60 py-3.5 px-5 rounded-[10px] font-sora text-sm cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
