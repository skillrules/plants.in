import { createClient } from '@supabase/supabase-js';


const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function test() {
  const dummyOrder = {
    customer_name: 'Test',
    customer_email: 'test@example.com',
    customer_phone: '1234567890',
    shipping_address: '123 Test St',
    shipping_city: 'Test City',
    shipping_postal: '12345',
    subtotal: 100
  };

  // Test 1: with select()
  console.log("Testing insert WITH select()...");
  const res1 = await supabase.from('orders').insert(dummyOrder).select('id').single();
  console.log("Result 1:", res1.error ? res1.error.message : "Success");

  // Test 2: without select()
  console.log("\nTesting insert WITHOUT select()...");
  const res2 = await supabase.from('orders').insert(dummyOrder);
  console.log("Result 2:", res2.error ? res2.error.message : "Success");
}
test();
