const { Client } = require('pg');
const c = new Client({
  host: 'db.tkwqshhsmegirqmmjuyv.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Lucasduda28123',
  ssl: { rejectUnauthorized: false }
});

c.connect()
  .then(() => c.query("INSERT INTO app_config(key, value) SELECT 'mp_gateway_config', '{\"active\":false,\"accessToken\":\"\"}'::jsonb WHERE NOT EXISTS (SELECT 1 FROM app_config WHERE key = 'mp_gateway_config')"))
  .then(r => { console.log('OK! rows:', r.rowCount); return c.end(); })
  .catch(e => { console.error('Erro:', e.message, e.detail); return c.end(); });
