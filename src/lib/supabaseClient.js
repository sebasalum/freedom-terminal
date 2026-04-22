import { createClient } from '@supabase/supabase-js';

// Extraemos las variables de entorno de forma segura
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Inicializamos y exportamos el cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
