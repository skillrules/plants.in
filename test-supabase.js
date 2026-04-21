import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY);

async function test() {
  const { data, error } = await supabase.from('site_settings').select('site_name, logo_url, favicon_url').eq('id', 1).maybeSingle();
  console.log("SELECT ERROR:", error?.message || "None");
  console.log("SELECT DATA:", data);
}
test();
