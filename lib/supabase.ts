import { createClient } from '@supabase/supabase-js';

// TypeScript bu değişkenlerin boş olma ihtimaline karşı kızmasın diye
// sonlarına minik bir "|| ''" ekliyoruz.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);