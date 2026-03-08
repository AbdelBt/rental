import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function AgencyLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Message d'erreur personnalisé
      if (error.message.includes("Invalid login credentials")) {
        setErrorMsg("Email ou mot de passe incorrect");
      } else if (error.message.includes("Email not confirmed")) {
        setErrorMsg("Veuillez confirmer votre email avant de vous connecter");
      } else {
        setErrorMsg("Erreur de connexion. Veuillez réessayer.");
      }

      setLoading(false);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1c1a28_0%,#050509_55%,#020106_100%)] text-cream flex flex-col">
      <main className="flex-1 flex items-center justify-center px-5 md:px-10 pb-10">
        <div className="w-full max-w-[1040px] grid gap-10 md:gap-14 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
          {/* Left: pitch */}
          <section className="hidden md:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-gold mb-5">
              <span className="text-sm">🏁</span> Espace agence Drivo
            </div>
            <h1 className="font-playfair text-[clamp(2.1rem,3.2vw,2.6rem)] font-bold leading-tight mb-4">
              Gérez vos réservations
              <br />
              et vos paiements en un seul endroit.
            </h1>
            <p className="text-cream/55 text-[15px] leading-relaxed mb-6 max-w-[480px]">
              Suivez vos voitures, vos revenus et vos clients en temps réel.
              Tableau de bord clair, paiements sécurisés, support dédié.
            </p>

            <p className="mt-6 text-xs text-cream/40 max-w-[420px]">
              Vous n'avez pas encore de compte ?{" "}
              <span className="text-gold">
                Contactez-nous pour connecter votre agence à Drivo.
              </span>
            </p>
          </section>

          {/* Right: login card */}
          <section className="w-full">
            <div className="bg-[#0b0b13]/95 border border-white/[0.08] rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.7)] max-w-[440px] mx-auto">
              <div className="mb-6">
                <div className="text-[11px] tracking-[0.16em] uppercase text-gold font-semibold mb-2">
                  Connexion agence
                </div>
                <h2 className="font-playfair text-[1.6rem] font-bold mb-1">
                  Accédez à votre espace
                </h2>
                <p className="text-cream/50 text-[13px]">
                  Identifiez-vous avec l'email utilisé lors de l'onboarding
                  Drivo.
                </p>
              </div>

              {/* Message d'erreur - AJOUTÉ */}
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                  ⚠️ {errorMsg}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-[11px] font-semibold text-cream/60 tracking-[0.18em] uppercase mb-2">
                    Email agence
                  </label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    placeholder="contact@monagence.ma"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[11px] font-semibold text-cream/60 tracking-[0.18em] uppercase">
                      Mot de passe
                    </label>
                    <button
                      type="button"
                      className="text-[11px] text-gold hover:text-cream/90 transition-colors"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    className="input-field"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between text-[12px] text-cream/45">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="accent-gold"
                      defaultChecked
                    />
                    <span>Se souvenir de moi</span>
                  </label>
                  <span className="hidden md:inline">
                    Accès réservé aux agences partenaires.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 mt-2 text-[13px] flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter à mon espace"
                  )}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-white/[0.06] text-[11px] text-cream/35">
                En vous connectant, vous acceptez les{" "}
                <span className="text-gold">CGU partenaires</span> de Drivo.
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
