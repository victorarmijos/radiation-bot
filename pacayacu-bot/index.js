// index.js — Zetesis Bot completo con post-test 
require('dotenv').config();
const express = require('express');
const pool = require('./config/db');

const { iniciarDiagnostico, guardarNombreIniciarPreguntas, guardarEdadPedirCiudad, guardarLocalidadIniciarPreguntas, procesarRespuestaDiagnostico } = require('./controllers/diagnosticoController');
const { iniciarNivel, procesarNivel, avanzarSiguienteNivel, mostrarPuntaje } = require('./controllers/nivelesController');
const { iniciarPosttest, procesarRespuestaPosttest } = require('./controllers/posttestController');
const { enviarMensaje, enviarBotones, enviarImagen, enviarImagenConBotones } = require('./services/whatsapp');

// ─── FUNCIÓN PARA NORMALIZAR TEXTO ────────────────────────────────────────
function normalizarTexto(texto) {
  return texto
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// ─── FUNCIÓN DE SIMILITUD (Levenshtein) ───────────────────────────────────
function distanciaLevenshtein(str1, str2) {
  const matriz = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(0));

  for (let i = 0; i <= str1.length; i++) matriz[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matriz[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicador = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matriz[j][i] = Math.min(
        matriz[j][i - 1] + 1,
        matriz[j - 1][i] + 1,
        matriz[j - 1][i - 1] + indicador
      );
    }
  }

  return matriz[str2.length][str1.length];
}

// ─── FUNCIÓN PARA BUSCAR COMANDOS CON TOLERANCIA ──────────────────────────
function buscarComandoSimilar(texto, comandos, tolerancia = 2) {
  texto = normalizarTexto(texto);

  for (const comando of comandos) {
    let toleranciaActual = tolerancia;
    if (comando.length <= 3) toleranciaActual = 0;
    else if (comando.length <= 6) toleranciaActual = 1;

    const distancia = distanciaLevenshtein(texto, comando);
    if (distancia <= toleranciaActual) {
      return comando;
    }
  }

  return null;
}

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// ─── CONSTANTES PARA DEBUG ───────────────────────────────────────────────────
const DEBUG_TELEFONO = process.env.DEBUG_TELEFONO || ''; // Tu número para debug
const MODO_DEBUG_ACTIVO = DEBUG_TELEFONO !== '';

// ─── HEALTH CHECK ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), debugMode: MODO_DEBUG_ACTIVO });
});

// ─── VERIFICACION META ─────────────────────────────────────────────────────
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
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
    if (!mensaje) return;
    
    if (mensaje.type !== 'text' && mensaje.type !== 'interactive') return;

    const telefono = mensaje.from;
    
    let textoRaw = '';
    if (mensaje.type === 'text') {
      textoRaw = mensaje.text.body.trim();
    } else if (mensaje.type === 'interactive') {
      textoRaw = mensaje.interactive.button_reply.id.trim();
    }
    
    const texto = normalizarTexto(textoRaw);
    const baseUrl = 'https://' + req.get('host');

    console.log(`[${telefono}]: ${textoRaw}`);

    await pool.query(
      'INSERT INTO interacciones (telefono, tipo_mensaje, contenido) VALUES ($1, $2, $3)',
      [telefono, 'entrante', textoRaw]
    ).catch(() => { });

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
    let etapa = usuario.etapa || 'inicio';
    const idioma = usuario.idioma || 'es';
    const nombre = usuario.nombre || null;

    // ══════════════════════════════════════════════════════════════
    // 🔧 MODO DEBUG 
    // ══════════════════════════════════════════════════════════════
    if (MODO_DEBUG_ACTIVO && telefono === DEBUG_TELEFONO) {
      if (texto === 'DEBUG') {
        await enviarMensaje(telefono, [
          '🔧 *MODO DEBUG ACTIVADO*',
          '',
          'Comandos disponibles:',
          '',
          '*DEBUG ESTADO* — Ver estado JSON actual',
          '*DEBUG LIMPIAR* — Reinicia completamente',
          '*DEBUG DIAGNOSTICO* — Salta a diagnóstico completado',
          '*DEBUG NIVEL1* — Ve a Nivel 1 (Capibara)',
          '*DEBUG NIVEL2* — Ve a Nivel 2 (Guacamayo)',
          '*DEBUG NIVEL3* — Ve a Nivel 3 (Anaconda)',
          '*DEBUG NIVEL4* — Ve a Nivel 4 (Jaguar)',
          '*DEBUG POSTTEST* — Salta a post-test',
          '*DEBUG FINAL* — Marca como programa completado',
          '*DEBUG RESPONDER* — Responde todas las preguntas automáticamente',
          '',
          'Escribe *AYUDA* para volver a comandos normales.'
        ].join('\n'));
        return;
      }

      // Debug: Ver estado actual
      if (texto.startsWith('DEBUG ESTADO')) {
        const { rows: usuarioCompleto } = await pool.query(
          'SELECT * FROM usuarios WHERE telefono = $1',
          [telefono]
        );
        const estadoJSON = JSON.stringify(usuarioCompleto[0], null, 2);
        const estadoLimitado = estadoJSON.substring(0, 4000); // WhatsApp tiene límite de caracteres
        await enviarMensaje(telefono, '```\n' + estadoLimitado + '\n```');
        return;
      }

      // Debug: Limpiar todo
      if (texto.startsWith('DEBUG LIMPIAR')) {
        await pool.query(
          `UPDATE usuarios 
           SET etapa = 'inicio', 
               puntos = 0, 
               nombre = NULL, 
               localidad = NULL,
               edad = NULL,
               nivel = NULL
           WHERE telefono = $1`,
          [telefono]
        );
        await enviarMensaje(telefono, '✅ *Base de datos limpiada*\n\nEscribe cualquier cosa para ver la bienvenida.');
        return;
      }

      // Debug: Saltar a diagnóstico completado
      if (texto.startsWith('DEBUG DIAGNOSTICO')) {
        await pool.query(
          `UPDATE usuarios 
           SET etapa = 'diagnostico_completado', 
               nombre = 'Testeo',
               edad = 25,
               localidad = 'Debug City',
               puntos = 8
           WHERE telefono = $1`,
          [telefono]
        );
        await enviarMensaje(telefono, '✅ *Diagnóstico completado (simulado)*\n\nEscribe *INICIAR* para comenzar los niveles.');
        return;
      }

      // Debug: Ir a niveles
      if (texto.startsWith('DEBUG NIVEL')) {
        const nivelMatch = texto.match(/DEBUG NIVEL(\d)/);
        if (!nivelMatch) return;
        const nivelNum = nivelMatch[1];
        const nivelIds = { '1': 'capibara', '2': 'guacamayo', '3': 'anaconda', '4': 'jaguar' };
        const nivelId = nivelIds[nivelNum];

        if (!nivelId) {
          await enviarMensaje(telefono, '❌ Nivel inválido. Usa DEBUG NIVEL1, NIVEL2, NIVEL3 o NIVEL4');
          return;
        }

        await pool.query(
          `UPDATE usuarios 
           SET etapa = $1, 
               nombre = 'Testeo',
               puntos = 10
           WHERE telefono = $2`,
          [`nivel${nivelNum}_inicio`, telefono]
        );
        await enviarMensaje(telefono, `✅ *Ahora en Nivel ${nivelNum}*\n\nEscribe *SIGUIENTE* para avanzar.`);
        return;
      }

      // Debug: Saltar a post-test
      if (texto.startsWith('DEBUG POSTTEST')) {
        await pool.query(
          `UPDATE usuarios 
           SET etapa = 'posttest_1',
               nombre = 'Testeo',
               puntos = 50
           WHERE telefono = $1`,
          [telefono]
        );
        await enviarMensaje(telefono, '✅ *Post-test iniciado*\n\nResponde las preguntas con A, B o C.');
        return;
      }

      // Debug: Marcar como finalizado
      if (texto.startsWith('DEBUG FINAL')) {
        await pool.query(
          `UPDATE usuarios 
           SET etapa = 'finalizado',
               nombre = 'Testeo',
               puntos = 100
           WHERE telefono = $1`,
          [telefono]
        );
        await enviarMensaje(telefono, '✅ *Programa completado*\n\nEscribe *CERTIFICADO* o *POSTTEST*.');
        return;
      }

      // Debug: Responder automáticamente
      if (texto.startsWith('DEBUG RESPONDER')) {
        await enviarMensaje(telefono, '⚙️ Respondiendo automáticamente todas las preguntas...');

        // Simular respuestas del diagnóstico
        for (let i = 1; i <= 11; i++) {
          const respuesta = ['A', 'B', 'C'][Math.floor(Math.random() * 3)];
          console.log(`[AUTO] Pregunta ${i}: ${respuesta}`);
          // Aquí se simularían las respuestas pero sin enviar al webhook real
        }

        await enviarMensaje(telefono, '✅ Simulación completada.\n\nEscribe *DEBUG* para más opciones.');
        return;
      }

      // Si está en debug pero escribe algo no reconocido
      if (texto.startsWith('DEBUG')) {
        await enviarMensaje(telefono, '❌ Comando debug no reconocido.\n\nEscribe *DEBUG* para ver las opciones.');
        return;
      }
    }

    // ══════��═══════════════════════════════════════════════════════
    // COMANDOS GLOBALES — funcionan en cualquier momento
    // ══════════════════════════════════════════════════════════════

    // Cambio de idioma
    if (texto === 'ESPANOL' || texto === 'ES') {
      await pool.query('UPDATE usuarios SET idioma = $1 WHERE telefono = $2', ['es', telefono]);
      await enviarMensaje(telefono, '🌿 Continuamos en español.\nEscribe *HOLA* para continuar.');
      return;
    }

    // Puntaje
    if (buscarComandoSimilar(texto, ['PUNTAJE', 'PUNTOS'])) {
      await mostrarPuntaje(telefono);
      return;
    }

    // Ayuda
    if (buscarComandoSimilar(texto, ['AYUDA', 'MENU'])) {
      const textoAyuda = [
        '*Comandos disponibles:*',
        '',
        '*HOLA* — Inicio o continuar',
        // '*DIAGNOSTICO* — Comenzar el diagnóstico',
        '*INICIAR* — Comenzar el recorrido educativo',
        '*PUNTAJE* — Ver tu progreso',
        '*REINICIAR* — Empezar desde cero',
        '',
        MODO_DEBUG_ACTIVO ? '🔧 *DEBUG* — Modo desarrollador' : ''
      ].filter(l => l !== '').join('\n');
      
      await enviarBotones(telefono, textoAyuda, [
        { id: 'INICIAR', title: 'Iniciar' },
        { id: 'PUNTAJE', title: 'Puntaje' },
        { id: 'REINICIAR', title: 'Reiniciar' }
      ]);
      return;
    }

    // 🟢 REINICIO PARA USUARIOS — Limpio y simple
    if (buscarComandoSimilar(texto, ['REINICIAR'], 1)) {
      await pool.query(
        `UPDATE usuarios 
         SET etapa = 'inicio', 
             puntos = 0, 
             nombre = NULL, 
             localidad = NULL,
             edad = NULL,
             nivel = NULL
         WHERE telefono = $1`,
        [telefono]
      );

      const bienvenida = [
        '🌿*¡Bienvenido/a de nuevo!👋*',
        '',
        'Aquí aprenderemos sobre radiación ambiental en la Amazonía Ecuatoriana.',
        '',
        // 'Escribe *DIAGNOSTICO* para comenzar el diagnóstico de 11 preguntas.',
        'Presiona *Iniciar* para ir directo al recorrido educativo.'
      ].join('\n');

      await enviarBotones(telefono, bienvenida, [{ id: 'INICIAR', title: 'Iniciar' }]);
      return;
    }

    // ══════════════════════════════════════════════════════════════
    // FLUJO PRINCIPAL
    // ══════════════════════════════════════════════════════════════


    // Inicio del diagnóstico
    // if (buscarComandoSimilar(texto, ['DIAGNOSTICO'])) {
    //   await iniciarDiagnostico(telefono, idioma);
    //   return;
    // }

    // 🟢 BIENVENIDA — Aparece CON CUALQUIER MENSAJE si está en 'inicio'
    if ((etapa === 'inicio' || !etapa || etapa === '') && !buscarComandoSimilar(texto, ['INICIAR'])) {
      const bienvenida = [
        '🌿*¡Bienvenido/a!👋*',
        '',
        'Aquí aprenderemos sobre radiación ambiental en la Amazonía Ecuatoriana.',
        '',
        // 'Escribe *DIAGNOSTICO* para comenzar un rápido diagnóstico de 11 preguntas.',
        'Presiona *Iniciar* para comenzar el recorrido educativo.'
      ].join('\n');

      await enviarBotones(telefono, bienvenida, [{ id: 'INICIAR', title: 'Iniciar' }]);
      return;
    }

    // Bienvenida si está en medio de lecciones
    if (buscarComandoSimilar(texto, ['HOLA', 'INICIO', 'START', 'HI'])) {
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

    // Captura de edad
    if (etapa === 'esperando_edad') {
      await guardarEdadPedirCiudad(telefono, textoRaw.trim(), idioma);
      return;
    }

    // Captura de la localidad
    if (etapa === 'esperando_localidad') {
      const localidadCapturada = textoRaw.trim();
      if (localidadCapturada.length < 2) {
        await enviarMensaje(telefono, 'Por favor escribe tu ciudad o comunidad, ej: *Pacayacu*');
        return;
      }
      await guardarLocalidadIniciarPreguntas(telefono, localidadCapturada, idioma);
      return;
    }

    // Respuestas durante el diagnóstico
    if (etapa.startsWith('diagnostico_') && etapa !== 'diagnostico_completado') {
      await procesarRespuestaDiagnostico(telefono, texto, etapa, idioma);
      return;
    }

    // INICIAR lecciones después del diagnóstico o directamente
    if ((etapa === 'diagnostico_completado' || etapa === 'inicio' || !etapa || etapa === '') && buscarComandoSimilar(texto, ['INICIAR'])) {
      if (nombre && usuario.edad) {
        await iniciarNivel(telefono, 'capibara', idioma, baseUrl);
      } else {
        await pool.query('UPDATE usuarios SET etapa = $1 WHERE telefono = $2', ['recurso_esperando_nombre', telefono]);
        const mensaje = [
          '🌿 *¡Vamos a comenzar nuestro recorrido educativo!*',
          '',
          'Para que sea más personalizado, ¿cuál es tu nombre?',
          'Escríbelo como prefieres que te llamemos.',
          'Ej: *Rosa*, *Juan Carlos*'
        ].join('\n');
        await enviarMensaje(telefono, mensaje);
      }
      return;
    }

    // Captura del nombre para el recurso educativo
    if (etapa === 'recurso_esperando_nombre') {
      const nombreCapturado = textoRaw.trim();
      if (nombreCapturado.length < 2) {
        await enviarMensaje(telefono, 'Por favor escribe tu nombre, ej: *Rosa* o *Juan Carlos*');
        return;
      }
      await pool.query('UPDATE usuarios SET nombre = $1, etapa = $2 WHERE telefono = $3', [nombreCapturado, 'recurso_esperando_edad', telefono]);
      
      await enviarMensaje(telefono, [
        `¡Mucho gusto, *${nombreCapturado}*! 👋`,
        '',
        '¿Cuántos años tienes?',
        'Escribe solo el número. Ej: *34*'
      ].join('\n'));
      return;
    }

    // Captura de edad para el recurso educativo
    if (etapa === 'recurso_esperando_edad') {
      const edadNum = parseInt(textoRaw.trim());
      if (isNaN(edadNum) || edadNum < 10 || edadNum > 100) {
        await enviarMensaje(telefono, '⚠️ Por favor escribe solo tu edad en números. Ej: *34*');
        return;
      }
      await pool.query('UPDATE usuarios SET edad = $1 WHERE telefono = $2', [edadNum, telefono]);
      
      await iniciarNivel(telefono, 'capibara', idioma, baseUrl);
      return;
    }

    if (etapa === 'diagnostico_completado') {
      await enviarMensaje(telefono, 'Escribe *INICIAR* para comenzar las lecciones.');
      return;
    }

    // Flujo de niveles
    const enNivel = await procesarNivel(telefono, texto, etapa, idioma, baseUrl);
    if (enNivel) return;

    // Avanzar entre niveles
    if (etapa === 'nivel1_completado' && texto === 'SIGUIENTE') {
      await avanzarSiguienteNivel(telefono, 'capibara', idioma, baseUrl);
      return;
    }
    if (etapa === 'nivel2_completado' && texto === 'SIGUIENTE') {
      await avanzarSiguienteNivel(telefono, 'guacamayo', idioma, baseUrl);
      return;
    }
    if (etapa === 'nivel3_completado' && texto === 'SIGUIENTE') {
      await avanzarSiguienteNivel(telefono, 'anaconda', idioma, baseUrl);
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
        'Selecciona *POSTTEST* para la evaluación final',
        'o *PUNTAJE* para ver tu resultado.'
      ].join('\n');

      await pool.query(
        "UPDATE usuarios SET etapa = 'programa_completado' WHERE telefono = $1",
        [telefono]
      );
      const imageUrl = `${baseUrl}/images/certificado.jpg`;
      await enviarImagenConBotones(telefono, imageUrl, cert, [
        { id: 'POSTTEST', title: 'Post-Test' },
        { id: 'PUNTAJE', title: 'Puntaje' }
      ]);
      return;
    }

    // Programa completado
    if (etapa === 'programa_completado' || etapa === 'finalizado') {
      const msg = [
        nombre ? `Hola, *${nombre}*!` : 'Hola!',
        '',
        'Elige una de las siguientes opciones:'
      ].join('\n');
      
      await enviarBotones(telefono, msg, [
        { id: 'CERTIFICADO', title: 'Certificado' },
        { id: 'POSTTEST', title: 'Post-Test' },
        { id: 'REINICIAR', title: 'Reiniciar' }
      ]);
      return;
    }

    // Mensaje no reconocido
    await enviarBotones(telefono,
      'No entendí tu mensaje. Usa los botones de abajo o escribe *AYUDA*.',
      [
        { id: 'AYUDA', title: 'Ayuda' },
        { id: 'INICIAR', title: 'Iniciar' }
      ]
    );

  } catch (err) {
    console.error('Error en webhook: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log('Zetesis Bot corriendo en puerto ' + PORT);
  if (MODO_DEBUG_ACTIVO) {
    console.log(`🔧 MODO DEBUG ACTIVADO para: ${DEBUG_TELEFONO}`);
  }
});