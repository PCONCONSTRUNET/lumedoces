const { Client } = require('pg');
const c = new Client({
  host: 'db.tkwqshhsmegirqmmjuyv.supabase.co',
  port: 5432, database: 'postgres', user: 'postgres',
  password: 'Lucasduda28123', ssl: { rejectUnauthorized: false }
});
const DAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'];
c.connect()
  .then(() => c.query("SELECT day_of_week, open_time, close_time, is_closed, is_24h FROM business_hours ORDER BY day_of_week"))
  .then(r => {
    r.rows.forEach(row => {
      console.log(DAYS[row.day_of_week] + ':', JSON.stringify(row));
    });
    return c.end();
  })
  .catch(e => { console.error('Erro:', e.message); return c.end(); });
