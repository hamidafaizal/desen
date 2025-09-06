import { createClient } from '@supabase/supabase-js'

// Ambil URL dan Kunci Anon dari environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Log untuk debugging koneksi
console.log("Connecting to Supabase with URL:", supabaseUrl ? "URL Loaded" : "URL NOT FOUND");

// Buat dan ekspor client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
