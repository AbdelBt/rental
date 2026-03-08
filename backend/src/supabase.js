import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "[backend] SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant. " +
      "Copie .env.example vers .env et renseigne les valeurs.",
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

