import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://your-project.supabase.co'; // Replace with your actual Supabase URL
const SUPABASE_ANON_KEY = 'your-anon-key'; // Replace with your actual Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);