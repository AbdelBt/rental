import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import stripeRouter from "./routes/stripe.js";
import { startReminderCron } from "./cron/reminders.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: true, credentials: true }));

// ⚠️ Le webhook Stripe a besoin du raw body — doit être AVANT express.json()
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "drivo-backend", env: process.env.NODE_ENV || "development" });
});

app.use("/api/stripe", stripeRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[backend] Server running on http://localhost:${port}`);
  startReminderCron();
});
