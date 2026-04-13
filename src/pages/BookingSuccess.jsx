import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

export default function BookingSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    fetch(`${BACKEND}/api/stripe/session/${sessionId}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sessionId]);

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "—";

  return (
    <div className="font-sora bg-dark-bg text-cream min-h-screen">
      <Navbar />
      <div className="max-w-[560px] mx-auto pt-[120px] pb-20 px-5">

        {loading ? (
          <div className="flex justify-center pt-20">
            <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Success icon */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">
                ✅
              </div>
              <h1 className="font-playfair text-3xl font-bold mb-2">Réservation confirmée !</h1>
              <p className="text-cream/50 text-sm">
                {data?.customerEmail
                  ? `Un email de confirmation a été envoyé à ${data.customerEmail}`
                  : "Votre réservation a été enregistrée avec succès."}
              </p>
            </div>

            {data && (
              <>
                {/* Car image */}
                {data.carImg && (
                  <div className="rounded-2xl overflow-hidden h-44 mb-5">
                    <img src={data.carImg} alt={data.carName} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Recap */}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 mb-4 space-y-3">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-cream/50">Véhicule</span>
                    <span className="font-semibold">{data.carName}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-cream/50">Départ</span>
                    <span className="font-semibold">{fmtDate(data.dateFrom)}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-cream/50">Retour</span>
                    <span className="font-semibold">{fmtDate(data.dateTo)}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-cream/50">Durée</span>
                    <span className="font-semibold">{data.days} jour{Number(data.days) > 1 ? "s" : ""}</span>
                  </div>
                  {data.deliveryCity && (
                    <div className="flex justify-between text-[13px]">
                      <span className="text-cream/50">Ville de livraison</span>
                      <span className="font-semibold text-gold">{data.deliveryCity}</span>
                    </div>
                  )}
                  {data.deliveryAddress && (
                    <div className="flex justify-between text-[13px] gap-4">
                      <span className="text-cream/50 shrink-0">Adresse de livraison</span>
                      <span className="font-semibold text-gold text-right">{data.deliveryAddress}</span>
                    </div>
                  )}
                </div>

                {/* Payment recap */}
                <div className="bg-gold/[0.07] border border-gold/20 rounded-2xl p-5 mb-6">
                  <div className="flex justify-between text-[13px] mb-2">
                    <span className="text-cream/55">Total location</span>
                    <span className="font-semibold">{Number(data.total).toLocaleString("fr-FR")} €</span>
                  </div>
                  <div className="flex justify-between text-[13px] mb-3">
                    <span className="text-cream/55">Acompte payé</span>
                    <span className="font-bold text-green-400">✓ {Number(data.amountPaid).toLocaleString("fr-FR")} €</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-white/[0.07]">
                    <span className="font-bold text-[14px]">Solde à payer sur place</span>
                    <span className="font-extrabold text-gold text-lg">
                      {(Number(data.total) - Number(data.amountPaid)).toLocaleString("fr-FR")} €
                    </span>
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col gap-3">
              <Link to="/client/dashboard" className="btn-primary py-3.5 text-sm text-center no-underline">
                Mon espace client →
              </Link>
              <Link to="/cars" className="py-3.5 text-sm text-center text-cream/50 hover:text-cream transition-colors no-underline">
                Explorer d'autres véhicules
              </Link>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
