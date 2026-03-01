// ─── Cars ────────────────────────────────────────────────────────────────────
export const cars = [
  {
    id: 1,
    name: "Kia Picanto",
    category: "Économique",
    price: 45,
    img: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&q=80",
    badge: "Sans caution",
    fuel: "Essence",
    seats: 4,
    transmission: "Auto",
  },
  {
    id: 2,
    name: "Toyota Corolla",
    category: "Standard",
    price: 130,
    img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80",
    badge: "Populaire",
    fuel: "Essence",
    seats: 5,
    transmission: "Auto",
  },
  {
    id: 3,
    name: "Nissan X-Trail",
    category: "SUV",
    price: 175,
    img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80",
    badge: "Famille",
    fuel: "Diesel",
    seats: 7,
    transmission: "Auto",
  },
  {
    id: 4,
    name: "BMW Série 5",
    category: "Premium",
    price: 450,
    img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80",
    badge: "Premium",
    fuel: "Essence",
    seats: 5,
    transmission: "Auto",
  },
  {
    id: 5,
    name: "Ford Mustang",
    category: "Sport",
    price: 750,
    img: "https://images.unsplash.com/photo-1584345604476-8ec5f82d718e?w=400&q=80",
    badge: "Sport",
    fuel: "Essence",
    seats: 4,
    transmission: "Manuel",
  },
  {
    id: 6,
    name: "Tesla Model 3",
    category: "Électrique",
    price: 195,
    img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&q=80",
    badge: "Éco",
    fuel: "Électrique",
    seats: 5,
    transmission: "Auto",
  },
  {
    id: 7,
    name: "Mercedes GLE",
    category: "Luxe",
    price: 650,
    img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=80",
    badge: null,
    fuel: "Diesel",
    seats: 5,
    transmission: "Auto",
  },
  {
    id: 8,
    name: "Hyundai Elantra",
    category: "Standard",
    price: 100,
    img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400&q=80",
    badge: "Promo -20%",
    fuel: "Essence",
    seats: 5,
    transmission: "Auto",
  },
];

// ─── Categories ──────────────────────────────────────────────────────────────
export const categories = [
  "Toutes",
  "Économique",
  "Standard",
  "SUV",
  "Premium",
  "Luxe",
  "Sport",
  "Électrique",
];

// ─── Brands ──────────────────────────────────────────────────────────────────
export const brands = [
  { name: "Mercedes", count: "400+" },
  { name: "BMW", count: "200+" },
  { name: "Audi", count: "100+" },
  { name: "Toyota", count: "100+" },
  { name: "Tesla", count: "50+" },
  { name: "Porsche", count: "80+" },
];

// ─── FAQs ────────────────────────────────────────────────────────────────────
export const faqs = [
  {
    q: "Puis-je conduire dans toutes les régions ?",
    a: "Oui, nos véhicules sont assurés sur l'ensemble du territoire national et peuvent circuler librement entre les régions couvertes par notre service.",
  },
  {
    q: "Que faire en cas d'accident ?",
    a: "Contactez immédiatement notre assistance 24h/24. Ne bougez pas le véhicule et photographiez la scène. Nous prendrons en charge toutes les démarches.",
  },
  {
    q: "Quelle est la politique de carburant ?",
    a: "Nous appliquons une politique plein-à-plein. Le véhicule vous est remis avec un plein et doit être restitué avec le même niveau.",
  },
];

// ─── Offers strip ────────────────────────────────────────────────────────────
export const offers = [
  { label: "Sans caution", sub: "À partir de 45€ / jour", icon: "🔓" },
  { label: "Réductions", sub: "Jusqu'à 40% de remise", icon: "🏷️" },
  { label: "Kilométrage illimité", sub: "À partir de 75€ / jour", icon: "🛣️" },
  { label: "Longue durée", sub: "À partir de 800€ / mois", icon: "📅" },
];

// ─── Features (Why us) ───────────────────────────────────────────────────────
export const features = [
  { icon: "📱", title: "100% Digital", desc: "Réservation, documents et paiement entièrement en ligne." },
  { icon: "💳", title: "Sans caution sur la plupart des offres", desc: "Aucun blocage de fonds sur votre carte bancaire." },
  { icon: "🚀", title: "Livraison rapide", desc: "Votre véhicule livré à l'hôtel, domicile ou aéroport." },
  { icon: "🔧", title: "Support 24h/24", desc: "Une équipe disponible à tout moment en cas de besoin." },
];

// ─── Footer columns ──────────────────────────────────────────────────────────
export const footerColumns = [
  { title: "Véhicules", links: ["Économiques", "Standards", "SUV", "Luxe", "Électriques"] },
  { title: "Service", links: ["Comment ça marche", "Livraison à domicile", "Assurances", "FAQ"] },
  { title: "Légal", links: ["CGU", "Confidentialité", "Cookies", "Contact"] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
