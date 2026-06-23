import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

/**
 * Retorna o cliente Supabase configurado com a service_role key.
 * Retorna `null` se as variaveis de ambiente nao estiverem definidas,
 * sinalizando que o fallback para arquivo local deve ser usado.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(url, key, {
      auth: { persistSession: false }
    });
  }

  return cachedClient;
}
