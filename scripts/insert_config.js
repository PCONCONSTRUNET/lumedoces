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
  .then(() => c.query(
    'INSERT INTO app_config(key, value) VALUES(, ::jsonb) ON CONFLICT(key) DO NOTHING',
    ['mp_gateway_config', JSON.stringify({ active: false, accessToken: '' })]
  ))
  .then(r => { console.log('Inserido!', r.rowCount, 'linha(s)'); return c.end(); })
  .catch(e => { console.error('Erro:', e.message); return c.end(); });
