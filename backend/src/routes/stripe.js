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
      city, timeFrom, timeTo,
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
        carId,
        carName,
        carImg,
        dateFrom,
        dateTo,
        days,
        total,
        deposit,
        customerEmail,
        customerFirstName,
        customerLastName,
        customerPhone,
        city,
        timeFrom,
        timeTo,
      },
      success_url: `${process.env.CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/booking/cancel`,

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
    const meta = session.metadata;

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
            email: meta.customerEmail,
            first_name: meta.customerFirstName,
            last_name: meta.customerLastName,
            phone: meta.customerPhone,
          })
          .select("id")
          .single();
        customerId = newCustomer?.id ?? null;
      }

      // 2. Trouver le car_id et agency_id dans Supabase
      let carId = null;
      let agencyId = null;
      // meta.carId peut être "sb-2" ou "2" ou un nombre
      const rawCarId = String(meta.carId ?? "").replace("sb-", "");
      if (rawCarId && !isNaN(rawCarId)) {
        const { data: carRow } = await supabaseAdmin
          .from("cars")
          .select("id, agency_id")
          .eq("id", Number(rawCarId))
          .maybeSingle();
        carId = carRow?.id ?? null;
        agencyId = carRow?.agency_id ?? null;
      }
      if (!carId) {
        const { data: carRow } = await supabaseAdmin
          .from("cars")
          .select("id, agency_id")
          .ilike("name", meta.carName)
          .maybeSingle();
        carId = carRow?.id ?? null;
        agencyId = carRow?.agency_id ?? null;
      }

      if (!agencyId) throw new Error("agency_id introuvable pour ce véhicule");

      // 3. Insérer la réservation
      const { data: reservation, error: resError } = await supabaseAdmin
        .from("reservations")
        .insert({
          customer_id: customerId,
          car_id: carId,
          agency_id: agencyId,
          client_name: `${meta.customerFirstName ?? ""} ${meta.customerLastName ?? ""}`.trim(),
          client_email: meta.customerEmail,
          client_phone: meta.customerPhone ?? null,
          date_from: meta.dateFrom,
          date_to: meta.dateTo,
          time_from: meta.timeFrom || "10:00",
          time_to: meta.timeTo || "10:00",
          days: Number(meta.days),
          total: Number(meta.total),
          deposit: Number(meta.deposit),
          deposit_paid: true,
          status: "confirmed",
          city: meta.city ?? null,
        })
        .select()
        .single();

      if (resError) throw resError;

      // 4. Email de confirmation via Resend
      const emailResult = await resend.emails.send({
        from: "Drivo <onboarding@resend.dev>",
        to: process.env.RESEND_TEST_EMAIL || meta.customerEmail,
        subject: `✅ Réservation confirmée — ${meta.carName}`,
        html: buildEmailHtml({ meta, reservationId: reservation?.id }),
      });
      console.log("[stripe] email result:", JSON.stringify(emailResult));

      console.log("[stripe] ✅ Réservation créée:", reservation?.id);
    } catch (err) {
      console.error("[stripe] webhook processing error:", err.message);
    }
  }

  res.json({ received: true });
});

// ─── POST /api/stripe/cancel ─────────────────────────────────────────────────
// Dashboard agence appelle cette route pour annuler une réservation + envoyer mail
router.post("/cancel", async (req, res) => {
  const { reservationId } = req.body;
  if (!reservationId) return res.status(400).json({ error: "reservationId requis" });

  try {
    const { data: r, error } = await supabaseAdmin
      .from("reservations")
      .select("id, client_name, client_email, date_from, date_to, total, deposit, cars(name, img)")
      .eq("id", reservationId)
      .single();

    if (error || !r) throw new Error("Réservation introuvable");

    await resend.emails.send({
      from: "Drivo <onboarding@resend.dev>",
      to: process.env.RESEND_TEST_EMAIL || r.client_email,
      subject: `❌ Réservation annulée — ${r.cars?.name}`,
      html: buildCancellationEmailHtml(r),
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("[cancel] error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/stripe/session/:id ─────────────────────────────────────────────
// Frontend appelle cette route sur la page success pour afficher les détails
router.get("/session/:id", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    res.json({
      customerEmail: session.customer_email,
      customerFirstName: session.metadata?.customerFirstName,
      customerLastName: session.metadata?.customerLastName,
      carName: session.metadata?.carName,
      carImg: session.metadata?.carImg,
      dateFrom: session.metadata?.dateFrom,
      dateTo: session.metadata?.dateTo,
      days: session.metadata?.days,
      total: session.metadata?.total,
      deposit: session.metadata?.deposit,
      city: session.metadata?.city,
      amountPaid: (session.amount_total / 100).toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Email HTML ───────────────────────────────────────────────────────────────
function buildEmailHtml({ meta, reservationId }) {
  const solde = Number(meta.total) - Number(meta.deposit);
  const refId = reservationId ? String(reservationId).padStart(6, "0") : "—";
  const fmtDate = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const pickupDay = fmtDate(meta.dateFrom);
  const returnDay = fmtDate(meta.dateTo);
  const days = Number(meta.days);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Confirmation de réservation Drivo</title>
</head>
<body style="margin:0;padding:0;background:#07070c;font-family:'Helvetica Neue',Arial,sans-serif;color:#f5efe0">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:40px">
    <h1 style="margin:0;font-size:36px;color:#c9a84c;letter-spacing:6px;font-weight:900;text-transform:uppercase">DRIVO</h1>
    <p style="margin:8px 0 0;font-size:11px;color:#ffffff35;letter-spacing:4px;text-transform:uppercase">Location de véhicules premium</p>
    <div style="width:60px;height:2px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);margin:16px auto 0"></div>
  </div>

  <!-- Badge confirmation -->
  <div style="background:linear-gradient(135deg,#0d2818,#0a1f12);border:1px solid #22c55e40;border-radius:16px;padding:20px 24px;margin-bottom:28px;display:flex;align-items:center;gap:16px">
    <div style="font-size:28px">✅</div>
    <div>
      <p style="margin:0;font-size:18px;font-weight:800;color:#22c55e">Réservation confirmée</p>
      <p style="margin:4px 0 0;font-size:13px;color:#ffffff60">Bonjour <strong style="color:#f5efe0">${meta.customerFirstName} ${meta.customerLastName}</strong>, votre réservation est bien enregistrée.</p>
    </div>
  </div>

  <!-- N° réservation -->
  <div style="text-align:center;background:#ffffff06;border:1px dashed #c9a84c50;border-radius:12px;padding:16px;margin-bottom:28px">
    <p style="margin:0;font-size:11px;color:#ffffff40;letter-spacing:3px;text-transform:uppercase">Numéro de réservation</p>
    <p style="margin:6px 0 0;font-size:26px;font-weight:900;color:#c9a84c;letter-spacing:4px">#${refId}</p>
    <p style="margin:6px 0 0;font-size:11px;color:#ffffff30">Conservez ce numéro pour toute communication avec notre équipe</p>
  </div>

  <!-- Véhicule -->
  ${meta.carImg ? `<img src="${meta.carImg}" alt="${meta.carName}" style="width:100%;height:200px;object-fit:cover;border-radius:16px;margin-bottom:28px;display:block">` : ""}

  <!-- Détails réservation -->
  <div style="background:linear-gradient(135deg,#1a1830,#0f0e1a);border:1px solid #c9a84c30;border-radius:20px;padding:28px;margin-bottom:24px">
    <h2 style="margin:0 0 20px;font-size:13px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;font-weight:700">Détails de votre location</h2>

    <table style="width:100%;border-collapse:collapse">
      <tr style="border-bottom:1px solid #ffffff08">
        <td style="padding:12px 0;font-size:13px;color:#ffffff55;width:40%">🚗 Véhicule</td>
        <td style="padding:12px 0;font-size:14px;font-weight:800;text-align:right;color:#f5efe0">${meta.carName}</td>
      </tr>
      <tr style="border-bottom:1px solid #ffffff08">
        <td style="padding:12px 0;font-size:13px;color:#ffffff55">📅 Prise en charge</td>
        <td style="padding:12px 0;font-size:13px;font-weight:700;text-align:right;color:#f5efe0">${pickupDay} à ${meta.timeFrom || "10:00"}</td>
      </tr>
      <tr style="border-bottom:1px solid #ffffff08">
        <td style="padding:12px 0;font-size:13px;color:#ffffff55">🔄 Restitution</td>
        <td style="padding:12px 0;font-size:13px;font-weight:700;text-align:right;color:#f5efe0">${returnDay} à ${meta.timeTo || "10:00"}</td>
      </tr>
      <tr style="border-bottom:1px solid #ffffff08">
        <td style="padding:12px 0;font-size:13px;color:#ffffff55">⏱ Durée</td>
        <td style="padding:12px 0;font-size:13px;font-weight:700;text-align:right;color:#f5efe0">${days} jour${days > 1 ? "s" : ""}</td>
      </tr>
      ${meta.city ? `<tr><td style="padding:12px 0;font-size:13px;color:#ffffff55">📍 Ville</td><td style="padding:12px 0;font-size:13px;font-weight:700;text-align:right;color:#f5efe0">${meta.city}</td></tr>` : ""}
    </table>
  </div>

  <!-- Paiement -->
  <div style="background:#c9a84c0e;border:1px solid #c9a84c35;border-radius:20px;padding:28px;margin-bottom:24px">
    <h2 style="margin:0 0 20px;font-size:13px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;font-weight:700">Récapitulatif paiement</h2>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <span style="font-size:13px;color:#ffffff55">Total de la location</span>
      <strong style="font-size:14px;color:#f5efe0">${Number(meta.total).toLocaleString("fr-FR")} €</strong>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;background:#22c55e10;border-radius:8px;padding:10px 12px">
      <span style="font-size:13px;color:#22c55e">✓ Acompte payé en ligne</span>
      <strong style="font-size:14px;color:#22c55e">${Number(meta.deposit).toLocaleString("fr-FR")} €</strong>
    </div>
    <div style="border-top:1px solid #ffffff12;padding-top:16px;display:flex;justify-content:space-between;align-items:center">
      <div>
        <p style="margin:0;font-size:14px;font-weight:800;color:#f5efe0">Solde à régler sur place</p>
        <p style="margin:4px 0 0;font-size:11px;color:#ffffff40">À payer lors de la prise en charge du véhicule</p>
      </div>
      <strong style="font-size:24px;color:#c9a84c;font-weight:900">${solde.toLocaleString("fr-FR")} €</strong>
    </div>
  </div>

  <!-- Instructions -->
  <div style="background:#ffffff04;border:1px solid #ffffff10;border-radius:20px;padding:28px;margin-bottom:24px">
    <h2 style="margin:0 0 20px;font-size:13px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;font-weight:700">Ce que vous devez savoir</h2>
    <div style="display:flex;flex-direction:column;gap:14px">
      <div style="display:flex;gap:14px;align-items:flex-start">
        <div style="width:32px;height:32px;background:#c9a84c15;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">📋</div>
        <div><p style="margin:0;font-size:13px;font-weight:700;color:#f5efe0">Documents à apporter</p><p style="margin:4px 0 0;font-size:12px;color:#ffffff55;line-height:1.6">Permis de conduire valide, pièce d'identité et ce numéro de réservation : <strong style="color:#c9a84c">#${refId}</strong></p></div>
      </div>
      <div style="display:flex;gap:14px;align-items:flex-start">
        <div style="width:32px;height:32px;background:#c9a84c15;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">🕙</div>
        <div><p style="margin:0;font-size:13px;font-weight:700;color:#f5efe0">Horaires de remise</p><p style="margin:4px 0 0;font-size:12px;color:#ffffff55;line-height:1.6">Prise en charge le <strong style="color:#f5efe0">${pickupDay} à ${meta.timeFrom || "10:00"}</strong>. Veuillez vous présenter 15 min à l'avance.</p></div>
      </div>
      <div style="display:flex;gap:14px;align-items:flex-start">
        <div style="width:32px;height:32px;background:#c9a84c15;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">🔄</div>
        <div><p style="margin:0;font-size:13px;font-weight:700;color:#f5efe0">Restitution du véhicule</p><p style="margin:4px 0 0;font-size:12px;color:#ffffff55;line-height:1.6">Le véhicule doit être restitué le <strong style="color:#f5efe0">${returnDay} à ${meta.timeTo || "10:00"}</strong> dans le même état.</p></div>
      </div>
      <div style="display:flex;gap:14px;align-items:flex-start">
        <div style="width:32px;height:32px;background:#c9a84c15;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">❌</div>
        <div><p style="margin:0;font-size:13px;font-weight:700;color:#f5efe0">Politique d'annulation</p><p style="margin:4px 0 0;font-size:12px;color:#ffffff55;line-height:1.6">L'acompte n'est pas remboursable. Annulation gratuite 48h avant la date de prise en charge — contactez-nous directement.</p></div>
      </div>
    </div>
  </div>

  <!-- Merci -->
  <div style="text-align:center;padding:32px 0 24px">
    <p style="margin:0;font-size:22px;font-weight:800;color:#f5efe0">Merci pour votre confiance, ${meta.customerFirstName} !</p>
    <p style="margin:12px 0 0;font-size:14px;color:#ffffff50;line-height:1.7">Nous avons hâte de vous accueillir.<br>Notre équipe est disponible pour toute question.</p>
    <div style="margin-top:24px">
      <a href="mailto:contact@drivo.ma" style="display:inline-block;background:#c9a84c;color:#07070c;text-decoration:none;font-weight:800;font-size:13px;padding:12px 28px;border-radius:50px;letter-spacing:1px">Nous contacter</a>
    </div>
  </div>

  <!-- Footer -->
  <div style="border-top:1px solid #ffffff0a;padding-top:24px;text-align:center">
    <p style="margin:0;font-size:12px;font-weight:900;color:#c9a84c;letter-spacing:4px">DRIVO</p>
    <p style="margin:8px 0 0;font-size:11px;color:#ffffff25;line-height:1.8">contact@drivo.ma · Maroc<br>Cet email est généré automatiquement — merci de ne pas y répondre directement.</p>
  </div>

</div>
</body>
</html>`;
}

function buildCancellationEmailHtml(r) {
  const fmtDate = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const refId = String(r.id).padStart(6, "0");
  const firstName = r.client_name?.split(" ")[0] || "Client";

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#07070c;font-family:'Helvetica Neue',Arial,sans-serif;color:#f5efe0">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">

  <div style="text-align:center;margin-bottom:40px">
    <h1 style="margin:0;font-size:36px;color:#c9a84c;letter-spacing:6px;font-weight:900;text-transform:uppercase">DRIVO</h1>
    <p style="margin:8px 0 0;font-size:11px;color:#ffffff35;letter-spacing:4px;text-transform:uppercase">Location de véhicules premium</p>
    <div style="width:60px;height:2px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);margin:16px auto 0"></div>
  </div>

  <div style="background:linear-gradient(135deg,#1a0808,#120a0a);border:1px solid #ef444440;border-radius:16px;padding:20px 24px;margin-bottom:28px">
    <div style="font-size:28px;margin-bottom:8px">❌</div>
    <p style="margin:0;font-size:18px;font-weight:800;color:#ef4444">Réservation annulée</p>
    <p style="margin:6px 0 0;font-size:13px;color:#ffffff60">Bonjour <strong style="color:#f5efe0">${firstName}</strong>, votre réservation a été annulée par l'agence.</p>
  </div>

  <div style="text-align:center;background:#ffffff06;border:1px dashed #c9a84c50;border-radius:12px;padding:16px;margin-bottom:28px">
    <p style="margin:0;font-size:11px;color:#ffffff40;letter-spacing:3px;text-transform:uppercase">Numéro de réservation</p>
    <p style="margin:6px 0 0;font-size:26px;font-weight:900;color:#c9a84c;letter-spacing:4px">#${refId}</p>
  </div>

  ${r.cars?.img ? `<img src="${r.cars.img}" alt="${r.cars.name}" style="width:100%;height:180px;object-fit:cover;border-radius:16px;margin-bottom:28px;display:block;opacity:0.6">` : ""}

  <div style="background:linear-gradient(135deg,#1a1830,#0f0e1a);border:1px solid #c9a84c30;border-radius:20px;padding:28px;margin-bottom:24px">
    <h2 style="margin:0 0 20px;font-size:13px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;font-weight:700">Détails annulés</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr style="border-bottom:1px solid #ffffff08">
        <td style="padding:12px 0;font-size:13px;color:#ffffff55;width:40%">🚗 Véhicule</td>
        <td style="padding:12px 0;font-size:14px;font-weight:800;text-align:right">${r.cars?.name || "—"}</td>
      </tr>
      <tr style="border-bottom:1px solid #ffffff08">
        <td style="padding:12px 0;font-size:13px;color:#ffffff55">📅 Prise en charge</td>
        <td style="padding:12px 0;font-size:13px;font-weight:700;text-align:right">${fmtDate(r.date_from)}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;font-size:13px;color:#ffffff55">🏁 Restitution</td>
        <td style="padding:12px 0;font-size:13px;font-weight:700;text-align:right">${fmtDate(r.date_to)}</td>
      </tr>
    </table>
  </div>

  <div style="background:#22c55e10;border:1px solid #22c55e30;border-radius:16px;padding:20px 24px;margin-bottom:28px">
    <p style="margin:0;font-size:13px;color:#22c55e;font-weight:700">💳 Remboursement</p>
    <p style="margin:8px 0 0;font-size:13px;color:#ffffff70;line-height:1.6">L'acompte de <strong style="color:#f5efe0">${r.deposit} €</strong> sera remboursé sous 5–10 jours ouvrés sur votre moyen de paiement d'origine.</p>
  </div>

  <div style="border-top:1px solid #ffffff0a;padding-top:24px;text-align:center">
    <p style="margin:0;font-size:12px;font-weight:900;color:#c9a84c;letter-spacing:4px">DRIVO</p>
    <p style="margin:8px 0 0;font-size:11px;color:#ffffff25;line-height:1.8">contact@drivo.ma · Maroc<br>Cet email est généré automatiquement — merci de ne pas y répondre directement.</p>
  </div>

</div>
</body>
</html>`;
}

export default router;
