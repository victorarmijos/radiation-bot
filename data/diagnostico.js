// diagnostico.js — Cuestionario de diagnóstico inicial Zétesis
// Mide: conocimiento sobre radiación + actitudes + entorno
// Formato: una pregunta por mensaje, respuestas A/B/C

const PREGUNTAS_DIAGNOSTICO = [

  // ── BLOQUE 1: ENTORNO Y HÁBITOS (2 preguntas) ──────────────────
  {
    id: 'DIAG_01',
    bloque: 'entorno',
    texto_es: [
      '👋 *¡Bienvenido/a a Zétesis!*',
      'Antes de comenzar, queremos conocerte mejor.',
      'Son solo 8 preguntas rápidas. 🌿',
      '',
      '*Pregunta 1 de 8*',
      '¿Hasta qué grado estudiaste?',
      '',
      'A) Primaria (1ro - 7mo)',
      'B) Secundaria (8vo - 13vo)',
      'C) Superior o Universidad',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    texto_ki: [
      '👋 *¡Shamupaymi Zétesis-pi!*',
      'Ñawpakman, imatak kanki yachana munanchimi.',
      '',
      '*Tapuy 1 de 8*',
      '¿Maykankama yacharkankichu?',
      '',
      'A) Ñawpa yachana (1-7)',
      'B) Chawpi yachana (8-13)',
      'C) Hatun yachana',
      '',
      'A, B o C nishpa kutichiy 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'entorno',
    puntaje: { A: 0, B: 1, C: 2 }
  },

  {
    id: 'DIAG_02',
    bloque: 'entorno',
    texto_es: [
      '*Pregunta 2 de 8*',
      '¿Con qué frecuencia usas el celular para aprender algo nuevo?',
      '',
      'A) Nunca o casi nunca',
      'B) A veces (1-2 veces por semana)',
      'C) Seguido (casi todos los días)',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    texto_ki: [
      '*Tapuy 2 de 8*',
      '¿Mashna kutimi celularwan yachankichu?',
      '',
      'A) Mana imaypipas',
      'B) Maypipas (semana 1-2 kuti)',
      'C) Tukuy puncha',
      '',
      'A, B o C nishpa kutichiy 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'entorno',
    puntaje: { A: 0, B: 1, C: 2 }
  },

  // ── BLOQUE 2: ACTITUDES HACIA LA CIENCIA (2 preguntas) ─────────
  {
    id: 'DIAG_03',
    bloque: 'actitud',
    texto_es: [
      '*Pregunta 3 de 8*',
      '¿Qué piensas sobre la ciencia y la naturaleza?',
      '',
      'A) No me interesa mucho, es muy difícil',
      'B) Me parece interesante pero no la entiendo bien',
      'C) Me gusta y quisiera aprender más',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    texto_ki: [
      '*Tapuy 3 de 8*',
      '¿Imatam yuyankichu yachaykunamanta?',
      '',
      'A) Mana munanichu, mancharinimi',
      'B) Alimi kan, mana allimi yachanichu',
      'C) Munani, achkata yachana munani',
      '',
      'A, B o C nishpa kutichiy 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'actitud',
    puntaje: { A: 0, B: 1, C: 2 }
  },

  {
    id: 'DIAG_04',
    bloque: 'actitud',
    texto_es: [
      '*Pregunta 4 de 8*',
      '¿Has escuchado hablar sobre contaminación o medio ambiente en tu comunidad?',
      '',
      'A) Nunca he escuchado nada',
      'B) He escuchado algo pero no sé mucho',
      'C) Sí, lo conversamos seguido en la comunidad',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    texto_ki: [
      '*Tapuy 4 de 8*',
      '¿Pachamamamanta rimashkata uyarirkankichu?',
      '',
      'A) Mana imaypipas',
      'B) Uyarirkami, mana allimi yachanichu',
      'C) Ari, ayllupi rimanchimi',
      '',
      'A, B o C nishpa kutichiy 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'actitud',
    puntaje: { A: 0, B: 1, C: 2 }
  },

  // ── BLOQUE 3: CONOCIMIENTO SOBRE RADIACIÓN (4 preguntas) ───────
  {
    id: 'DIAG_05',
    bloque: 'conocimiento',
    texto_es: [
      '*Pregunta 5 de 8*',
      '¿Has escuchado la palabra "radiación"?',
      '',
      'A) No, nunca',
      'B) Sí, pero no sé qué significa',
      'C) Sí, y sé algo sobre lo que es',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    texto_ki: [
      '*Tapuy 5 de 8*',
      '¿"Radiación" niskata uyarirkankichu?',
      '',
      'A) Mana, mana imaypipas',
      'B) Ari, mana yachanichu imami kan',
      'C) Ari, yachaniми imami kan',
      '',
      'A, B o C nishpa kutichiy 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'conocimiento',
    puntaje: { A: 0, B: 1, C: 2 }
  },

  {
    id: 'DIAG_06',
    bloque: 'conocimiento',
    texto_es: [
      '*Pregunta 6 de 8*',
      '¿Qué crees que es la radiación?',
      '',
      'A) Solo algo peligroso de las plantas nucleares',
      'B) Una forma de energía que existe en la naturaleza y también la creamos',
      'C) Solo las ondas del celular y el wifi',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    texto_ki: [
      '*Tapuy 6 de 8*',
      '¿Imatam radiación kan ninki?',
      '',
      'A) Llaki kaspillami plantas nuclearesmanta',
      'B) Pachamama ukupi tiyak energia',
      'C) Celular wifi señalkunalla',
      '',
      'A, B o C nishpa kutichiy 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'conocimiento',
    correcta: 'B',
    puntaje: { A: 0, B: 2, C: 0 }
  },

  {
    id: 'DIAG_07',
    bloque: 'conocimiento',
    texto_es: [
      '*Pregunta 7 de 8*',
      '¿Crees que en la Amazonía ecuatoriana existe radiación natural?',
      '',
      'A) No, aquí no hay radiación de ningún tipo',
      'B) No sé, nunca había pensado en eso',
      'C) Sí, en toda la Tierra existe radiación natural de fondo',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    texto_ki: [
      '*Tapuy 7 de 8*',
      '¿Ecuador Amazoníapi radiación natural tiyankichu?',
      '',
      'A) Mana, kaypi mana radiación kanchu',
      'B) Mana yachanichu',
      'C) Ari, tukuy pachapi radiación natural tiyami',
      '',
      'A, B o C nishpa kutichiy 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'conocimiento',
    correcta: 'C',
    puntaje: { A: 0, B: 1, C: 2 }
  },

  {
    id: 'DIAG_08',
    bloque: 'conocimiento',
    texto_es: [
      '*Pregunta 8 de 8 — ¡Última!* 🎯',
      '¿Qué diferencia hay entre radiación natural y artificial?',
      '',
      'A) No hay diferencia, toda radiación es igual de peligrosa',
      'B) La natural viene de la Tierra y el cosmos; la artificial la creamos los humanos',
      'C) La natural es peligrosa y la artificial es segura',
      '',
      'Responde con A, B o C 👇'
    ].join('\n'),
    texto_ki: [
      '*Tapuy 8 de 8 — ¡Kipalla!* 🎯',
      '¿Imatam radiación natural artificial tukuymanta chikan kan?',
      '',
      'A) Mana chikanchu, tukuymi llaki',
      'B) Natural pachamamamanta, artificial runakunami ruranchi',
      'C) Natural llaki, artificial allimi',
      '',
      'A, B o C nishpa kutichiy 👇'
    ].join('\n'),
    opciones: ['A', 'B', 'C'],
    tipo: 'conocimiento',
    correcta: 'B',
    puntaje: { A: 0, B: 2, C: 0 }
  }
];

// ── Clasificación por puntaje total ────────────────────────────────
// Puntaje máximo: 16 puntos
function clasificarNivel(puntaje) {
  if (puntaje <= 5)  return 'basico';
  if (puntaje <= 11) return 'intermedio';
  return 'avanzado';
}

// ── Mensaje de resultado según nivel ───────────────────────────────
function mensajeResultado(nivel, idioma = 'es') {
  const mensajes = {
    basico: {
      es: [
        '🌱 *¡Gracias por responder!*',
        '',
        'Tu nivel de inicio es: *Explorador/a*',
        'Comenzaremos desde lo básico con explicaciones simples,',
        'imágenes y audios en español y kichwa.',
        '',
        'No te preocupes — ¡aprenderás mucho! 💪',
        '',
        'Escribe *INICIAR* para comenzar tu primera lección.'
      ].join('\n'),
      ki: [
        '🌱 *¡Kutichishkamanta pagui!*',
        '',
        'Kan kanka: *Mashkak*',
        'Ñawpakta yachachishun.',
        '',
        'Escribe *INICIAR* yachana kallarinkapak.'
      ].join('\n')
    },
    intermedio: {
      es: [
        '🌿 *¡Muy bien!*',
        '',
        'Tu nivel de inicio es: *Investigador/a*',
        'Ya tienes algunas bases. Iremos más rápido',
        'y profundizaremos en los temas que necesitas.',
        '',
        'Escribe *INICIAR* para comenzar tu primera lección.'
      ].join('\n'),
      ki: [
        '🌿 *¡Allimi!*',
        '',
        'Kan kanka: *Maskak*',
        'Yachaykunata charinkiми.',
        '',
        'Escribe *INICIAR* yachana kallarinkapak.'
      ].join('\n')
    },
    avanzado: {
      es: [
        '🏆 *¡Excelente!*',
        '',
        'Tu nivel de inicio es: *Científico/a Comunitario/a*',
        'Tienes buenos conocimientos. Te daremos contenido',
        'más detallado y desafíos avanzados.',
        '',
        'Escribe *INICIAR* para comenzar tu primera lección.'
      ].join('\n'),
      ki: [
        '🏆 *¡Sumakmi!*',
        '',
        'Kan kanka: *Yachak*',
        'Allimi yachankiми.',
        '',
        'Escribe *INICIAR* yachana kallarinkapak.'
      ].join('\n')
    }
  };
  return mensajes[nivel][idioma] || mensajes[nivel]['es'];
}

module.exports = { PREGUNTAS_DIAGNOSTICO, clasificarNivel, mensajeResultado };