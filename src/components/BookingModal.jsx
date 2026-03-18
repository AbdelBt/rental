import { useState } from "react";

function getCustomerDefaults() {
  try {
    const cached = JSON.parse(localStorage.getItem("drivo_customer"));
    if (cached) return {
      firstName: cached.first_name ?? "",
      lastName:  cached.last_name  ?? "",
      email:     cached.email      ?? "",
      phone:     cached.phone      ?? "",
      city:      cached.city       ?? "",
    };
  } catch (_) {}
  return { firstName: "", lastName: "", email: "", phone: "", city: "" };
}

export default function BookingModal({
  car, pickupDate, returnDate, days, total, deposit, backendUrl, onClose,
}) {
  const [form, setForm] = useState(getCustomerDefaults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fmtDate = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      setError("Prénom, nom et email sont requis.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/stripe/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId:             car.id,
          carName:           `${car.brand ? car.brand + " " : ""}${car.name}`,
          carImg:            car.img || "",
          dateFrom:          pickupDate.toISOString().split("T")[0],
          dateTo:            returnDate.toISOString().split("T")[0],
          days,
          total,
          deposit,
          customerEmail:     form.email,
          customerFirstName: form.firstName,
          customerLastName:  form.lastName,
          customerPhone:     form.phone,
          city:              form.city,
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
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#0f0e1a] border border-white/[0.1] rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.07] flex items-start justify-between gap-3">
          <div>
            <h2 className="font-playfair text-xl font-bold">Finaliser la réservation</h2>
            <p className="text-[12px] text-cream/45 mt-0.5">
              {car.brand ? `${car.brand} ` : ""}{car.name} · {fmtDate(pickupDate)} → {fmtDate(returnDate)}
            </p>
          </div>
          <button onClick={onClose} className="text-cream/40 hover:text-cream text-xl bg-transparent border-none cursor-pointer shrink-0">✕</button>
        </div>

        {/* Récap prix */}
        <div className="mx-6 mt-5 bg-gold/[0.07] border border-gold/20 rounded-xl p-4">
          <div className="flex justify-between text-[13px] mb-1.5">
            <span className="text-cream/55">{car.price} € × {days} jour{days > 1 ? "s" : ""}</span>
            <span className="font-semibold">{total} €</span>
          </div>
          <div className="flex justify-between text-[13px] mb-2">
            <span className="text-cream/55">Acompte à payer maintenant (40%)</span>
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
              <label className="block text-[11px] font-semibold text-cream/50 tracking-widest uppercase mb-1.5">Prénom *</label>
              <input
                className="input-field"
                placeholder="Mohamed"
                value={form.firstName}
                onChange={update("firstName")}
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-cream/50 tracking-widest uppercase mb-1.5">Nom *</label>
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
            <label className="block text-[11px] font-semibold text-cream/50 tracking-widest uppercase mb-1.5">Email *</label>
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
              <label className="block text-[11px] font-semibold text-cream/50 tracking-widest uppercase mb-1.5">Téléphone</label>
              <input
                type="tel"
                className="input-field"
                placeholder="+212 6..."
                value={form.phone}
                onChange={update("phone")}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-cream/50 tracking-widest uppercase mb-1.5">Ville</label>
              <input
                className="input-field"
                placeholder="Marrakech"
                value={form.city}
                onChange={update("city")}
              />
            </div>
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
