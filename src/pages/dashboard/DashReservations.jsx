import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

const S_COLOR = {
  confirmed: "#22c55e",
  pending: "#f59e0b",
  completed: "#6366f1",
  cancelled: "#ef4444",
};
const S_LABEL = {
  confirmed: "Confirmée",
  pending: "En attente",
  completed: "Terminée",
  cancelled: "Annulée",
};
const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function StatusBadge({ status }) {
  return (
    <span
      className="inline-flex items-center justify-center min-w-[80px] py-1.5 px-3.5 rounded-[30px] text-[11px] font-bold tracking-wide whitespace-nowrap text-center"
      style={{
        color: S_COLOR[status],
        background: `${S_COLOR[status]}15`,
        border: `1px solid ${S_COLOR[status]}30`,
      }}
    >
      {S_LABEL[status]}
    </span>
  );
}

// Modal de confirmation de paiement cash
function ConfirmCashModal({ reservation, onConfirm, onClose }) {
  const solde = reservation.prixTotal - reservation.acompte;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
      <div className="bg-dark border border-gold/30 rounded-3xl p-6 md:p-8 max-w-[450px] w-full shadow-2xl">
        <h3 className="text-lg md:text-xl mb-4 flex items-center gap-2">
          <span className="text-2xl">💶</span> Confirmer le paiement cash
        </h3>
        <p className="text-cream/70 mb-6 text-sm leading-relaxed">
          Avez-vous bien reçu{" "}
          <strong className="text-gold text-lg">{solde} DH</strong> en cash de{" "}
          <strong>{reservation.client}</strong> pour la {reservation.carName} ?
        </p>
        <div className="bg-gold/10 rounded-2xl p-5 mb-7 border border-gold/15">
          <div className="flex justify-between mb-3 text-sm">
            <span className="text-cream/60">Prix total :</span>
            <span className="font-bold">{reservation.prixTotal} DH</span>
          </div>
          <div className="flex justify-between mb-3 text-sm">
            <span className="text-cream/60">Déjà payé en ligne :</span>
            <span className="font-bold">{reservation.acompte} DH</span>
          </div>
          <div className="flex justify-between border-t border-gold/30 pt-3 text-base">
            <span className="font-bold">Solde à confirmer :</span>
            <span className="font-extrabold text-gold text-lg">{solde} DH</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-transparent border border-white/15 rounded-[40px] text-cream/70 cursor-pointer text-sm font-semibold transition-all duration-200 hover:bg-white/5"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 bg-gold border-none rounded-[40px] text-dark-bg font-bold cursor-pointer text-sm transition-all duration-200 hover:bg-[#e5b95a] hover:scale-[1.02]"
          >
            ✓ Confirmer le paiement
          </button>
        </div>
      </div>
    </div>
  );
}

// Sidebar des détails
function ReservationSidebar({
  reservation,
  onClose,
  onUpdateStatus,
  onConfirmCash,
}) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const solde = reservation.prixTotal - reservation.acompte;

  const dateDebut = new Date(reservation.from);
  const dateFin = new Date(reservation.to);
  const duree = Math.ceil((dateFin - dateDebut) / (1000 * 60 * 60 * 24));

  return (
    <>
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-[500px] bg-[#0f0f14] border-l border-gold/20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-[1000] overflow-y-auto p-6 md:p-8 animate-slide-in">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 bg-white/5 border-none w-11 h-11 rounded-full text-xl text-cream cursor-pointer flex items-center justify-center transition-all duration-200 z-10 hover:bg-gold/20 hover:text-gold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-7 pr-12 font-playfair">
          Détails de la réservation
        </h2>

        {/* Image du véhicule */}
        <div className="w-full h-[200px] rounded-2xl overflow-hidden mb-6 relative border border-gold/30">
          <img
            src={reservation.carImg}
            alt={reservation.carName}
            className="w-full h-full object-cover"
          />
          {reservation.carCategory && (
            <div className="absolute top-4 left-4 bg-gold/90 text-dark-bg py-1.5 px-3.5 rounded-[30px] text-xs font-bold">
              {reservation.carCategory}
            </div>
          )}
        </div>

        {/* Client info */}
        <div className="bg-gold/10 rounded-2xl p-6 mb-6 border border-gold/15">
          <div className="flex items-center gap-5">
            <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-br from-gold to-[#8a6520] flex items-center justify-center text-[22px] font-extrabold text-dark-bg shrink-0">
              {reservation.client
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <div className="font-bold text-xl">{reservation.client}</div>
              <div className="text-sm text-cream/50 mt-1.5 flex gap-3">
                <span>📍 {reservation.city}</span>
                {reservation.phone && <span>📞 {reservation.phone}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Infos véhicule */}
        <div className="bg-dark rounded-2xl p-6 mb-6 border border-white/[0.07]">
          <div className="font-bold text-lg mb-4">🚗 Véhicule</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-cream/40 mb-1">Marque</div>
              <div className="font-semibold text-base">
                {reservation.carBrand || "-"}
              </div>
            </div>
            <div>
              <div className="text-xs text-cream/40 mb-1">Modèle</div>
              <div className="font-semibold text-base">
                {reservation.carName}
              </div>
            </div>
            <div>
              <div className="text-xs text-cream/40 mb-1">Année</div>
              <div className="font-semibold text-base">
                {reservation.carYear || "-"}
              </div>
            </div>
            <div>
              <div className="text-xs text-cream/40 mb-1">Immatriculation</div>
              <div className="font-semibold text-base font-mono">
                {reservation.carPlate || "-"}
              </div>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-dark rounded-2xl p-6 mb-6 border border-white/[0.07]">
          <div className="font-bold text-lg mb-4">📅 Dates</div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                🚀
              </div>
              <div>
                <div className="text-xs text-cream/40">Début</div>
                <div className="font-semibold text-base">
                  {dateDebut.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                🏁
              </div>
              <div>
                <div className="text-xs text-cream/40">Fin</div>
                <div className="font-semibold text-base">
                  {dateFin.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
            <div className="mt-2 py-3 px-3 bg-gold/5 rounded-xl text-center font-semibold text-gold">
              Durée : {duree} jour{duree > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Paiement */}
        <div className="bg-dark rounded-2xl p-6 mb-6 border border-white/[0.07]">
          <div className="font-bold text-lg mb-4">💳 Paiement</div>

          <div className="mb-6">
            <div className="flex justify-between text-[13px] mb-2">
              <span className="text-green-500">
                ✓ En ligne: {reservation.acompte} DH
              </span>
              <span
                style={{
                  color: reservation.cashConfirme ? "#22c55e" : "#f59e0b",
                }}
              >
                {reservation.cashConfirme ? "✓" : "⏳"} Cash: {solde} DH
              </span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-[5px] overflow-hidden flex">
              <div
                style={{
                  width: `${(reservation.acompte / reservation.prixTotal) * 100}%`,
                  background: "#22c55e",
                }}
                className="h-full"
              />
              <div
                style={{
                  width: `${(solde / reservation.prixTotal) * 100}%`,
                  background: reservation.cashConfirme ? "#22c55e" : "#f59e0b",
                  opacity: reservation.cashConfirme ? 1 : 0.5,
                }}
                className="h-full"
              />
            </div>
          </div>

          <div className="bg-black/30 rounded-2xl p-4 mb-5">
            <div className="flex justify-between mb-2">
              <span className="text-cream/60">Prix total</span>
              <span className="font-bold text-lg">
                {reservation.prixTotal} DH
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-cream/60">Commission (10%)</span>
              <span className="font-bold text-red-500">
                -{Math.round(reservation.prixTotal * 0.1)} DH
              </span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2">
              <span className="font-bold">Net agence</span>
              <span className="font-extrabold text-gold text-xl">
                {Math.round(reservation.prixTotal * 0.9)} DH
              </span>
            </div>
          </div>

          {!reservation.cashConfirme && reservation.status !== "cancelled" && (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full py-4 bg-gold/10 border border-gold/30 rounded-[40px] text-gold font-bold text-[15px] cursor-pointer mb-4 transition-all duration-200 hover:bg-gold/20"
            >
              ✓ Confirmer paiement cash ({solde} DH)
            </button>
          )}

          {reservation.cashConfirme && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl py-3.5 px-3.5 text-green-500 text-sm flex items-center gap-2.5 mb-4">
              <span className="text-xl">✅</span>
              <span>
                Paiement cash confirmé le{" "}
                {new Date(reservation.cashConfirmedAt).toLocaleDateString(
                  "fr-FR",
                )}
              </span>
            </div>
          )}

          {reservation.note && (
            <div className="bg-gold/5 rounded-2xl p-4 border-l-4 border-gold">
              <div className="text-xs text-cream/40 mb-1.5">
                💬 Note du client
              </div>
              <div className="text-sm italic">"{reservation.note}"</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {reservation.status !== "cancelled" &&
            reservation.status !== "completed" && (
              <>
                <button
                  onClick={() => onUpdateStatus(reservation.id, "confirmed")}
                  className="py-4 bg-green-500 border-none rounded-[40px] text-dark-bg font-bold text-[15px] cursor-pointer transition-all duration-200 hover:bg-green-400"
                >
                  ✓ Confirmer la réservation
                </button>
                <button
                  onClick={() => onUpdateStatus(reservation.id, "cancelled")}
                  className="py-4 bg-transparent border border-red-500/50 rounded-[40px] text-red-500 font-semibold text-[15px] cursor-pointer transition-all duration-200 hover:bg-red-500/10"
                >
                  ✕ Annuler la réservation
                </button>
              </>
            )}
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmCashModal
          reservation={reservation}
          onConfirm={() => {
            onConfirmCash(reservation.id);
            setShowConfirmModal(false);
          }}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
}

export default function DashReservations() {
  const [reservations, setReservations] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agencyId, setAgencyId] = useState(null);
  const [view, setView] = useState("list");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedCar, setSelectedCar] = useState("all");
  // États pour l'ajout de réservation
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReservation, setNewReservation] = useState({
    car_id: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    date_from: "",
    date_to: "",
    days: 1,
    total: 0,
    deposit: 0,
    city: "",
    note: "",
    status: "pending",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Charger l'agence et les données
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // Récupérer l'agence
        const { data: agency } = await supabase
          .from("agencies")
          .select("id")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (!agency) return;
        setAgencyId(agency.id);

        // Récupérer les voitures de l'agence (sans plate pour éviter erreur si colonne absente)
        const { data: carsData } = await supabase
          .from("cars")
          .select("id, name, brand, year, category, img, price") // price ajouté pour le calcul
          .eq("agency_id", agency.id);
        setCars(carsData || []);

        // Récupérer les réservations
        const { data: resData } = await supabase
          .from("reservations")
          .select("*")
          .eq("agency_id", agency.id)
          .order("created_at", { ascending: false });

        if (resData) {
          // Enrichir avec les infos des voitures
          const enriched = resData.map((r) => {
            const car = carsData?.find((c) => c.id === r.car_id) || {};
            return {
              ...r,
              client: r.client_name,
              carName: car.name || "Inconnue",
              carBrand: car.brand,
              carYear: car.year,
              carCategory: car.category,
              carImg: car.img,
              from: r.date_from,
              to: r.date_to,
              total: r.total,
              days: r.days,
              city: r.city,
              phone: r.client_phone,
              note: r.note,
              prixTotal: r.total,
              acompte: r.deposit || Math.round(r.total * 0.4),
              cashConfirme: r.cash_confirmed || false,
              cashConfirmedAt: r.cash_confirmed_at,
            };
          });
          setReservations(enriched);
        }
      } catch (err) {
        console.error("Erreur chargement réservations:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Fonction pour calculer jours et total lors de l'ajout
  const calculateDaysAndTotal = (from, to, carId) => {
    if (!from || !to || !carId) return;
    const start = new Date(from);
    const end = new Date(to);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const car = cars.find((c) => c.id === parseInt(carId));
    if (car) {
      setNewReservation((prev) => ({
        ...prev,
        days: diffDays,
        total: diffDays * car.price,
      }));
    } else {
      setNewReservation((prev) => ({ ...prev, days: diffDays }));
    }
  };

  // Ajout d'une réservation
  const handleAddReservation = async () => {
    try {
      if (
        !newReservation.car_id ||
        !newReservation.client_name ||
        !newReservation.date_from ||
        !newReservation.date_to
      ) {
        alert("Veuillez remplir tous les champs obligatoires");
        return;
      }

      const { error } = await supabase.from("reservations").insert([
        {
          agency_id: agencyId,
          car_id: newReservation.car_id,
          client_name: newReservation.client_name,
          client_email: newReservation.client_email,
          client_phone: newReservation.client_phone,
          date_from: newReservation.date_from,
          date_to: newReservation.date_to,
          days: newReservation.days,
          total: newReservation.total,
          deposit: newReservation.deposit,
          city: newReservation.city,
          note: newReservation.note,
          status: newReservation.status,
          cash_confirmed: false,
        },
      ]);

      if (error) throw error;

      // Recharger les réservations
      const { data: newRes } = await supabase
        .from("reservations")
        .select("*")
        .eq("agency_id", agencyId)
        .order("created_at", { ascending: false });

      // Enrichir avec les infos des voitures
      const enriched = newRes.map((r) => {
        const car = cars.find((c) => c.id === r.car_id) || {};
        return {
          ...r,
          client: r.client_name,
          carName: car.name || "Inconnue",
          carBrand: car.brand,
          carYear: car.year,
          carCategory: car.category,
          carImg: car.img,
          from: r.date_from,
          to: r.date_to,
          total: r.total,
          days: r.days,
          city: r.city,
          phone: r.client_phone,
          note: r.note,
          prixTotal: r.total,
          acompte: r.deposit || Math.round(r.total * 0.4),
          cashConfirme: r.cash_confirmed || false,
          cashConfirmedAt: r.cash_confirmed_at,
        };
      });
      setReservations(enriched);
      setShowAddModal(false);
      // Réinitialiser le formulaire
      setNewReservation({
        car_id: "",
        client_name: "",
        client_email: "",
        client_phone: "",
        date_from: "",
        date_to: "",
        days: 1,
        total: 0,
        deposit: 0,
        city: "",
        note: "",
        status: "pending",
      });
    } catch (err) {
      console.error("Erreur ajout réservation:", err);
      alert("Erreur lors de l'ajout");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from("reservations")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r)),
      );
      if (selected?.id === id) setSelected((prev) => ({ ...prev, status }));
    } catch (err) {
      console.error("Erreur mise à jour statut:", err);
    }
  };

  const confirmCash = async (id) => {
    try {
      const { error } = await supabase
        .from("reservations")
        .update({
          cash_confirmed: true,
          cash_confirmed_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      setReservations((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                cashConfirme: true,
                cashConfirmedAt: new Date().toISOString(),
              }
            : r,
        ),
      );
      if (selected?.id === id) {
        setSelected((prev) => ({
          ...prev,
          cashConfirme: true,
          cashConfirmedAt: new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.error("Erreur confirmation cash:", err);
    }
  };

  const openSidebar = (reservation) => {
    setSelected(reservation);
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setTimeout(() => setSelected(null), 300);
  };

  // Filtrage
  const filtered = reservations.filter(
    (r) => filter === "all" || r.status === filter,
  );

  // Calendrier
  const firstDay = new Date(calYear, calMonth, 1);
  const lastDay = new Date(calYear, calMonth + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();
  const cells = Array.from(
    { length: Math.ceil((startDow + totalDays) / 7) * 7 },
    (_, i) => {
      const day = i - startDow + 1;
      return day >= 1 && day <= totalDays ? day : null;
    },
  );

  const resOnDay = (day) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return filtered.filter((r) => r.from <= dateStr && r.to >= dateStr);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 md:gap-7 max-w-[1400px] mx-auto p-4 md:p-6 min-h-screen relative">
      {/* Header */}
      <div className="flex justify-between flex-wrap items-end gap-4 mb-2">
        <div>
          <div className="w-9 md:w-12 h-0.5 bg-gold rounded mb-4 md:mb-5" />
          <h1 className="font-playfair text-2xl md:text-3xl font-bold leading-tight">
            Réservations
          </h1>
          <p className="text-cream/55 text-sm mt-1.5">
            {reservations.length} réservations au total
          </p>
        </div>

        <div className="flex gap-2">
          {/* Bouton Nouvelle réservation */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gold text-dark-bg py-2 px-4 rounded-lg font-bold text-sm flex items-center gap-2"
          >
            ➕ Nouvelle réservation
          </button>

          {/* View toggle */}
          <div
            className={`flex bg-white/[0.04] rounded-[40px] p-1 border border-white/[0.07] ${isMobile ? "w-full" : "w-auto"}`}
          >
            {[
              ["list", "☰ Liste"],
              ["calendar", "📅 Calendrier"],
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex-1 md:flex-none py-2 md:py-2 px-5 rounded-[30px] border-none font-bold text-sm md:text-[13px] cursor-pointer transition-all duration-200 whitespace-nowrap ${
                  view === v
                    ? "bg-gold text-dark-bg"
                    : "bg-transparent text-cream/55"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status pills */}
      <div className="flex gap-2.5 flex-wrap pb-1">
        {[
          {
            val: "all",
            label: "Toutes",
            count: reservations.length,
            color: null,
          },
          {
            val: "confirmed",
            label: "Confirmée",
            count: reservations.filter((r) => r.status === "confirmed").length,
            color: S_COLOR.confirmed,
          },
          {
            val: "pending",
            label: "En attente",
            count: reservations.filter((r) => r.status === "pending").length,
            color: S_COLOR.pending,
          },
          {
            val: "completed",
            label: "Terminée",
            count: reservations.filter((r) => r.status === "completed").length,
            color: S_COLOR.completed,
          },
          {
            val: "cancelled",
            label: "Annulée",
            count: reservations.filter((r) => r.status === "cancelled").length,
            color: S_COLOR.cancelled,
          },
        ].map(({ val, label, count, color }) => {
          const isActive = filter === val;
          return (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`inline-flex items-center gap-2 py-2 md:py-2 px-4 rounded-[40px] font-semibold text-xs md:text-[12px] cursor-pointer transition-all duration-200 justify-center ${
                isMobile ? "min-w-0" : "min-w-[100px]"
              }`}
              style={{
                border: `1px solid ${isActive ? color || "#d4a853" : "rgba(255,255,255,0.1)"}`,
                background: isActive
                  ? `${color || "#d4a853"}15`
                  : "transparent",
                color: isActive ? color || "#d4a853" : "rgba(240,238,234,0.6)",
              }}
            >
              <span>{label}</span>
              <span
                className="py-0.5 px-2 rounded-[20px] text-[11px] font-bold min-w-6 text-center"
                style={{
                  background: isActive
                    ? color || "#d4a853"
                    : "rgba(255,255,255,0.1)",
                  color: isActive ? "#0a0a0f" : "rgba(240,238,234,0.6)",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List view */}
      {view === "list" && (
        <div className="flex flex-col gap-3">
          {filtered.length > 0 ? (
            filtered.map((r) => (
              <div
                key={r.id}
                onClick={() => openSidebar(r)}
                className={`bg-dark border border-white/[0.07] rounded-2xl p-4 md:p-5 md:px-6 cursor-pointer transition-all duration-200 flex gap-4 hover:border-gold/30 hover:bg-dark-lighter hover:-translate-y-0.5 ${
                  isMobile
                    ? "flex-col items-stretch"
                    : "flex-row justify-between items-center"
                }`}
              >
                <div className="flex gap-4 items-center flex-1">
                  <div
                    className={`rounded-2xl bg-gradient-to-br from-gold to-[#8a6520] flex items-center justify-center font-extrabold text-dark-bg shrink-0 ${
                      isMobile
                        ? "w-12 h-12 text-base"
                        : "w-[52px] h-[52px] text-lg"
                    }`}
                  >
                    {r.client
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[15px] md:text-base mb-1.5">
                      {r.client}
                    </div>
                    <div className="text-xs md:text-[13px] text-cream/50 flex flex-col gap-1">
                      <div className="flex gap-3 flex-wrap">
                        <span>🚗 {r.carName}</span>
                        <span>📍 {r.city}</span>
                      </div>
                      {r.note && (
                        <div className="text-[11px] text-gold/80 italic max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
                          💬 {r.note}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-5 flex-wrap ${isMobile ? "justify-between" : "justify-end ml-auto"}`}
                >
                  <div
                    className={`flex flex-col ${isMobile ? "items-start" : "items-end"}`}
                  >
                    <div className="font-extrabold text-gold text-base md:text-lg">
                      {r.total} DH
                    </div>
                    <div className="text-[11px] text-cream/40">
                      {r.days} jours
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 md:py-16 px-5 md:px-16 text-cream/30 text-sm md:text-[15px] bg-dark rounded-3xl border border-white/[0.07]">
              <div className="text-5xl mb-4">📭</div>
              Aucune réservation trouvée
            </div>
          )}
        </div>
      )}

      {/* Calendar view */}
      {view === "calendar" && (
        <div className="bg-dark border border-white/[0.07] rounded-3xl overflow-hidden p-6 md:p-7">
          <div className="flex justify-between items-center mb-7 flex-wrap gap-4">
            <div className="flex gap-3 items-center">
              <button
                onClick={() => {
                  if (calMonth === 0) {
                    setCalMonth(11);
                    setCalYear((y) => y - 1);
                  } else {
                    setCalMonth((m) => m - 1);
                  }
                }}
                className="bg-white/5 border border-white/10 text-cream w-10 h-10 rounded-xl cursor-pointer text-lg flex items-center justify-center"
              >
                ←
              </button>
              <h3 className="font-playfair text-xl font-bold min-w-[220px] text-center">
                {MONTHS[calMonth]} {calYear}
              </h3>
              <button
                onClick={() => {
                  if (calMonth === 11) {
                    setCalMonth(0);
                    setCalYear((y) => y + 1);
                  } else {
                    setCalMonth((m) => m + 1);
                  }
                }}
                className="bg-white/5 border border-white/10 text-cream w-10 h-10 rounded-xl cursor-pointer text-lg flex items-center justify-center"
              >
                →
              </button>
            </div>

            {/* Filtre par voiture */}
            <select
              value={selectedCar}
              onChange={(e) => setSelectedCar(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-cream text-sm cursor-pointer min-w-[200px]"
            >
              <option value="all">🚗 Tous les véhicules</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-7 mb-4">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center py-3.5 text-sm font-bold text-cream/45 tracking-wide border-b border-white/[0.07]"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2.5 min-h-[800px]">
            {cells.map((day, i) => {
              const today = new Date();
              const isToday =
                day === today.getDate() &&
                calMonth === today.getMonth() &&
                calYear === today.getFullYear();
              const res = day ? resOnDay(day) : [];
              const hasReservations = res.length > 0;

              return (
                <div
                  key={i}
                  className={`rounded-[18px] p-4 min-h-[160px] transition-all duration-200 flex flex-col ${
                    day ? "cursor-pointer" : "cursor-default"
                  }`}
                  style={{
                    background: day
                      ? hasReservations
                        ? "rgba(212,168,83,0.03)"
                        : "transparent"
                      : "rgba(0,0,0,0.2)",
                    border: `1px solid ${hasReservations ? "rgba(212,168,83,0.2)" : "rgba(255,255,255,0.05)"}`,
                  }}
                >
                  {day && (
                    <>
                      <div className="flex justify-between items-center mb-3.5">
                        <span
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-semibold ${
                            isToday
                              ? "font-extrabold text-gold bg-gold/15"
                              : "text-cream/80"
                          }`}
                        >
                          {day}
                        </span>
                        {res.length > 0 && (
                          <span className="bg-gold text-dark-bg text-xs font-bold py-1 px-3 rounded-[20px]">
                            {res.length}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-[120px]">
                        {res.slice(0, 3).map((r) => (
                          <div
                            key={r.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              openSidebar(r);
                            }}
                            className="text-xs font-semibold py-2.5 px-3 rounded-lg cursor-pointer flex justify-between items-center transition-all duration-200"
                            style={{
                              background: `${S_COLOR[r.status]}15`,
                              borderLeft: `4px solid ${S_COLOR[r.status]}`,
                              color: S_COLOR[r.status],
                            }}
                          >
                            <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[90px]">
                              {r.client.split(" ")[0]}
                            </span>
                            <span className="font-bold">{r.total} DH</span>
                          </div>
                        ))}
                        {res.length > 3 && (
                          <div className="text-[11px] text-cream/50 text-center py-1.5 px-1.5 bg-white/[0.03] rounded-md">
                            +{res.length - 3} autre
                            {res.length - 3 > 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] animate-fade-in"
          />
          <ReservationSidebar
            reservation={selected}
            onClose={closeSidebar}
            onUpdateStatus={updateStatus}
            onConfirmCash={confirmCash}
          />
        </>
      )}

      {/* Modal d'ajout de réservation */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
          <div className="bg-dark border border-gold/30 rounded-3xl p-6 md:p-8 max-w-[600px] w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">➕ Nouvelle réservation</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-cream/60 hover:text-cream text-2xl"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddReservation();
              }}
              className="space-y-4"
            >
              {/* Véhicule */}
              <div>
                <label className="text-gold text-xs font-bold uppercase tracking-wide mb-1 block">
                  Véhicule *
                </label>
                <select
                  value={newReservation.car_id}
                  onChange={(e) => {
                    const carId = e.target.value;
                    setNewReservation((prev) => ({ ...prev, car_id: carId }));
                    calculateDaysAndTotal(
                      newReservation.date_from,
                      newReservation.date_to,
                      carId,
                    );
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-cream"
                  required
                >
                  <option value="">Sélectionner un véhicule</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.name} - {car.price} DH/jour
                    </option>
                  ))}
                </select>
              </div>

              {/* Client */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gold text-xs font-bold uppercase tracking-wide mb-1 block">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={newReservation.client_name}
                    onChange={(e) =>
                      setNewReservation((prev) => ({
                        ...prev,
                        client_name: e.target.value,
                      }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-cream"
                    required
                  />
                </div>
                <div>
                  <label className="text-gold text-xs font-bold uppercase tracking-wide mb-1 block">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={newReservation.client_phone}
                    onChange={(e) =>
                      setNewReservation((prev) => ({
                        ...prev,
                        client_phone: e.target.value,
                      }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-cream"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-gold text-xs font-bold uppercase tracking-wide mb-1 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newReservation.client_email}
                    onChange={(e) =>
                      setNewReservation((prev) => ({
                        ...prev,
                        client_email: e.target.value,
                      }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-cream"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gold text-xs font-bold uppercase tracking-wide mb-1 block">
                    Date début *
                  </label>
                  <input
                    type="date"
                    value={newReservation.date_from}
                    onChange={(e) => {
                      const from = e.target.value;
                      setNewReservation((prev) => ({
                        ...prev,
                        date_from: from,
                      }));
                      calculateDaysAndTotal(
                        from,
                        newReservation.date_to,
                        newReservation.car_id,
                      );
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-cream"
                    required
                  />
                </div>
                <div>
                  <label className="text-gold text-xs font-bold uppercase tracking-wide mb-1 block">
                    Date fin *
                  </label>
                  <input
                    type="date"
                    value={newReservation.date_to}
                    onChange={(e) => {
                      const to = e.target.value;
                      setNewReservation((prev) => ({ ...prev, date_to: to }));
                      calculateDaysAndTotal(
                        newReservation.date_from,
                        to,
                        newReservation.car_id,
                      );
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-cream"
                    required
                  />
                </div>
              </div>

              {/* Résumé */}
              <div className="bg-gold/10 rounded-xl p-4 border border-gold/20">
                <div className="flex justify-between mb-2">
                  <span>Nombre de jours</span>
                  <span className="font-bold">{newReservation.days}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Prix total</span>
                  <span className="font-bold text-gold">
                    {newReservation.total} DH
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Acompte (optionnel)</span>
                  <input
                    type="number"
                    value={newReservation.deposit}
                    onChange={(e) =>
                      setNewReservation((prev) => ({
                        ...prev,
                        deposit: Number(e.target.value),
                      }))
                    }
                    className="w-24 bg-white/5 border border-white/10 rounded p-1 text-right"
                    min="0"
                    step="100"
                  />
                </div>
              </div>

              {/* Ville et note */}
              <div>
                <label className="text-gold text-xs font-bold uppercase tracking-wide mb-1 block">
                  Ville
                </label>
                <input
                  type="text"
                  value={newReservation.city}
                  onChange={(e) =>
                    setNewReservation((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-cream"
                  placeholder="Casablanca"
                />
              </div>
              <div>
                <label className="text-gold text-xs font-bold uppercase tracking-wide mb-1 block">
                  Note
                </label>
                <textarea
                  value={newReservation.note}
                  onChange={(e) =>
                    setNewReservation((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-cream"
                  rows="2"
                  placeholder="Informations complémentaires..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-transparent border border-white/15 rounded-lg text-cream/70 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gold rounded-lg text-dark-bg font-bold"
                >
                  Créer la réservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styles pour animations */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease;
        }
      `}</style>
    </div>
  );
}
