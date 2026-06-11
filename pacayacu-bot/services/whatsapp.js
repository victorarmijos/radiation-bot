const https = require('https');

function realizarPeticion(payload) {
  const PHONE_ID = process.env.WHATSAPP_PHONE_ID;
  const TOKEN    = process.env.WHATSAPP_TOKEN;

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

async function enviarMensaje(telefono, texto) {
  const payload = JSON.stringify({
    messaging_product: 'whatsapp',
    to: telefono,
    type: 'text',
    text: { body: texto }
  });
  return realizarPeticion(payload);
}

// Botones: [{ id: "A", title: "Opción A" }, ...] (Máx 3)
async function enviarBotones(telefono, texto, botones) {
  const payload = JSON.stringify({
    messaging_product: 'whatsapp',
    to: telefono,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: texto },
      action: {
        buttons: botones.map(b => ({
          type: 'reply',
          reply: { id: b.id, title: b.title }
        }))
      }
    }
  });
  return realizarPeticion(payload);
}

async function enviarImagen(telefono, url, caption = '') {
  const payloadObj = {
    messaging_product: 'whatsapp',
    to: telefono,
    type: 'image',
    image: { link: url }
  };
  if (caption) payloadObj.image.caption = caption;
  
  return realizarPeticion(JSON.stringify(payloadObj));
}

async function enviarImagenConBotones(telefono, url, texto, botones) {
  const payload = JSON.stringify({
    messaging_product: 'whatsapp',
    to: telefono,
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'image',
        image: { link: url }
      },
      body: { text: texto },
      action: {
        buttons: botones.map(b => ({
          type: 'reply',
          reply: { id: b.id, title: b.title }
        }))
      }
    }
  });
  return realizarPeticion(payload);
}

module.exports = { enviarMensaje, enviarBotones, enviarImagen, enviarImagenConBotones };
