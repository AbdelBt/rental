// ─── Agency profile
export const agency = {
  id: "agc_001",
  name: "AutoMaroc Premium",
  email: "contact@automarocpremium.ma",
  phone: "+212 6 61 23 45 67",
  whatsapp: "+212 6 61 23 45 67",
  city: "Casablanca",
  cities: ["Casablanca", "Marrakech"],
  address: "123 Boulevard Mohammed V, Casablanca",
  logo: null,
  verified: true,
  memberSince: "Janvier 2024",
  rating: 4.8,
  totalReviews: 142,
  commission: 10,
  iban: "MA64 0111 2000 0100 1234 5670 891",
};

// ─── Agency cars
export const agencyCars = [
  { id: "c1", name: "BMW Série 5", brand: "BMW", category: "Premium", city: "Casablanca", price: 450, priceWeek: 2500, priceMonth: 6500, fuel: "Essence", transmission: "Auto", seats: 5, deposit: false, depositAmount: 0, minDays: 1, minAge: 21, babyseat: true, status: "active", img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80", reservations: 24, revenue: 10800 },
  { id: "c2", name: "Mercedes GLE", brand: "Mercedes", category: "Luxe", city: "Marrakech", price: 650, priceWeek: 3800, priceMonth: 8500, fuel: "Diesel", transmission: "Auto", seats: 5, deposit: true, depositAmount: 2000, minDays: 2, minAge: 23, babyseat: false, status: "active", img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=80", reservations: 18, revenue: 11700 },
  { id: "c3", name: "Toyota Corolla", brand: "Toyota", category: "Standard", city: "Casablanca", price: 130, priceWeek: 750, priceMonth: 2200, fuel: "Essence", transmission: "Auto", seats: 5, deposit: false, depositAmount: 0, minDays: 1, minAge: 18, babyseat: true, status: "active", img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80", reservations: 41, revenue: 5330 },
  { id: "c4", name: "Dacia Duster", brand: "Dacia", category: "SUV", city: "Casablanca", price: 120, priceWeek: 700, priceMonth: 1900, fuel: "Diesel", transmission: "Manuel", seats: 5, deposit: false, depositAmount: 0, minDays: 1, minAge: 18, babyseat: false, status: "maintenance", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80", reservations: 33, revenue: 3960 },
  { id: "c5", name: "Tesla Model 3", brand: "Tesla", category: "Électrique", city: "Casablanca", price: 195, priceWeek: 1100, priceMonth: 3200, fuel: "Électrique", transmission: "Auto", seats: 5, deposit: false, depositAmount: 0, minDays: 1, minAge: 21, babyseat: false, status: "active", img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&q=80", reservations: 29, revenue: 5655 },
];

// ─── Reservations
export const reservations = [
  { id: "r001", carId: "c1", carName: "BMW Série 5", client: "Thomas Bernard", email: "thomas@email.com", phone: "+32 478 12 34 56", from: "2025-04-10", to: "2025-04-14", days: 4, total: 1800, deposit: 180, status: "confirmed", city: "Casablanca", note: "" },
  { id: "r002", carId: "c3", carName: "Toyota Corolla", client: "Sophie Martin", email: "sophie@email.com", phone: "+33 612 34 56 78", from: "2025-04-12", to: "2025-04-15", days: 3, total: 390, deposit: 39, status: "confirmed", city: "Casablanca", note: "Livraison aéroport" },
  { id: "r003", carId: "c2", carName: "Mercedes GLE", client: "Karim Alaoui", email: "karim@email.com", phone: "+31 620 98 76 54", from: "2025-04-15", to: "2025-04-20", days: 5, total: 3250, deposit: 325, status: "pending", city: "Marrakech", note: "" },
  { id: "r004", carId: "c5", carName: "Tesla Model 3", client: "Anna Köhler", email: "anna@email.com", phone: "+49 176 55 44 33", from: "2025-04-08", to: "2025-04-10", days: 2, total: 390, deposit: 39, status: "completed", city: "Casablanca", note: "" },
  { id: "r005", carId: "c1", carName: "BMW Série 5", client: "Youssef Darif", email: "youssef@email.com", phone: "+32 495 66 77 88", from: "2025-04-18", to: "2025-04-25", days: 7, total: 3150, deposit: 315, status: "confirmed", city: "Casablanca", note: "Siège bébé requis" },
  { id: "r006", carId: "c3", carName: "Toyota Corolla", client: "Marie Dupont", email: "marie@email.com", phone: "+33 698 11 22 33", from: "2025-04-05", to: "2025-04-07", days: 2, total: 260, deposit: 26, status: "completed", city: "Casablanca", note: "" },
  { id: "r007", carId: "c2", carName: "Mercedes GLE", client: "Pierre Lefebvre", email: "pierre@email.com", phone: "+32 470 44 55 66", from: "2025-04-22", to: "2025-04-29", days: 7, total: 4550, deposit: 455, status: "confirmed", city: "Marrakech", note: "Mariage — véhicule décoré" },
  { id: "r008", carId: "c4", carName: "Dacia Duster", client: "Lars Hansen", email: "lars@email.com", phone: "+45 221 33 44 55", from: "2025-03-28", to: "2025-04-02", days: 5, total: 600, deposit: 60, status: "completed", city: "Casablanca", note: "" },
];


// ─── Payments
export const payments = [
  { id: "p001", resId: "r004", client: "Anna Köhler", carName: "Tesla Model 3", amount: 390, commission: 39, net: 351, date: "2025-04-10", status: "paid", type: "income" },
  { id: "p002", resId: "r006", client: "Marie Dupont", carName: "Toyota Corolla", amount: 260, commission: 26, net: 234, date: "2025-04-07", status: "paid", type: "income" },
  { id: "p003", resId: "r008", client: "Lars Hansen", carName: "Dacia Duster", amount: 600, commission: 60, net: 540, date: "2025-04-02", status: "paid", type: "income" },
  { id: "p004", resId: "r001", client: "Thomas Bernard", carName: "BMW Série 5", amount: 1800, commission: 180, net: 1620, date: "2025-04-14", status: "pending", type: "income" },
  { id: "p005", resId: "r002", client: "Sophie Martin", carName: "Toyota Corolla", amount: 390, commission: 39, net: 351, date: "2025-04-15", status: "pending", type: "income" },
  { id: "p006", resId: "r005", client: "Youssef Darif", carName: "BMW Série 5", amount: 3150, commission: 315, net: 2835, date: "2025-04-25", status: "pending", type: "income" },
  { id: "p007", resId: "r007", client: "Pierre Lefebvre", carName: "Mercedes GLE", amount: 4550, commission: 455, net: 4095, date: "2025-04-29", status: "pending", type: "income" },
];

// ─── Blacklist
export const blacklist = [
  { id: "b001", name: "Ahmed Benali", phone: "+33 611 22 33 44", reason: "Véhicule rendu avec dommages non déclarés. Jante rayée + pare-choc fissuré.", date: "2025-02-14", severity: "high", sharedBy: "AutoMaroc Premium", reportedBy: "3 agences" },
  { id: "b002", name: "Kevin Moreau", phone: "+32 477 55 66 77", reason: "Annulation 3x sans prévenir. No-show confirmé.", date: "2025-01-08", severity: "medium", sharedBy: "AutoMaroc Premium", reportedBy: "1 agence" },
  { id: "b003", name: "Fatima Zahra", phone: "+31 634 88 99 00", reason: "Retard de restitution de 2 jours, injoignable.", date: "2025-03-20", severity: "medium", sharedBy: "LuxRent Maroc", reportedBy: "2 agences" },
  { id: "b004", name: "Roberto Santos", phone: "+34 612 44 55 66", reason: "Fumé dans le véhicule malgré interdiction. Nettoyage 800 €.", date: "2025-03-05", severity: "low", sharedBy: "CasaFleet", reportedBy: "1 agence" },
];

// ─── Overview stats
export const overviewStats = {
  revenueMonth: 11730,
  revenueLastMonth: 9840,
  reservationsMonth: 14,
  reservationsLastMonth: 11,
  activeCars: 4,
  totalCars: 5,
  avgRating: 4.8,
  pendingPayouts: 10530,
  completedPayouts: 1125,
  revenueChart: [
    { month: "Nov", rev: 5200 },
    { month: "Déc", rev: 7800 },
    { month: "Jan", rev: 6400 },
    { month: "Fév", rev: 9200 },
    { month: "Mar", rev: 9840 },
    { month: "Avr", rev: 11730 },
  ],
};

// ─── Damage pricing presets
export const defaultDamages = [
  { label: "Jante rayée", price: 800 },
  { label: "Pare-choc fissuré", price: 2500 },
  { label: "Rétroviseur cassé", price: 600 },
  { label: "Vitre brisée", price: 1500 },
  { label: "Intérieur souillé", price: 400 },
];


// ─── Stats
export const stats = {
  totalCars: agencyCars.length,
  availableCars: agencyCars.filter(c => c.available).length,
  totalReservations: reservations.length,
  activeReservations: reservations.filter(r => r.status === "confirmed").length,
  pendingReservations: reservations.filter(r => r.status === "pending").length,
  completedReservations: reservations.filter(r => r.status === "completed").length,
  totalRevenue: reservations.filter(r => r.status !== "cancelled").reduce((s, r) => s + r.total, 0),
  depositsReceived: reservations.filter(r => r.status !== "cancelled").reduce((s, r) => s + r.deposit, 0),
  monthlyData: [
    { month: "Oct", reservations: 3, revenue: 4200 },
    { month: "Nov", reservations: 5, revenue: 7800 },
    { month: "Déc", reservations: 8, revenue: 12400 },
    { month: "Jan", reservations: 6, revenue: 9100 },
    { month: "Fév", reservations: 7, revenue: 11200 },
    { month: "Mar", reservations: 9, revenue: 14600 },
    { month: "Avr", reservations: 4, revenue: 8350 },
  ],
};
