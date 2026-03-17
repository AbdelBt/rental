import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Variables d'environnement Supabase manquantes !");
}

// Singleton qui survit aux rechargements HMR de Vite
// Sans ça, chaque save recrée le client → session perdue → requêtes sans token
const globalKey = "__supabase_client__";
if (!window[globalKey]) {
  window[globalKey] = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = window[globalKey];
