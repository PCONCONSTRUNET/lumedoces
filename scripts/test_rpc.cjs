const { Client } = require('pg');
const c = new Client({
  connectionString: 'postgresql://postgres:Lucasduda28123@db.tkwqshhsmegirqmmjuyv.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});
c.connect()
  .then(() => c.query(SELECT create_pix_payment('{"amount": 2, "description": "Pedido Teste Postgres", "payerName": "Lucas"}');))
  .then(r => { console.log('RPC Response:', JSON.stringify(r.rows[0].create_pix_payment, null, 2)); return c.end(); })
  .catch(e => { console.error('Erro:', e.message); return c.end(); });
