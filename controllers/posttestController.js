// controllers/posttestController.js
// Evaluacion final — sin reintentos, con retroalimentacion
// Calcula Ganancia Normalizada de Hake al finalizar

const pool = require('../config/db');
const { enviarMensaje } = require('../services/whatsapp');
const { PREGUNTAS_POSTTEST, PUNTAJE_MAXIMO_POSTTEST } = require('../data/posttest');

// ── Iniciar el post-test ───────────────────────────────────────────
async function iniciarPosttest(telefono, idioma = 'es') {
  await pool.query(
    'UPDATE usuarios SET etapa = $1 WHERE telefono = $2',
    ['posttest_1', telefono]
  );

  const intro = [
    '📋 *EVALUACION FINAL — Zetesis*',
    '',
    'Ahora mediremos lo que aprendiste.',
    '',
    '8 preguntas sobre los 4 niveles.',
    'No hay reintentos — si te equivocas',
    'recibirás la explicación y continuarás.',
    '',
    '¡Muestra lo que sabes!',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━'
  ].join('\n');

  await enviarMensaje(telefono, intro);

  // Pequeña pausa y enviar primera pregunta
  setTimeout(async () => {
    await enviarMensaje(telefono, PREGUNTAS_POSTTEST[0].texto_es);
  }, 1500);
}

// ── Procesar respuesta del post-test ──────────────────────────────
async function procesarRespuestaPosttest(telefono, respuesta, etapaActual, idioma = 'es') {
  const numPregunta = parseInt(etapaActual.split('_')[1]);
  const indexActual = numPregunta - 1;
  const pregunta    = PREGUNTAS_POSTTEST[indexActual];

  if (!pregunta) return;

  const cmd = respuesta.trim().toUpperCase();

  // Validar A, B o C
  if (!['A', 'B', 'C'].includes(cmd)) {
    await enviarMensaje(telefono, '⚠️ Responde con *A*, *B* o *C*');
    return;
  }

  const esCorrecta   = cmd === pregunta.correcta;
  const puntosGanados = pregunta.puntaje[cmd] || 0;

  // Guardar respuesta
  await pool.query(
    `INSERT INTO interacciones
     (telefono, tipo_mensaje, contenido, respuesta_dada, pregunta_id,
      puntos_ganados, es_correcta, etapa_al_momento)
     VALUES ($1, 'posttest', $2, $3, $4, $5, $6, $7)`,
    [telefono, cmd, cmd, pregunta.id, puntosGanados, esCorrecta, etapaActual]
  );

  // Enviar retroalimentacion (siempre, correcta o no)
  const feedback = pregunta.retroalimentacion[cmd];
  await enviarMensaje(telefono, feedback);

  // Avanzar a siguiente pregunta o finalizar
  const siguienteIndex = indexActual + 1;

  if (siguienteIndex < PREGUNTAS_POSTTEST.length) {
    const nuevaEtapa = `posttest_${numPregunta + 1}`;
    await pool.query(
      'UPDATE usuarios SET etapa = $1 WHERE telefono = $2',
      [nuevaEtapa, telefono]
    );

    // Pausa antes de la siguiente pregunta
    setTimeout(async () => {
      await enviarMensaje(telefono, PREGUNTAS_POSTTEST[siguienteIndex].texto_es);
    }, 2000);

  } else {
    // Todas las preguntas respondidas
    setTimeout(async () => {
      await finalizarPosttest(telefono, idioma);
    }, 2000);
  }
}

// ── Finalizar post-test y calcular Ganancia de Hake ───────────────
async function finalizarPosttest(telefono, idioma = 'es') {
  // Puntaje del post-test
  const { rows: postRows } = await pool.query(
    `SELECT COALESCE(SUM(puntos_ganados), 0) AS total
     FROM interacciones
     WHERE telefono = $1 AND tipo_mensaje = 'posttest'`,
    [telefono]
  );
  const puntajePost = parseInt(postRows[0].total);

  // Puntaje del diagnóstico inicial
  const { rows: diagRows } = await pool.query(
    'SELECT puntaje FROM diagnostico WHERE telefono = $1',
    [telefono]
  );
  const puntajePre = diagRows.length ? parseInt(diagRows[0].puntaje) : 0;

  // Puntaje maximo del diagnostico (8 preguntas x 2 puntos = 16)
  const PUNTAJE_MAX_DIAGNOSTICO = 16;

  // Ganancia Normalizada de Hake
  // <g> = (%Post - %Pre) / (100 - %Pre)
  const porcentajePre  = (puntajePre  / PUNTAJE_MAX_DIAGNOSTICO)  * 100;
  const porcentajePost = (puntajePost / PUNTAJE_MAXIMO_POSTTEST)  * 100;

  let hake = 0;
  if (porcentajePre < 100) {
    hake = (porcentajePost - porcentajePre) / (100 - porcentajePre);
  } else {
    hake = 1; // Ya estaba en 100% antes
  }

  const hakeRedondeado = Math.round(hake * 100) / 100;

  // Clasificacion de Hake
  let nivelHake, descripcionHake, emojiHake;
  if (hake <= 0) {
    nivelHake       = 'Sin ganancia';
    descripcionHake = 'El puntaje post no supera al diagnóstico inicial. Puede indicar dificultad con los contenidos.';
    emojiHake       = '📊';
  } else if (hake <= 0.3) {
    nivelHake       = 'Ganancia baja';
    descripcionHake = 'Hay aprendizaje pero el programa puede mejorar su efectividad pedagógica.';
    emojiHake       = '📈';
  } else if (hake <= 0.7) {
    nivelHake       = 'Ganancia media';
    descripcionHake = 'Efectividad esperada para m-learning. El programa cumple su objetivo pedagógico.';
    emojiHake       = '📈';
  } else {
    nivelHake       = 'Ganancia alta';
    descripcionHake = 'Internalización cognitiva superlativa. El programa superó las expectativas.';
    emojiHake       = '🏆';
  }

  // Obtener nombre
  const { rows: usuarioRows } = await pool.query(
    'SELECT nombre FROM usuarios WHERE telefono = $1',
    [telefono]
  );
  const nombre = usuarioRows[0]?.nombre || 'Participante';

  // Guardar resultados finales
  await pool.query(
    `INSERT INTO resultados_posttest
     (telefono, puntaje_pre, puntaje_post, porcentaje_pre, porcentaje_post, hake, nivel_hake)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (telefono) DO UPDATE
     SET puntaje_post = $3, porcentaje_post = $5, hake = $6, nivel_hake = $7`,
    [telefono, puntajePre, puntajePost,
     Math.round(porcentajePre), Math.round(porcentajePost),
     hakeRedondeado, nivelHake]
  ).catch(() => {});

  await pool.query(
    "UPDATE usuarios SET etapa = 'finalizado' WHERE telefono = $1",
    [telefono]
  );

  // Mensaje de resultados finales
  const msgFinal = [
    `${emojiHake} *RESULTADOS FINALES — ${nombre}*`,
    '━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '📊 *Diagnóstico inicial:*',
    `   ${Math.round(porcentajePre)}% (${puntajePre} pts)`,
    '',
    '📋 *Evaluación final:*',
    `   ${Math.round(porcentajePost)}% (${puntajePost} pts)`,
    '',
    '📐 *Ganancia Normalizada de Hake:*',
    `   ⟨g⟩ = ${hakeRedondeado}`,
    `   ${nivelHake}`,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    descripcionHake,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    `Gracias por participar, *${nombre}*!`,
    'Tu aporte es parte de la investigación',
    'científica de Zetesis en Pacayacu.',
    '',
    'Escribe *CERTIFICADO* para recibir',
    'tu certificado de Guardian Jaguar.'
  ].join('\n');

  await enviarMensaje(telefono, msgFinal);
}

module.exports = { iniciarPosttest, procesarRespuestaPosttest };
