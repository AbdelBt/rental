import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

const STEPS = ["Identité", "Tarifs & Options", "Équipements", "Photos"];
const CATS = [
  "Économique",
  "Standard",
  "SUV",
  "Premium",
  "Luxe",
  "Sport",
  "Électrique",
  "Utilitaire",
];
const CITIES = ["Casablanca", "Marrakech", "Agadir", "Tanger", "Rabat", "Fès"];
const FUELS = ["Essence", "Diesel", "Électrique", "Hybride", "GPL"];
const STATUS = {
  active: { label: "Disponible", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
  unavailable: {
    label: "Indisponible",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.15)",
  },
  maintenance: {
    label: "Maintenance",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.15)",
  },
};

const EMPTY = {
  name: "",
  brand: "",
  year: new Date().getFullYear(),
  category: "Standard",
  city: "Casablanca",
  price: "",
  price_week: "",
  price_month: "",
  fuel: "Essence",
  seats: 5,
  transmission: "Auto",
  mileage: "Illimité",
  deposit: false,
  deposit_amount: 0,
  babyseat: false,
  gps: false,
  min_age: 21,
  min_days: 1,
  second_driver: "",
  delivery_price: "",
  damage_rules: [],
  status: "active",
  img: "",
  imgs: [],
  description: "",
  agency_id: null,
};

const inputClasses =
  "w-full bg-white/[0.04] border border-white/10 text-cream py-2.5 px-3.5 rounded-[10px] font-sora text-[13px] outline-none box-border";
const labelClasses =
  "text-[11px] font-bold text-gold tracking-[0.12em] uppercase block mb-1.5";

function Field({ label, children }) {
  return (
    <div>
      <label className={labelClasses}>{label}</label>
      {children}
    </div>
  );
}

function Inp({ k, form, set, type = "text", placeholder = "" }) {
  return (
    <input
      type={type}
      value={form[k] ?? ""}
      placeholder={placeholder}
      onChange={(e) =>
        set(k, type === "number" ? Number(e.target.value) || 0 : e.target.value)
      }
      className={inputClasses}
    />
  );
}

function Sel({ k, form, set, options }) {
  return (
    <select
      value={form[k]}
      onChange={(e) => set(k, e.target.value)}
      className={inputClasses}
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-dark">
          {o}
        </option>
      ))}
    </select>
  );
}

function Check({ k, form, set, label }) {
  return (
    <label
      className={`flex items-center gap-2 cursor-pointer py-2.5 px-3 bg-white/[0.03] rounded-lg border ${
        form[k] ? "border-gold/30" : "border-white/[0.07]"
      }`}
    >
      <input
        type="checkbox"
        checked={!!form[k]}
        onChange={(e) => set(k, e.target.checked)}
        className="accent-gold w-[15px] h-[15px] shrink-0"
      />
      <span
        className={`text-[13px] font-semibold ${
          form[k] ? "text-gold" : "text-cream/65"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

export default function DashVoitures() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [deleteId, setDeleteId] = useState(null);
  const [sidebarCar, setSidebarCar] = useState(null);
  const [dmgIn, setDmgIn] = useState({ item: "", price: "" });
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [agencyId, setAgencyId] = useState(null);

  // Charger l'agence ID au démarrage
  // Dans DashVoitures.jsx - useEffect modifié

  useEffect(() => {
    const initAgency = async () => {
      try {
        setLoading(true);

        // 1. Récupérer l'utilisateur connecté
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) {
          console.error("Aucun utilisateur connecté");
          setLoading(false);
          return;
        }

        console.log("Utilisateur connecté:", user.id, user.email);

        // 2. D'ABORD chercher par auth_user_id (plus fiable)
        let { data: agencyByUserId, error: errorByUserId } = await supabase
          .from("agencies")
          .select("*")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (errorByUserId && errorByUserId.code !== "PGRST116") {
          throw errorByUserId;
        }

        // 3. Si trouvé par auth_user_id, on l'utilise
        if (agencyByUserId) {
          console.log("Agence trouvée par auth_user_id:", agencyByUserId);
          setAgencyId(agencyByUserId.id);
          loadCars(agencyByUserId.id);
          setLoading(false);
          return;
        }

        // 6. Si aucune agence trouvée, on en crée une nouvelle
        console.log("Création d'une nouvelle agence pour", user.email);

        const { data: newAgency, error: insertError } = await supabase
          .from("agencies")
          .insert([
            {
              auth_user_id: user.id,
              name: user.email?.split("@")[0] || "Mon agence",
              email: user.email,
              city: "Casablanca",
              phone: "",
            },
          ])
          .select()
          .single();

        if (insertError) {
          // Si erreur de duplicate, essayer une dernière fois de récupérer
          if (insertError.code === "23505") {
            console.log(
              "Email déjà existant, récupération de l'agence existante",
            );

            const { data: existingAgency } = await supabase
              .from("agencies")
              .select("*")
              .eq("email", user.email)
              .single();

            if (existingAgency) {
              // Mettre à jour avec le bon auth_user_id
              const { data: updated } = await supabase
                .from("agencies")
                .update({ auth_user_id: user.id })
                .eq("id", existingAgency.id)
                .select()
                .single();

              setAgencyId(updated?.id || existingAgency.id);
              loadCars(updated?.id || existingAgency.id);
            }
          } else {
            throw insertError;
          }
        } else {
          setAgencyId(newAgency.id);
          loadCars(newAgency.id);
        }
      } catch (err) {
        console.error("Erreur lors de l'initialisation:", err);
      } finally {
        setLoading(false);
      }
    };

    initAgency();
  }, []);

  // Charger les voitures depuis Supabase
  const loadCars = async (agency_id) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("agency_id", agency_id)
        .order("added_at", { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (err) {
      console.error("Erreur chargement voitures:", err);
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openAdd = () => {
    setForm({ ...EMPTY, agency_id: agencyId });
    setStep(0);
    setModal("add");
  };

  const openEdit = (car) => {
    setForm({
      ...EMPTY,
      ...car,
      imgs: car.imgs || [],
      damage_rules: car.damage_rules || [],
    });
    setStep(0);
    setModal(car);
  };

  const closeModal = () => setModal(null);

  // Sauvegarder dans Supabase
  const save = async () => {
    if (!form.name?.trim() || !form.price) return;

    // Liste des champs numériques
    const numericFields = [
      "price",
      "price_week",
      "price_month",
      "deposit_amount",
      "second_driver",
      "delivery_price",
      "min_age",
      "min_days",
      "year",
    ];

    const cleanForm = { ...form };
    numericFields.forEach((field) => {
      const value = cleanForm[field];
      if (value === "" || value === null || value === undefined) {
        cleanForm[field] = null; // null pour les champs optionnels
      } else if (typeof value === "string") {
        // Convertir en nombre, garder null si pas un nombre valide
        const num = parseFloat(value);
        cleanForm[field] = isNaN(num) ? null : num;
      }
    });

    try {
      if (modal === "add") {
        const { data, error } = await supabase
          .from("cars")
          .insert([
            {
              agency_id: agencyId,
              name: cleanForm.name,
              brand: cleanForm.brand,
              year: cleanForm.year,
              category: cleanForm.category,
              city: cleanForm.city,
              price: cleanForm.price,
              price_week: cleanForm.price_week,
              price_month: cleanForm.price_month,
              fuel: cleanForm.fuel,
              transmission: cleanForm.transmission,
              seats: cleanForm.seats,
              deposit: cleanForm.deposit,
              deposit_amount: cleanForm.deposit_amount,
              img: cleanForm.img,
              imgs: cleanForm.imgs,
              description: cleanForm.description,
              status: cleanForm.status,
              mileage: cleanForm.mileage,
              min_age: cleanForm.min_age,
              min_days: cleanForm.min_days,
              second_driver: cleanForm.second_driver,
              delivery_price: cleanForm.delivery_price,
              damage_rules: cleanForm.damage_rules,
              babyseat: cleanForm.babyseat,
              gps: cleanForm.gps,
            },
          ])
          .select();

        if (error) throw error;
        if (data) setCars((prev) => [data[0], ...prev]);
      } else {
        const { error } = await supabase
          .from("cars")
          .update({
            name: cleanForm.name,
            brand: cleanForm.brand,
            year: cleanForm.year,
            category: cleanForm.category,
            city: cleanForm.city,
            price: cleanForm.price,
            price_week: cleanForm.price_week,
            price_month: cleanForm.price_month,
            fuel: cleanForm.fuel,
            transmission: cleanForm.transmission,
            seats: cleanForm.seats,
            deposit: cleanForm.deposit,
            deposit_amount: cleanForm.deposit_amount,
            img: cleanForm.img,
            imgs: cleanForm.imgs,
            description: cleanForm.description,
            status: cleanForm.status,
            mileage: cleanForm.mileage,
            min_age: cleanForm.min_age,
            min_days: cleanForm.min_days,
            second_driver: cleanForm.second_driver,
            delivery_price: cleanForm.delivery_price,
            damage_rules: cleanForm.damage_rules,
            babyseat: cleanForm.babyseat,
            gps: cleanForm.gps,
          })
          .eq("id", cleanForm.id);

        if (error) throw error;

        setCars((prev) =>
          prev.map((c) => (c.id === cleanForm.id ? { ...cleanForm } : c)),
        );
        if (sidebarCar?.id === cleanForm.id) setSidebarCar({ ...cleanForm });
      }
      closeModal();
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      alert("Erreur lors de la sauvegarde");
    }
  };

  const cycleStatus = async (id, e) => {
    e?.stopPropagation();
    const order = ["active", "unavailable", "maintenance"];

    const car = cars.find((c) => c.id === id);
    const currentStatus = car.status || "active";
    const nextStatus = order[(order.indexOf(currentStatus) + 1) % order.length];

    try {
      const { error } = await supabase
        .from("cars")
        .update({ status: nextStatus })
        .eq("id", id);

      if (error) throw error;

      setCars((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c)),
      );

      if (sidebarCar?.id === id) {
        setSidebarCar((s) => ({ ...s, status: nextStatus }));
      }
    } catch (err) {
      console.error("Erreur mise à jour statut:", err);
    }
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase.from("cars").delete().eq("id", deleteId);

      if (error) throw error;

      setCars((prev) => prev.filter((c) => c.id !== deleteId));
      if (sidebarCar?.id === deleteId) setSidebarCar(null);
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur lors de la suppression");
    } finally {
      setDeleteId(null);
    }
  };

  const addDmg = () => {
    if (!dmgIn.item || !dmgIn.price) return;
    set("damage_rules", [
      ...(form.damage_rules || []),
      { item: dmgIn.item, price: Number(dmgIn.price) },
    ]);
    setDmgIn({ item: "", price: "" });
  };

  const addImgUrl = () => {
    const url = prompt("Coller l'URL de la photo :");
    if (url?.trim()) set("imgs", [...(form.imgs || []), url.trim()]);
  };

  const canNext = () => {
    if (step === 0) return form.name?.trim() && form.brand?.trim();
    if (step === 1) return !!form.price;
    return true;
  };

  // Charger les stats mensuelles (réservations/revenus)
  useEffect(() => {
    const loadStats = async () => {
      if (!cars.length) return;

      for (let car of cars) {
        const { data } = await supabase
          .from("reservations")
          .select("total")
          .eq("car_id", car.id)
          .eq("status", "completed");

        if (data) {
          const revenue = data.reduce((sum, r) => sum + r.total, 0);
          setCars((prev) =>
            prev.map((c) =>
              c.id === car.id
                ? { ...c, reservations: data.length, revenue }
                : c,
            ),
          );
        }
      }
    };

    loadStats();
  }, [cars.length]);

  const displayed = cars.filter((c) => {
    const matchS =
      filterStatus === "all" || (c.status || "active") === filterStatus;
    const q = search.toLowerCase();
    const matchQ =
      !search ||
      c.name?.toLowerCase().includes(q) ||
      c.brand?.toLowerCase().includes(q) ||
      c.city?.toLowerCase().includes(q);
    return matchS && matchQ;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 items-start">
      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col gap-[22px]">
        {/* Header */}
        <div className="flex justify-between items-end flex-wrap gap-3">
          <div>
            <div className="w-9 h-0.5 bg-gold rounded mb-3" />
            <h1 className="font-playfair text-[clamp(1.4rem,3vw,2rem)] font-bold">
              Mes voitures
            </h1>
            <p className="text-cream/40 text-[13px] mt-1">
              {cars.length} véhicule{cars.length > 1 ? "s" : ""} ·{" "}
              {cars.filter((c) => (c.status || "active") === "active").length}{" "}
              disponibles
            </p>
          </div>
          <button
            onClick={openAdd}
            className="bg-gold text-dark-bg border-none py-3 px-5 rounded-[10px] font-sora font-bold text-[13px] cursor-pointer flex items-center gap-2 shadow-[0_4px_20px_rgba(212,168,83,0.35)]"
          >
            ＋ Ajouter un véhicule
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2.5 flex-wrap items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Nom, marque, ville…"
            className={`${inputClasses} max-w-[210px] py-2 px-3.5 flex-[1_1_140px]`}
          />
          <div className="flex gap-1.5 flex-wrap">
            {[
              ["all", "Tous"],
              ["active", "Disponibles"],
              ["unavailable", "Indisponibles"],
              ["maintenance", "Maintenance"],
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setFilterStatus(v)}
                className={`py-1.5 px-3 rounded-full font-sora text-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${
                  filterStatus === v
                    ? "border border-gold bg-gold/10 text-gold"
                    : "border border-white/10 text-cream/50"
                }`}
              >
                {l} (
                {v === "all"
                  ? cars.length
                  : cars.filter((c) => (c.status || "active") === v).length}
                )
              </button>
            ))}
          </div>
        </div>

        {/* Cars grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(265px,1fr))] gap-4">
          {displayed.map((car) => {
            const st = STATUS[car.status || "active"];
            const isSel = sidebarCar?.id === car.id;
            return (
              <div
                key={car.id}
                onClick={() => setSidebarCar(isSel ? null : car)}
                className={`bg-dark rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  isSel
                    ? "border border-gold/55 -translate-y-1 shadow-[0_8px_32px_rgba(212,168,83,0.18)]"
                    : "border border-white/[0.06]"
                }`}
              >
                <div className="relative">
                  <img
                    src={
                      car.img ||
                      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400"
                    }
                    alt={car.name}
                    className="w-full h-[155px] object-cover block"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/85 to-transparent" />
                  <button
                    onClick={(e) => cycleStatus(car.id, e)}
                    className="absolute top-2.5 right-2.5 text-[10px] font-bold py-1 px-2.5 rounded-full border-none cursor-pointer backdrop-blur-md transition-all"
                    style={{ background: st.bg, color: st.color }}
                  >
                    {st.label}
                  </button>
                  <div className="absolute bottom-2.5 left-3">
                    <div className="text-[10px] text-gold font-semibold tracking-widest uppercase">
                      {car.category}
                    </div>
                    <div className="font-bold text-base">{car.name}</div>
                  </div>
                </div>
                <div className="py-3.5 px-4">
                  <div className="flex gap-1.5 mb-2.5 flex-wrap">
                    {[
                      `📍 ${car.city}`,
                      `⛽ ${car.fuel}`,
                      `👤 ${car.seats}p`,
                      `⚙️ ${car.transmission}`,
                    ].map((s) => (
                      <span
                        key={s}
                        className="text-[10px] text-cream/50 bg-white/[0.04] py-0.5 px-1.5 rounded-md"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="text-xl font-extrabold text-gold">
                        {car.price} DH
                      </span>
                      <span className="text-[11px] text-cream/40 ml-1">
                        /jour
                      </span>
                    </div>
                    <div className="text-right text-[11px] text-cream/35">
                      <div>{car.reservations || 0} rés.</div>
                      <div className="text-gold/70 font-semibold">
                        {(car.revenue || 0).toLocaleString()} DH
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(car);
                      }}
                      className="flex-1 bg-white/[0.05] border border-white/10 text-cream py-2 rounded-lg font-sora text-xs font-semibold cursor-pointer transition-all hover:border-gold"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(car.id);
                      }}
                      className="bg-red-500/10 border border-red-500/20 text-red-500 py-2 px-3 rounded-lg font-sora text-xs cursor-pointer transition-all hover:bg-red-500/20"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {displayed.length === 0 && (
            <div className="col-span-full text-center py-[60px] text-cream/30">
              <div className="text-4xl mb-3">🚗</div>
              Aucun véhicule trouvé
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - reste identique mais avec les champs Supabase */}
      {sidebarCar &&
        (() => {
          const st = STATUS[sidebarCar.status || "active"];
          return (
            <div
              className="w-[310px] shrink-0 sticky top-20 bg-dark rounded-[20px] overflow-hidden max-h-[calc(100vh-104px)] overflow-y-auto"
              style={{ border: `1px solid ${st.color}33` }}
            >
              {/* ... (contenu sidebar identique à votre code) ... */}
              <div className="relative">
                <img
                  src={
                    sidebarCar.img ||
                    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600"
                  }
                  alt={sidebarCar.name}
                  className="w-full h-[185px] object-cover block"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/95 to-transparent" />
                <button
                  onClick={() => setSidebarCar(null)}
                  className="absolute top-3 right-3 bg-[#0a0a0f]/65 border-none text-cream w-8 h-8 rounded-full cursor-pointer text-sm backdrop-blur-sm flex items-center justify-center"
                >
                  ✕
                </button>
                <div className="absolute bottom-3 left-4">
                  <div className="text-[10px] text-gold font-bold tracking-[0.12em] uppercase">
                    {sidebarCar.category}
                  </div>
                  <div className="font-playfair text-[19px] font-bold leading-tight">
                    {sidebarCar.name}
                  </div>
                  <div className="text-xs text-cream/50 mt-0.5">
                    {sidebarCar.brand} {sidebarCar.year || ""}
                  </div>
                </div>
              </div>
              <div className="py-4 px-4 pb-5">
                <button
                  onClick={(e) => cycleStatus(sidebarCar.id, e)}
                  className="w-full py-2 rounded-lg font-sora font-bold text-xs cursor-pointer mb-4 transition-all"
                  style={{
                    border: `1px solid ${st.color}55`,
                    background: st.bg,
                    color: st.color,
                  }}
                >
                  {st.label} · cliquer pour changer
                </button>
                {/* KPIs */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    [
                      "💰",
                      "Revenu",
                      `${(sidebarCar.revenue || 0).toLocaleString()} DH`,
                    ],
                    ["📅", "Rés.", `${sidebarCar.reservations || 0}`],
                    ["💵", "/ jour", `${sidebarCar.price} DH`],
                    [
                      "📆",
                      "/ sem",
                      sidebarCar.price_week
                        ? `${sidebarCar.price_week} DH`
                        : "—",
                    ],
                  ].map(([ic, lb, val]) => (
                    <div
                      key={lb}
                      className="bg-white/[0.03] rounded-[10px] py-2.5 px-3"
                    >
                      <div className="text-sm mb-0.5">{ic}</div>
                      <div className="text-sm font-extrabold text-gold">
                        {val}
                      </div>
                      <div className="text-[10px] text-cream/35 mt-0.5">
                        {lb}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Specs */}
                <div className="mb-3.5">
                  <div className="text-[10px] font-bold text-cream/30 tracking-widest uppercase mb-1.5">
                    Caractéristiques
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {[
                      `⛽ ${sidebarCar.fuel}`,
                      `⚙️ ${sidebarCar.transmission}`,
                      `👤 ${sidebarCar.seats} places`,
                      `📍 ${sidebarCar.city}`,
                      `🛣️ ${sidebarCar.mileage || "Illimité"}`,
                      `🎂 ${sidebarCar.min_age || 21} ans min`,
                      sidebarCar.babyseat ? "🪑 Siège bébé" : null,
                      sidebarCar.gps ? "🗺️ gps" : null,
                      sidebarCar.deposit
                        ? `🔐 Caution ${sidebarCar.deposit_amount || 0} MAD`
                        : "✅ Sans caution",
                    ]
                      .filter(Boolean)
                      .map((s) => (
                        <span
                          key={s}
                          className="text-[11px] text-cream/60 bg-white/[0.05] py-1 px-2 rounded-md"
                        >
                          {s}
                        </span>
                      ))}
                  </div>
                </div>
                {/* Description */}
                {sidebarCar.description && (
                  <div className="mb-3.5 py-2.5 px-3 bg-white/[0.03] rounded-[10px] text-xs text-cream/55 leading-relaxed">
                    {sidebarCar.description}
                  </div>
                )}
                {/* Damages */}
                {sidebarCar.damage_rules?.length > 0 && (
                  <div className="mb-3.5">
                    <div className="text-[10px] font-bold text-cream/30 tracking-widest uppercase mb-1.5">
                      Tarifs dommages
                    </div>
                    {sidebarCar.damage_rules.map((r, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-xs py-1 border-b border-white/[0.05]"
                      >
                        <span className="text-cream/55">{r.item}</span>
                        <span className="font-bold text-gold">
                          {r.price} MAD
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {/* Extra photos */}
                {sidebarCar.imgs?.length > 0 && (
                  <div className="mb-3.5">
                    <div className="text-[10px] font-bold text-cream/30 tracking-widest uppercase mb-1.5">
                      Photos
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {sidebarCar.imgs.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt=""
                          className="w-full aspect-video object-cover rounded-lg border border-white/[0.08]"
                        />
                      ))}
                    </div>
                  </div>
                )}
                {/* Actions */}
                <div className="flex gap-2 mt-1.5">
                  <button
                    onClick={() => openEdit(sidebarCar)}
                    className="flex-1 bg-gold text-dark-bg border-none py-2.5 rounded-lg font-sora font-bold text-[13px] cursor-pointer shadow-[0_4px_14px_rgba(212,168,83,0.3)]"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => setDeleteId(sidebarCar.id)}
                    className="bg-red-500/10 border border-red-500/20 text-red-500 py-2.5 px-3.5 rounded-lg font-sora text-[13px] cursor-pointer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* Modal Add/Edit - adapter les noms de champs pour Supabase */}
      {modal !== null && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90" onClick={closeModal} />
          <div className="relative bg-dark border border-white/10 rounded-3xl w-full max-w-[700px] max-h-[93vh] overflow-y-auto flex flex-col">
            {/* Header + stepper (identique) */}
            <div className="py-6 px-7 pb-5 border-b border-white/[0.07] sticky top-0 bg-dark z-10">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="font-playfair text-[21px] font-bold">
                    {modal === "add"
                      ? "➕ Nouveau véhicule"
                      : `✏️ Modifier — ${form.name || "…"}`}
                  </h2>
                  <p className="text-xs text-cream/38 mt-0.5">
                    Étape {step + 1}/{STEPS.length} · {STEPS[step]}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="bg-white/[0.06] border-none text-cream/60 w-9 h-9 rounded-full cursor-pointer text-base flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
              {/* Stepper */}
              <div className="flex items-center">
                {STEPS.map((s, i) => (
                  <div
                    key={s}
                    className={`flex-1 flex flex-col items-center gap-1 ${
                      i < step ? "cursor-pointer" : ""
                    }`}
                    onClick={() => i < step && setStep(i)}
                  >
                    <div className="flex items-center w-full">
                      {i > 0 && (
                        <div
                          className={`flex-1 h-0.5 transition-colors ${
                            i <= step ? "bg-gold" : "bg-white/10"
                          }`}
                        />
                      )}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 transition-all ${
                          i <= step
                            ? "bg-gold border-2 border-gold text-dark-bg"
                            : "bg-white/[0.07] border-2 border-white/15 text-cream/35"
                        }`}
                      >
                        {i < step ? "✓" : i + 1}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 transition-colors ${
                            i < step ? "bg-gold" : "bg-white/10"
                          }`}
                        />
                      )}
                    </div>
                    <div
                      className={`text-[10px] font-semibold tracking-wide text-center ${
                        i === step ? "text-gold" : "text-cream/35"
                      }`}
                    >
                      {s}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step body - adapter les noms de champs */}
            <div className="py-6 px-7 flex-1 min-h-[320px]">
              {step === 0 && (
                <div className="flex flex-col gap-[18px]">
                  <div className="flex gap-4 items-start">
                    <div className="w-[150px] h-[100px] rounded-xl overflow-hidden shrink-0 border border-white/10 bg-white/[0.03] relative">
                      {form.img ? (
                        <img
                          src={form.img}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentNode.querySelector(
                              ".error-message",
                            ).style.display = "flex";
                          }}
                          onLoad={(e) => {
                            e.target.style.display = "block";
                            e.target.parentNode.querySelector(
                              ".error-message",
                            ).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-cream/20 text-[32px]">
                          🚗
                        </div>
                      )}
                      <div className="error-message hidden absolute inset-0 items-center justify-center bg-red-500/10 text-red-500 text-xs">
                        ⚠️ Image invalide
                      </div>
                      <div className="absolute bottom-1 left-0 right-0 text-center text-[9px] text-cream/30">
                        Aperçu
                      </div>
                    </div>
                    <div className="flex-1">
                      <Field label="URL photo principale">
                        <Inp
                          k="img"
                          form={form}
                          set={set}
                          placeholder="https://images.unsplash.com/…"
                        />
                      </Field>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <Field label="Nom du véhicule *">
                      <Inp
                        k="name"
                        form={form}
                        set={set}
                        placeholder="ex: Toyota Corolla"
                      />
                    </Field>
                    <Field label="Marque *">
                      <Inp
                        k="brand"
                        form={form}
                        set={set}
                        placeholder="ex: Toyota"
                      />
                    </Field>
                    <Field label="Année">
                      <Inp k="year" form={form} set={set} type="number" />
                    </Field>
                    <Field label="Catégorie">
                      <Sel k="category" form={form} set={set} options={CATS} />
                    </Field>
                    <Field label="Ville">
                      <Sel k="city" form={form} set={set} options={CITIES} />
                    </Field>
                    <Field label="Statut initial">
                      <select
                        value={form.status}
                        onChange={(e) => set("status", e.target.value)}
                        className={inputClasses}
                      >
                        {Object.entries(STATUS).map(([k, v]) => (
                          <option key={k} value={k} className="bg-dark">
                            {v.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="Description (optionnel)">
                    <textarea
                      value={form.description || ""}
                      onChange={(e) => set("description", e.target.value)}
                      placeholder="Points forts, état du véhicule…"
                      className={`${inputClasses} min-h-[72px] resize-y font-sans leading-normal`}
                    />
                  </Field>
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-3 gap-3.5">
                    <Field label="Prix / jour (DH) *">
                      <Inp
                        k="price"
                        form={form}
                        set={set}
                        type="number"
                        placeholder="0"
                      />
                    </Field>
                    <Field label="Prix / semaine (DH)">
                      <Inp
                        k="price_week"
                        form={form}
                        set={set}
                        type="number"
                        placeholder="0"
                      />
                    </Field>
                    <Field label="Prix / mois (DH)">
                      <Inp
                        k="price_month"
                        form={form}
                        set={set}
                        type="number"
                        placeholder="0"
                      />
                    </Field>
                    <Field label="Durée min (jours)">
                      <Inp k="min_days" form={form} set={set} type="number" />
                    </Field>
                    <Field label="2ème conducteur (DH)">
                      <Inp
                        k="second_driver"
                        form={form}
                        set={set}
                        type="number"
                        placeholder="0"
                      />
                    </Field>
                    <Field label="Livraison autre ville (MAD)">
                      <Inp
                        k="delivery_price"
                        form={form}
                        set={set}
                        type="number"
                        placeholder="0"
                      />
                    </Field>
                  </div>
                  <div className="bg-white/[0.03] rounded-xl p-4">
                    <Check
                      k="deposit"
                      form={form}
                      set={set}
                      label="Caution requise à la prise en charge"
                    />
                    {form.deposit && (
                      <div className="mt-3">
                        <Field label="Montant caution (MAD)">
                          <Inp
                            k="deposit_amount"
                            form={form}
                            set={set}
                            type="number"
                            placeholder="0"
                          />
                        </Field>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={labelClasses}>
                      Grille tarifaire dommages (MAD)
                    </label>
                    {(form.damage_rules || []).length === 0 && (
                      <p className="text-xs text-cream/30 mb-2.5 -mt-1">
                        Aucun tarif défini.
                      </p>
                    )}
                    <div className="flex flex-col gap-1.5 mb-2.5">
                      {(form.damage_rules || []).map((r, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center bg-white/[0.03] border border-white/[0.07] rounded-lg py-2 px-3"
                        >
                          <span className="text-[13px]">{r.item}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gold text-[13px]">
                              {r.price} MAD
                            </span>
                            <button
                              onClick={() =>
                                set(
                                  "damage_rules",
                                  form.damage_rules.filter((_, j) => j !== i),
                                )
                              }
                              className="bg-transparent border-none text-red-500 cursor-pointer text-[15px] leading-none"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-[1fr_110px_auto] gap-2">
                      <input
                        value={dmgIn.item}
                        onChange={(e) =>
                          setDmgIn((d) => ({ ...d, item: e.target.value }))
                        }
                        placeholder="ex: Jante rayée"
                        className={inputClasses}
                      />
                      <input
                        type="number"
                        value={dmgIn.price}
                        onChange={(e) =>
                          setDmgIn((d) => ({ ...d, price: e.target.value }))
                        }
                        placeholder="MAD"
                        className={inputClasses}
                      />
                      <button
                        onClick={addDmg}
                        className="bg-gold/10 border border-gold/30 text-gold rounded-lg font-sora font-bold text-xs cursor-pointer py-0 px-3.5 whitespace-nowrap"
                      >
                        + Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-3 gap-3.5">
                    <Field label="Carburant">
                      <Sel k="fuel" form={form} set={set} options={FUELS} />
                    </Field>
                    <Field label="Transmission">
                      <Sel
                        k="transmission"
                        form={form}
                        set={set}
                        options={["Auto", "Manuel"]}
                      />
                    </Field>
                    <Field label="Places">
                      <Inp k="seats" form={form} set={set} type="number" />
                    </Field>
                    <Field label="Âge minimum (ans)">
                      <Inp k="min_age" form={form} set={set} type="number" />
                    </Field>
                    <Field label="Kilométrage inclus">
                      <Inp
                        k="mileage"
                        form={form}
                        set={set}
                        placeholder="Illimité ou 200 km/j"
                      />
                    </Field>
                  </div>
                  <div>
                    <label className={labelClasses}>
                      Options &amp; équipements
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Check
                        k="babyseat"
                        form={form}
                        set={set}
                        label="🪑 Siège bébé disponible"
                      />
                      <Check
                        k="gps"
                        form={form}
                        set={set}
                        label="🗺️ GPS inclus"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-[18px]">
                  <div>
                    <label className={labelClasses}>
                      Photo principale (aperçu)
                    </label>
                    {form.img ? (
                      <img
                        src={form.img}
                        alt=""
                        className="w-full h-40 object-cover rounded-xl border border-white/10"
                      />
                    ) : (
                      <div className="h-20 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-cream/30 text-[13px]">
                        Pas de photo principale — définir à l'étape 1
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <label className={`${labelClasses} mb-0`}>
                        Photos supplémentaires
                      </label>
                      <button
                        onClick={addImgUrl}
                        className="bg-gold/10 border border-gold/30 text-gold py-1.5 px-3.5 rounded-md font-sora font-bold text-xs cursor-pointer"
                      >
                        + Ajouter URL
                      </button>
                    </div>
                    {(form.imgs || []).length === 0 ? (
                      <div className="py-6 border border-dashed border-white/10 rounded-xl text-center text-cream/30 text-[13px]">
                        🖼️ Aucune photo supplémentaire
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {form.imgs.map((img, i) => (
                          <div
                            key={i}
                            className="relative rounded-[10px] overflow-hidden aspect-video"
                          >
                            <img
                              src={img}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() =>
                                set(
                                  "imgs",
                                  form.imgs.filter((_, j) => j !== i),
                                )
                              }
                              className="absolute top-1 right-1 bg-black/75 border-none text-white w-[22px] h-[22px] rounded-full cursor-pointer text-xs flex items-center justify-center"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="py-4 px-7 border-t border-white/[0.07] flex justify-between items-center gap-3 bg-dark sticky bottom-0">
              <button
                onClick={step === 0 ? closeModal : () => setStep((s) => s - 1)}
                className="bg-transparent border border-white/10 text-cream/55 py-2.5 px-5 rounded-[10px] font-sora text-sm cursor-pointer"
              >
                {step === 0 ? "Annuler" : "← Retour"}
              </button>
              <div className="flex gap-1 items-center">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-sm transition-all ${
                      i === step
                        ? "w-[18px] bg-gold"
                        : i < step
                          ? "w-1.5 bg-gold/45"
                          : "w-1.5 bg-white/15"
                    }`}
                  />
                ))}
              </div>
              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => canNext() && setStep((s) => s + 1)}
                  disabled={!canNext()}
                  style={{
                    background: canNext() ? "#d4a853" : "rgba(212,168,83,0.18)",
                    color: canNext() ? "#0a0a0f" : "rgba(240,238,234,0.25)",
                    border: "none",
                    padding: "11px 24px",
                    borderRadius: "10px",
                    fontFamily: "inherit",
                    fontWeight: "700",
                    fontSize: "14px",
                    cursor: canNext() ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                  }}
                >
                  Suivant →
                </button>
              ) : (
                <button
                  onClick={save}
                  className="bg-gold text-dark-bg border-none py-2.5 px-6 rounded-[10px] font-sora font-bold text-sm cursor-pointer shadow-[0_4px_16px_rgba(212,168,83,0.35)]"
                >
                  {modal === "add" ? "✓ Ajouter le véhicule" : "✓ Enregistrer"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-5">
          <div
            className="absolute inset-0 bg-black/90"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative bg-dark border border-red-500/35 rounded-[20px] p-8 max-w-[380px] w-full text-center">
            <div className="text-[44px] mb-4">🗑️</div>
            <h3 className="font-playfair font-bold text-xl mb-2.5">
              Supprimer ce véhicule ?
            </h3>
            <p className="text-cream/50 text-sm mb-7 leading-relaxed">
              Action irréversible. Toutes les données seront définitivement
              supprimées.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white border-none py-3 rounded-[10px] font-sora font-bold cursor-pointer"
              >
                Supprimer
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-transparent border border-white/10 text-cream py-3 rounded-[10px] font-sora cursor-pointer"
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
