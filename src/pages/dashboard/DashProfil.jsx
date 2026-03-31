import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { CitiesMultiSelect } from "../../components/CityAutocomplete";

export default function DashProfil() {
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAgency = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error("Non authentifié");

        const { data: agencyData, error: agencyError } = await supabase
          .from("agencies")
          .select("*")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (agencyError) throw agencyError;

        if (!agencyData) {
          // Auto-create the agency record if it doesn't exist
          const { data: newAgency, error: insertError } = await supabase
            .from("agencies")
            .insert([
              {
                auth_user_id: user.id,
                name: user.email?.split("@")[0] || "Mon agence",
                email: user.email,
                city: "Casablanca",
                phone: "",
                whatsapp: "",
                address: "",
                cities: ["Casablanca"],
                iban: "",
                commission: 10,
                rating: 0,
                total_reviews: 0,
                verified: false,
                member_since: new Date().toISOString().split("T")[0],
              },
            ])
            .select()
            .single();

          if (insertError) throw insertError;
          setAgency(newAgency);
          setForm(newAgency);
        } else {
          setAgency(agencyData);
          setForm(agencyData);
        }
      } catch (err) {
        console.error("Erreur chargement profil:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAgency();
  }, []);

  const save = async () => {
    try {
      if (form.iban && !/^[A-Z]{2}[0-9A-Z]{10,30}$/.test(form.iban)) {
        setError(
          "Format IBAN invalide (exemple: MA64011519000000105000553171)",
        );
        return;
      }

      setError(null);
      const { error: updateError } = await supabase
        .from("agencies")
        .update({
          name: form.name,
          email: form.email,
          phone: form.phone,
          whatsapp: form.whatsapp,
          address: form.address,
          cities: form.cities,
          iban: form.iban,
        })
        .eq("id", agency.id);

      if (updateError) throw updateError;

      setAgency(form);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      setError("Erreur lors de la sauvegarde");
    }
  };

  const cancel = () => {
    setForm(agency);
    setEditing(false);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-[10px] py-4 px-5 text-red-500 text-sm">
        ⚠️ {error}
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-[10px] py-4 px-5 text-orange-500 text-sm">
        Aucune agence trouvée.
      </div>
    );
  }

  const A = editing ? form : agency;

  const inputClasses =
    "w-full bg-white/[0.04] border border-white/10 text-cream py-2.5 px-3.5 rounded-lg font-sora text-[13px] outline-none box-border";
  const labelClasses =
    "text-[11px] font-bold text-gold tracking-[0.12em] uppercase block mb-1.5";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <div className="w-9 h-0.5 bg-gold rounded mb-3" />
          <h1 className="font-playfair text-[clamp(1.5rem,3vw,2rem)] font-bold">
            Profil agence
          </h1>
          <p className="text-cream/45 text-sm mt-1">
            Gérez les informations de votre agence
          </p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="bg-gold/10 border border-gold/30 text-gold py-2.5 px-5 rounded-lg font-sora font-bold text-[13px] cursor-pointer"
          >
            ✏️ Modifier
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={save}
              className="bg-gold text-[#0a0a0f] border-none py-2.5 px-5 rounded-lg font-sora font-bold text-[13px] cursor-pointer"
            >
              ✓ Enregistrer
            </button>
            <button
              onClick={cancel}
              className="bg-transparent border border-white/10 text-cream/60 py-2.5 px-4 rounded-lg font-sora text-[13px] cursor-pointer"
            >
              Annuler
            </button>
          </div>
        )}
      </div>

      {saved && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-[10px] py-3 px-4 text-green-500 text-[13px] font-semibold">
          ✅ Profil mis à jour avec succès.
        </div>
      )}

      {/* Agency hero card */}
      <div className="bg-gradient-to-br from-dark to-[#1a1a26] border border-white/[0.07] rounded-[20px] p-7 flex gap-6 items-center flex-wrap">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold to-[#8a6520] flex items-center justify-center text-[28px] font-extrabold text-[#0a0a0f] shrink-0">
          {A.name?.charAt(0) || "A"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-playfair text-[22px] font-bold">{A.name}</h2>
            {A.verified && (
              <span className="text-[11px] font-bold text-green-500 bg-green-500/10 py-0.5 px-2.5 rounded-full">
                ✓ Vérifié
              </span>
            )}
          </div>
          <div className="text-[13px] text-cream/50 mt-1">
            Membre depuis {A.member_since} | {A.cities?.join(", ")}
          </div>
          <div className="flex gap-4 mt-2.5 flex-wrap">
            <span className="text-[13px] text-gold font-bold">
              ★ {A.rating}/5
            </span>
            <span className="text-[13px] text-cream/45">
              {A.total_reviews} avis
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* General information */}
        <div className="bg-dark border border-white/[0.07] rounded-2xl p-6 flex flex-col gap-4">
          <div className="font-bold text-[15px] mb-1">
            📋 Informations générales
          </div>
          {[
            ["Nom de l'agence", "name"],
            ["Email", "email"],
            ["Téléphone", "phone"],
            ["WhatsApp", "whatsapp"],
            ["Adresse", "address"],
          ].map(([label, key]) => (
            <div key={key}>
              <label className={labelClasses}>{label}</label>
              {editing ? (
                <input
                  value={form[key] || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  className={inputClasses}
                />
              ) : (
                <div className="text-sm text-cream/80 py-2.5 px-3.5 bg-white/[0.03] rounded-lg">
                  {A[key] || "—"}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          {/* Villes */}
          <div className="bg-dark border border-white/[0.07] rounded-2xl p-6">
            <div className="font-bold text-[15px] mb-4">
              📍 Villes d'opération
            </div>
            {editing ? (
              <CitiesMultiSelect
                cities={form.cities || []}
                onChange={(cities) => setForm((f) => ({ ...f, cities }))}
              />
            ) : (
              <div className="flex gap-2 flex-wrap">
                {A.cities?.map((city) => (
                  <span
                    key={city}
                    className="text-[13px] font-semibold text-gold bg-gold/10 border border-gold/25 py-1.5 px-3.5 rounded-full"
                  >
                    📍 {city}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* IBAN */}
          <div className="bg-dark border border-white/[0.07] rounded-2xl p-6">
            <div className="font-bold text-[15px] mb-4">
              🏦 Coordonnées bancaires
            </div>
            <label className={labelClasses}>IBAN</label>
            {editing ? (
              <div>
                <input
                  value={form.iban || ""}
                  onChange={(e) => {
                    // Keep only alphanumeric characters and convert to uppercase
                    const value = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                    setForm((f) => ({ ...f, iban: value }));
                  }}
                  className={`${inputClasses} font-mono tracking-wider`}
                  placeholder="MA64 0115 1900 0001 0500 0553 171"
                  maxLength="34"
                />
                {form.iban && !/^[A-Z]{2}[0-9A-Z]{10,30}$/.test(form.iban) && (
                  <p className="text-red-500 text-xs mt-1">
                    Format IBAN invalide (doit commencer par 2 lettres)
                  </p>
                )}
              </div>
            ) : (
              <div className="font-mono text-sm text-gold py-2.5 px-3.5 bg-gold/5 border border-gold/15 rounded-lg tracking-wide">
                {A.iban || "—"}
              </div>
            )}
            <div className="text-xs text-cream/35 mt-2">
              Les versements Drivo sont effectués sur ce compte sous 7 jours
              ouvrés.
            </div>
          </div>

          {/* Commission info */}
          <div className="bg-gold/5 border border-gold/20 rounded-[14px] py-4 px-5">
            <div className="font-bold text-[13px] text-gold mb-2">
              📊 Commission Drivo
            </div>
            <div className="text-[28px] font-extrabold text-gold">
              {A.commission}%
            </div>
            <div className="text-xs text-cream/45 mt-1">
              Prélevée sur chaque acompte de réservation. Le reste vous est
              versé directement par le client sur place.
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl py-5 px-6">
        <div className="font-bold text-sm text-red-500 mb-2">
          ⚠️ Zone dangereuse
        </div>
        <div className="text-[13px] text-cream/50 mb-4">
          La suppression de votre compte est irréversible. Toutes vos données,
          voitures et réservations seront effacées.
        </div>
        <button className="bg-transparent border border-red-500/40 text-red-500 py-2.5 px-4 rounded-lg font-sora font-semibold text-[13px] cursor-pointer">
          Supprimer mon compte agence
        </button>
      </div>
    </div>
  );
}
