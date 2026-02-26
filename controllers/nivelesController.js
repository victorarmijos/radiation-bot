// controllers/nivelesController.js — Flujo de ensenanza Zetesis
// Capibara -> Guacamayo -> Anaconda -> Jaguar

const pool = require('../config/db');
const { enviarMensaje } = require('../services/whatsapp');
const { NIVELES, ETAPA_A_NIVEL } = require('../data/niveles');

// ─── INICIAR UN NIVEL ──────────────────────────────────────────────────────
async function iniciarNivel(telefono, nivelId, idioma) {
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

  await enviarMensaje(telefono, intro + primerMensaje.texto);
}

// ─── PROCESAR MENSAJE DURANTE UN NIVEL ────────────────────────────────────
async function procesarNivel(telefono, texto, etapaActual, idioma) {
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
      await enviarMensaje(telefono, nivel.quiz.pregunta);
      return true;
    }

    // Si hay siguiente mensaje
    if (nivel.mensajes[siguienteEtapa]) {
      await pool.query(
        'UPDATE usuarios SET etapa = $1 WHERE telefono = $2',
        [siguienteEtapa, telefono]
      );
      await enviarMensaje(telefono, nivel.mensajes[siguienteEtapa].texto);
      return true;
    }

    return false;
  }

  // ── Comando QUIZ — ir al quiz directamente desde ultimo mensaje ──
  if (cmd === 'QUIZ') {
    await pool.query(
      'UPDATE usuarios SET etapa = $1 WHERE telefono = $2',
      [nivel.quiz.etapa, telefono]
    );
    await enviarMensaje(telefono, nivel.quiz.pregunta);
    return true;
  }

  // ── Respuesta al quiz (A, B o C) ───────────────────────────
  if (etapaActual === nivel.quiz.etapa && ['A', 'B', 'C'].includes(cmd)) {
    return await procesarRespuestaQuiz(telefono, cmd, nivel, idioma);
  }

  // ── Si esta en el quiz y escribe algo que no es A/B/C ──────
  if (etapaActual === nivel.quiz.etapa) {
    await enviarMensaje(telefono, 'Responde con *A*, *B* o *C*');
    return true;
  }

  // ── Si esta en mensaje y escribe algo que no es SIGUIENTE ──
  const msgActual = nivel.mensajes[etapaActual];
  if (msgActual) {
    await enviarMensaje(telefono, 'Escribe *SIGUIENTE* para continuar.');
    return true;
  }

  return false;
}

// ─── PROCESAR RESPUESTA AL QUIZ ───────────────────────────────────────────
async function procesarRespuestaQuiz(telefono, respuesta, nivel, idioma) {
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

  await enviarMensaje(telefono, opcion.texto);

  // Si es correcta -> avanzar
  if (opcion.correcto) {
    await completarNivel(telefono, nivel, idioma);
  }

  return true;
}

// ─── COMPLETAR UN NIVEL Y AVANZAR AL SIGUIENTE ────────────────────────────
async function completarNivel(telefono, nivel, idioma) {
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
  ).catch(() => {}); // Si la tabla no tiene unique constraint, ignorar

  // Esperar un momento y enviar insignia
  setTimeout(async () => {
    // Si hay siguiente nivel
    if (nivel.siguiente_nivel) {
      await enviarMensaje(telefono, nivel.insignia);

    // Si es el ultimo nivel -> certificacion
    } else {
      await finalizarPrograma(telefono, idioma);
    }
  }, 1500);
}

// ─── FINALIZAR EL PROGRAMA — NIVEL 4 COMPLETADO ───────────────────────────
async function finalizarPrograma(telefono, idioma) {
  const certificado = [
    '*CERTIFICADO DE GUARDIAN JAGUAR*',
    '*Zetesis — Centro de Investigacion Cientifica*',
    '',
    'Este certificado reconoce que',
    telefono,
    'ha completado el programa de',
    '*Alfabetizacion en Salud Ambiental*',
    'sobre Radiacion en Zonas Petroleras',
    'de Pacayacu, Sucumbios, Ecuador.',
    '',
    'N1 Capibara:  Reconocimiento del entorno',
    'N2 Guacamayo: Vias de exposicion',
    'N3 Anaconda:  Trilogia ALARA',
    'N4 Jaguar:    Liderazgo comunitario',
    '',
    'Comparte este mensaje con tu comunidad.',
    'Cada persona informada es un guardian mas.',
    '',
    'Escribe *POSTTEST* para el test de evaluacion final.'
  ].join('\n');

  await pool.query(
    'UPDATE usuarios SET etapa = $1 WHERE telefono = $2',
    ['programa_completado', telefono]
  );

  await enviarMensaje(telefono, certificado);
}

// ─── AVANZAR AL SIGUIENTE NIVEL (comando SIGUIENTE despues de insignia) ────
async function avanzarSiguienteNivel(telefono, nivelActualId, idioma) {
  const nivelActual = NIVELES[nivelActualId];
  if (!nivelActual || !nivelActual.siguiente_nivel) return;

  const siguienteNivelId = nivelActual.siguiente_nivel;
  await iniciarNivel(telefono, siguienteNivelId, idioma);
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
    '*Tu progreso en Zetesis*',
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