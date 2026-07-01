import { createClient } from "@supabase/supabase-js";

// Supabase client. Set these in .env.local (see .env.example).
// The site degrades gracefully (RSVP/guestbook stored locally) if not configured.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;
