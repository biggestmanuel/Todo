import { createClient } from '@supabase/supabase-js';

// Single shared Supabase client, built from env vars.
// NEXT_PUBLIC_ vars are safe to expose because Row Level Security (RLS)
// on the todos table is what actually controls access — see README.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
