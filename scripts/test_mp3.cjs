const token = 'APP_USR-4237224829653865-092216-8e53ce9edb6626294e6063076c652336-3700302220';
fetch('https://api.mercadopago.com/v1/payments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
    'X-Idempotency-Key': 'test-' + Date.now()
  },
  body: JSON.stringify({
    transaction_amount: 10,
    description: 'Pedido sem CPF',
    payment_method_id: 'pix',
    payer: {
      email: 'lumeartesanaisc@gmail.com',
      first_name: 'Sem Cpf'
    }
  })
}).then(r => r.json()).then(console.log).catch(console.error);
