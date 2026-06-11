// controllers/diagnosticoController.js
// Flujo: Bienvenida → Nombre → Edad → Ciudad → 11 preguntas → Cierre

const pool = require('../config/db');
const { enviarMensaje, enviarBotones } = require('../services/whatsapp');
const { PREGUNTAS_DIAGNOSTICO, clasificarNivel, mensajeResultado } = require('../data/diagnostico');

// ── 1. Bienvenida e inicio — pide el nombre ─────────
async function iniciarDiagnostico(telefono, idioma = 'es') {
  await pool.query(
    'UPDATE usuarios SET etapa = $1 WHERE telefono = $2',
    ['esperando_nombre', telefono]
  );

  const bienvenida = [
    '🌿 *Bienvenido/a a la Fase de Diagnóstico*',
    '',
    'Somos un equipo de investigación científica',
    '',
    'Este diagnóstico es *completamente anónimo* y nos ayuda a entender el conocimiento de la comunidad sobre radiación ambiental.',
    '',
    'Son solo *11 preguntas rápidas* — menos de 5 minutos. ⏱️',
    '',
    '━━━━━━━━━━━━━━━━━━━',
    '👇 Para comenzar, ¿cuál es tu nombre?',
    'Escríbelo como prefieres que te llamemos.',
    'Ej: *Rosa*, *Juan Carlos*, *Luisa*'
  ].join('\n');

  await enviarMensaje(telefono, bienvenida);
}

// ── 2. Guarda el nombre y pide la edad ───────
async function guardarNombreIniciarPreguntas(telefono, nombre, idioma = 'es') {
  await pool.query(
    'UPDATE usuarios SET nombre = $1, etapa = $2 WHERE telefono = $3',
    [nombre, 'esperando_edad', telefono]
  );

  await enviarMensaje(telefono, [
    `Hola, *${nombre}*! 👋`,
    '',
    '¿Cuántos años tienes?',
    'Escribe solo el número. Ej: *34*'
  ].join('\n'));
}

// ── 3. Guarda la edad y pide la ciudad ─────────
async function guardarEdadPedirCiudad(telefono, edad, idioma = 'es') {
  // Validar que sea un número razonable
  const edadNum = parseInt(edad);
  if (isNaN(edadNum) || edadNum < 10 || edadNum > 100) {
    await enviarMensaje(telefono, '⚠️ Por favor escribe solo tu edad en números. Ej: *34*');
    return;
  }

  await pool.query(
    'UPDATE usuarios SET edad = $1, etapa = $2 WHERE telefono = $3',
    [edadNum, 'esperando_localidad', telefono]
  );

  await enviarMensaje(telefono, [
    '¿En qué ciudad o comunidad vives?',
    'Ej: *Pacayacu*, *Lago Agrio*, *El Eno*'
  ].join('\n'));
}

// ── 4. Guarda la ciudad e inicia las preguntas ──────
async function guardarLocalidadIniciarPreguntas(telefono, localidad, idioma = 'es') {
  const { rows } = await pool.query(
    'SELECT nombre FROM usuarios WHERE telefono = $1',
    [telefono]
  );
  const nombre = rows[0]?.nombre || 'amigo/a';

  await pool.query(
    'UPDATE usuarios SET localidad = $1, etapa = $2 WHERE telefono = $3',
    [localidad, 'diagnostico_1', telefono]
  );

  const intro = [
    `¡Perfecto, *${nombre}*! 🌿`,
    '',
    'Ahora comenzamos las 11 preguntas.',
    'No hay respuestas incorrectas —',
    'lo que importa es tu opinión real.',
    '',
    '━━━━━━━━━━━━━━━━━━━'
  ].join('\n');

  const primera = PREGUNTAS_DIAGNOSTICO[0];
  await enviarBotones(telefono, intro + '\n\n' + primera.texto_es, [
    { id: 'A', title: 'Opción A' },
    { id: 'B', title: 'Opción B' },
    { id: 'C', title: 'Opción C' }
  ]);
}

// ── 5. Procesa cada respuesta ─────────────────
async function procesarRespuestaDiagnostico(telefono, respuesta, etapaActual, idioma = 'es') {
  const numPregunta = parseInt(etapaActual.split('_')[1]);
  const indexActual = numPregunta - 1;
  const pregunta = PREGUNTAS_DIAGNOSTICO[indexActual];

  if (!pregunta) return;

  const cmd = respuesta.trim().toUpperCase();

  if (!['A', 'B', 'C'].includes(cmd)) {
    await enviarBotones(telefono, '⚠️ Por favor responde solo con *A*, *B* o *C*.', [
      { id: 'A', title: 'Opción A' },
      { id: 'B', title: 'Opción B' },
      { id: 'C', title: 'Opción C' }
    ]);
    return;
  }

  const puntosGanados = pregunta.puntaje[cmd] || 0;

  await pool.query(
    `INSERT INTO interacciones
     (telefono, tipo_mensaje, contenido, respuesta_dada, pregunta_id, puntos_ganados, etapa_al_momento)
     VALUES ($1, 'diagnostico', $2, $3, $4, $5, $6)`,
    [telefono, cmd, cmd, pregunta.id, puntosGanados, etapaActual]
  );

  const siguienteIndex = indexActual + 1;

  if (siguienteIndex < PREGUNTAS_DIAGNOSTICO.length) {
    const nuevaEtapa = `diagnostico_${numPregunta + 1}`;
    await pool.query(
      'UPDATE usuarios SET etapa = $1 WHERE telefono = $2',
      [nuevaEtapa, telefono]
    );
    await enviarBotones(telefono, PREGUNTAS_DIAGNOSTICO[siguienteIndex].texto_es, [
      { id: 'A', title: 'Opción A' },
      { id: 'B', title: 'Opción B' },
      { id: 'C', title: 'Opción C' }
    ]);
  } else {
    await finalizarDiagnostico(telefono, idioma);
  }
}

// ── 6. Finaliza y muestra mensaje de cierre ───────────────────────
async function finalizarDiagnostico(telefono, idioma = 'es') {
  const { rows: puntajeRows } = await pool.query(
    `SELECT COALESCE(SUM(puntos_ganados), 0) AS total
     FROM interacciones
     WHERE telefono = $1 AND tipo_mensaje = 'diagnostico'`,
    [telefono]
  );

  const puntajeTotal = parseInt(puntajeRows[0].total);
  const nivelDetectado = clasificarNivel(puntajeTotal);

  const { rows: usuarioRows } = await pool.query(
    'SELECT nombre FROM usuarios WHERE telefono = $1',
    [telefono]
  );
  const nombre = usuarioRows[0]?.nombre || null;

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

  const msgCierre = mensajeResultado(nivelDetectado, nombre, idioma);
  await enviarBotones(telefono, msgCierre, [{ id: 'INICIAR', title: 'Iniciar Recurso' }]);
}

module.exports = {
  iniciarDiagnostico,
  guardarNombreIniciarPreguntas,
  guardarEdadPedirCiudad,
  guardarLocalidadIniciarPreguntas,
  procesarRespuestaDiagnostico
};
