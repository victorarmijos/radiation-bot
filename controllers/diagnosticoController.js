// controllers/diagnosticoController.js — Flujo del diagnóstico inicial
const pool = require('../config/db');
const { enviarMensaje } = require('../services/whatsapp');
const { PREGUNTAS_DIAGNOSTICO, clasificarNivel, mensajeResultado } = require('../data/diagnostico');

// ── Inicia el diagnóstico para un usuario ──────────────────────────
async function iniciarDiagnostico(telefono, idioma = 'es') {
  // Marcar etapa como diagnóstico activo
  await pool.query(
    'UPDATE usuarios SET etapa = $1 WHERE telefono = $2',
    ['diagnostico_1', telefono]
  );

  // Enviar primera pregunta
  const primera = PREGUNTAS_DIAGNOSTICO[0];
  const texto = idioma === 'ki' ? primera.texto_ki : primera.texto_es;
  await enviarMensaje(telefono, texto);
}

// ── Procesa cada respuesta del diagnóstico ─────────────────────────
async function procesarRespuestaDiagnostico(telefono, respuesta, etapaActual, idioma = 'es') {
  // Extraer número de pregunta actual desde la etapa (ej. 'diagnostico_3' → 3)
  const numPregunta = parseInt(etapaActual.split('_')[1]);
  const indexActual = numPregunta - 1;
  const pregunta    = PREGUNTAS_DIAGNOSTICO[indexActual];

  if (!pregunta) return;

  // Validar que la respuesta sea válida
  const respuestaValida = ['A', 'B', 'C'].includes(respuesta.trim().toUpperCase());
  if (!respuestaValida) {
    await enviarMensaje(telefono, idioma === 'ki'
      ? '⚠️ A, B o C nishpa kutichiy.'
      : '⚠️ Por favor responde solo con A, B o C.'
    );
    return;
  }

  const respuestaFinal = respuesta.trim().toUpperCase();
  const puntosGanados  = pregunta.puntaje[respuestaFinal] || 0;

  // Registrar respuesta en interacciones
  await pool.query(
    `INSERT INTO interacciones
     (telefono, tipo_mensaje, contenido, respuesta_dada, pregunta_id, puntos_ganados, etapa_al_momento)
     VALUES ($1, 'diagnostico', $2, $3, $4, $5, $6)`,
    [telefono, respuestaFinal, respuestaFinal, pregunta.id, puntosGanados, etapaActual]
  );

  // ¿Hay siguiente pregunta?
  const siguienteIndex = indexActual + 1;

  if (siguienteIndex < PREGUNTAS_DIAGNOSTICO.length) {
    // Avanzar a siguiente pregunta
    const nuevaEtapa    = `diagnostico_${numPregunta + 1}`;
    const siguientePregunta = PREGUNTAS_DIAGNOSTICO[siguienteIndex];
    const textoPregunta = idioma === 'ki'
      ? siguientePregunta.texto_ki
      : siguientePregunta.texto_es;

    await pool.query(
      'UPDATE usuarios SET etapa = $1 WHERE telefono = $2',
      [nuevaEtapa, telefono]
    );

    await enviarMensaje(telefono, textoPregunta);

  } else {
    // Diagnóstico completado — calcular puntaje total
    await finalizarDiagnostico(telefono, idioma);
  }
}

// ── Finaliza el diagnóstico y clasifica al usuario ─────────────────
async function finalizarDiagnostico(telefono, idioma = 'es') {
  // Sumar puntaje total de todas las respuestas del diagnóstico
  const { rows } = await pool.query(
    `SELECT COALESCE(SUM(puntos_ganados), 0) AS total
     FROM interacciones
     WHERE telefono = $1 AND tipo_mensaje = 'diagnostico'`,
    [telefono]
  );

  const puntajeTotal  = parseInt(rows[0].total);
  const nivelDetectado = clasificarNivel(puntajeTotal);

  // Guardar resultado en tabla diagnostico
  await pool.query(
    `INSERT INTO diagnostico (telefono, puntaje, nivel_detectado, completado)
     VALUES ($1, $2, $3, true)
     ON CONFLICT (telefono) DO UPDATE
     SET puntaje = $2, nivel_detectado = $3, completado = true`,
    [telefono, puntajeTotal, nivelDetectado]
  );

  // Actualizar etapa del usuario
  await pool.query(
    'UPDATE usuarios SET etapa = $1, nivel = $2 WHERE telefono = $3',
    ['diagnostico_completado', nivelDetectado === 'avanzado' ? 3 : nivelDetectado === 'intermedio' ? 2 : 1, telefono]
  );

  // Enviar mensaje de resultado
  const msgResultado = mensajeResultado(nivelDetectado, idioma);
  await enviarMensaje(telefono, msgResultado);
}

module.exports = { iniciarDiagnostico, procesarRespuestaDiagnostico };