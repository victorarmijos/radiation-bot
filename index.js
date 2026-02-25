require('dotenv').config();
const express = require('express');
const pool    = require('./config/db');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /webhook — Verificación de Meta
app.get('/webhook', (req, res) => {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('✅ Webhook verificado por Meta');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// POST /webhook — Recepción y registro de mensajes
app.post('/webhook', async (req, res) => {
  res.sendStatus(200);

  try {
    const body = req.body;
    if (body?.object !== 'whatsapp_business_account') return;

    const changes = body?.entry?.[0]?.changes?.[0]?.value;
    const mensaje = changes?.messages?.[0];
    if (!mensaje) return;

    const telefono = mensaje.from;
    const tipo     = mensaje.type;

    if (tipo !== 'text') {
      console.log(`Tipo no soportado: ${tipo} de ${telefono}`);
      return;
    }

    const texto = mensaje.text.body.trim();
    console.log(`📩 Mensaje de ${telefono}: "${texto}"`);

    // Crear usuario si no existe
    await pool.query(
      `INSERT INTO usuarios (telefono, ultima_sesion)
       VALUES ($1, NOW())
       ON CONFLICT (telefono) DO UPDATE
       SET ultima_sesion = NOW()`,
      [telefono]
    );

    // Registrar en bitácora de interacciones
    await pool.query(
      `INSERT INTO interacciones
       (telefono, tipo_mensaje, contenido, etapa_al_momento)
       VALUES ($1, 'entrante', $2, 'inicio')`,
      [telefono, texto]
    );

    console.log(`✅ Mensaje registrado en Supabase`);

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Zétesis Bot corriendo en puerto ${PORT}`);
});
```

---

Guarda y sube a GitHub:
```
