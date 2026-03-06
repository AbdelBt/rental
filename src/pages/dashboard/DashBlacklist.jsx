import { useState } from "react";
import { blacklist as initialList } from "../../data/dashboardData";

const SEV_COLOR = { high: "#ef4444", medium: "#f59e0b", low: "#6366f1" };
const SEV_LABEL = { high: "🔴 Grave", medium: "🟡 Modéré", low: "🔵 Mineur" };
const EMPTY = {
  name: "",
  email: "",
  phone: "",
  city: "",
  reason: "",
  severity: "medium",
};

export default function DashBlacklist() {
  const [list, setList] = useState(initialList);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState("");
  const [delId, setDelId] = useState(null);
  const [saved, setSaved] = useState(false);

  const filtered = list.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search) ||
      (b.email || "").toLowerCase().includes(search.toLowerCase()),
  );

  const addToList = () => {
    if (!form.name || !form.reason) return;
    setList((prev) => [
      ...prev,
      {
        ...form,
        id: `b${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        sharedBy: "AutoMaroc Premium",
        reportedBy: "1 agence",
      },
    ]);
    setForm(EMPTY);
    setModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const removeFromList = () => {
    setList((prev) => prev.filter((b) => b.id !== delId));
    setDelId(null);
  };

  const inp = (label, key, opts = {}) => (
    <div>
      <label className="text-[11px] font-bold text-gold tracking-[0.12em] uppercase block mb-1.5">
        {label}
      </label>
      {opts.select ? (
        <select
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="w-full bg-white/[0.04] border border-white/10 text-cream py-2 px-3 rounded-lg font-sora text-[13px] outline-none box-border"
        >
          {opts.options.map((o) => (
            <option key={o} value={o} className="bg-dark">
              {o}
            </option>
          ))}
        </select>
      ) : opts.textarea ? (
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

      {/* Info banner */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-[14px] py-4 px-5 flex gap-3 items-start">
        <span className="text-xl shrink-0">🛡️</span>
        <div className="text-[13px] text-cream/65 leading-relaxed">
          La blacklist est{" "}
          <strong className="text-cream">partagée entre toutes les agences Drivo</strong>
          . Lorsque vous signalez un client, toutes les agences partenaires
          peuvent le voir. Cela permet de protéger l'ensemble du réseau contre
          les mauvais locataires.
        </div>
      </div>

      {saved && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-[10px] py-3 px-4 text-green-500 text-[13px] font-semibold">
          ✅ Client signalé avec succès. Toutes les agences Drivo ont été
          notifiées.
        </div>
      )}

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍  Rechercher par nom, téléphone, email…"
        className="w-full bg-white/[0.04] border border-white/10 text-cream py-3 px-4 rounded-lg font-sora text-[13px] outline-none box-border text-sm"
      />

      {/* List */}
      <div className="flex flex-col gap-3">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="bg-dark rounded-[14px] py-4 px-5"
            style={{
              border: `1px solid ${SEV_COLOR[b.severity]}22`,
              borderLeft: `4px solid ${SEV_COLOR[b.severity]}`,
            }}
          >
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <span className="font-bold text-base">{b.name}</span>
                  <span
                    className="text-[11px] font-bold py-0.5 px-2.5 rounded-full"
                    style={{
                      color: SEV_COLOR[b.severity],
                      background: `${SEV_COLOR[b.severity]}18`,
                    }}
                  >
                    {SEV_LABEL[b.severity]}
                  </span>
                  {b.sharedBy !== "AutoMaroc Premium" && (
                    <span className="text-[11px] text-cream/40 bg-white/[0.04] py-0.5 px-2.5 rounded-full">
                      via {b.sharedBy}
                    </span>
                  )}
                </div>
                <div className="text-[13px] text-cream/50 mb-2">
                  📞 {b.phone} · 🗓 Signalé le {b.date} · {b.reportedBy}
                </div>
                <div className="text-[13px] text-cream/70 leading-relaxed bg-white/[0.03] rounded-lg py-2.5 px-3">
                  {b.reason}
                </div>
              </div>
              {b.sharedBy === "AutoMaroc Premium" && (
                <button
                  onClick={() => setDelId(b.id)}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 py-2 px-3.5 rounded-lg font-sora text-xs cursor-pointer shrink-0 transition-all hover:bg-red-500/20"
                >
                  Retirer
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-[60px] text-cream/30 text-[15px]">
            <div className="text-4xl mb-3">✅</div>
            Aucun client blacklisté trouvé
          </div>
        )}
      </div>

      {/* Add modal */}
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
            <div className="grid grid-cols-2 gap-3.5">
              {inp("Nom complet", "name", { placeholder: "Prénom Nom" })}
              {inp("Téléphone / WhatsApp", "phone", {
                placeholder: "+32 4xx xx xx xx",
              })}
              {inp("Email", "email", { placeholder: "email@exemple.com" })}
              {inp("Niveau de gravité", "severity", {
                select: true,
                options: Object.keys(SEV_LABEL),
              })}
              <div className="col-span-2">
                {inp("Motif du signalement", "reason", {
                  textarea: true,
                  placeholder:
                    "Décrivez le comportement problématique, les dommages, les incidents…",
                })}
              </div>
            </div>
            <div className="flex gap-2.5 mt-6">
              <button
                onClick={addToList}
                className="flex-1 bg-red-500 text-white border-none py-3.5 rounded-[10px] font-sora font-bold text-sm cursor-pointer"
              >
                Signaler ce client
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

      {/* Remove confirm */}
      {delId && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-5">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() => setDelId(null)}
          />
          <div className="relative bg-dark border border-red-500/30 rounded-2xl p-7 max-w-[380px] w-full text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="font-bold text-lg mb-2">
              Retirer de la blacklist ?
            </h3>
            <p className="text-cream/50 text-sm mb-6">
              Ce client ne sera plus signalé aux autres agences Drivo.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={removeFromList}
                className="flex-1 bg-red-500 text-white border-none py-3 rounded-lg font-sora font-bold cursor-pointer"
              >
                Retirer
              </button>
              <button
                onClick={() => setDelId(null)}
                className="flex-1 bg-transparent border border-white/10 text-cream py-3 rounded-lg font-sora cursor-pointer"
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
