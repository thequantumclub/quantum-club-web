import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ozgcxewhmvenewhgnnqy.supabase.co';
const supabaseKey = 'sb_publishable_54PxzwiUP1krgQAfi_3JPg_F_NHs63M';
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

  // Test 2: Check auth
  console.log('Auth check:');
  const { data: authData, error: authError } = await supabase.auth.getSession();
  if (authError) {
    console.error('FAIL - Error:', authError.message);
  } else {
    console.log('PASS - Auth service is active. Session:', authData.session ? 'exists' : 'null');
  }
}

testConnection();
