const https = require('https');

async function enviarMensaje(telefono, texto) {
  const PHONE_ID = process.env.WHATSAPP_PHONE_ID;
  const TOKEN    = process.env.WHATSAPP_TOKEN;

  const payload = JSON.stringify({
    messaging_product: 'whatsapp',
    to: telefono,
    type: 'text',
    text: { body: texto }
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'graph.facebook.com',
      path: '/v19.0/' + PHONE_ID + '/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          console.error('WhatsApp API error ' + res.statusCode + ': ' + data);
          reject(new Error(data));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

module.exports = { enviarMensaje };
