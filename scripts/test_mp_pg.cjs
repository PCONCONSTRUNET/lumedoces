const { Client } = require('pg');
const c = new Client({
  connectionString: 'postgresql://postgres:Lucasduda28123@db.tkwqshhsmegirqmmjuyv.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

const fn = `
CREATE OR REPLACE FUNCTION test_mp_http() RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE
  req http_request;
  res http_response;
BEGIN
  req.method := 'POST';
  req.uri := 'https://api.mercadopago.com/v1/payments';
  req.headers := ARRAY[
    http_header('Authorization', 'Bearer APP_USR-4237224829653865-092216-8e53ce9edb6626294e6063076c652336-3700302220'),
    http_header('X-Idempotency-Key', 'test-' || extract(epoch from now())::text)
  ];
  req.content_type := 'application/json';
  req.content := '{"transaction_amount": 1, "payment_method_id": "pix", "payer": {"email": "lumeartesanaisc@gmail.com", "first_name": "teste"}}';
  
  res := http(req);
  RETURN res.content::jsonb;
END;
$$;
`;

c.connect()
  .then(() => c.query(fn))
  .then(() => c.query('SELECT test_mp_http();'))
  .then(r => { console.log('MP Response:', JSON.stringify(r.rows[0].test_mp_http, null, 2)); return c.end(); })
  .catch(e => { console.error('Erro:', e.message); return c.end(); });
