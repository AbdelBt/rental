import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function BookingCancel() {
  return (
    <div className="font-sora bg-dark-bg text-cream min-h-screen">
      <Navbar />
      <div className="max-w-[480px] mx-auto pt-[140px] pb-20 px-5 text-center">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
          ✕
        </div>
        <h1 className="font-playfair text-2xl font-bold mb-3">Paiement annulé</h1>
        <p className="text-cream/50 text-sm mb-8 leading-relaxed">
          Votre paiement a été annulé. Aucun montant n'a été débité.
          Vous pouvez réessayer ou choisir un autre véhicule.
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={() => window.history.back()} className="btn-primary py-3.5 text-sm cursor-pointer border-none">
            ← Réessayer
          </button>
          <Link to="/cars" className="py-3.5 text-sm text-cream/50 hover:text-cream transition-colors no-underline">
            Explorer les véhicules
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
