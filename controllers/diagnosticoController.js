// controllers/diagnosticoController.js
const pool = require('../config/db');
const { enviarMensaje } = require('../services/whatsapp');
const { PREGUNTAS_DIAGNOSTICO, clasificarNivel } = require('../data/diagnostico');

// ── Inicia el diagnóstico — primero pide el nombre ─────────────────
async function iniciarDiagnostico(telefono, idioma = 'es') {
  await pool.query(
    'UPDATE usuarios SET etapa = $1 WHERE telefono = $2',
    ['esperando_nombre', telefono]
  );

  const msg = idioma === 'ki'
    ? '👋 Imatak shutiki?\n\nShutiykita killkay, ej: *Rosa* o *Juan*'
    : '👋 Antes de comenzar, ¿cuál es tu nombre?\n\nEscríbelo tal como quieres que aparezca en tu certificado.\nEj: *Rosa*, *Juan Carlos*, *Mamá Luisa*';

  await enviarMensaje(telefono, msg);
}

// ── Guarda el nombre y arranca la primera pregunta ─────────────────
async function guardarNombreIniciarPreguntas(telefono, nombre, idioma = 'es') {
  await pool.query(
    'UPDATE usuarios SET nombre = $1, etapa = $2 WHERE telefono = $3',
    [nombre, 'diagnostico_1', telefono]
  );

  const saludo = idioma === 'ki'
    ? `Alimi, *${nombre}*! Tapuykuna kallarishun.\n\n`
    : `Perfecto, *${nombre}*! Comenzamos el diagnóstico.\n\n`;

  const primera = PREGUNTAS_DIAGNOSTICO[0];
  const textoPregunta = idioma === 'ki' ? primera.texto_ki : primera.texto_es;

  await enviarMensaje(telefono, saludo + textoPregunta);
}

// ── Procesa cada respuesta del diagnóstico ─────────────────────────
async function procesarRespuestaDiagnostico(telefono, respuesta, etapaActual, idioma = 'es') {
  const numPregunta = parseInt(etapaActual.split('_')[1]);
  const indexActual = numPregunta - 1;
  const pregunta    = PREGUNTAS_DIAGNOSTICO[indexActual];

  if (!pregunta) return;

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

  await pool.query(
    `INSERT INTO interacciones
     (telefono, tipo_mensaje, contenido, respuesta_dada, pregunta_id, puntos_ganados, etapa_al_momento)
     VALUES ($1, 'diagnostico', $2, $3, $4, $5, $6)`,
    [telefono, respuestaFinal, respuestaFinal, pregunta.id, puntosGanados, etapaActual]
  );

  const siguienteIndex = indexActual + 1;

  if (siguienteIndex < PREGUNTAS_DIAGNOSTICO.length) {
    const nuevaEtapa        = `diagnostico_${numPregunta + 1}`;
    const siguientePregunta = PREGUNTAS_DIAGNOSTICO[siguienteIndex];
    const textoPregunta     = idioma === 'ki'
      ? siguientePregunta.texto_ki
      : siguientePregunta.texto_es;

    await pool.query(
      'UPDATE usuarios SET etapa = $1 WHERE telefono = $2',
      [nuevaEtapa, telefono]
    );

    await enviarMensaje(telefono, textoPregunta);
  } else {
    await finalizarDiagnostico(telefono, idioma);
  }
}

// ── Finaliza el diagnóstico y clasifica al usuario ─────────────────
async function finalizarDiagnostico(telefono, idioma = 'es') {
  const { rows: puntajeRows } = await pool.query(
    `SELECT COALESCE(SUM(puntos_ganados), 0) AS total
     FROM interacciones
     WHERE telefono = $1 AND tipo_mensaje = 'diagnostico'`,
    [telefono]
  );

  const puntajeTotal   = parseInt(puntajeRows[0].total);
  const nivelDetectado = clasificarNivel(puntajeTotal);

  // Obtener nombre guardado
  const { rows: usuarioRows } = await pool.query(
    'SELECT nombre FROM usuarios WHERE telefono = $1',
    [telefono]
  );
  const nombre = usuarioRows[0]?.nombre || 'amigo/a';

  await pool.query(
    `INSERT INTO diagnostico (telefono, puntaje, nivel_detectado, completado)
     VALUES ($1, $2, $3, true)
     ON CONFLICT (telefono) DO UPDATE
     SET puntaje = $2, nivel_detectado = $3, completado = true`,
    [telefono, puntajeTotal, nivelDetectado]
  );

  await pool.query(
    'UPDATE usuarios SET etapa = $1, nivel = $2 WHERE telefono = $3',
    ['diagnostico_completado',
     nivelDetectado === 'avanzado' ? 3 : nivelDetectado === 'intermedio' ? 2 : 1,
     telefono]
  );

  const msgResultado = mensajeResultadoConNombre(nivelDetectado, nombre, idioma);
  await enviarMensaje(telefono, msgResultado);
}

// ── Mensaje de resultado personalizado con nombre ──────────────────
function mensajeResultadoConNombre(nivel, nombre, idioma) {
  if (idioma === 'ki') {
    return [
      `*${nombre}*, alimi! Tapuykuna tukurishka.`,
      '',
      '*INICIAR* nishpa katiy yachanakapak.'
    ].join('\n');
  }

  const info = {
    basico: {
      titulo: 'Nivel Básico — Capibara 🌿',
      descripcion: 'Estás comenzando tu camino. Las lecciones te darán una base sólida sobre radiación ambiental desde cero.'
    },
    intermedio: {
      titulo: 'Nivel Intermedio — Guacamayo 🦜',
      descripcion: 'Tienes nociones sobre el tema. Las lecciones ampliarán y precisarán tu conocimiento con información científica de Sucumbíos.'
    },
    avanzado: {
      titulo: 'Nivel Avanzado — Anaconda 🐍',
      descripcion: 'Tienes buen conocimiento previo. Las lecciones profundizarán en los aspectos técnicos y tu rol en la ciencia ciudadana.'
    }
  }[nivel] || {
    titulo: 'Nivel Básico — Capibara 🌿',
    descripcion: 'Las lecciones te darán una base sólida sobre radiación ambiental.'
  };

  return [
    `✅ Diagnóstico completado, *${nombre}*!`,
    '',
    `Tu nivel de partida: *${info.titulo}*`,
    '',
    info.descripcion,
    '',
    '▶️ Escribe *INICIAR* para comenzar las lecciones.'
  ].join('\n');
}

module.exports = {
  iniciarDiagnostico,
  guardarNombreIniciarPreguntas,
  procesarRespuestaDiagnostico
};
