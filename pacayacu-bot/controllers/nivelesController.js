// controllers/nivelesController.js — Flujo de enseñanza 
// Capibara -> Guacamayo -> Anaconda -> Jaguar

const pool = require('../config/db');
const { enviarMensaje, enviarBotones, enviarImagenConBotones } = require('../services/whatsapp'); // Quitamos 'esperar' de aquí
const { NIVELES, ETAPA_A_NIVEL } = require('../data/niveles');

// Creamos la función esperar una sola vez
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ─── INICIAR UN NIVEL ─────────────
async function iniciarNivel(telefono, nivelId, idioma, baseUrl) {
  const nivel = NIVELES[nivelId];
  if (!nivel) return;

  const etapaInicio = nivel.etapa_inicio;
  const primerMensaje = nivel.mensajes[etapaInicio];

  await pool.query(
    'UPDATE usuarios SET etapa = $1 WHERE telefono = $2',
    [etapaInicio, telefono]
  );

  const intro = idioma === 'ki'
    ? 'Kichwa rimaypi wichwashun pronto...\n\n'
    : '';

  let textoMsg = primerMensaje.texto;
  
  // Agregar saludo personalizado si es el nivel 1
  if (nivelId === 'capibara') {
    const { rows } = await pool.query('SELECT nombre FROM usuarios WHERE telefono = $1', [telefono]);
    if (rows.length > 0 && rows[0].nombre) {
      textoMsg = `🌿 ¡Bienvenido/a al recorrido, *${rows[0].nombre}*!\n\n` + textoMsg;
    }
  }

  const esUltimoMensaje = primerMensaje.siguiente === nivel.quiz.etapa;
  const botonId = esUltimoMensaje ? 'QUIZ' : 'SIGUIENTE';
  const botonTitle = esUltimoMensaje ? 'Ir al Quiz' : 'Siguiente';

  // --- MODIFICACIÓN: Enviamos todo en un solo bloque ---
  await enviarBotones(telefono, intro + textoMsg, [{ id: botonId, title: botonTitle }]);
}


// ─── PROCESAR MENSAJE DURANTE UN NIVEL ────────────────────────────────────
async function procesarNivel(telefono, texto, etapaActual, idioma, baseUrl) {
  const nivelId = ETAPA_A_NIVEL[etapaActual];
  if (!nivelId) return false;

  const nivel = NIVELES[nivelId];
  const cmd = texto.trim().toUpperCase();

  // ── Navegacion entre mensajes ──────────────────────────────
  if (cmd === 'SIGUIENTE' || cmd === 'NEXT') {
    const msgActual = nivel.mensajes[etapaActual];

    if (!msgActual) return false;

    const siguienteEtapa = msgActual.siguiente;

    // Si siguiente es el quiz
    if (siguienteEtapa === nivel.quiz.etapa) {
      await pool.query(
        'UPDATE usuarios SET etapa = $1 WHERE telefono = $2',
        [nivel.quiz.etapa, telefono]
      );
      await enviarBotones(telefono, nivel.quiz.pregunta, [
        { id: 'A', title: 'Opción A' },
        { id: 'B', title: 'Opción B' },
        { id: 'C', title: 'Opción C' }
      ]);
      return true;
    }

    // Si hay siguiente mensaje
    if (nivel.mensajes[siguienteEtapa]) {
      await pool.query(
        'UPDATE usuarios SET etapa = $1 WHERE telefono = $2',
        [siguienteEtapa, telefono]
      );
      const nextMsg = nivel.mensajes[siguienteEtapa];
      const esUltimo = nextMsg.siguiente === nivel.quiz.etapa;
      const botonId = esUltimo ? 'QUIZ' : 'SIGUIENTE';
      const botonTitle = esUltimo ? 'Ir al Quiz' : 'Siguiente';

      // --- MODIFICACIÓN: Enviamos la teoría y el botón juntos ---
      await enviarBotones(telefono, nextMsg.texto, [{ id: botonId, title: botonTitle }]);
      return true;
    }
  }

  // ── Comando QUIZ — ir al quiz directamente desde ultimo mensaje ──
  if (cmd === 'QUIZ') {
    await pool.query(
      'UPDATE usuarios SET etapa = $1 WHERE telefono = $2',
      [nivel.quiz.etapa, telefono]
    );
    await enviarBotones(telefono, nivel.quiz.pregunta, [
      { id: 'A', title: 'Opción A' },
      { id: 'B', title: 'Opción B' },
      { id: 'C', title: 'Opción C' }
    ]);
    return true;
  }

  // ── Respuesta al quiz (A, B o C) ───────────────────────────
  if (etapaActual === nivel.quiz.etapa && ['A', 'B', 'C'].includes(cmd)) {
    return await procesarRespuestaQuiz(telefono, cmd, nivel, idioma, baseUrl);
  }

  // ── Si esta en el quiz y escribe algo que no es A/B/C ──────
  if (etapaActual === nivel.quiz.etapa) {
    await enviarBotones(telefono, 'Responde con *A*, *B* o *C*', [
      { id: 'A', title: 'Opción A' },
      { id: 'B', title: 'Opción B' },
      { id: 'C', title: 'Opción C' }
    ]);
    return true;
  }

  // ── Si esta en mensaje y escribe algo que no es SIGUIENTE ──
  const msgActual = nivel.mensajes[etapaActual];
  if (msgActual) {
    const esUltimo = msgActual.siguiente === nivel.quiz.etapa;
    const botonId = esUltimo ? 'QUIZ' : 'SIGUIENTE';
    const botonTitle = esUltimo ? 'Ir al Quiz' : 'Siguiente';
    await enviarBotones(telefono, 'Presiona el botón para continuar.', [{ id: botonId, title: botonTitle }]);
    return true;
  }

  return false;
}

// ─── PROCESAR RESPUESTA AL QUIZ ───────────────────────────────────────────
async function procesarRespuestaQuiz(telefono, respuesta, nivel, idioma, baseUrl) {
  const quiz = nivel.quiz;
  const opcion = quiz.respuestas[respuesta];

  if (!opcion) return false;

  // Registrar intento en base de datos
  await pool.query(
    `INSERT INTO interacciones
     (telefono, tipo_mensaje, contenido, respuesta_dada, pregunta_id,
      puntos_ganados, es_correcta, etapa_al_momento)
     VALUES ($1, 'quiz', $2, $3, $4, $5, $6, $7)`,
    [
      telefono,
      respuesta,
      respuesta,
      'quiz_nivel_' + nivel.numero,
      opcion.puntaje,
      opcion.correcto,
      'nivel' + nivel.numero + '_quiz'
    ]
  );

  // Si es correcta -> avanzar
  if (opcion.correcto) {
    await enviarMensaje(telefono, opcion.texto);
    await completarNivel(telefono, nivel, idioma, baseUrl);
  } else {
    // Es incorrecta, volver a mostrar los botones del quiz
    await enviarBotones(telefono, opcion.texto, [
      { id: 'A', title: 'Opción A' },
      { id: 'B', title: 'Opción B' },
      { id: 'C', title: 'Opción C' }
    ]);
  }

  return true;
}

// ─── COMPLETAR UN NIVEL Y AVANZAR AL SIGUIENTE ────────────────────────────
async function completarNivel(telefono, nivel, idioma, baseUrl) {
  // Actualizar puntos y etapa
  await pool.query(
    `UPDATE usuarios
     SET puntos = puntos + 10,
         etapa = $1
     WHERE telefono = $2`,
    [nivel.etapa_fin, telefono]
  );

  // Registrar completion del nivel
  await pool.query(
    `INSERT INTO progreso_modulos (telefono, modulo_id, completado, puntaje)
     VALUES ($1, $2, true, 10)
     ON CONFLICT (telefono, modulo_id) DO UPDATE
     SET completado = true, puntaje = 10`,
    [telefono, 'nivel_' + nivel.numero]
  ).catch(() => {});

  // Usamos el 'esperar' que acabamos de definir
  await esperar(1500); 

  // --- ARREGLO DE LA IMAGEN ---
  // Nos aseguramos de que baseUrl no tenga una barra / al final para evitar url//images
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const imageUrl = `${cleanBaseUrl}/images/${nivel.id}.jpg`;
  
  console.log("Intentando enviar imagen:", imageUrl); // Para ver la url en los logs

  try {
      if (nivel.siguiente_nivel) {
        await enviarImagenConBotones(telefono, imageUrl, nivel.insignia, [{ id: 'SIGUIENTE', title: 'Siguiente Nivel' }]);
      } else {
        await enviarImagenConBotones(telefono, imageUrl, nivel.insignia, [{ id: 'CERTIFICADO', title: 'Ver Certificado' }]);
      }
  } catch (err) {
      console.error("Error al enviar la imagen:", err);
      // Fallback: Si la imagen falla, enviamos el texto solo con los botones para que el bot no se congele
      const fallbackBotones = nivel.siguiente_nivel 
          ? [{ id: 'SIGUIENTE', title: 'Siguiente Nivel' }] 
          : [{ id: 'CERTIFICADO', title: 'Ver Certificado' }];
          
      await enviarBotones(telefono, `[Insignia Desbloqueada]\n\n${nivel.insignia}`, fallbackBotones);
  }
}
// ─── FINALIZAR EL PROGRAMA — NIVEL 4 COMPLETADO ───────────────────────────
async function finalizarPrograma(telefono, idioma, baseUrl) {
  // 1. Obtenemos el nombre del usuario desde la base de datos
  const { rows } = await pool.query('SELECT nombre FROM usuarios WHERE telefono = $1', [telefono]);
  const nombreUsuario = (rows.length > 0 && rows[0].nombre) ? rows[0].nombre : 'Participante';

  // 2. Armamos el certificado incluyendo el nombre
  const certificado = [
    '🏆 *CERTIFICADO DE GUARDIAN JAGUAR*',
    '━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    'Este certificado reconoce que:',
    `*${nombreUsuario}*`,
    'ha completado el programa de',
    '*Alfabetización en Salud Ambiental*',
    'sobre Radiación en la Amazonía Ecuatoriana.',
    '',
    '🌿 N1 Capibara  — Espectro electromagnético y tipos de radiación',
    '🦜 N2 Guacamayo — Radiación natural vs. TENORM',
    '🐍 N3 Anaconda  — Vías de exposición y dosimetría (mSv)',
    '🐆 N4 Jaguar    — Protocolos de acción y ciencia ciudadana',
    '━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    'Selecciona *POSTTEST* para la evaluación final y ver tus resultados.'
  ].join('\n');

  await pool.query(
    'UPDATE usuarios SET etapa = $1 WHERE telefono = $2',
    ['programa_completado', telefono]
  );

  // 3. Enviamos la imagen con el texto del certificado y el botón
  const cleanBaseUrl = baseUrl && baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : (baseUrl || 'https://radiation-bot.onrender.com');
  const imageUrl = `${cleanBaseUrl}/images/certificado.jpg`;

  try {
      await enviarImagenConBotones(telefono, imageUrl, certificado, [{ id: 'POSTTEST', title: 'Ir al Post-Test' }]);
  } catch (err) {
      console.error("Error enviando certificado:", err);
      // Fallback por si la imagen falla
      await enviarBotones(telefono, certificado, [{ id: 'POSTTEST', title: 'Ir al Post-Test' }]);
  }
}

// ─── AVANZAR AL SIGUIENTE NIVEL (comando SIGUIENTE despues de insignia) ────
async function avanzarSiguienteNivel(telefono, nivelActualId, idioma, baseUrl) {
  const nivelActual = NIVELES[nivelActualId];
  if (!nivelActual || !nivelActual.siguiente_nivel) return;

  const siguienteNivelId = nivelActual.siguiente_nivel;
  await iniciarNivel(telefono, siguienteNivelId, idioma, baseUrl);
}

// ─── MOSTRAR PUNTAJE ACTUAL ────────────────────────────────────────────────
async function mostrarPuntaje(telefono) {
  const { rows } = await pool.query(
    'SELECT puntos, nivel, etapa FROM usuarios WHERE telefono = $1',
    [telefono]
  );

  if (!rows.length) return;

  const { puntos, nivel, etapa } = rows[0];

  const nivelNombre = {
    1: 'Basico — Capibara',
    2: 'Intermedio — Guacamayo',
    3: 'Avanzado — Anaconda',
    4: 'Guardian Jaguar'
  }[nivel] || 'Explorando';

  const msg = [
    '*Tu progreso*',
    '',
    'Puntos acumulados: *' + puntos + '*',
    'Nivel: *' + nivelNombre + '*',
    'Etapa actual: ' + etapa,
    '',
    'Cada nivel completado suma 10 puntos.',
    'Cada respuesta correcta suma 2 puntos.'
  ].join('\n');

  await enviarMensaje(telefono, msg);
}

module.exports = {
  iniciarNivel,
  procesarNivel,
  avanzarSiguienteNivel,
  mostrarPuntaje,
  finalizarPrograma
};