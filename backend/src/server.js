import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import carsRouter from "./routes/cars.js";
import reservationsRouter from "./routes/reservations.js";
import agencyRouter from "./routes/agency.js";
import customersRouter from "./routes/customers.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "drivo-backend", env: process.env.NODE_ENV || "development" });
});

// Routers
app.use("/api/cars", carsRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/agency", agencyRouter);
app.use("/api/customers", customersRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[backend] Server running on http://localhost:${port}`);
});

