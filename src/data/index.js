// ─── Cars ────────────────────────────────────────────────────────────────────
export const cars = [
  {
    id: 1,
    name: "Kia Picanto",
    brand: "Kia",
    year: 2023,
    category: "Économique",
    price: 45,
    priceMonth: 900,
    img: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80",
    imgs: [
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80",
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    ],
    badge: "Sans caution",
    fuel: "Essence",
    seats: 4,
    transmission: "Auto",
    mileage: "Illimité",
    deposit: false,
    rating: 4.7,
    reviews: 128,
    description: "Parfaite pour les déplacements urbains, économique en carburant et facile à garer. Idéale pour les courts trajets en ville.",
    features: ["Climatisation", "Bluetooth", "USB", "Régulateur de vitesse"],
    available: true,
  },
  {
    id: 2,
    name: "Toyota Corolla",
    brand: "Toyota",
    year: 2023,
    category: "Standard",
    price: 130,
    priceMonth: 2200,
    img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
    imgs: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80",
    ],
    badge: "Populaire",
    fuel: "Essence",
    seats: 5,
    transmission: "Auto",
    mileage: "250 km/j",
    deposit: false,
    rating: 4.8,
    reviews: 312,
    description: "La référence en termes de fiabilité et confort. Idéale pour les familles et les voyages interurbains avec une consommation maîtrisée.",
    features: ["Climatisation", "GPS", "Bluetooth", "Caméra de recul", "Régulateur"],
    available: true,
  },
  {
    id: 3,
    name: "Nissan X-Trail",
    brand: "Nissan",
    year: 2024,
    category: "SUV",
    price: 175,
    priceMonth: 2800,
    img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
    imgs: [
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    ],
    badge: "Famille",
    fuel: "Diesel",
    seats: 7,
    transmission: "Auto",
    mileage: "300 km/j",
    deposit: true,
    rating: 4.6,
    reviews: 87,
    description: "SUV spacieux avec 7 places, parfait pour les grandes familles ou les groupes. Confort haut de gamme sur longs trajets.",
    features: ["7 places", "Climatisation bi-zone", "GPS", "Toit panoramique", "Bluetooth"],
    available: true,
  },
  {
    id: 4,
    name: "BMW Série 5",
    brand: "BMW",
    year: 2024,
    category: "Premium",
    price: 450,
    priceMonth: 6500,
    img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    imgs: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&q=80",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80",
    ],
    badge: "Premium",
    fuel: "Essence",
    seats: 5,
    transmission: "Auto",
    mileage: "Illimité",
    deposit: false,
    rating: 4.9,
    reviews: 204,
    description: "L'élégance allemande à son meilleur. Performances exceptionnelles, intérieur luxueux et technologie de pointe pour une conduite inoubliable.",
    features: ["Sièges chauffants", "GPS intégré", "Toit ouvrant", "Son Harman Kardon", "Caméra 360°"],
    available: true,
  },
  {
    id: 5,
    name: "Ford Mustang",
    brand: "Ford",
    year: 2023,
    category: "Sport",
    price: 750,
    priceMonth: 9500,
    img: "https://images.unsplash.com/photo-1584345604476-8ec5f82d718e?w=800&q=80",
    imgs: [
      "https://images.unsplash.com/photo-1584345604476-8ec5f82d718e?w=800&q=80",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
    ],
    badge: "Sport",
    fuel: "Essence",
    seats: 4,
    transmission: "Manuel",
    mileage: "200 km/j",
    deposit: true,
    rating: 4.8,
    reviews: 156,
    description: "Une icône américaine. Le V8 rugissant, le design musculeux et les performances pures font du Mustang une expérience de conduite unique.",
    features: ["V8 5.0L", "Mode Sport+", "Échappement actif", "Sièges sport", "Apple CarPlay"],
    available: true,
  },
  {
    id: 6,
    name: "Tesla Model 3",
    brand: "Tesla",
    year: 2024,
    category: "Électrique",
    price: 195,
    priceMonth: 3200,
    img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
    imgs: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
      "https://images.unsplash.com/photo-1561580125-028ee3bd62eb?w=800&q=80",
      "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&q=80",
    ],
    badge: "Éco",
    fuel: "Électrique",
    seats: 5,
    transmission: "Auto",
    mileage: "Illimité",
    deposit: false,
    rating: 4.9,
    reviews: 289,
    description: "La référence du véhicule électrique. Autonomie de 500+ km, recharge rapide, et une technologie embarquée sans égale sur le marché.",
    features: ["Autopilot", "Écran 15\"", "Recharge rapide", "OTA Updates", "Caméras 360°"],
    available: true,
  },
  {
    id: 7,
    name: "Mercedes GLE",
    brand: "Mercedes",
    year: 2024,
    category: "Luxe",
    price: 650,
    priceMonth: 8500,
    img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
    imgs: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80",
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80",
    ],
    badge: null,
    fuel: "Diesel",
    seats: 5,
    transmission: "Auto",
    mileage: "Illimité",
    deposit: true,
    rating: 4.9,
    reviews: 178,
    description: "Le summum du luxe et du confort. Finitions premium, suspension air adaptative et systèmes d'assistance à la conduite de dernière génération.",
    features: ["Suspension air", "Burmester Sound", "MBUX", "Sièges massants", "Toit panoramique"],
    available: true,
  },
  {
    id: 8,
    name: "Hyundai Elantra",
    brand: "Hyundai",
    year: 2023,
    category: "Standard",
    price: 100,
    priceMonth: 1800,
    img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80",
    imgs: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80",
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
    ],
    badge: "Promo -20%",
    fuel: "Essence",
    seats: 5,
    transmission: "Auto",
    mileage: "250 km/j",
    deposit: false,
    rating: 4.5,
    reviews: 94,
    description: "Design moderne et équipements généreux à petit prix. L'Elantra offre un excellent rapport qualité-prix pour les trajets quotidiens.",
    features: ["Climatisation auto", "Bluetooth", "Caméra recul", "Régulateur adaptatif"],
    available: true,
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
    q: "Comment sont facturés les péages ?",
    a: "Les péages sont automatiquement détectés et facturés à la fin de votre location via votre moyen de paiement enregistré.",
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
  { label: "Sans caution", sub: "À partir de 450 € / jour", icon: "🔓" },
  { label: "Réductions", sub: "Jusqu'à 40% de remise", icon: "🏷️" },
  { label: "Kilométrage illimité", sub: "À partir de 750 € / jour", icon: "🛣️" },
  { label: "Longue durée", sub: "À partir de 8 000 € / mois", icon: "📅" },
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

export const cities = [
  { name: "Casablanca", count: 48, x: 22, y: 37, lat: 33.5731, lng: -7.5898, desc: "Capitale économique" },
  { name: "Marrakech", count: 63, x: 30, y: 54, lat: 31.6295, lng: -7.9811, desc: "Ville Ocre" },
  { name: "Agadir", count: 35, x: 18, y: 65, lat: 30.4278, lng: -9.5981, desc: "Côte Atlantique" },
  { name: "Tanger", count: 27, x: 27, y: 10, lat: 35.7595, lng: -5.834, desc: "Porte de l'Europe" },
];

export const reviews = [
  { name: "Sophie M.", city: "Bruxelles", rating: 5, car: "BMW Série 5", text: "Service impeccable ! Livraison à l'aéroport de Marrakech exactement à l'heure. Aucun souci pendant tout le séjour.", avatar: "SM", date: "Mars 2025" },
  { name: "Thomas B.", city: "Paris", rating: 5, car: "Tesla Model 3", text: "J'avais peur de louer au Maroc mais Drivo m'a rassuré. Tout transparent, paiement sécurisé, voiture parfaite.", avatar: "TB", date: "Fév. 2025" },
  { name: "Karim A.", city: "Amsterdam", rating: 5, car: "Dacia Duster", text: "Idéal pour nos excursions dans le désert. Je recommande à tous les Marocains de la diaspora !", avatar: "KA", date: "Jan. 2025" },
  { name: "Marie L.", city: "Lyon", rating: 4, car: "Toyota Corolla", text: "Très bonne expérience. Processus simple, voiture propre. Seul bémol : livraison avec 20 min de retard.", avatar: "ML", date: "Déc. 2024" },
  { name: "Youssef D.", city: "Liège", rating: 5, car: "Mercedes GLE", text: "Utilisé pour un mariage à Marrakech. Résultat parfait, chauffeur pro, voiture magnifique.", avatar: "YD", date: "Nov. 2024" },
  { name: "Anna K.", city: "Berlin", rating: 5, car: "Nissan X-Trail", text: "Avec 3 enfants on avait besoin de place. X-Trail parfait pour visiter Agadir et l'Anti-Atlas.", avatar: "AK", date: "Oct. 2024" },
];

export const recentCars = [...cars]
  .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
  .slice(0, 6);

export function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}