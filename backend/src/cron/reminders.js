import cron from "node-cron";
import { Resend } from "resend";
import { supabaseAdmin } from "../supabase.js";

const resend = new Resend(process.env.RESEND_API_KEY);

// Tourne chaque jour à 8h00
export function startReminderCron() {
  cron.schedule("0 8 * * *", async () => {
    console.log("[cron] Envoi rappels réservations J-1...");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    const { data: reservations, error } = await supabaseAdmin
      .from("reservations")
      .select("id, client_name, client_email, date_from, date_to, total, deposit, time_from, city, cars(name, img, agencies(name, address, city, phone))")
      .eq("date_from", dateStr)
      .in("status", ["confirmed", "pending"]);

    if (error) {
      console.error("[cron] Erreur fetch réservations:", error.message);
      return;
    }

    console.log(`[cron] ${reservations.length} rappel(s) à envoyer`);

    for (const r of reservations) {
      try {
        await resend.emails.send({
          from: "Drivo <onboarding@resend.dev>",
          to: process.env.RESEND_TEST_EMAIL || r.client_email,
          subject: `⏰ Rappel — Votre location ${r.cars?.name} commence demain`,
          html: buildReminderEmailHtml(r),
        });
        console.log(`[cron] Rappel envoyé à ${r.client_email}`);
      } catch (err) {
        console.error(`[cron] Erreur envoi rappel ${r.id}:`, err.message);
      }
    }
  });

  console.log("[cron] Rappels J-1 programmés à 8h00");
}

function buildReminderEmailHtml(r) {
  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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

  <div style="background:linear-gradient(135deg,#1a1500,#120f00);border:1px solid #c9a84c40;border-radius:16px;padding:20px 24px;margin-bottom:28px">
    <div style="font-size:28px;margin-bottom:8px">⏰</div>
    <p style="margin:0;font-size:18px;font-weight:800;color:#c9a84c">Votre location commence demain</p>
    <p style="margin:6px 0 0;font-size:13px;color:#ffffff60">Bonjour <strong style="color:#f5efe0">${firstName}</strong>, voici un rappel pour votre réservation de demain.</p>
  </div>

  <div style="text-align:center;background:#ffffff06;border:1px dashed #c9a84c50;border-radius:12px;padding:16px;margin-bottom:28px">
    <p style="margin:0;font-size:11px;color:#ffffff40;letter-spacing:3px;text-transform:uppercase">Numéro de réservation</p>
    <p style="margin:6px 0 0;font-size:26px;font-weight:900;color:#c9a84c;letter-spacing:4px">#${refId}</p>
  </div>

  ${r.cars?.img ? `<img src="${r.cars.img}" alt="${r.cars.name}" style="width:100%;height:200px;object-fit:cover;border-radius:16px;margin-bottom:28px;display:block">` : ""}

  <div style="background:linear-gradient(135deg,#1a1830,#0f0e1a);border:1px solid #c9a84c30;border-radius:20px;padding:28px;margin-bottom:24px">
    <h2 style="margin:0 0 20px;font-size:13px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;font-weight:700">Détails de votre location</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr style="border-bottom:1px solid #ffffff08">
        <td style="padding:12px 0;font-size:13px;color:#ffffff55;width:40%">🚗 Véhicule</td>
        <td style="padding:12px 0;font-size:14px;font-weight:800;text-align:right">${r.cars?.name || "—"}</td>
      </tr>
      <tr style="border-bottom:1px solid #ffffff08">
        <td style="padding:12px 0;font-size:13px;color:#ffffff55">📅 Prise en charge</td>
        <td style="padding:12px 0;font-size:13px;font-weight:700;text-align:right;color:#c9a84c">${fmtDate(r.date_from)} à ${r.time_from || "10:00"}</td>
      </tr>
      <tr style="border-bottom:1px solid #ffffff08">
        <td style="padding:12px 0;font-size:13px;color:#ffffff55">🏁 Restitution</td>
        <td style="padding:12px 0;font-size:13px;font-weight:700;text-align:right">${fmtDate(r.date_to)}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;font-size:13px;color:#ffffff55">💳 Solde restant</td>
        <td style="padding:12px 0;font-size:14px;font-weight:800;text-align:right;color:#f59e0b">${r.total - r.deposit} € à régler en cash</td>
      </tr>
    </table>
  </div>

  <!-- Lieu de prise en charge -->
  <div style="background:linear-gradient(135deg,#0d1a2b,#081018);border:1px solid #3b82f640;border-radius:20px;padding:28px;margin-bottom:24px">
    <h2 style="margin:0 0 16px;font-size:13px;color:#60a5fa;letter-spacing:3px;text-transform:uppercase;font-weight:700">📍 Lieu de prise en charge</h2>
    ${r.cars?.agencies?.name ? `<p style="margin:0 0 8px;font-size:15px;font-weight:800;color:#f5efe0">${r.cars.agencies.name}</p>` : ""}
    ${r.cars?.agencies?.address ? `<p style="margin:0 0 6px;font-size:13px;color:#ffffff70">${r.cars.agencies.address}${r.cars.agencies.city ? `, ${r.cars.agencies.city}` : ""}</p>` : r.city ? `<p style="margin:0 0 6px;font-size:13px;color:#ffffff70">${r.city}</p>` : ""}
    <p style="margin:12px 0 0;font-size:14px;font-weight:700;color:#c9a84c">🕐 À ${r.time_from || "10:00"}</p>
    ${r.cars?.agencies?.phone ? `<p style="margin:8px 0 0;font-size:13px;color:#ffffff55">📞 ${r.cars.agencies.phone}</p>` : ""}
  </div>

  <div style="background:#22c55e10;border:1px solid #22c55e30;border-radius:16px;padding:20px 24px;margin-bottom:28px">
    <p style="margin:0;font-size:13px;color:#22c55e;font-weight:700">✅ Rappel important</p>
    <p style="margin:8px 0 0;font-size:13px;color:#ffffff70;line-height:1.6">Présentez-vous avec votre <strong style="color:#f5efe0">permis de conduire</strong> et votre <strong style="color:#f5efe0">pièce d'identité</strong> à l'heure de prise en charge.</p>
  </div>

  <div style="border-top:1px solid #ffffff0a;padding-top:24px;text-align:center">
    <p style="margin:0;font-size:12px;font-weight:900;color:#c9a84c;letter-spacing:4px">DRIVO</p>
    <p style="margin:8px 0 0;font-size:11px;color:#ffffff25;line-height:1.8">contact@drivo.ma · Maroc<br>Cet email est généré automatiquement — merci de ne pas y répondre directement.</p>
  </div>

</div>
</body>
</html>`;
}
