import { useState, useEffect, useRef } from "react";
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
  plate: "",
  damage_rules: [],
  status: "active",
  img: "",
  imgs: [],
  description: "",
  agency_id: null,
};

const IC =
  "w-full bg-white/[0.04] border border-white/10 text-cream py-2.5 px-3.5 rounded-[10px] font-sora text-[13px] outline-none box-border";
const LC =
  "text-[11px] font-bold text-gold tracking-[0.12em] uppercase block mb-1.5";

function Field({ label, children }) {
  return (
    <div>
      <label className={LC}>{label}</label>
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
      className={IC}
    />
  );
}
function Sel({ k, form, set, options }) {
  return (
    <select
      value={form[k]}
      onChange={(e) => set(k, e.target.value)}
      className={IC}
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
      className={`flex items-center gap-2 cursor-pointer py-2.5 px-3 bg-white/[0.03] rounded-lg border ${form[k] ? "border-gold/30" : "border-white/[0.07]"}`}
    >
      <input
        type="checkbox"
        checked={!!form[k]}
        onChange={(e) => set(k, e.target.checked)}
        className="accent-gold w-[15px] h-[15px] shrink-0"
      />
      <span
        className={`text-[13px] font-semibold ${form[k] ? "text-gold" : "text-cream/65"}`}
      >
        {label}
      </span>
    </label>
  );
}

/* ── Photo uploader component ───────────────────────────────── */
function PhotoUploader({
  label,
  onFile,
  currentUrl,
  onRemove,
  multiple = false,
  existingImgs = [],
  onAddImg,
  onRemoveImg,
}) {
  const ref = useRef();
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState(null);

  const upload = async (files) => {
    setErr(null);
    setUploading(true);
    try {
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          setErr("Fichier non supporté");
          continue;
        }
        if (file.size > 8 * 1024 * 1024) {
          setErr("Fichier trop lourd (max 8 Mo)");
          continue;
        }
        const ext = file.name.split(".").pop();
        const path = `cars/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("car-photos")
          .upload(path, file, { upsert: true });
        if (upErr) throw upErr;
        const {
          data: { publicUrl },
        } = supabase.storage.from("car-photos").getPublicUrl(path);
        if (multiple) onAddImg(publicUrl);
        else onFile(publicUrl);
      }
    } catch (e) {
      setErr(e.message ?? "Erreur upload");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    upload([...e.dataTransfer.files]);
  };

  if (multiple) {
    return (
      <div>
        <label className={LC}>{label}</label>
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => ref.current.click()}
          className="border-2 border-dashed border-white/10 rounded-xl p-5 text-center cursor-pointer hover:border-gold/40 transition-colors relative"
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-cream/50 text-sm">
              <div className="w-4 h-4 border-2 border-cream/30 border-t-gold rounded-full animate-spin" />
              Téléchargement…
            </div>
          ) : (
            <>
              <div className="text-3xl mb-2">🖼️</div>
              <div className="text-sm text-cream/40">
                Glisser-déposer ou <span className="text-gold">cliquer</span>{" "}
                pour ajouter des photos
              </div>
              <div className="text-xs text-cream/25 mt-1">
                JPG, PNG, WEBP · max 8 Mo chacune
              </div>
            </>
          )}
          <input
            ref={ref}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => upload([...e.target.files])}
          />
        </div>
        {err && <div className="text-red-500 text-xs mt-1.5">⚠️ {err}</div>}
        {existingImgs.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {existingImgs.map((img, i) => (
              <div
                key={i}
                className="relative rounded-[10px] overflow-hidden aspect-video group"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onRemoveImg(i)}
                  className="absolute top-1 right-1 bg-black/75 border-none text-white w-[22px] h-[22px] rounded-full cursor-pointer text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <label className={LC}>{label}</label>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !currentUrl && ref.current.click()}
        className={`rounded-xl border-2 overflow-hidden transition-colors ${currentUrl ? "border-gold/30" : "border-dashed border-white/10 cursor-pointer hover:border-gold/40"}`}
        style={{ height: "140px" }}
      >
        {currentUrl ? (
          <div className="relative w-full h-full">
            <img
              src={currentUrl}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  ref.current.click();
                }}
                className="bg-gold text-[#0a0a0f] border-none rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer"
              >
                🔄 Changer
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="bg-red-500 text-white border-none rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer"
              >
                🗑️
              </button>
            </div>
          </div>
        ) : uploading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-cream/40">
            <div className="w-5 h-5 border-2 border-cream/30 border-t-gold rounded-full animate-spin" />
            <span className="text-xs">Téléchargement…</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <div className="text-3xl">📷</div>
            <div className="text-sm text-cream/40">
              Glisser ou <span className="text-gold">cliquer</span>
            </div>
            <div className="text-xs text-cream/25">
              JPG, PNG, WEBP · max 8 Mo
            </div>
          </div>
        )}
      </div>
      {err && <div className="text-red-500 text-xs mt-1.5">⚠️ {err}</div>}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => upload([...e.target.files])}
      />
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
          error: uErr,
        } = await supabase.auth.getUser();
        if (uErr || !user) {
          setLoading(false);
          return;
        }

        let { data: ag } = await supabase
          .from("agencies")
          .select("*")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (!ag) {
          const { data: newAg, error: iErr } = await supabase
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
          if (iErr) throw iErr;
          ag = newAg;
        }

        setAgencyId(ag.id);
        const { data: carsData, error: cErr } = await supabase
          .from("cars")
          .select("*")
          .eq("agency_id", ag.id)
          .order("added_at", { ascending: false });
        if (cErr) throw cErr;
        setCars(carsData || []);
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

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
  const closeModal = () => {
    setModal(null);
    setSaving(false);
  };

  const save = async () => {
    if (!form.name?.trim() || !form.price) return;
    setSaving(true);
    const numFields = [
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
    const clean = { ...form };
    numFields.forEach((f) => {
      const v = clean[f];
      clean[f] =
        v === "" || v === null || v === undefined
          ? null
          : isNaN(parseFloat(v))
            ? null
            : parseFloat(v);
    });

    const payload = {
      agency_id: agencyId,
      name: clean.name,
      brand: clean.brand,
      year: clean.year,
      category: clean.category,
      city: clean.city,
      price: clean.price,
      price_week: clean.price_week,
      price_month: clean.price_month,
      fuel: clean.fuel,
      transmission: clean.transmission,
      seats: clean.seats,
      deposit: clean.deposit,
      deposit_amount: clean.deposit_amount,
      img: clean.img,
      imgs: clean.imgs,
      plate: clean.plate || null,
      description: clean.description,
      status: clean.status,
      mileage: clean.mileage,
      min_age: clean.min_age,
      min_days: clean.min_days,
      second_driver: clean.second_driver,
      delivery_price: clean.delivery_price,
      damage_rules: clean.damage_rules,
      babyseat: clean.babyseat,
      gps: clean.gps,
    };

    try {
      if (modal === "add") {
        const { data, error } = await supabase
          .from("cars")
          .insert([payload])
          .select();
        if (error) throw error;
        setCars((prev) => [data[0], ...prev]);
      } else {
        const { error } = await supabase
          .from("cars")
          .update(payload)
          .eq("id", clean.id);
        if (error) throw error;
        setCars((prev) =>
          prev.map((c) => (c.id === clean.id ? { ...clean } : c)),
        );
        if (sidebarCar?.id === clean.id) setSidebarCar({ ...clean });
      }
      closeModal();
    } catch (err) {
      console.error("Save error:", err);
      alert("Erreur lors de la sauvegarde : " + err.message);
      setSaving(false);
    }
  };

  const cycleStatus = async (id, e) => {
    e?.stopPropagation();
    const order = ["active", "unavailable", "maintenance"];
    const car = cars.find((c) => c.id === id);
    const next =
      order[(order.indexOf(car.status || "active") + 1) % order.length];
    try {
      await supabase.from("cars").update({ status: next }).eq("id", id);
      setCars((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: next } : c)),
      );
      if (sidebarCar?.id === id) setSidebarCar((s) => ({ ...s, status: next }));
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    try {
      await supabase.from("cars").delete().eq("id", deleteId);
      setCars((prev) => prev.filter((c) => c.id !== deleteId));
      if (sidebarCar?.id === deleteId) setSidebarCar(null);
    } catch (err) {
      alert("Erreur suppression: " + err.message);
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

  const canNext = () => {
    if (step === 0) return form.name?.trim() && form.brand?.trim();
    if (step === 1) return !!form.price;
    return true;
  };

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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="flex gap-6 items-start">
      {/* ── Main ── */}
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
            className={`${IC} max-w-[210px] py-2 px-3.5 flex-[1_1_140px]`}
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
                className={`py-1.5 px-3 rounded-full font-sora text-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${filterStatus === v ? "border border-gold bg-gold/10 text-gold" : "border border-white/10 text-cream/50"}`}
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

        {/* Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(265px,1fr))] gap-4">
          {displayed.map((car) => {
            const st = STATUS[car.status || "active"];
            const isSel = sidebarCar?.id === car.id;
            return (
              <div
                key={car.id}
                onClick={() => setSidebarCar(isSel ? null : car)}
                className={`bg-dark rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${isSel ? "border border-gold/55 -translate-y-1 shadow-[0_8px_32px_rgba(212,168,83,0.18)]" : "border border-white/[0.06]"}`}
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
                    className="absolute top-2.5 right-2.5 text-[10px] font-bold py-1 px-2.5 rounded-full border-none cursor-pointer backdrop-blur-md"
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
                        {car.price} €
                      </span>
                      <span className="text-[11px] text-cream/40 ml-1">
                        /jour
                      </span>
                    </div>
                    <div className="text-right text-[11px] text-cream/35">
                      <div>{car.reservations || 0} rés.</div>
                      <div className="text-gold/70 font-semibold">
                        {(car.revenue || 0).toLocaleString()} €
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(car);
                      }}
                      className="flex-1 bg-white/[0.05] border border-white/10 text-cream py-2 rounded-lg font-sora text-xs font-semibold cursor-pointer hover:border-gold"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(car.id);
                      }}
                      className="bg-red-500/10 border border-red-500/20 text-red-500 py-2 px-3 rounded-lg font-sora text-xs cursor-pointer hover:bg-red-500/20"
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
              <div className="text-4xl mb-3">🚗</div>Aucun véhicule trouvé
            </div>
          )}
        </div>
      </div>

      {/* ── Sidebar ── */}
      {sidebarCar &&
        (() => {
          const st = STATUS[sidebarCar.status || "active"];
          return (
            <div
              className="w-[310px] shrink-0 sticky top-20 bg-dark rounded-[20px] overflow-hidden max-h-[calc(100vh-104px)] overflow-y-auto"
              style={{ border: `1px solid ${st.color}33` }}
            >
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
                  className="w-full py-2 rounded-lg font-sora font-bold text-xs cursor-pointer mb-4"
                  style={{
                    border: `1px solid ${st.color}55`,
                    background: st.bg,
                    color: st.color,
                  }}
                >
                  {st.label} · cliquer pour changer
                </button>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    [
                      "💰",
                      "Revenu",
                      `${(sidebarCar.revenue || 0).toLocaleString()} €`,
                    ],
                    ["📅", "Rés.", `${sidebarCar.reservations || 0}`],
                    ["💵", "/ jour", `${sidebarCar.price} €`],
                    [
                      "📆",
                      "/ sem",
                      sidebarCar.price_week
                        ? `${sidebarCar.price_week} €`
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
                      sidebarCar.gps ? "🗺️ GPS" : null,
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
                {sidebarCar.description && (
                  <div className="mb-3.5 py-2.5 px-3 bg-white/[0.03] rounded-[10px] text-xs text-cream/55 leading-relaxed">
                    {sidebarCar.description}
                  </div>
                )}
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
                        <span className="font-bold text-gold">{r.price} €</span>
                      </div>
                    ))}
                  </div>
                )}
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

      {/* ── Modal ── */}
      {modal !== null && (
        <div className="fixed inset-0 z-[600] flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-black/90" onClick={closeModal} />
          <div className="relative bg-dark border border-white/10 rounded-t-3xl sm:rounded-3xl w-full max-w-[700px] flex flex-col" style={{ height: "92dvh", maxHeight: "92dvh" }}>
            {/* Header + stepper */}
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
              <div className="flex items-center">
                {STEPS.map((s, i) => (
                  <div
                    key={s}
                    className={`flex-1 flex flex-col items-center gap-1 ${i < step ? "cursor-pointer" : ""}`}
                    onClick={() => i < step && setStep(i)}
                  >
                    <div className="flex items-center w-full">
                      {i > 0 && (
                        <div
                          className={`flex-1 h-0.5 ${i <= step ? "bg-gold" : "bg-white/10"}`}
                        />
                      )}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 ${i <= step ? "bg-gold border-2 border-gold text-dark-bg" : "bg-white/[0.07] border-2 border-white/15 text-cream/35"}`}
                      >
                        {i < step ? "✓" : i + 1}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 ${i < step ? "bg-gold" : "bg-white/10"}`}
                        />
                      )}
                    </div>
                    <div
                      className={`text-[10px] font-semibold tracking-wide text-center ${i === step ? "text-gold" : "text-cream/35"}`}
                    >
                      {s}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="py-6 px-7 flex-1 overflow-y-auto overscroll-contain">
              {/* Step 0: Identity */}
              {step === 0 && (
                <div className="flex flex-col gap-[18px]">
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
                    <Field label="Plaque d'immatriculation">
                      <Inp k="plate" form={form} set={set} placeholder="ex: 12345-A-1" />
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
                        className={IC}
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
                      className={`${IC} min-h-[72px] resize-y font-sans leading-normal`}
                    />
                  </Field>
                </div>
              )}

              {/* Step 1: Tarifs */}
              {step === 1 && (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-3 gap-3.5">
                    <Field label="Prix / jour (€) *">
                      <Inp
                        k="price"
                        form={form}
                        set={set}
                        type="number"
                        placeholder="0"
                      />
                    </Field>
                    <Field label="Prix / semaine (€)">
                      <Inp
                        k="price_week"
                        form={form}
                        set={set}
                        type="number"
                        placeholder="0"
                      />
                    </Field>
                    <Field label="Prix / mois (€)">
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
                    <Field label="2ème conducteur (€)">
                      <Inp
                        k="second_driver"
                        form={form}
                        set={set}
                        type="number"
                        placeholder="0"
                      />
                    </Field>
                    <Field label="Livraison autre ville (€)">
                      <Inp
                        k="delivery_price"
                        form={form}
                        set={set}
                        type="number"
                        placeholder="0"
                      />
                    </Field>
                  </div>
                  <div>
                    <label className={LC}>Grille tarifaire dommages (€)</label>
                    {!(form.damage_rules || []).length && (
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
                              {r.price} €
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
                        className={IC}
                      />
                      <input
                        type="number"
                        value={dmgIn.price}
                        onChange={(e) =>
                          setDmgIn((d) => ({ ...d, price: e.target.value }))
                        }
                        placeholder="€"
                        className={IC}
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

              {/* Step 2: Equipment */}
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
                    <label className={LC}>Options &amp; équipements</label>
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

              {/* Step 3: Photos — upload depuis galerie */}
              {step === 3 && (
                <div className="flex flex-col gap-6">
                  <PhotoUploader
                    label="Photo principale"
                    currentUrl={form.img}
                    onFile={(url) => set("img", url)}
                    onRemove={() => set("img", "")}
                  />
                  <PhotoUploader
                    label="Photos supplémentaires"
                    multiple
                    existingImgs={form.imgs || []}
                    onAddImg={(url) => set("imgs", [...(form.imgs || []), url])}
                    onRemoveImg={(i) =>
                      set(
                        "imgs",
                        (form.imgs || []).filter((_, j) => j !== i),
                      )
                    }
                  />
                  <div className="bg-gold/5 border border-gold/15 rounded-xl p-4 text-xs text-cream/45 leading-relaxed">
                    💡 Les photos sont uploadées directement dans votre galerie
                    Supabase Storage (bucket{" "}
                    <code className="text-gold">car-photos</code>). Les formats
                    JPG, PNG et WEBP sont acceptés.
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
                    className={`h-1.5 rounded-sm transition-all ${i === step ? "w-[18px] bg-gold" : i < step ? "w-1.5 bg-gold/45" : "w-1.5 bg-white/15"}`}
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
                  }}
                >
                  Suivant →
                </button>
              ) : (
                <button
                  onClick={save}
                  disabled={saving}
                  className="bg-gold text-dark-bg border-none py-2.5 px-6 rounded-[10px] font-sora font-bold text-sm cursor-pointer disabled:opacity-50 shadow-[0_4px_16px_rgba(212,168,83,0.35)]"
                >
                  {saving
                    ? "Enregistrement…"
                    : modal === "add"
                      ? "✓ Ajouter le véhicule"
                      : "✓ Enregistrer"}
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
