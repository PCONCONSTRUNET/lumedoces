const { Client } = require('pg');
const c = new Client({
  host: 'db.tkwqshhsmegirqmmjuyv.supabase.co',
  port: 5432, database: 'postgres', user: 'postgres',
  password: 'Lucasduda28123', ssl: { rejectUnauthorized: false }
});
c.connect()
  .then(() => c.query("SELECT value FROM app_config WHERE key = 'mp_gateway_config'"))
  .then(r => { console.log('Config MP:', JSON.stringify(r.rows[0]?.value, null, 2)); return c.end(); })
  .catch(e => { console.error('Erro:', e.message); return c.end(); });
