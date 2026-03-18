import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { cars as staticCars } from "../data";

function normalizeSupabaseCar(c) {
  return {
    id: c.id, // UUID string
    name: c.name,
    brand: c.brand,
    year: c.year,
    category: c.category,
    price: c.price,
    priceMonth: c.price_month ?? null,
    img: c.img,
    imgs: Array.isArray(c.imgs) ? c.imgs : c.img ? [c.img] : [],
    badge: null,
    fuel: c.fuel,
    seats: c.seats,
    transmission: c.transmission,
    mileage: c.mileage ?? "Illimité",
    deposit: c.deposit_amount > 0,
    rating: 4.8,
    reviews: 0,
    description: c.description ?? "",
    features: [
      c.gps && "GPS",
      c.babyseat && "Siège bébé",
    ].filter(Boolean),
    available: true,
    _source: "supabase",
  };
}

export function useCars() {
  const [cars, setCars] = useState(staticCars);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      console.log("[useCars] fetching from Supabase...");
      try {
        const { data, error } = await supabase
          .from("cars")
          .select("*")
          .order("price", { ascending: true });

        console.log("[useCars] response →", { data, error });

        if (cancelled) return;

        if (error) {
          console.error("[useCars] Supabase error:", error.message, error);
          setCars(staticCars);
        } else if (!data || data.length === 0) {
          console.warn("[useCars] table vide ou aucun résultat");
          setCars(staticCars);
        } else {
          console.log("[useCars] voitures Supabase:", data.length, data);
          const supabaseCars = data.map(normalizeSupabaseCar);
          // Merge: supabase cars first, then static cars not already present by name
          const supabaseNames = new Set(supabaseCars.map((c) => c.name.toLowerCase()));
          const filteredStatic = staticCars.filter(
            (c) => !supabaseNames.has(c.name.toLowerCase())
          );
          setCars([...supabaseCars, ...filteredStatic]);
        }
      } catch {
        if (!cancelled) setCars(staticCars);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { cars, loading };
}
