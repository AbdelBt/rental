import express from "express";
import { supabaseAdmin } from "../supabase.js";

const router = express.Router();

// GET /api/cars
router.get("/", async (req, res) => {
  try {
    const { city, category, maxPrice } = req.query;

    let query = supabaseAdmin.from("cars").select("*").eq("published", true);

    if (city) query = query.eq("city", city);
    if (category && category !== "Toutes") query = query.eq("category", category);
    if (maxPrice) query = query.lte("price", Number(maxPrice));

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des voitures." });
  }
});

// GET /api/cars/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from("cars")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(404).json({ error: "Voiture introuvable." });
  }
});

export default router;

