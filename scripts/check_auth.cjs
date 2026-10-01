const { Client } = require('pg');
const c = new Client({
  host: 'db.tkwqshhsmegirqmmjuyv.supabase.co',
  port: 5432, database: 'postgres', user: 'postgres',
  password: 'Lucasduda28123', ssl: { rejectUnauthorized: false }
});
// Verifica quantos usuarios existem no auth
c.connect()
  .then(() => c.query('SELECT COUNT(*) as total FROM auth.users'))
  .then(r => { console.log('Users no auth:', r.rows[0].total); return c.end(); })
  .catch(e => { console.error('Erro:', e.message); return c.end(); });
