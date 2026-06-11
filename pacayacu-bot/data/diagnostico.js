// data/diagnostico.js — Diagnóstico 
// Flujo: Bienvenida → Nombre → Edad → Ciudad → 11 preguntas → Cierre

const PREGUNTAS_DIAGNOSTICO = [

  // ── BLOQUE 1: ENTORNO Y HÁBITOS ────────────────────────────────
  {
    id: 'DIAG_01',
    bloque: 'entorno',
    texto_es: [
      '*Pregunta 1 de 11*',
      '¿Hasta qué nivel de estudios llegaste?',
      '',
      'A) Primaria (1ro - 7mo).',
      'B) Secundaria (8vo - Bachillerato).',
      'C) Superior o Universidad.',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'entorno',
    puntaje: { A: 1, B: 2, C: 3 }
  },

  {
    id: 'DIAG_02',
    bloque: 'entorno',
    texto_es: [
      '*Pregunta 2 de 11*',
      '¿Con qué frecuencia usas el celular para aprender algo nuevo?',
      '',
      'A) Nunca o casi nunca.',
      'B) A veces (1-2 veces por semana).',
      'C) Seguido (casi todos los días).',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'entorno',
    puntaje: { A: 1, B: 2, C: 3 }
  },

  // ── BLOQUE 2: ACTITUDES HACIA LA CIENCIA ───────────────────────
  {
    id: 'DIAG_03',
    bloque: 'actitud',
    texto_es: [
      '*Pregunta 3 de 11*',
      '¿Qué piensas sobre aprender ciencia y temas del ambiente? 🤔',
      '',
      'A) No me interesa mucho, es muy difícil.',
      'B) Me gusta y quisiera aprender más.',
      'C) Me parece interesante pero no la entiendo bien.',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'actitud',
    puntaje: { A: 1, B: 3, C: 2 }
  },

  {
    id: 'DIAG_04',
    bloque: 'actitud',
    texto_es: [
      '*Pregunta 4 de 11*',
      '¿Has escuchado hablar sobre contaminación o medio ambiente en tu comunidad? 🧐',
      '',
      'A) Sí, lo conversamos seguido en la comunidad.',
      'B) He escuchado algo pero no sé mucho.',
      'C) No, nunca he escuchado nada.',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'actitud',
    puntaje: { A: 3, B: 2, C: 1 }
  },

  // ── BLOQUE 3: CONOCIMIENTO SOBRE RADIACIÓN ─────────────────────
  {
    id: 'DIAG_05',
    bloque: 'conocimiento',
    texto_es: [
      '*Pregunta 5 de 11*',
      '¿Has escuchado la palabra "radiación"? ☢️',
      '',
      'A) Sí, pero no sé qué significa',
      'B) Sí, y sé algo sobre lo que es',
      'C) No, nunca',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'conocimiento',
    puntaje: { A: 2, B: 3, C: 1 }
  },

  {
    id: 'DIAG_06',
    bloque: 'conocimiento',
    texto_es: [
      '*Pregunta 6 de 11*',
      '¿Qué crees que es la radiación?',
      '',
      'A) Solo algo peligroso de las plantas nucleares',
      'B) Una forma de energía que existe en la naturaleza y que también usamos en tecnología',
      'C) No estoy seguro, pero sé que existe en el celular y en los rayos X',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'conocimiento',
    correcta: 'B',
    puntaje: { A: 1, B: 3, C: 2 }
  },

  {
    id: 'DIAG_07',
    bloque: 'conocimiento',
    texto_es: [
      '*Pregunta 7 de 11*',
      '¿Crees que en la Amazonía ecuatoriana existe radiación natural? 🌲',
      '',
      'A) No, aquí no hay radiación de ningún tipo.',
      'B) No sé, nunca había pensado en eso.',
      'C) Sí, en toda la Tierra existe radiación natural de fondo.',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'conocimiento',
    correcta: 'C',
    puntaje: { A: 1, B: 1, C: 3 }
  },

  {
    id: 'DIAG_08',
    bloque: 'conocimiento',
    texto_es: [
      '*Pregunta 8 de 11*',
      '¿Qué diferencia hay entre radiación natural y artificial?',
      '',
      'A) La natural viene del entorno y la artificial la creamos los humanos.',
      'B) No hay diferencia, toda radiación es un invento del hombre y siempre es destructiva.',
      'C) La natural viene del cosmos y la artificial de aparatos, pero la artificial siempre es más peligrosa.',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'conocimiento',
    correcta: 'A',
    puntaje: { A: 3, B: 1, C: 2 }
  },

  // ── BLOQUE 4: PERCEPCIÓN DEL RIESGO LOCAL ──────────────────────
  {
    id: 'DIAG_09',
    bloque: 'percepcion_local',
    texto_es: [
      '*Pregunta 9 de 11*',
      '¿Qué piensas cuando ves tubos viejos y oxidados de pozos petroleros abandonados cerca de tu comunidad?',
      '',
      'A) No les presto atención, son solo chatarra vieja y no representan peligro.',
      'B) Me dan mucho miedo, creo que todo eso es súper tóxico y mortal.',
      'C) Sé que requieren cuidado y es mejor no tocarlos ni usarlos.',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'percepcion_local',
    correcta: 'C',
    puntaje: { A: 2, B: 1, C: 3 }
  },

  // ── BLOQUE 5: COMPORTAMIENTO Y TENORM ──────────────────────────
  {
    id: 'DIAG_10',
    bloque: 'comportamiento',
    texto_es: [
      '*Pregunta 10 de 11*',
      'Si un vecino quiere llevarse un tubo viejo de un pozo petrolero',
      'para hacer la cerca de su finca, ¿qué le dirías?',
      '',
      'A) Que es buena idea, así recicla el material y ahorra dinero.',
      'B) Que tenga cuidado solo de no cortarse con el óxido, o no le diría nada.',
      'C) Que no lo haga, esos tubos pueden tener minerales con radiación natural.',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'comportamiento',
    correcta: 'C',
    puntaje: { A: 1, B: 2, C: 3 }
  },

  // ── BLOQUE 6: GAMIFICACIÓN ──────────────────────────────────────
  {
    id: 'DIAG_11',
    bloque: 'gamificacion',
    texto_es: [
      '*Pregunta 11 de 11* 🎯',
      'Si fueras a tomar un curso corto por WhatsApp sobre cómo cuidar tu salud y el ambiente,',
      '¿cómo te gustaría que fuera?',
      '',
      'A) Que me manden textos largos y serios para leer.',
      'B) Que sea como un juego donde gano puntos, paso niveles y hay personajes de animales.',
      'C) Que solo me manden un video y ya.',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'gamificacion',
    puntaje: { A: 1, B: 3, C: 2 }
  }
];

// ── Clasificación por puntaje total ────────────────────────────────
function clasificarNivel(puntaje) {
  if (puntaje <= 10) return 'basico';
  if (puntaje <= 20) return 'intermedio';
  return 'avanzado';
}

// ── Mensaje de resultado final (fase de prueba — sin curso aún) ───
function mensajeResultado(nivel, nombre, idioma = 'es') {
  const nombreTexto = nombre ? `, *${nombre}*` : '';

  return [
    `✅ *¡Gracias por participar${nombreTexto}!*`,
    '',
    '🌿 Has completado el diagnóstico de alfabetización científica sobre radiación ambiental en Pacayacu.',
    '',
    'Tu participación es muy valiosa para esta investigación.',
    '',
    '━━━━━━━━━━━━━━━━━━━',
    '📲 *Muy pronto...*',
    'Estaremos activando el curso completo por WhatsApp.',
    'Te notificaremos cuando esté listo para que puedas desarrollarlo a tu ritmo desde tu celular.',
    '',
    'El curso incluirá:',
    '🦫 Nivel 1 — Capibara',
    '🦜 Nivel 2 — Guacamayo',
    '🐍 Nivel 3 — Anaconda',
    '🐆 Nivel 4 — Jaguar',
    '━━━━━━━━━━━━━━━━━━━',
    '',

    'Pacayacu, Sucumbíos, Ecuador — 2026'
  ].join('\n');
}

module.exports = { PREGUNTAS_DIAGNOSTICO, clasificarNivel, mensajeResultado };
