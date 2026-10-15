import "server-only";
import { createClient } from "@supabase/supabase-js";

let client;
/** Client Supabase avec la clé service_role. Importable uniquement côté serveur. */
export function db() {
  if (!client) {
    client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
