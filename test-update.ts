import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);
async function test() {
  const { error } = await supabase.from('site_settings').update({ favicon_url: 'test' }).eq('id', 1);
  console.log("UPDATE ERROR:", error);
}
test();
