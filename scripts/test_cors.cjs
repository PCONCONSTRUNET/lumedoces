const fetch = require('node-fetch');
fetch('https://api.mercadopago.com/v1/payments', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'http://localhost:5173',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'Content-Type, Authorization'
  }
}).then(r => {
  console.log('Status:', r.status);
  console.log('CORS Headers:', r.headers.get('access-control-allow-origin'));
}).catch(console.error);
