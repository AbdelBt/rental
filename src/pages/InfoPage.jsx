import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useBreakpoint from "../hooks/useBreakpoint";
import { useState } from "react";

const PAGES = {
  "pourquoi-nous": {
    title: "Pourquoi choisir Drivo ?",
    subtitle: "La location de voiture au Maroc, réinventée.",
    sections: [
      { icon: "📱", title: "100% Digital", body: "Réservez en quelques clics depuis n'importe où dans le monde. Contrat, documents et confirmation envoyés par email immédiatement." },
      { icon: "💳", title: "Paiement sécurisé", body: "Vous payez uniquement l'acompte (40%) sur notre plateforme. Le reste est réglé directement au loueur sur place. Zéro mauvaise surprise." },
      { icon: "🔍", title: "Véhicules vérifiés", body: "Chaque véhicule sur Drivo est contrôlé : assurance à jour, contrôle technique valide, photos réelles. Pas de mauvaises surprises à l'arrivée." },
      { icon: "🚀", title: "Livraison à domicile", body: "Votre voiture livrée à l'hôtel, à l'aéroport ou à domicile. Disponible dans toutes nos villes partenaires." },
      { icon: "🛡️", title: "Sans caution sur la majorité", body: "Contrairement aux grandes agences, la plupart de nos loueurs ne demandent pas de caution. Votre carte bancaire reste libre." },
      { icon: "📞", title: "Support 24h/24", body: "Une équipe disponible à tout moment pour vous aider avant, pendant et après votre location. En français, néerlandais et arabe." },
    ],
  },
  "maroc-infos": {
    title: "Conduire au Maroc",
    subtitle: "Tout ce que vous devez savoir avant de prendre la route.",
    sections: [
      { icon: "🚦", title: "Mêmes règles qu'en Europe", body: "Pas de mauvaises surprises : les règles de conduite au Maroc sont quasi identiques à celles de l'Europe. Priorité à droite, respect des feux, ceinture obligatoire." },
      { icon: "🏎️", title: "Limites de vitesse", body: "En ville : 50 km/h · Sur route : 100 km/h · Sur autoroute : 120 km/h. Exactement les mêmes qu'en Belgique ou en France." },
      { icon: "🛣️", title: "Autoroutes modernes", body: "Le Maroc dispose d'un réseau autoroutier moderne reliant toutes les grandes villes. Casablanca-Marrakech : 2h30, Casablanca-Tanger : 3h." },
      { icon: "📋", title: "Documents requis", body: "Permis de conduire européen valide (pas besoin de permis international). Passeport ou carte d'identité. Le loueur fournit tous les documents du véhicule." },
      { icon: "⛽", title: "Carburant", body: "Les stations-service sont nombreuses sur les grands axes. Prix environ 40% moins cher qu'en Europe. Acceptent Visa/Mastercard dans les grandes villes." },
      { icon: "🔒", title: "Sécurité routière", body: "Les grands axes sont sûrs et bien entretenus. Restez vigilant en ville (conduite parfois agressive). La nuit, évitez les routes secondaires isolées." },
    ],
  },
  "paiement-securise": {
    title: "Paiement sécurisé",
    subtitle: "Transparent, sécurisé, sans mauvaises surprises.",
    sections: [
      { icon: "1️⃣", title: "Étape 1 : Réservation en ligne", body: "Choisissez votre véhicule et vos dates. Payez uniquement l'acompte (40% du total) sur notre plateforme sécurisée via Stripe." },
      { icon: "2️⃣", title: "Étape 2 : Confirmation immédiate", body: "Vous recevez immédiatement un email de confirmation avec tous les détails : véhicule, dates, loueur, montant restant à payer sur place." },
      { icon: "3️⃣", title: "Étape 3 : Paiement sur place", body: "Le jour J, vous payez le solde directement au loueur (espèces ou carte selon disponibilité). Le loueur vous remet une quittance officielle." },
      { icon: "🧾", title: "Preuves de paiement", body: "Pour chaque transaction, vous recevez un reçu de notre plateforme ET une quittance du loueur. Conservez-les pendant toute la durée de votre séjour." },
      { icon: "⚠️", title: "Politique d'annulation", body: "L'acompte versé n'est pas remboursable en cas d'annulation. En cas de force majeure documentée, un avoir peut être accordé. Les modifications de dates sont possibles sous conditions." },
      { icon: "🔐", title: "Sécurité des données", body: "Vos données bancaires sont chiffrées via Stripe (certifié PCI-DSS). Drivo ne stocke jamais vos informations de carte bancaire." },
    ],
  },
  "solutions-sur-mesure": {
    title: "Solutions sur mesure",
    subtitle: "Vous n'avez pas trouvé ce que vous cherchez ? On s'en occupe.",
    isContact: true,
  },
  faq: {
    title: "Questions fréquentes",
    subtitle: "Tout ce que vous voulez savoir sur la location avec Drivo.",
    isFaq: true,
  },
};

export default function InfoPage() {
  const { slug } = useParams();
  const { isMobile } = useBreakpoint();
  const page = PAGES[slug];

  if (!page)
    return (
      <div className="font-sora bg-dark-bg text-cream min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="text-5xl">🔍</div>
        <div className="text-xl font-bold">Page introuvable</div>
        <Link to="/" className="text-gold no-underline">← Retour à l'accueil</Link>
      </div>
    );

  return (
    <div className="font-sora bg-dark-bg text-cream min-h-screen">
      <Navbar />

      <div className="bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(212,168,83,0.1)_0%,transparent_60%),#0a0a0f] pt-[120px] pb-16 text-center px-5 md:px-10">
        <div className="w-12 h-0.5 bg-gold rounded mx-auto mb-6" />
        <h1 className="font-playfair text-[clamp(2rem,5vw,3.5rem)] font-bold mb-4">
          {page.title}
        </h1>
        <p className="text-cream/50 text-base max-w-[600px] mx-auto">
          {page.subtitle}
        </p>
        <div className="flex justify-center gap-2 mt-6 text-[13px] text-cream/40">
          <Link to="/" className="text-cream/40 no-underline">Accueil</Link>
          <span>›</span>
          <span className="text-gold">{page.title}</span>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto py-16 px-5 md:px-10 pb-20">
        {page.sections && (
          <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            {page.sections.map((s, i) => (
              <div key={i} className="bg-dark border border-white/[0.07] rounded-2xl p-7">
                <div className="text-[32px] mb-3.5">{s.icon}</div>
                <h3 className="font-bold text-[17px] mb-2.5 text-cream">
                  {s.title}
                </h3>
                <p className="text-cream/55 text-sm leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        )}

        {page.isContact && <ContactForm />}
        {page.isFaq && <FaqContent />}
      </div>

      <Footer />
    </div>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const { isMobile } = useBreakpoint();
  const labelClasses = "text-[11px] font-semibold text-gold tracking-[0.15em] uppercase block mb-2";

  return sent ? (
    <div className="text-center py-[60px]">
      <div className="text-[56px] mb-5">✅</div>
      <h3 className="font-playfair text-[28px] font-bold mb-3">Demande envoyée !</h3>
      <p className="text-cream/50 text-[15px]">
        Nous vous recontactons sous 24h avec les meilleures options disponibles.
      </p>
    </div>
  ) : (
    <div>
      <div className="bg-gold/10 border border-gold/20 rounded-2xl p-7 mb-8">
        <div className="text-[32px] mb-3">💡</div>
        <p className="text-cream/70 text-sm leading-relaxed">
          Vous cherchez un véhicule 9 places ? Un van avec chauffeur ? Une voiture avec siège bébé dans une ville spécifique ? Décrivez votre besoin et nous appelons nos partenaires loueurs au Maroc pour trouver la solution idéale.
        </p>
      </div>
      <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
        {[
          ["Votre prénom", "text"],
          ["Email", "email"],
          ["Téléphone / WhatsApp", "tel"],
          ["Ville au Maroc", "text"],
        ].map(([label, type]) => (
          <div key={label}>
            <label className={labelClasses}>{label}</label>
            <input type={type} className="input-field" placeholder={label} />
          </div>
        ))}
        <div className={isMobile ? "col-span-1" : "col-span-2"}>
          <label className={labelClasses}>Décrivez votre besoin</label>
          <textarea
            className="input-field resize-y min-h-[120px] font-sora"
            placeholder="Ex: Besoin d'un véhicule 9 places avec chauffeur à Marrakech du 15 au 22 juillet, budget max 8000 DH..."
          />
        </div>
        <div className={isMobile ? "col-span-1" : "col-span-2"}>
          <button className="btn-primary w-full py-4 text-sm" onClick={() => setSent(true)}>
            Envoyer ma demande →
          </button>
        </div>
      </div>
    </div>
  );
}

function FaqContent() {
  const [open, setOpen] = useState(null);
  const { faqs } = require("../data");
  return (
    <div>
      {faqs.map((f, i) => (
        <div key={i} className="border-b border-white/[0.06]">
          <div
            onClick={() => setOpen(open === i ? null : i)}
            className="flex justify-between items-center py-5 cursor-pointer text-base font-medium transition-colors hover:text-gold"
          >
            <span className="pr-4">{f.q}</span>
            <span
              className={`text-gold text-xl shrink-0 inline-block transition-transform ${
                open === i ? "rotate-45" : ""
              }`}
            >
              +
            </span>
          </div>
          {open === i && (
            <div className="text-cream/60 text-sm leading-relaxed pb-5">
              {f.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
