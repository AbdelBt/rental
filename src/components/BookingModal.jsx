import { useState, useEffect, useRef } from "react";
import DateRangeButton from "./DateRangeButton";

function AddressAutocomplete({ value, onChange, cityFilter }) {
  const [query, setQuery] = useState(value ?? "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    clearTimeout(timeoutRef.current);
    if (val.length < 3) { setSuggestions([]); setOpen(false); return; }
    timeoutRef.current = setTimeout(async () => {
      try {
        const q = cityFilter ? `${val}, ${cityFilter}, Maroc` : `${val}, Maroc`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&countrycodes=ma&format=json&limit=6&addressdetails=1`,
          { headers: { "Accept-Language": "fr" } }
        );
        const data = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
      } catch (_) {}
    }, 400);
  };

  const handleSelect = (item) => {
    const label = item.display_name.split(",").slice(0, 3).join(",").trim();
    setQuery(label);
    onChange(label);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        className="input-field"
        placeholder="Ex : Hôtel Atlas, Aéroport Mohammed V, 12 Rue…"
        value={query}
        onChange={handleChange}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        autoComplete="off"
        required
      />
      {open && (
        <ul className="absolute z-[700] top-full left-0 right-0 mt-1 bg-[#15131f] border border-white/[0.1] rounded-xl overflow-hidden shadow-2xl max-h-52 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item.place_id}
              onMouseDown={() => handleSelect(item)}
              className="px-3 py-2.5 text-[12px] text-cream/80 hover:bg-white/[0.06] cursor-pointer border-b border-white/[0.05] last:border-none leading-tight"
            >
              <span className="text-gold mr-1.5">📍</span>
              {item.display_name.split(",").slice(0, 4).join(",")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function getCustomerDefaults() {
  try {
    const cached = JSON.parse(localStorage.getItem("drivo_customer"));
    if (cached)
      return {
        firstName: cached.first_name ?? "",
        lastName: cached.last_name ?? "",
        email: cached.email ?? "",
        phone: cached.phone ?? "",
        deliveryCity: cached.deliveryCity ?? "",
        deliveryAddress: cached.deliveryAddress ?? "",
      };
  } catch (_) {}
  return { firstName: "", lastName: "", email: "", phone: "", deliveryCity: "", deliveryAddress: "" };
}

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

export default function BookingModal({
  car,
  pickupDate: initPickup,
  returnDate: initReturn,
  backendUrl,
  onClose,
}) {
  const [pickupDate, setPickupDate] = useState(initPickup);
  const [returnDate, setReturnDate] = useState(initReturn);
  const [form, setForm] = useState(getCustomerDefaults);
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnTime, setReturnTime] = useState("10:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-set deliveryCity when there's only one available city
  useEffect(() => {
    const availableCities = Array.isArray(car.agency?.cities) && car.agency.cities.length > 0
      ? car.agency.cities
      : [car.city ?? car.agency?.city].filter(Boolean);
    if (availableCities.length === 1) {
      setForm((f) => ({ ...f, deliveryCity: availableCities[0] }));
    }
  }, [car]);

  const days = Math.max(1, Math.round((returnDate - pickupDate) / 86400000));
  const total = car.price * days;
  const deposit = Math.round(total * 0.4);

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missing = [];
    if (!form.firstName) missing.push("prénom");
    if (!form.lastName) missing.push("nom");
    if (!form.email) missing.push("email");
    if (!form.deliveryCity) missing.push("ville de livraison");
    if (!form.deliveryAddress) missing.push("adresse de livraison");
    if (missing.length > 0) {
      setError(`Champ(s) requis : ${missing.join(", ")}.`);
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/stripe/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car.id,
          carName: `${car.brand ? car.brand + " " : ""}${car.name}`,
          carImg: car.img || "",
          dateFrom: pickupDate.toISOString().split("T")[0],
          dateTo: returnDate.toISOString().split("T")[0],
          timeFrom: pickupTime ?? "10:00",
          timeTo: returnTime ?? "10:00",
          days,
          total,
          deposit,
          customerEmail: form.email,
          customerFirstName: form.firstName,
          customerLastName: form.lastName,
          customerPhone: form.phone,
          deliveryCity: form.deliveryCity,
          deliveryAddress: form.deliveryAddress,
          city: car.city ?? car.agency?.city ?? null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");

      // Redirection vers Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#0f0e1a] border border-white/[0.1] rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.07] flex items-start justify-between gap-3">
          <div>
            <h2 className="font-playfair text-xl font-bold">
              Finaliser la réservation
            </h2>
            <p className="text-[12px] text-cream/45 mt-0.5">
              {car.brand ? `${car.brand} ` : ""}
              {car.name}
            </p>
            <p className="text-[12px] text-cream/45 mt-0.5">
              🚗 {fmtDate(pickupDate)} à {pickupTime ?? "10:00"} &nbsp;→&nbsp;
              🔑 {fmtDate(returnDate)} à {returnTime ?? "10:00"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-cream/40 hover:text-cream text-xl bg-transparent border-none cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Dates modifiables */}
        <div className="mx-6 mt-5">
          <label className="block text-[11px] font-semibold text-cream/50 tracking-widest uppercase mb-1.5">Dates de location</label>
          <DateRangeButton
            pickupDate={pickupDate}
            returnDate={returnDate}
            onChange={({ start, end }) => {
              if (start) setPickupDate(start);
              if (end) setReturnDate(end);
            }}
          />
        </div>

        {/* Récap prix */}
        <div className="mx-6 mt-5 bg-gold/[0.07] border border-gold/20 rounded-xl p-4">
          <div className="flex justify-between text-[13px] mb-1.5">
            <span className="text-cream/55">
              {car.price} € × {days} jour{days > 1 ? "s" : ""}
            </span>
            <span className="font-semibold">{total} €</span>
          </div>
          <div className="flex justify-between text-[13px] mb-2">
            <span className="text-cream/55">
              Acompte à payer maintenant (40%)
            </span>
            <span className="font-bold text-gold">{deposit} €</span>
          </div>
          <div className="flex justify-between text-[12px] pt-2 border-t border-white/[0.07]">
            <span className="text-cream/40">Solde à payer sur place</span>
            <span className="text-cream/60">{total - deposit} €</span>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-cream/50 tracking-widest uppercase mb-1.5">
                Prénom *
              </label>
              <input
                className="input-field"
                placeholder="Mohamed"
                value={form.firstName}
                onChange={update("firstName")}
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-cream/50 tracking-widest uppercase mb-1.5">
                Nom *
              </label>
              <input
                className="input-field"
                placeholder="Benali"
                value={form.lastName}
                onChange={update("lastName")}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-cream/50 tracking-widest uppercase mb-1.5">
              Email *
            </label>
            <input
              type="email"
              className="input-field"
              placeholder="email@exemple.com"
              value={form.email}
              onChange={update("email")}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-cream/50 tracking-widest uppercase mb-1.5">
                Téléphone
              </label>
              <input
                type="tel"
                className="input-field"
                placeholder="+212 6..."
                value={form.phone}
                onChange={update("phone")}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-cream/50 tracking-widest uppercase mb-1.5">
                Ville de livraison *
              </label>
              {(() => {
                const availableCities = Array.isArray(car.agency?.cities) && car.agency.cities.length > 0
                  ? car.agency.cities
                  : [car.city ?? car.agency?.city].filter(Boolean);
                return availableCities.length > 1 ? (
                  <select
                    className="input-field cursor-pointer"
                    value={form.deliveryCity}
                    onChange={update("deliveryCity")}
                    required
                    style={{ background: "#0f0e1a", color: "#f5efe0" }}
                  >
                    <option value="" style={{ background: "#0f0e1a" }}>Choisir…</option>
                    {availableCities.map((c) => (
                      <option key={c} value={c} style={{ background: "#0f0e1a" }}>{c}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="input-field"
                    value={availableCities[0] ?? ""}
                    readOnly
                    style={{ opacity: 0.6, cursor: "not-allowed" }}
                  />
                );
              })()}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-cream/50 tracking-widest uppercase mb-1.5">
              Adresse exacte de livraison *
            </label>
            <AddressAutocomplete
              value={form.deliveryAddress}
              onChange={(val) => setForm((f) => ({ ...f, deliveryAddress: val }))}
              cityFilter={form.deliveryCity}
            />
          </div>

          {/* Politique d'annulation */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 flex flex-col gap-2">
            <div className="text-[11px] font-bold text-gold tracking-widest uppercase mb-0.5">
              Politique d'annulation
            </div>
            <div className="flex gap-2">
              <span className="shrink-0">❌</span>
              <span className="text-[12px] text-cream/60">
                Réservation{" "}
                <span className="text-cream/90 font-semibold">
                  non remboursable
                </span>{" "}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="shrink-0">✈️</span>
              <span className="text-[12px] text-cream/60">
                Exception :{" "}
                <span className="text-cream/90 font-semibold">vol annulé</span>{" "}
                (justificatif requis)
              </span>
            </div>
          </div>

          {/* Heures */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
            <div className="text-[11px] font-bold text-gold tracking-widest uppercase mb-3">
              🕙 Heure de remise & restitution
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-cream/50 tracking-widest uppercase mb-1.5">
                  🚗 Remise des clés
                </label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="input-field cursor-pointer"
                >
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t} className="bg-[#0f0e1a]">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-cream/50 tracking-widest uppercase mb-1.5">
                  🔑 Restitution
                </label>
                <select
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="input-field cursor-pointer"
                >
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t} className="bg-[#0f0e1a]">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-[11px] text-cream/35 mt-2.5">
              Par défaut 10h00 — modifiez selon vos besoins.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-[12px] text-red-400">
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gold text-[#0a0a0f] font-extrabold text-[14px] tracking-wide uppercase rounded-xl border-none cursor-pointer hover:bg-[#e8be6a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full animate-spin" />
                Redirection vers Stripe…
              </span>
            ) : (
              `Payer l'acompte — ${deposit} €`
            )}
          </button>

          <p className="text-[11px] text-cream/30 text-center">
            🔒 Paiement sécurisé par Stripe · Vos données sont protégées
          </p>
        </form>
      </div>
    </div>
  );
}
