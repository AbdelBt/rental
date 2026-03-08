import express from "express";
import { supabaseAdmin } from "../supabase.js";

const router = express.Router();

// GET /api/agency/:agencyId/dashboard
router.get("/:agencyId/dashboard", async (req, res) => {
  try {
    const { agencyId } = req.params;

    const [{ data: agg, error: errAgg }, { data: recent, error: errRecent }] = await Promise.all([
      supabaseAdmin
        .from("reservations")
        .select("total, status")
        .eq("agency_id", agencyId),
      supabaseAdmin
        .from("reservations")
        .select("*")
        .eq("agency_id", agencyId)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    if (errAgg) throw errAgg;
    if (errRecent) throw errRecent;

    const revenue = agg?.reduce((sum, r) => sum + Number(r.total || 0), 0) || 0;
    const count = agg?.length || 0;

    res.json({
      revenue,
      reservationsCount: count,
      recent,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: "Erreur lors du chargement du dashboard agence." });
  }
});

export default router;

