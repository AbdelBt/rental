import { useState, cloneElement } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

/* ── SVG icons ─────────────────────────────────────────────── */
const IconCalendar = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconHistory = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="12 8 12 12 14 14" />
    <path d="M3.05 11a9 9 0 1 0 .5-4.5" />
    <polyline points="3 3 3 9 9 9" />
  </svg>
);
const IconShield = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconMail = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
);
const IconLock = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconEye = ({ off }) =>
  off ? (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
const IconUser = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconPhone = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IconUpload = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

/* ── Input with icon ────────────────────────────────────────── */
function InputIcon({ icon, children, rightSlot }) {
  // Inject inline padding to override the .input-field CSS padding
  const padded = cloneElement(children, {
    style: {
      paddingLeft: "2.5rem",
      ...(rightSlot ? { paddingRight: "2.5rem" } : {}),
    },
  });
  return (
    <div className="relative flex items-center">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/30 pointer-events-none z-10">
        {icon}
      </span>
      {padded}
      {rightSlot && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10">
          {rightSlot}
        </span>
      )}
    </div>
  );
}

/* ── Login form ─────────────────────────────────────────────── */
function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) {
      setError(
        error.message.includes("Invalid login credentials")
          ? "Email ou mot de passe incorrect."
          : error.message,
      );
    } else {
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <form className="space-y-3.5" onSubmit={handleSubmit}>
      {error && (
        <div className="flex items-center gap-2.5 p-3 bg-red-500/8 border border-red-500/25 rounded-xl text-red-400 text-[12.5px]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <div>
        <label className="block text-[10.5px] font-semibold text-cream/50 tracking-[0.17em] uppercase mb-1.5">
          Email
        </label>
        <InputIcon icon={<IconMail />}>
          <input
            type="email"
            className="input-field pl-10 pr-4"
            placeholder="vous@exemple.com"
            value={form.email}
            onChange={update("email")}
            required
          />
        </InputIcon>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[10.5px] font-semibold text-cream/50 tracking-[0.17em] uppercase">
            Mot de passe
          </label>
          <button
            type="button"
            className="text-[11px] text-gold/80 hover:text-gold transition-colors"
          >
            Oublié ?
          </button>
        </div>
        <InputIcon
          icon={<IconLock />}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="text-cream/30 hover:text-cream/60 transition-colors bg-transparent border-none cursor-pointer p-0"
            >
              <IconEye off={!showPw} />
            </button>
          }
        >
          <input
            type={showPw ? "text" : "password"}
            className="input-field pl-10 pr-10"
            placeholder="••••••••"
            value={form.password}
            onChange={update("password")}
            required
          />
        </InputIcon>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3 text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Connexion en cours...
          </>
        ) : (
          "Se connecter"
        )}
      </button>
    </form>
  );
}

/* ── Signup form ────────────────────────────────────────────── */
function FileUploadField({ label, onChange, file }) {
  return (
    <label className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.07] bg-white/[0.02] cursor-pointer hover:border-gold/30 hover:bg-gold/[0.03] transition-all group">
      <span className="text-cream/30 group-hover:text-gold/60 transition-colors shrink-0">
        <IconUpload />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[11.5px] text-cream/60 font-medium truncate">
          {label}
        </div>
        {file && (
          <div className="text-[10.5px] text-gold/70 truncate mt-0.5">
            {file.name}
          </div>
        )}
        {!file && (
          <div className="text-[10.5px] text-cream/30 mt-0.5">
            Cliquer pour choisir
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="hidden"
      />
    </label>
  );
}

function SignupForm() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", ok: false });
  const [licenseFile, setLicenseFile] = useState(null);
  const [idFrontFile, setIdFrontFile] = useState(null);
  const [idBackFile, setIdBackFile] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setMessage({ text: "", ok: false });

    if (form.password !== form.confirm_password) {
      setMessage({
        text: "Les mots de passe ne correspondent pas.",
        ok: false,
      });
      setLoading(false);
      return;
    }

    // 1. Create Supabase account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          role: "client",
        },
      },
    });

    if (authError) {
      setMessage({ text: authError.message, ok: false });
      setLoading(false);
      return;
    }

    const userId = authData.user?.id;

    // 2. Insert customer profile into public.customers
    if (userId) {
      await supabase.from("customers").insert([
        {
          auth_user_id: userId,
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
        },
      ]);
    }

    // 3. Upload documents to Supabase Storage (bucket: customer-documents)
    if (userId) {
      const uploads = [
        { file: licenseFile, path: `${userId}/license` },
        { file: idFrontFile, path: `${userId}/id_front` },
        { file: idBackFile, path: `${userId}/id_back` },
      ];
      await Promise.all(
        uploads
          .filter(({ file }) => !!file)
          .map(({ file, path }) =>
            supabase.storage
              .from("customer-documents")
              .upload(path, file, { upsert: true }),
          ),
      );
    }

    setMessage({
      text: "Compte créé ! Vérifie tes emails pour confirmer ton adresse.",
      ok: true,
    });
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
    });
    setLicenseFile(null);
    setIdFrontFile(null);
    setIdBackFile(null);
    setLoading(false);
  };

  return (
    <form className="space-y-3.5" onSubmit={handleSubmit}>
      {message.text && (
        <div
          className={`flex items-start gap-2.5 p-3 rounded-xl text-[12.5px] border ${
            message.ok
              ? "bg-green-500/8 border-green-500/25 text-green-400"
              : "bg-red-500/8 border-red-500/25 text-red-400"
          }`}
        >
          {message.ok ? (
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
              strokeWidth="2.5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* First / Last name */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[10.5px] font-semibold text-cream/50 tracking-[0.17em] uppercase mb-1.5">
            Prénom
          </label>
          <InputIcon icon={<IconUser />}>
            <input
              className="input-field pl-10"
              value={form.first_name}
              onChange={update("first_name")}
              placeholder="Prénom"
              required
            />
          </InputIcon>
        </div>
        <div>
          <label className="block text-[10.5px] font-semibold text-cream/50 tracking-[0.17em] uppercase mb-1.5">
            Nom
          </label>
          <InputIcon icon={<IconUser />}>
            <input
              className="input-field pl-10"
              value={form.last_name}
              onChange={update("last_name")}
              placeholder="Nom"
              required
            />
          </InputIcon>
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-[10.5px] font-semibold text-cream/50 tracking-[0.17em] uppercase mb-1.5">
          Email
        </label>
        <InputIcon icon={<IconMail />}>
          <input
            type="email"
            className="input-field pl-10"
            value={form.email}
            onChange={update("email")}
            placeholder="exemple@exemple.com"
            required
          />
        </InputIcon>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-[10.5px] font-semibold text-cream/50 tracking-[0.17em] uppercase mb-1.5">
          Téléphone
        </label>
        <InputIcon icon={<IconPhone />}>
          <input
            type="tel"
            className="input-field pl-10"
            value={form.phone}
            onChange={update("phone")}
            placeholder="+212…"
          />
        </InputIcon>
      </div>

      {/* Password / Confirm */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[10.5px] font-semibold text-cream/50 tracking-[0.17em] uppercase mb-1.5">
            Mot de passe
          </label>
          <InputIcon
            icon={<IconLock />}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="text-cream/30 hover:text-cream/60 transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                <IconEye off={!showPw} />
              </button>
            }
          >
            <input
              type={showPw ? "text" : "password"}
              className="input-field pl-10 pr-10"
              value={form.password}
              onChange={update("password")}
              placeholder="••••••••"
              required
            />
          </InputIcon>
        </div>
        <div>
          <label className="block text-[10.5px] font-semibold text-cream/50 tracking-[0.17em] uppercase mb-1.5">
            Confirmer
          </label>
          <InputIcon
            icon={<IconLock />}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowConfirmPw((v) => !v)}
                className="text-cream/30 hover:text-cream/60 transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                <IconEye off={!showConfirmPw} />
              </button>
            }
          >
            <input
              type={showConfirmPw ? "text" : "password"}
              className={`input-field pl-10 pr-10 ${
                form.confirm_password && form.confirm_password !== form.password
                  ? "border-red-500/50"
                  : ""
              }`}
              value={form.confirm_password}
              onChange={update("confirm_password")}
              placeholder="••••••••"
              required
            />
          </InputIcon>
        </div>
      </div>

      {/* Documents */}
      <div className="pt-1">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-[10px] font-semibold text-cream/35 tracking-[0.15em] uppercase">
            Documents requis
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>
        <div className="space-y-2">
          <FileUploadField
            label="Permis de conduire"
            onChange={setLicenseFile}
            file={licenseFile}
          />
          <FileUploadField
            label="Carte d'identité — face avant"
            onChange={setIdFrontFile}
            file={idFrontFile}
          />
          <FileUploadField
            label="Carte d'identité — face arrière"
            onChange={setIdBackFile}
            file={idBackFile}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3 text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
            Création...
          </>
        ) : (
          "Créer mon compte"
        )}
      </button>
    </form>
  );
}

/* ── Features list ──────────────────────────────────────────── */
const FEATURES = [
  {
    Icon: IconCalendar,
    title: "Décompte en temps réel",
    desc: "Sachez exactement combien de jours avant votre location.",
  },
  {
    Icon: IconHistory,
    title: "Historique complet",
    desc: "Toutes vos réservations passées et à venir en un coup d'œil.",
  },
  {
    Icon: IconShield,
    title: "Données sécurisées",
    desc: "Vos informations sont chiffrées et protégées.",
  },
];

/* ── Main component ─────────────────────────────────────────── */
export default function ClientAuth() {
  const [tab, setTab] = useState("login");
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen text-cream flex flex-col relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, #1e1a30 0%, #07070e 55%, #020106 100%)",
      }}
    >
      {/* Ambient glow top */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(ellipse, #c9a84c 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #5b8de8 0%, transparent 70%)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-16 relative z-10">
        <div className="w-full max-w-[1080px] grid gap-12 md:gap-16 md:grid-cols-[1.1fr_1fr] items-center">
          {/* ── Left pitch ─────────────────────────────────── */}
          <section className="hidden md:flex flex-col gap-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[11.5px] text-cream/35 hover:text-gold transition-colors no-underline w-fit"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Retour au site
            </Link>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/[0.08] px-3.5 py-1.5 text-[10.5px] font-bold tracking-[0.14em] uppercase text-gold mb-5">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                Espace voyageur Drivo
              </div>

              <h1 className="font-playfair text-[clamp(2.1rem,3.2vw,2.8rem)] font-bold leading-[1.15] mb-4 text-cream">
                Gérez vos locations
                <br />
                <span className="text-gold">depuis un seul endroit.</span>
              </h1>

              <p className="text-cream/50 text-[14.5px] leading-relaxed max-w-[400px]">
                Suivez vos réservations, consultez les jours restants avant
                votre départ et gérez vos documents en toute simplicité.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3.5 mt-1">
              {FEATURES.map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0 mt-0.5">
                    <Icon />
                  </div>
                  <div>
                    <div className="text-[13.5px] font-semibold text-cream/85">
                      {title}
                    </div>
                    <div className="text-[12px] text-cream/40 mt-0.5">
                      {desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-5 pt-2 border-t border-white/[0.05] mt-2">
              {[
                ["1 200+", "véhicules"],
                ["24/7", "support"],
                ["100%", "sécurisé"],
              ].map(([val, lbl]) => (
                <div key={lbl}>
                  <div className="font-playfair text-[1.3rem] font-bold text-gold">
                    {val}
                  </div>
                  <div className="text-[11px] text-cream/35">{lbl}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Right card ─────────────────────────────────── */}
          <section className="w-full">
            {/* Gradient border wrapper */}
            <div
              className="p-px rounded-2xl md:rounded-3xl max-w-[440px] mx-auto"
              style={{
                background:
                  "linear-gradient(145deg, rgba(201,168,76,.55) 0%, rgba(255,255,255,.12) 45%, rgba(91,141,232,.25) 100%)",
              }}
            >
              <div className="bg-[#0a0a12] rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-[0_32px_80px_rgba(0,0,0,0.8)]">
                {/* Tabs */}
                <div className="flex bg-white/[0.04] rounded-xl p-1 mb-6 gap-1">
                  {[
                    { key: "login", label: "Se connecter" },
                    { key: "signup", label: "Créer un compte" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setTab(key)}
                      className={`flex-1 py-2.5 rounded-[9px] text-[12px] font-bold tracking-wide transition-all duration-200 ${
                        tab === key
                          ? "bg-gradient-to-r from-[#c9a84c] to-[#e8c86a] text-[#0a0a0f] shadow-[0_2px_12px_rgba(201,168,76,0.3)]"
                          : "text-cream/40 hover:text-cream/65"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Heading */}
                <div className="mb-5">
                  <h2 className="font-playfair text-[1.55rem] font-bold leading-tight mb-1.5">
                    {tab === "login"
                      ? "Bon retour parmi nous"
                      : "Rejoignez Drivo"}
                  </h2>
                  <p className="text-cream/45 text-[12.5px]">
                    {tab === "login"
                      ? "Connectez-vous pour accéder à vos réservations."
                      : "Un seul compte pour toutes vos locations au Maroc."}
                  </p>
                </div>

                {tab === "login" ? (
                  <LoginForm onSuccess={() => navigate("/client/dashboard")} />
                ) : (
                  <SignupForm />
                )}

                {/* Footer link */}
                <div className="mt-5 pt-4 border-t border-white/[0.05] text-center">
                  <span className="text-[11.5px] text-cream/35">
                    {tab === "login"
                      ? "Pas encore de compte ? "
                      : "Déjà un compte ? "}
                  </span>
                  <button
                    onClick={() => setTab(tab === "login" ? "signup" : "login")}
                    className="text-[11.5px] text-gold hover:text-gold/80 font-semibold transition-colors bg-transparent border-none cursor-pointer"
                  >
                    {tab === "login" ? "Créer un compte" : "Se connecter"}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile — retour site */}
            <div className="mt-5 text-center md:hidden">
              <Link
                to="/"
                className="text-[11.5px] text-cream/35 hover:text-gold transition-colors no-underline"
              >
                ← Retour au site
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
