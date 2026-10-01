import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const urlMatch = envFile.match(/VITE_SUPABASE_URL="(.*)"/);
const keyMatch = envFile.match(/VITE_SUPABASE_PUBLISHABLE_KEY="(.*)"/);

const supabase = createClient(urlMatch![1], keyMatch![1]);
supabase.from('store_settings').select('*').then((res) => console.log("Result:", res)).catch(console.error);
