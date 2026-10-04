import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection to:', supabaseUrl);
  
  // Test 1: Fetch registrations
  const { data: regData, error: regError } = await supabase.from('registrations').select('*').limit(1);
  console.log('Registrations table test:');
  if (regError) {
    console.error('FAIL - Error:', regError.message);
  } else {
    console.log('PASS - Data:', regData);
  }

  // Test 2: Check auth (mock sign in or sign up just to see if auth is enabled)
  console.log('Auth check:');
  const { data: authData, error: authError } = await supabase.auth.getSession();
  if (authError) {
    console.error('FAIL - Error:', authError.message);
  } else {
    console.log('PASS - Auth service is active. Session:', authData.session ? 'exists' : 'null');
  }
}

testConnection();
