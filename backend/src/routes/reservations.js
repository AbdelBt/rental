import express from "express";
import { supabaseAdmin } from "../supabase.js";

const router = express.Router();

// POST /api/reservations
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabaseAdmin
      .from("reservations")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la création de la réservation." });
  }
});

export default router;

