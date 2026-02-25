// index.js actualizado — integra flujo de diagnóstico
require('dotenv').config();
const express = require('express');
const pool    = require('./config/db');
const { iniciarDiagnostico, procesarRespuestaDiagnostico } = require('./controllers/diagnosticoController');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /webhook — Verificacion de Meta
app.get('/webhook', (req, res) => {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// POST /webhook — Recepcion de mensajes
app.post('/webhook', async (req, res) => {
  res.sendStatus(200);

  try {
    const body = req.body;
    if (body?.object !== 'whatsapp_business_account') return;

    const changes = body?.entry?.[0]?.changes?.[0]?.value;
    const mensaje = changes?.messages?.[0];
    if (!mensaje) return;

    const telefono = mensaje.from;
    if (mensaje.type !== 'text') return;

    const texto = mensaje.text.body.trim().toUpperCase();
    console.log('Mensaje de ' + telefono + ': ' + texto);

    // Registrar mensaje entrante
    await pool.query(
      'INSERT INTO interacciones (telefono, tipo_mensaje, contenido) VALUES ($1, $2, $3)',
      [telefono, 'entrante', texto]
    );

    // Obtener o crear usuario
    const { rows } = await pool.query(
      `INSERT INTO usuarios (telefono, ultima_sesion)
       VALUES ($1, NOW())
       ON CONFLICT (telefono) DO UPDATE
       SET ultima_sesion = NOW()
       RETURNING *`,
      [telefono]
    );
    const usuario = rows[0];
    const etapa   = usuario.etapa || 'inicio';

    // Detectar idioma (usuario escribe KICHWA o KI para cambiar)
    let idioma = usuario.idioma || 'es';
    if (texto === 'KICHWA' || texto === 'KI') {
      idioma = 'ki';
      await pool.query('UPDATE usuarios SET idioma = $1 WHERE telefono = $2', ['ki', telefono]);
      await require('./services/whatsapp').enviarMensaje(telefono, 'Alimi! Kichwa simipi yachachishun. 🌿\nEscribe HOLA para continuar.');
      return;
    }
    if (texto === 'ESPAÑOL' || texto === 'ES') {
      idioma = 'es';
      await pool.query('UPDATE usuarios SET idioma = $1 WHERE telefono = $2', ['es', telefono]);
      await require('./services/whatsapp').enviarMensaje(telefono, 'Perfecto, continuamos en espanol. 🌿\nEscribe HOLA para continuar.');
      return;
    }

    // ── ENRUTADOR PRINCIPAL ────────────────────────────────────────

    // Comando HOLA — bienvenida e inicio de diagnostico
    if (texto === 'HOLA' || texto === 'INICIO' || texto === 'START') {
      const bienvenida = idioma === 'ki'
        ? '🌿 *Shamupaymi Zetesis-pi!*\n\nKaypi radiacion ambiental yachashun.\nNawpakta tapuykuna charini.\n\nEscribe *DIAGNOSTICO* kallarinkapak.'
        : '🌿 *Bienvenido/a a Zetesis!*\n\nAqui aprenderemos sobre radiacion ambiental en la Amazonia ecuatoriana.\n\nPrimero haremos un diagnostico rapido de 8 preguntas.\n\nEscribe *DIAGNOSTICO* para comenzar.\n\n_Si prefieres en kichwa, escribe KICHWA_';
      await require('./services/whatsapp').enviarMensaje(telefono, bienvenida);
      return;
    }

    // Comando DIAGNOSTICO — inicia cuestionario
    if (texto === 'DIAGNOSTICO') {
      await iniciarDiagnostico(telefono, idioma);
      return;
    }

    // Respuestas durante el diagnostico
    if (etapa.startsWith('diagnostico_') && etapa !== 'diagnostico_completado') {
      await procesarRespuestaDiagnostico(telefono, texto, etapa, idioma);
      return;
    }

    // Diagnostico completado — iniciar leccion
    if (etapa === 'diagnostico_completado' && texto === 'INICIAR') {
      await require('./services/whatsapp').enviarMensaje(telefono,
        idioma === 'ki'
          ? 'Alimi! Yachana kallarishun. Kay parte wichwashun...'
          : 'Perfecto! Las lecciones estaran disponibles muy pronto. Por ahora tu diagnostico fue guardado exitosamente.'
      );
      return;
    }

    // Mensaje no reconocido
    await require('./services/whatsapp').enviarMensaje(telefono,
      idioma === 'ki'
        ? 'Mana yachanichu. *HOLA* nishpa qallariy.'
        : 'No entendi tu mensaje. Escribe *HOLA* para comenzar.'
    );

  } catch (err) {
    console.error('Error: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log('Zetesis Bot corriendo en puerto ' + PORT);
});