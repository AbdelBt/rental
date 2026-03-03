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
      {
        icon: "📱",
        title: "100% Digital",
        body: "Réservez en quelques clics depuis n'importe où dans le monde. Contrat, documents et confirmation envoyés par email immédiatement.",
      },
      {
        icon: "💳",
        title: "Paiement sécurisé",
        body: "Vous payez uniquement l'acompte (10%) sur notre plateforme. Le reste est réglé directement au loueur sur place. Zéro mauvaise surprise.",
      },
      {
        icon: "🔍",
        title: "Véhicules vérifiés",
        body: "Chaque véhicule sur Drivo est contrôlé : assurance à jour, contrôle technique valide, photos réelles. Pas de mauvaises surprises à l'arrivée.",
      },
      {
        icon: "🚀",
        title: "Livraison à domicile",
        body: "Votre voiture livrée à l'hôtel, à l'aéroport ou à domicile. Disponible dans toutes nos villes partenaires.",
      },
      {
        icon: "🛡️",
        title: "Sans caution sur la majorité",
        body: "Contrairement aux grandes agences, la plupart de nos loueurs ne demandent pas de caution. Votre carte bancaire reste libre.",
      },
      {
        icon: "📞",
        title: "Support 24h/24",
        body: "Une équipe disponible à tout moment pour vous aider avant, pendant et après votre location. En français, néerlandais et arabe.",
      },
    ],
  },
  "maroc-infos": {
    title: "Conduire au Maroc",
    subtitle: "Tout ce que vous devez savoir avant de prendre la route.",
    sections: [
      {
        icon: "🚦",
        title: "Mêmes règles qu'en Europe",
        body: "Pas de mauvaises surprises : les règles de conduite au Maroc sont quasi identiques à celles de l'Europe. Priorité à droite, respect des feux, ceinture obligatoire.",
      },
      {
        icon: "🏎️",
        title: "Limites de vitesse",
        body: "En ville : 50 km/h · Sur route : 100 km/h · Sur autoroute : 120 km/h. Exactement les mêmes qu'en Belgique ou en France.",
      },
      {
        icon: "🛣️",
        title: "Autoroutes modernes",
        body: "Le Maroc dispose d'un réseau autoroutier moderne reliant toutes les grandes villes. Casablanca-Marrakech : 2h30, Casablanca-Tanger : 3h.",
      },
      {
        icon: "📋",
        title: "Documents requis",
        body: "Permis de conduire européen valide (pas besoin de permis international). Passeport ou carte d'identité. Le loueur fournit tous les documents du véhicule.",
      },
      {
        icon: "⛽",
        title: "Carburant",
        body: "Les stations-service sont nombreuses sur les grands axes. Prix environ 40% moins cher qu'en Europe. Acceptent Visa/Mastercard dans les grandes villes.",
      },
      {
        icon: "🔒",
        title: "Sécurité routière",
        body: "Les grands axes sont sûrs et bien entretenus. Restez vigilant en ville (conduite parfois agressive). La nuit, évitez les routes secondaires isolées.",
      },
    ],
  },
  "paiement-securise": {
    title: "Paiement sécurisé",
    subtitle: "Transparent, sécurisé, sans mauvaises surprises.",
    sections: [
      {
        icon: "1️⃣",
        title: "Réservation simple",
        body: "Choisissez votre véhicule et vos dates. Tous les paiements sont sécurisés via notre plateforme.",
      },
      {
        icon: "2️⃣",
        title: "Confirmation immédiate",
        body: "Vous recevez immédiatement un email de confirmation avec tous les détails : véhicule, dates, loueur et montant.",
      },
      {
        icon: "3️⃣",
        title: "Paiement sécurisé",
        body: "Le paiement se fait entièrement via notre plateforme, de manière sécurisée et transparente.",
      },
      {
        icon: "🧾",
        title: "Preuves de paiement",
        body: "Pour chaque transaction, vous recevez un reçu officiel. Conservez-le pendant toute la durée de votre séjour.",
      },
      {
        icon: "⚠️",
        title: "Politique d'annulation",
        body: "En cas d'annulation, nous appliquons nos conditions. Vous pouvez modifier vos dates sous certaines conditions.",
      },
      {
        icon: "🔐",
        title: "Sécurité des données",
        body: "Vos données bancaires sont chiffrées via Stripe (certifié PCI-DSS). Drivo ne stocke jamais vos informations de carte bancaire.",
      },
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
      <div
        style={{
          fontFamily: "'Sora',sans-serif",
          background: "#0a0a0f",
          color: "#f0eeea",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ fontSize: "48px" }}>🔍</div>
        <div style={{ fontSize: "20px", fontWeight: "700" }}>
          Page introuvable
        </div>
        <Link to="/" style={{ color: "#d4a853", textDecoration: "none" }}>
          ← Retour à l'accueil
        </Link>
      </div>
    );

  return (
    <div
      style={{
        fontFamily: "'Sora',sans-serif",
        background: "#0a0a0f",
        color: "#f0eeea",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      {/* Hero header */}
      <div
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,168,83,0.1) 0%, transparent 60%), #0a0a0f",
          paddingTop: "120px",
          paddingBottom: "64px",
          textAlign: "center",
          padding: "120px clamp(20px,4vw,40px) 64px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "3px",
            background: "#d4a853",
            borderRadius: "2px",
            margin: "0 auto 24px",
          }}
        />
        <h1
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(2rem,5vw,3.5rem)",
            fontWeight: "700",
            marginBottom: "16px",
          }}
        >
          {page.title}
        </h1>
        <p
          style={{
            color: "rgba(240,238,234,0.5)",
            fontSize: "16px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {page.subtitle}
        </p>
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginTop: "24px",
            fontSize: "13px",
            color: "rgba(240,238,234,0.4)",
          }}
        >
          <Link
            to="/"
            style={{ color: "rgba(240,238,234,0.4)", textDecoration: "none" }}
          >
            Accueil
          </Link>
          <span>›</span>
          <span style={{ color: "#d4a853" }}>{page.title}</span>
        </div>
      </div>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "64px clamp(20px,4vw,40px) 80px",
        }}
      >
        {/* Standard sections grid */}
        {page.sections && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)",
              gap: "20px",
            }}
          >
            {page.sections.map((s, i) => (
              <div
                key={i}
                style={{
                  background: "#13131a",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "16px",
                  padding: "28px",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "14px" }}>
                  {s.icon}
                </div>
                <h3
                  style={{
                    fontWeight: "700",
                    fontSize: "17px",
                    marginBottom: "10px",
                    color: "#f0eeea",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    color: "rgba(240,238,234,0.55)",
                    fontSize: "14px",
                    lineHeight: "1.8",
                  }}
                >
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Contact form for "solutions sur mesure" */}
        {page.isContact && <ContactForm />}

        {/* FAQ content */}
        {page.isFaq && <FaqContent />}
      </div>

      <Footer />
    </div>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const { isMobile } = useBreakpoint();
  return sent ? (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <div style={{ fontSize: "56px", marginBottom: "20px" }}>✅</div>
      <h3
        style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "12px",
        }}
      >
        Demande envoyée !
      </h3>
      <p style={{ color: "rgba(240,238,234,0.5)", fontSize: "15px" }}>
        Nous vous recontactons sous 24h avec les meilleures options disponibles.
      </p>
    </div>
  ) : (
    <div>
      <div
        style={{
          background: "rgba(212,168,83,0.08)",
          border: "1px solid rgba(212,168,83,0.2)",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "32px",
        }}
      >
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>💡</div>
        <p
          style={{
            color: "rgba(240,238,234,0.7)",
            fontSize: "14px",
            lineHeight: "1.8",
          }}
        >
          Vous cherchez un véhicule 9 places ? Un van avec chauffeur ? Une
          voiture avec siège bébé dans une ville spécifique ? Décrivez votre
          besoin et nous appelons nos partenaires loueurs au Maroc pour trouver
          la solution idéale.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "16px",
        }}
      >
        {[
          ["Votre prénom", "text"],
          ["Email", "email"],
          ["Téléphone / WhatsApp", "tel"],
          ["Ville au Maroc", "text"],
        ].map(([label, type]) => (
          <div key={label}>
            <label
              style={{
                fontSize: "11px",
                fontWeight: "600",
                color: "#d4a853",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "8px",
              }}
            >
              {label}
            </label>
            <input type={type} className="input-field" placeholder={label} />
          </div>
        ))}
        <div style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
          <label
            style={{
              fontSize: "11px",
              fontWeight: "600",
              color: "#d4a853",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "8px",
            }}
          >
            Décrivez votre besoin
          </label>
          <textarea
            className="input-field"
            placeholder="Ex: Besoin d'un véhicule 9 places avec chauffeur à Marrakech du 15 au 22 juillet, budget max 800€..."
            style={{
              resize: "vertical",
              minHeight: "120px",
              fontFamily: "'Sora',sans-serif",
            }}
          />
        </div>
        <div style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
          <button
            className="btn-primary"
            style={{ width: "100%", padding: "16px", fontSize: "14px" }}
            onClick={() => setSent(true)}
          >
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
        <div
          key={i}
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 0",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "500",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d4a853")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#f0eeea")}
          >
            <span style={{ paddingRight: "16px" }}>{f.q}</span>
            <span
              style={{
                color: "#d4a853",
                fontSize: "20px",
                flexShrink: 0,
                display: "inline-block",
                transition: "transform 0.2s",
                transform: open === i ? "rotate(45deg)" : "none",
              }}
            >
              +
            </span>
          </div>
          {open === i && (
            <div
              style={{
                color: "rgba(240,238,234,0.6)",
                fontSize: "14px",
                lineHeight: "1.7",
                paddingBottom: "20px",
              }}
            >
              {f.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
