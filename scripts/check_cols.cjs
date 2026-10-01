const { Client } = require('pg');
const c = new Client({
  host: 'db.tkwqshhsmegirqmmjuyv.supabase.co',
  port: 5432, database: 'postgres', user: 'postgres',
  password: 'Lucasduda28123', ssl: { rejectUnauthorized: false }
});
c.connect()
  .then(() => c.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'business_hours'"))
  .then(r => { console.log('Colunas:', r.rows.map(x => x.column_name).join(', ')); return c.end(); })
  .catch(e => { console.error('Erro:', e.message); return c.end(); });
