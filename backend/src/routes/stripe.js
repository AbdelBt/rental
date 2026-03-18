import express from "express";
import Stripe from "stripe";
import { Resend } from "resend";
import { supabaseAdmin } from "../supabase.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

// ─── POST /api/stripe/create-checkout ───────────────────────────────────────
router.post("/create-checkout", async (req, res) => {
  try {
    const {
      carId, carName, carImg,
      dateFrom, dateTo, days,
      total, deposit,
      customerEmail, customerFirstName, customerLastName, customerPhone,
      city,
    } = req.body;

    if (!customerEmail || !dateFrom || !dateTo || !carName) {
      return res.status(400).json({ error: "Données manquantes." });
    }

    const depositCents = Math.round(Number(deposit) * 100);
    if (depositCents < 50) {
      return res.status(400).json({ error: "Montant trop faible pour Stripe (min 0.50 €)." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      locale: "fr",
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: `Acompte — ${carName}`,
            description: `Du ${new Date(dateFrom).toLocaleDateString("fr-FR")} au ${new Date(dateTo).toLocaleDateString("fr-FR")} · ${days} jour${Number(days) > 1 ? "s" : ""}`,
            images: carImg ? [carImg] : [],
          },
          unit_amount: depositCents,
        },
        quantity: 1,
      }],
      metadata: {
        carId:             String(carId ?? ""),
        carName,
        carImg:            carImg ?? "",
        dateFrom,
        dateTo,
        days:              String(days),
        total:             String(total),
        deposit:           String(deposit),
        customerEmail,
        customerFirstName,
        customerLastName,
        customerPhone:     customerPhone ?? "",
        city:              city ?? "",
      },
      success_url: `${process.env.CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.CLIENT_URL}/booking/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("[stripe] create-checkout error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/stripe/webhook ────────────────────────────────────────────────
// IMPORTANT: raw body — doit être monté avant express.json() dans server.js
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe] webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const meta    = session.metadata;

    try {
      // 1. Trouver ou créer le customer dans Supabase
      let customerId = null;
      const { data: existingCustomer } = await supabaseAdmin
        .from("customers")
        .select("id")
        .eq("email", meta.customerEmail)
        .maybeSingle();

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer } = await supabaseAdmin
          .from("customers")
          .insert({
            email:      meta.customerEmail,
            first_name: meta.customerFirstName,
            last_name:  meta.customerLastName,
            phone:      meta.customerPhone,
          })
          .select("id")
          .single();
        customerId = newCustomer?.id ?? null;
      }

      // 2. Trouver le car_id dans Supabase (par nom si pas d'UUID disponible)
      let carId = null;
      if (meta.carId && meta.carId.includes("-")) {
        carId = meta.carId; // UUID valide
      } else {
        const { data: carRow } = await supabaseAdmin
          .from("cars")
          .select("id, agency_id")
          .ilike("name", meta.carName)
          .maybeSingle();
        carId = carRow?.id ?? null;
      }

      // 3. Insérer la réservation
      const { data: reservation, error: resError } = await supabaseAdmin
        .from("reservations")
        .insert({
          customer_id:      customerId,
          car_id:           carId,
          date_from:        meta.dateFrom,
          date_to:          meta.dateTo,
          time_from:        "10:00",
          time_to:          "10:00",
          total:            Number(meta.total),
          deposit_amount:   Number(meta.deposit),
          deposit_paid:     true,
          deposit_paid_at:  new Date().toISOString(),
          status:           "confirmed",
          city:             meta.city,
          stripe_session_id: session.id,
        })
        .select()
        .single();

      if (resError) throw resError;

      // 4. Email de confirmation via Resend
      await resend.emails.send({
        from:    "Drivo <onboarding@resend.dev>", // remplace par ton domaine vérifié
        to:      meta.customerEmail,
        subject: `✅ Réservation confirmée — ${meta.carName}`,
        html:    buildEmailHtml({ meta, reservationId: reservation?.id }),
      });

      console.log("[stripe] ✅ Réservation créée:", reservation?.id);
    } catch (err) {
      console.error("[stripe] webhook processing error:", err.message);
    }
  }

  res.json({ received: true });
});

// ─── GET /api/stripe/session/:id ─────────────────────────────────────────────
// Frontend appelle cette route sur la page success pour afficher les détails
router.get("/session/:id", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    res.json({
      customerEmail:     session.customer_email,
      customerFirstName: session.metadata?.customerFirstName,
      customerLastName:  session.metadata?.customerLastName,
      carName:           session.metadata?.carName,
      carImg:            session.metadata?.carImg,
      dateFrom:          session.metadata?.dateFrom,
      dateTo:            session.metadata?.dateTo,
      days:              session.metadata?.days,
      total:             session.metadata?.total,
      deposit:           session.metadata?.deposit,
      city:              session.metadata?.city,
      amountPaid:        (session.amount_total / 100).toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Email HTML ───────────────────────────────────────────────────────────────
function buildEmailHtml({ meta, reservationId }) {
  const solde     = Number(meta.total) - Number(meta.deposit);
  const refId     = reservationId ? reservationId.slice(0, 8).toUpperCase() : "—";
  const fmtDate   = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#07070c;font-family:'Helvetica Neue',Arial,sans-serif;color:#f5efe0">
  <div style="max-width:580px;margin:0 auto;padding:40px 20px">

    <!-- Logo -->
    <div style="text-align:center;margin-bottom:36px">
      <h1 style="margin:0;font-size:32px;color:#c9a84c;letter-spacing:4px;font-weight:900">DRIVO</h1>
      <p style="margin:6px 0 0;font-size:11px;color:#ffffff40;letter-spacing:3px;text-transform:uppercase">Location de voitures premium</p>
    </div>

    <!-- Hero -->
    <div style="background:linear-gradient(135deg,#1a1830,#0f0e1a);border:1px solid #c9a84c40;border-radius:20px;padding:36px;margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
        <div style="width:48px;height:48px;background:#22c55e20;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px">✅</div>
        <div>
          <h2 style="margin:0;font-size:20px;color:#f5efe0">Réservation confirmée !</h2>
          <p style="margin:4px 0 0;font-size:13px;color:#ffffff60">Bonjour ${meta.customerFirstName}, tout est prêt.</p>
        </div>
      </div>

      ${meta.carImg ? `<img src="${meta.carImg}" alt="${meta.carName}" style="width:100%;height:180px;object-fit:cover;border-radius:12px;margin-bottom:20px">` : ""}

      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;font-size:13px;color:#ffffff60;border-bottom:1px solid #ffffff10">Véhicule</td><td style="padding:8px 0;font-size:13px;font-weight:700;text-align:right;border-bottom:1px solid #ffffff10">${meta.carName}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#ffffff60;border-bottom:1px solid #ffffff10">Départ</td><td style="padding:8px 0;font-size:13px;font-weight:600;text-align:right;border-bottom:1px solid #ffffff10">${fmtDate(meta.dateFrom)}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#ffffff60;border-bottom:1px solid #ffffff10">Retour</td><td style="padding:8px 0;font-size:13px;font-weight:600;text-align:right;border-bottom:1px solid #ffffff10">${fmtDate(meta.dateTo)}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#ffffff60;border-bottom:1px solid #ffffff10">Durée</td><td style="padding:8px 0;font-size:13px;font-weight:600;text-align:right;border-bottom:1px solid #ffffff10">${meta.days} jour${Number(meta.days) > 1 ? "s" : ""}</td></tr>
        ${meta.city ? `<tr><td style="padding:8px 0;font-size:13px;color:#ffffff60">Ville</td><td style="padding:8px 0;font-size:13px;font-weight:600;text-align:right">${meta.city}</td></tr>` : ""}
      </table>
    </div>

    <!-- Paiement -->
    <div style="background:#c9a84c12;border:1px solid #c9a84c30;border-radius:16px;padding:24px;margin-bottom:20px">
      <h3 style="margin:0 0 16px;font-size:12px;color:#c9a84c;letter-spacing:2px;text-transform:uppercase">Récapitulatif paiement</h3>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:13px;color:#ffffff60">Total location</span><strong style="font-size:13px">${Number(meta.total).toLocaleString("fr-FR")} €</strong></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:13px;color:#ffffff60">Acompte payé en ligne</span><strong style="font-size:13px;color:#22c55e">✓ ${Number(meta.deposit).toLocaleString("fr-FR")} €</strong></div>
      <div style="display:flex;justify-content:space-between;border-top:1px solid #ffffff15;padding-top:12px;margin-top:4px"><span style="font-weight:700">Solde à payer sur place</span><strong style="font-size:18px;color:#c9a84c">${solde.toLocaleString("fr-FR")} €</strong></div>
    </div>

    <!-- Ref -->
    <div style="text-align:center;margin-bottom:32px">
      <p style="font-size:12px;color:#ffffff40;margin:0">N° de réservation</p>
      <p style="font-size:20px;font-weight:900;color:#c9a84c;letter-spacing:3px;margin:4px 0 0">#${refId}</p>
    </div>

    <!-- Footer -->
    <p style="text-align:center;font-size:11px;color:#ffffff30;margin:0">Drivo · contact@drivo.ma · Maroc<br>Cet email est généré automatiquement, ne pas répondre.</p>
  </div>
</body>
</html>`;
}

export default router;
