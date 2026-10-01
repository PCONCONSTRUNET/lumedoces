const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://tkwqshhsmegirqmmjuyv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrd3FzaGhzbWVnaXJxbW1qdXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NTE1OTIsImV4cCI6MjEwNjIyNzU5Mn0.thF4wKT62uoOpTc6Sndaz_64bV24S4e2g3uG4QzoD9A';
const supabase = createClient(supabaseUrl, supabaseKey);

supabase.rpc('create_pix_payment', {
  payload: {
    amount: 1,
    description: 'Pedido Teste Anon',
    payerName: 'Lucas',
    payerEmail: 'lumeartesanaisc@gmail.com'
  }
}).then(console.log).catch(console.error);
