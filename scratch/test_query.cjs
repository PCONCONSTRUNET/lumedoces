const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL="(.*?)"/);
const keyMatch = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY="(.*?)"/);

if (!urlMatch || !keyMatch) {
  console.log("Could not find variables in .env");
  process.exit(1);
}

const supabase = createClient(urlMatch[1], keyMatch[1]);
supabase.from('customer_profiles').select('*').then(res => {
  console.log(JSON.stringify(res, null, 2));
}).catch(err => console.error(err));
