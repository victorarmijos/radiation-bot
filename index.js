// index.js — Bot completo y corregido
require('dotenv').config();
const express = require('express');
const pool    = require('./config/db');

const { iniciarDiagnostico, procesarRespuestaDiagnostico } = require('./controllers/diagnosticoController');
const { iniciarNivel, procesarNivel, avanzarSiguienteNivel, mostrarPuntaje } = require('./controllers/nivelesController');
const { enviarMensaje } = require('./services/whatsapp');

const app  = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// ─── HEALTH CHECK ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── WEBHOOK VERIFICACION META ─────────────────────────────────────────────
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

// ─── WEBHOOK PRINCIPAL ─────────────────────────────────────────────────────
app.post('/webhook', async (req, res) => {
  res.sendStatus(200);

  try {
    const body = req.body;
    if (body?.object !== 'whatsapp_business_account') return;

    const changes = body?.entry?.[0]?.changes?.[0]?.value;
    const mensaje = changes?.messages?.[0];
    if (!mensaje || mensaje.type !== 'text') return;

    const telefono = mensaje.from;
    const textoRaw = mensaje.text.body.trim();
    const texto    = textoRaw.toUpperCase();

    console.log('Mensaje de ' + telefono + ': ' + textoRaw);

    // Registrar mensaje entrante
    await pool.query(
      'INSERT INTO interacciones (telefono, tipo_mensaje, contenido) VALUES ($1, $2, $3)',
      [telefono, 'entrante', textoRaw]
    ).catch(() => {});

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
    const idioma  = usuario.idioma || 'es';

    // ══════════════════════════════════════════════════════════════
    // COMANDOS GLOBALES — funcionan en cualquier momento
    // ══════════════════════════════════════════════════════════════

    // ── Cambio de idioma en cualquier momento ─────────────────────
    if (texto === 'KICHWA' || texto === 'KI') {
      await pool.query('UPDATE usuarios SET idioma = $1 WHERE telefono = $2', ['ki', telefono]);
      await enviarMensaje(telefono,
        'Alimi! Kunanmanta kichwa simipi yachachishun.\n\n' +
        'Escribe *HOLA* para continuar donde estabas.'
      );
      return;
    }

    if (texto === 'ESPANOL' || texto === 'ES') {
      await pool.query('UPDATE usuarios SET idioma = $1 WHERE telefono = $2', ['es', telefono]);
      await enviarMensaje(telefono,
        'Perfecto, continuamos en espanol.\n\n' +
        'Escribe *HOLA* para continuar donde estabas.'
      );
      return;
    }

    // ── Puntaje ───────────────────────────────────────────────────
    if (texto === 'PUNTAJE' || texto === 'PUNTOS') {
      await mostrarPuntaje(telefono);
      return;
    }

    // ── Reinicio completo ─────────────────────────────────────────
    if (texto === 'REINICIAR') {
      await pool.query(
        "UPDATE usuarios SET etapa = 'inicio', puntos = 0 WHERE telefono = $1",
        [telefono]
      );
      await enviarMensaje(telefono,
        'Tu progreso fue reiniciado.\nEscribe *HOLA* para comenzar de nuevo.'
      );
      return;
    }

    // ── Ayuda ─────────────────────────────────────────────────────
    if (texto === 'AYUDA' || texto === 'MENU') {
      await enviarMensaje(telefono, [
        '*Comandos disponibles:*',
        '',
        '*HOLA* — Inicio o continuar',
        '*DIAGNOSTICO* — Comenzar el diagnostico',
        '*SIGUIENTE* — Avanzar en la leccion',
        '*QUIZ* — Ir a la evaluacion del nivel',
        '*PUNTAJE* — Ver tu progreso',
        '*ESPANOL* — Cambiar a espanol',
        '*KICHWA* — Cambiar a kichwa',
        '*REINICIAR* — Empezar desde cero',
      ].join('\n'));
      return;
    }

    // ══════════════════════════════════════════════════════════════
    // FLUJO PRINCIPAL
    // ══════════════════════════════════════════════════════════════

    // ── Bienvenida ────────────────────────────────────────────────
    if (texto === 'HOLA' || texto === 'INICIO' || texto === 'START' || texto === 'HI') {

      // Si ya tiene diagnostico completado y estaba en un nivel, retomar
      if (etapa.startsWith('nivel') || etapa === 'diagnostico_completado') {
        await enviarMensaje(telefono, [
          idioma === 'ki'
            ? 'Shamupaymi! Katishun.'
            : 'Bienvenido de vuelta!',
          '',
          idioma === 'ki'
            ? 'Escribe *SIGUIENTE* katinkapak o *AYUDA* comandokuna rikunkapak.'
            : 'Escribe *SIGUIENTE* para continuar o *AYUDA* para ver los comandos.',
        ].join('\n'));
        return;
      }

      // Bienvenida normal
      const bienvenida = idioma === 'ki'
        ? [
            '🌿 *Shamupaymi!*',
            '',
            'Kaypi radiacion ambiental yachashun',
            'Sucumbios llaktapi.',
            '',
            'Nawpakta tapuykuna charini.',
            'Escribe *DIAGNOSTICO* kallarinkapak.',
            '',
            '_Espanol simipi munankichu? ES nishpa killkay._'
          ].join('\n')
        : [
            '🌿 *Bienvenido/a!*',
            '',
            'Aqui aprenderemos sobre radiacion ambiental',
            'en la Amazonia ecuatoriana.',
            '',
            'Primero haremos un diagnostico rapido de 4 preguntas',
            'para conocer tu punto de partida.',
            '',
            'Escribe *DIAGNOSTICO* para comenzar.',
            '',
            '_Si prefieres en kichwa, escribe KICHWA_'
          ].join('\n');

      await enviarMensaje(telefono, bienvenida);
      return;
    }

    // ── Inicio del diagnostico ────────────────────────────────────
    if (texto === 'DIAGNOSTICO') {
      await iniciarDiagnostico(telefono, idioma);
      return;
    }

    // ── Respuestas durante el diagnostico ─────────────────────────
    if (etapa.startsWith('diagnostico_') && etapa !== 'diagnostico_completado') {
      await procesarRespuestaDiagnostico(telefono, texto, etapa, idioma);
      return;
    }

    // ── INICIAR lecciones despues del diagnostico ─────────────────
    // FIX: aqui conectamos el diagnostico con los niveles de ensenanza
    if (etapa === 'diagnostico_completado' && texto === 'INICIAR') {
      await iniciarNivel(telefono, 'capibara', idioma);
      return;
    }

    // Si esta en diagnostico_completado pero escribe otra cosa
    if (etapa === 'diagnostico_completado') {
      await enviarMensaje(telefono,
        idioma === 'ki'
          ? 'Escribe *INICIAR* yachana kallarinkapak.'
          : 'Escribe *INICIAR* para comenzar las lecciones.'
      );
      return;
    }

    // ── Flujo de niveles de ensenanza ─────────────────────────────
    const enNivel = await procesarNivel(telefono, texto, etapa, idioma);
    if (enNivel) return;

    // ── Avanzar al siguiente nivel desde insignia ─────────────────
    if (etapa === 'nivel1_completado' && texto === 'SIGUIENTE') {
      await avanzarSiguienteNivel(telefono, 'capibara', idioma);
      return;
    }
    if (etapa === 'nivel2_completado' && texto === 'SIGUIENTE') {
      await avanzarSiguienteNivel(telefono, 'guacamayo', idioma);
      return;
    }
    if (etapa === 'nivel3_completado' && texto === 'SIGUIENTE') {
      await avanzarSiguienteNivel(telefono, 'anaconda', idioma);
      return;
    }

    // ── Certificado final nivel 4 ─────────────────────────────────
    if ((etapa === 'nivel4_completado' || etapa === 'programa_completado') && texto === 'CERTIFICADO') {
      const cert = [
        '*CERTIFICADO DE GUARDIAN JAGUAR*',
        '*Radiación — Pacayacu, Sucumbios*',
        '',
        'Has completado el programa de',
        '*Alfabetizacion en Salud Ambiental*',
        'sobre Radiacion Ambiental en la Amazonia ecuatoriana.',
        '',
        'N1 Capibara   — Reconoces lo invisible',
        'N2 Guacamayo  — Entiendes las vias de exposicion',
        'N3 Anaconda   — La ciencia como herramienta',
        'N4 Jaguar     — Pensamiento cientifico critico',
        '',
        'Comparte este mensaje.',
        'Cada persona informada fortalece la comunidad.',
        '',
        'Escribe *PUNTAJE* para ver tu resultado final.'
      ].join('\n');
      await pool.query(
        "UPDATE usuarios SET etapa = 'programa_completado' WHERE telefono = $1",
        [telefono]
      );
      await enviarMensaje(telefono, cert);
      return;
    }

    // ── Programa completado — modo consulta ───────────────────────
    if (etapa === 'programa_completado') {
      await enviarMensaje(telefono, [
        'Ya completaste el programa.',
        '',
        '*PUNTAJE* — ver tu resultado',
        '*CERTIFICADO* — recibir tu certificado',
        '*REINICIAR* — volver a empezar',
        '*AYUDA* — ver todos los comandos'
      ].join('\n'));
      return;
    }

    // ── Mensaje no reconocido ─────────────────────────────────────
    await enviarMensaje(telefono,
      idioma === 'ki'
        ? 'Mana yachanichu. *AYUDA* nishpa comandokuna riku, o *HOLA* nishpa qallariy.'
        : 'No entendi tu mensaje. Escribe *AYUDA* para ver los comandos o *HOLA* para comenzar.'
    );

  } catch (err) {
    console.error('Error en webhook: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log('Radiación Bot corriendo en puerto ' + PORT);
});
