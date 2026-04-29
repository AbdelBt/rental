import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useClientAuth } from "../../hooks/ClientAuthContext";

function Field({ label, value, type = "text", onChange, editable }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-cream/55 tracking-[0.15em] uppercase mb-1.5">
        {label}
      </label>
      {editable ? (
        <input
          type={type}
          className="input-field"
          value={value}
          onChange={onChange}
        />
      ) : (
        <div className="input-field text-cream/70 cursor-default select-text">
          {value || "—"}
        </div>
      )}
    </div>
  );
}

const DOCS = [
  {
    label: "Permis de conduire",
    key: "license",
    verifiedKey: "license_verified",
  },
  {
    label: "Carte d'identité — face avant",
    key: "id_front",
    verifiedKey: "id_front_verified",
  },
  {
    label: "Carte d'identité — face arrière",
    key: "id_back",
    verifiedKey: "id_back_verified",
  },
];

function DocRow({
  label,
  docKey,
  verifiedKey,
  authId,
  customerId,
  customer,
  onUploaded,
}) {
  const verified = customer?.[verifiedKey];
  const uploaded = customer?.[`${docKey}_uploaded`] || verified;
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !authId) return;
    setErr(null);
    setUploading(true);
    try {
      // Upload file to storage
      const { error: upErr } = await supabase.storage
        .from("customer-documents")
        .upload(`${authId}/${docKey}`, file, { upsert: true });
      if (upErr) throw upErr;

      // Auto-confirm: mark as verified immediately in customers table
      if (customerId) {
        await supabase
          .from("customers")
          .update({ [verifiedKey]: true })
          .eq("id", customerId);
      }

      onUploaded(docKey);
    } catch (e) {
      setErr(e.message ?? "Erreur upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0 gap-3 flex-wrap">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            verified || uploaded
              ? "bg-green-500/10 text-green-400"
              : "bg-white/[0.05] text-cream/30"
          }`}
        >
          {verified || uploaded ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          )}
        </div>
        <div>
          <div className="text-[13px] text-cream/75">{label}</div>
          {err && <div className="text-[11px] text-red-400 mt-0.5">{err}</div>}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
            verified || uploaded
              ? "bg-green-500/15 text-green-400 border-green-500/30"
              : "bg-white/[0.05] text-cream/35 border-white/[0.08]"
          }`}
        >
          {verified || uploaded ? "Confirmé" : "Manquant"}
        </span>

        {!verified && !uploaded && (
          <label
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border cursor-pointer transition-colors ${
              uploading
                ? "border-white/10 text-cream/30 cursor-not-allowed"
                : "border-gold/30 text-gold hover:bg-gold/10"
            }`}
          >
            {uploading ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 border border-gold/30 border-t-gold rounded-full animate-spin inline-block" />
                Upload…
              </span>
            ) : uploaded ? (
              "Remplacer"
            ) : (
              "Envoyer"
            )}
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              disabled={uploading}
              onChange={handleUpload}
            />
          </label>
        )}
      </div>
    </div>
  );
}

export default function ClientProfile() {
  const { client, customer, user, patchCustomer, loading } = useClientAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", ok: false });
  const [uploadedThisSession, setUploadedThisSession] = useState({});

  useEffect(() => {
    if (client) {
      setForm({
        first_name: client.first_name ?? "",
        last_name: client.last_name ?? "",
        phone: client.phone ?? "",
      });
    }
  }, [client]);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    if (!client?.id) return;
    setSaving(true);
    setMessage({ text: "", ok: false });

    const { error } = await supabase
      .from("customers")
      .update({
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
      })
      .eq("id", client.id);

    if (error) {
      setMessage({ text: error.message, ok: false });
    } else {
      // Patch local state instantly — no round-trip needed
      patchCustomer({
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
      });
      setMessage({ text: "Profil mis à jour.", ok: true });
      setEditing(false);
    }
    setSaving(false);
  };

  const handleDocUploaded = (docKey) =>
    setUploadedThisSession((p) => ({
      ...p,
      [docKey]: true,
      [`${docKey}_verified`]: true,
    }));

  // Merge session uploads into customer so DocRow shows "Confirmé" immediately after upload
  const mergedCustomer = customer
    ? {
        ...customer,
        license_uploaded:
          customer.license_uploaded || !!uploadedThisSession.license,
        id_front_uploaded:
          customer.id_front_uploaded || !!uploadedThisSession.id_front,
        id_back_uploaded:
          customer.id_back_uploaded || !!uploadedThisSession.id_back,
        license_verified:
          customer.license_verified || !!uploadedThisSession.license_verified,
        id_front_verified:
          customer.id_front_verified || !!uploadedThisSession.id_front_verified,
        id_back_verified:
          customer.id_back_verified || !!uploadedThisSession.id_back_verified,
      }
    : null;

  const initials = client
    ? `${client.first_name?.[0] ?? ""}${client.last_name?.[0] ?? ""}`.toUpperCase()
    : "?";

  const allVerified = DOCS.every((d) => customer?.[d.verifiedKey]);
  const missingCount = DOCS.filter(
    (d) => !mergedCustomer?.[`${d.key}_uploaded`],
  ).length;

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl animate-pulse">
        <div className="h-8 w-48 bg-white/[0.05] rounded-lg" />
        <div className="h-24 bg-white/[0.03] border border-white/[0.07] rounded-2xl" />
        <div className="h-52 bg-white/[0.03] border border-white/[0.07] rounded-2xl" />
        <div className="h-40 bg-white/[0.03] border border-white/[0.07] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-playfair text-2xl font-bold mb-1">Mon profil</h1>
        <p className="text-cream/45 text-sm">
          Gérez vos informations personnelles.
        </p>
      </div>

      {/* Avatar card */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5b8de8] to-[#2d5fc4] flex items-center justify-center text-2xl font-extrabold text-white shrink-0">
          {initials}
        </div>
        <div>
          <div className="font-playfair text-xl font-bold">
            {client?.first_name} {client?.last_name}
          </div>
          <div className="text-cream/45 text-sm">{client?.email}</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-[11px] text-cream/30">Client Drivo</div>
            {allVerified && (
              <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                ✓ Vérifié
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Missing docs alert */}
      {missingCount > 0 && (
        <div className="flex items-start gap-3 bg-amber-500/[0.07] border border-amber-500/25 rounded-xl p-4">
          <svg
            className="text-amber-400 shrink-0 mt-0.5"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-[12px] text-amber-300/80">
            {missingCount === 1
              ? "1 document manquant."
              : `${missingCount} documents manquants.`}{" "}
            Envoyez vos pièces pour finaliser votre compte.
          </p>
        </div>
      )}

      {/* Personal info */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-[14px]">
            Informations personnelles
          </h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="text-[12px] text-gold hover:text-cream/90 transition-colors"
            >
              Modifier
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditing(false);
                  setMessage({ text: "", ok: false });
                }}
                className="text-[12px] text-cream/40 hover:text-cream/70 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-[12px] text-gold hover:text-cream/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          )}
        </div>

        {message.text && (
          <div
            className={`p-3 rounded-lg text-[12px] border ${
              message.ok
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {message.ok ? "✓" : "⚠"} {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Prénom"
            value={editing ? form.first_name : (client?.first_name ?? "")}
            editable={editing}
            onChange={update("first_name")}
          />
          <Field
            label="Nom"
            value={editing ? form.last_name : (client?.last_name ?? "")}
            editable={editing}
            onChange={update("last_name")}
          />
          <Field
            label="Email"
            value={client?.email ?? ""}
            editable={false}
            type="email"
          />
          <Field
            label="Téléphone"
            value={editing ? form.phone : (client?.phone ?? "")}
            editable={editing}
            onChange={update("phone")}
          />
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[14px]">Documents</h2>
          <span className="text-[11px] text-cream/35"></span>
        </div>

        <div>
          {DOCS.map((d) => (
            <DocRow
              key={d.key}
              label={d.label}
              docKey={d.key}
              verifiedKey={d.verifiedKey}
              authId={user?.id}
              customerId={client?.id}
              customer={mergedCustomer}
              onUploaded={handleDocUploaded}
            />
          ))}
        </div>

        {Object.keys(uploadedThisSession).length > 0 && (
          <div className="mt-4 p-3 bg-green-500/[0.08] border border-green-500/20 rounded-xl text-[12px] text-green-400">
            ✓ Document(s) confirmé(s) avec succès.
          </div>
        )}
      </div>

      {/* Security */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
        <h2 className="font-semibold text-[14px] mb-4">Sécurité</h2>
        <div className="flex items-center justify-between">
          <div className="text-[13px] text-cream/70">Mot de passe</div>
          <button
            onClick={async () => {
              const { error } = await supabase.auth.resetPasswordForEmail(
                client?.email ?? "",
              );
              if (!error) alert("Email de réinitialisation envoyé !");
            }}
            className="text-[12px] text-gold hover:text-cream/90 transition-colors bg-transparent border-none cursor-pointer"
          >
            Réinitialiser →
          </button>
        </div>
      </div>
    </div>
  );
}
