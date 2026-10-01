const { Client } = require('pg');
const c = new Client({
  connectionString: 'postgresql://postgres:Lucasduda28123@db.tkwqshhsmegirqmmjuyv.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

const fn = `
CREATE EXTENSION IF NOT EXISTS http;

CREATE OR REPLACE FUNCTION create_pix_payment(payload jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_config jsonb;
  v_token text;
  v_active boolean;
  req http_request;
  res http_response;
  mp_payload jsonb;
BEGIN
  SELECT value INTO v_config FROM app_config WHERE key = 'mp_gateway_config';
  
  IF v_config IS NULL THEN
    RETURN '{"error": "Mercado Pago não configurado"}'::jsonb;
  END IF;
  
  v_active := (v_config->>'active')::boolean;
  v_token := v_config->>'accessToken';
  
  IF NOT v_active OR v_token IS NULL OR v_token = '' THEN
    RETURN '{"error": "Mercado Pago inativo ou sem token"}'::jsonb;
  END IF;
  
  mp_payload := jsonb_build_object(
    'transaction_amount', (payload->>'amount')::numeric,
    'description', payload->>'description',
    'payment_method_id', 'pix',
    'external_reference', payload->>'externalReference',
    'payer', jsonb_build_object(
      'email', COALESCE(payload->>'payerEmail', 'lumeartesanaisc@gmail.com'),
      'first_name', payload->>'payerName'
    )
  );

  IF payload->>'payerCpf' IS NOT NULL AND length(regexp_replace(payload->>'payerCpf', '\\D', '', 'g')) >= 11 THEN
    mp_payload := jsonb_set(
      mp_payload, 
      '{payer,identification}', 
      jsonb_build_object(
        'type', CASE WHEN length(regexp_replace(payload->>'payerCpf', '\\D', '', 'g')) = 14 THEN 'CNPJ' ELSE 'CPF' END,
        'number', regexp_replace(payload->>'payerCpf', '\\D', '', 'g')
      )
    );
  END IF;

  req.method := 'POST';
  req.uri := 'https://api.mercadopago.com/v1/payments';
  req.headers := ARRAY[
    http_header('Authorization', 'Bearer ' || v_token),
    http_header('X-Idempotency-Key', COALESCE(payload->>'externalReference', 'req-' || extract(epoch from now())::text))
  ];
  req.content_type := 'application/json';
  req.content := mp_payload::text;
  
  res := http(req);
  
  IF res.status >= 200 AND res.status < 300 THEN
    RETURN jsonb_build_object(
      'qrCodeBase64', res.content::jsonb #>> '{point_of_interaction,transaction_data,qr_code_base64}',
      'qrCode', res.content::jsonb #>> '{point_of_interaction,transaction_data,qr_code}'
    );
  ELSE
    RETURN jsonb_build_object('error', 'Erro MP: ' || res.status::text, 'details', res.content);
  END IF;
END;
$$;
`;

c.connect()
  .then(() => c.query(fn))
  .then(() => { console.log('Função criada com sucesso!'); return c.end(); })
  .catch(e => { console.error('Erro:', e.message); return c.end(); });
