// index.js — Zetesis Bot completo con post-test
require('dotenv').config();
const express = require('express');
const pool    = require('./config/db');

const { iniciarDiagnostico, guardarNombreIniciarPreguntas, procesarRespuestaDiagnostico } = require('./controllers/diagnosticoController');
const { iniciarNivel, procesarNivel, avanzarSiguienteNivel, mostrarPuntaje } = require('./controllers/nivelesController');
const { iniciarPosttest, procesarRespuestaPosttest } = require('./controllers/posttestController');
const { enviarMensaje } = require('./services/whatsapp');

const app  = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(__dirname));

// ─── HEALTH CHECK ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── VERIFICACION META ─────────────────────────────────────────────────────
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

    console.log(`[${telefono}]: ${textoRaw}`);

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
    const nombre  = usuario.nombre || null;

    // ══════════════════════════════════════════════════════════════
    // COMANDOS GLOBALES — funcionan en cualquier momento
    // ══════════════════════════════════════════════════════════════

    // Cambio de idioma
    if (texto === 'KICHWA' || texto === 'KI') {
      await pool.query('UPDATE usuarios SET idioma = $1 WHERE telefono = $2', ['ki', telefono]);
      await enviarMensaje(telefono, '🌿 Kunanmanta kichwa simipi yachachishun.\nEscribe *HOLA* para continuar.');
      return;
    }
    if (texto === 'ESPANOL' || texto === 'ES') {
      await pool.query('UPDATE usuarios SET idioma = $1 WHERE telefono = $2', ['es', telefono]);
      await enviarMensaje(telefono, '🌿 Continuamos en español.\nEscribe *HOLA* para continuar.');
      return;
    }

    // Puntaje
    if (texto === 'PUNTAJE' || texto === 'PUNTOS') {
      await mostrarPuntaje(telefono);
      return;
    }

    // Ayuda
    if (texto === 'AYUDA' || texto === 'MENU') {
      await enviarMensaje(telefono, [
        '*Comandos disponibles:*',
        '',
        '*HOLA* — Inicio o continuar',
        '*DIAGNOSTICO* — Comenzar el diagnóstico',
        '*SIGUIENTE* — Avanzar en la lección',
        '*QUIZ* — Ir a la evaluación del nivel',
        '*POSTTEST* — Evaluación final (después de terminar niveles)',
        '*PUNTAJE* — Ver tu progreso',
        '*ESPANOL* — Cambiar a español',
        '*KICHWA* — Cambiar a kichwa',
        '*REINICIAR* — Empezar desde cero',
      ].join('\n'));
      return;
    }

    // Reiniciar
    if (texto === 'REINICIAR') {
      await pool.query(
        "UPDATE usuarios SET etapa = 'inicio', puntos = 0, nombre = NULL WHERE telefono = $1",
        [telefono]
      );
      await enviarMensaje(telefono, 'Progreso reiniciado.\nEscribe *HOLA* para comenzar de nuevo.');
      return;
    }

    // ══════════════════════════════════════════════════════════════
    // FLUJO PRINCIPAL
    // ══════════════════════════════════════════════════════════════

    // Bienvenida
    if (texto === 'HOLA' || texto === 'INICIO' || texto === 'START' || texto === 'HI') {
      if (etapa.startsWith('nivel') || etapa === 'diagnostico_completado') {
        const saludo = nombre ? `Bienvenido de vuelta, *${nombre}*!` : 'Bienvenido de vuelta!';
        await enviarMensaje(telefono, [
          saludo,
          '',
          'Escribe *SIGUIENTE* para continuar donde estabas.',
          'Escribe *AYUDA* para ver todos los comandos.'
        ].join('\n'));
        return;
      }

      if (etapa === 'programa_completado' || etapa === 'finalizado') {
        const saludo = nombre ? `Hola de nuevo, *${nombre}*!` : 'Hola de nuevo!';
        await enviarMensaje(telefono, [
          saludo,
          '',
          '*POSTTEST* — Hacer la evaluación final',
          '*CERTIFICADO* — Recibir tu certificado',
          '*PUNTAJE* — Ver tu progreso',
          '*REINICIAR* — Empezar desde cero'
        ].join('\n'));
        return;
      }

      const bienvenida = idioma === 'ki'
        ? '🌿 *Shamupaymi!*\n\nKaypi radiacion ambiental yachashun.\n\nEscribe *DIAGNOSTICO* kallarinkapak.\n\n_Espanol munankichu? ES nishpa killkay._'
        : [
            '🌿*Bienvenido/a!👋*',
            '',
            'Aquí aprenderemos sobre radiación ambiental',
            'en la Amazonía e+Ecuatoriana.',
            '',
            'Primero haremos un diagnóstico rápido de 8 preguntas',
            'para conocer tu punto de partida.',
            '',
            'Escribe *DIAGNOSTICO* para comenzar.',
            '',
            '_Si prefieres en kichwa, escribe KICHWA_'
          ].join('\n');

      await enviarMensaje(telefono, bienvenida);
      return;
    }

    // Inicio del diagnóstico
    if (texto === 'DIAGNOSTICO') {
      await iniciarDiagnostico(telefono, idioma);
      return;
    }

    // Captura del nombre
    if (etapa === 'esperando_nombre') {
      const nombreCapturado = textoRaw.trim();
      if (nombreCapturado.length < 2) {
        await enviarMensaje(telefono, 'Por favor escribe tu nombre, ej: *Rosa* o *Juan Carlos*');
        return;
      }
      await guardarNombreIniciarPreguntas(telefono, nombreCapturado, idioma);
      return;
    }

    // Respuestas durante el diagnóstico
    if (etapa.startsWith('diagnostico_') && etapa !== 'diagnostico_completado') {
      await procesarRespuestaDiagnostico(telefono, texto, etapa, idioma);
      return;
    }

    // INICIAR lecciones después del diagnóstico
    if (etapa === 'diagnostico_completado' && texto === 'INICIAR') {
      await iniciarNivel(telefono, 'capibara', idioma);
      return;
    }

    if (etapa === 'diagnostico_completado') {
      await enviarMensaje(telefono, 'Escribe *INICIAR* para comenzar las lecciones.');
      return;
    }

    // Flujo de niveles
    const enNivel = await procesarNivel(telefono, texto, etapa, idioma);
    if (enNivel) return;

    // Avanzar entre niveles
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

    // ── POST-TEST — evaluacion final ──────────────────────────────
    if (texto === 'POSTTEST') {
      // Solo disponible después de completar los niveles
      if (!['nivel4_completado', 'programa_completado', 'finalizado'].includes(etapa)) {
        await enviarMensaje(telefono,
          'El post-test estará disponible cuando completes los 4 niveles de aprendizaje.\n\nEscribe *SIGUIENTE* para continuar donde estabas.'
        );
        return;
      }
      await iniciarPosttest(telefono, idioma);
      return;
    }

    // Respuestas durante el post-test
    if (etapa.startsWith('posttest_')) {
      await procesarRespuestaPosttest(telefono, texto, etapa, idioma);
      return;
    }

    // Certificado final con nombre
    if (['nivel4_completado', 'programa_completado', 'finalizado'].includes(etapa) && texto === 'CERTIFICADO') {
      const nombreCert = nombre || 'Participante';
      const cert = [
        '🏆 *CERTIFICADO DE GUARDIAN JAGUAR*',
        '*Pacayacu - Sucumbíos, Ecuador*',
        '━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        'Este certificado reconoce que',
        `*${nombreCert}*`,
        'ha completado el programa de',
        '*Alfabetización en Salud Ambiental*',
        'sobre Radiación Ambiental',
        'en la Amazonía ecuatoriana.',
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━',
        '🌿 N1 Capibara   — Reconoces lo invisible',
        '🦜 N2 Guacamayo  — Vías de exposición',
        '🐍 N3 Anaconda   — La ciencia como herramienta',
        '🐆 N4 Jaguar     — Pensamiento científico crítico',
        '━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        'Comparte este mensaje.',
        'Cada persona informada fortalece la comunidad.',
        '',
        'Escribe *POSTTEST* para la evaluación final',
        'o *PUNTAJE* para ver tu resultado.'
      ].join('\n');

      await pool.query(
        "UPDATE usuarios SET etapa = 'programa_completado' WHERE telefono = $1",
        [telefono]
      );
      await enviarMensaje(telefono, cert);
      return;
    }

    // Programa completado
    if (etapa === 'programa_completado' || etapa === 'finalizado') {
      await enviarMensaje(telefono, [
        nombre ? `Hola, *${nombre}*!` : 'Hola!',
        '',
        '*POSTTEST* — Evaluación final',
        '*CERTIFICADO* — Recibir tu certificado',
        '*PUNTAJE* — Ver tu progreso',
        '*REINICIAR* — Volver a empezar'
      ].join('\n'));
      return;
    }

    // Mensaje no reconocido
    await enviarMensaje(telefono,
      idioma === 'ki'
        ? 'Mana yachanichu. *AYUDA* nishpa comandokuna riku.'
        : 'No entendí tu mensaje. Escribe *AYUDA* para ver los comandos o *HOLA* para comenzar.'
    );

  } catch (err) {
    console.error('Error en webhook: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log('Zetesis Bot corriendo en puerto ' + PORT);
});
