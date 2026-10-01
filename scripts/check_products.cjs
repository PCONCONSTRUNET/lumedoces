const { Client } = require('pg');
const c = new Client({
  connectionString: 'postgresql://postgres:Lucasduda28123@db.tkwqshhsmegirqmmjuyv.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});
c.connect()
  .then(() => c.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'products';"))
  .then(r => { console.log('Products Columns:', r.rows.map(row => row.column_name).join(', ')); return c.end(); })
  .catch(e => { console.error('Erro:', e.message); return c.end(); });
