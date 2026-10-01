const { Client } = require('pg');
const c = new Client({
  connectionString: 'postgresql://postgres:Lucasduda28123@db.tkwqshhsmegirqmmjuyv.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});
c.connect()
  .then(() => c.query('CREATE EXTENSION IF NOT EXISTS http;'))
  .then(() => c.query("SELECT content::jsonb FROM http_post('https://httpbin.org/post', '{\"test\":1}', 'application/json');"))
  .then(r => { console.log('HTTP Ext OK:', r.rows[0].content); return c.end(); })
  .catch(e => { console.error('Erro:', e.message); return c.end(); });
