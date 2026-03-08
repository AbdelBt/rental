import { useState } from "react";

export default function ClientSignup() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [licenseFile, setLicenseFile] = useState(null);
  const [idFrontFile, setIdFrontFile] = useState(null);
  const [idBackFile, setIdBackFile] = useState(null);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setMessage("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (licenseFile) fd.append("license", licenseFile);
      if (idFrontFile) fd.append("id_front", idFrontFile);
      if (idBackFile) fd.append("id_back", idBackFile);

      const res = await fetch("http://localhost:4000/api/customers/register", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Erreur lors de la création du compte.");
      } else {
        setMessage("Compte créé. Vérifie tes emails pour finaliser l'accès.");
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setMessage("Erreur réseau. Réessaie plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-cream flex items-center justify-center px-5">
      <div className="w-full max-w-[520px] bg-[#0b0b13] border border-white/[0.08] rounded-2xl p-6 md:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
        <h1 className="font-playfair text-2xl font-bold mb-1">
          Créer mon compte voyageur
        </h1>
        <p className="text-cream/55 text-sm mb-6">
          Un seul compte pour toutes vos réservations, avec vérification
          d'identité (permis + pièce d'identité).
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-cream/60 tracking-[0.18em] uppercase mb-1.5">
                Prénom
              </label>
              <input
                className="input-field"
                value={form.first_name}
                onChange={update("first_name")}
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-cream/60 tracking-[0.18em] uppercase mb-1.5">
                Nom
              </label>
              <input
                className="input-field"
                value={form.last_name}
                onChange={update("last_name")}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-cream/60 tracking-[0.18em] uppercase mb-1.5">
              Email
            </label>
            <input
              type="email"
              className="input-field"
              value={form.email}
              onChange={update("email")}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-cream/60 tracking-[0.18em] uppercase mb-1.5">
                Téléphone
              </label>
              <input
                className="input-field"
                value={form.phone}
                onChange={update("phone")}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-cream/60 tracking-[0.18em] uppercase mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                className="input-field"
                value={form.password}
                onChange={update("password")}
                required
              />
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.08] mt-2">
            <p className="text-[11px] text-cream/45 mb-2 font-semibold tracking-[0.16em] uppercase">
              Documents à fournir
            </p>
            <div className="space-y-3 text-[12px]">
              <label className="flex flex-col gap-1">
                <span className="text-cream/60">
                  Permis de conduire (photo ou scan)
                </span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                  className="text-[11px]"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-cream/60">
                  Carte d&apos;identité - face avant
                </span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setIdFrontFile(e.target.files?.[0] || null)}
                  className="text-[11px]"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-cream/60">
                  Carte d&apos;identité - face arrière
                </span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setIdBackFile(e.target.files?.[0] || null)}
                  className="text-[11px]"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-[13px] mt-2 disabled:opacity-60"
          >
            {loading ? "Création du compte..." : "Créer mon compte"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-[12px] text-cream/50">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

