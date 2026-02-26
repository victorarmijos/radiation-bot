// diagnostico.js — Cuestionario de diagnóstico inicial Zétesis
// Mide: conocimiento sobre radiación + actitudes + entorno
// Formato: una pregunta por mensaje, respuestas A/B/C

const PREGUNTAS_DIAGNOSTICO = [

  // ── BLOQUE 1: ENTORNO Y HÁBITOS (2 preguntas) ──────────────────
  {
    id: 'DIAG_01',
    bloque: 'entorno',
    texto_es: [
      '👋 *¡Bienvenido/a!*',
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
      '👋 *¡Alli shamupay!*',
      'Manarak kallarishpami, kanta riksinkapak munanchik.',
      '',
      '*Tapuy 2 de 8*',
      '¿Maykankaman yacharkanki?',
      '',
      'A) Kallari yachay (1-7)',
      'B) Chawpi yachay (8-13)',
      'C) Hatun yachay',
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
      '¿Mashna kutintak shuk mushuk yachayta yachankapak antanikik kamuyta (celular) kanki?',
      '',
      'A) Mana haykapish (manapash)',
      'B) Maypilla (shuk ishkay kutin tantari punchapi)',
      'C) Kutin kutin (tukuy punchakuna shinami)',
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
      '¿Yachaymanta (ciencia), pachamamamantapash imatatak yuyanki?',
      '',
      'A) Mana munachini, sinchimi kan',
      'B) Sumakmi kan, shinapash mana alli hamutanichu',
      'C) Munanimi, ashkatapash yachankapak munani',
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
      '¿Kikin ayllullaktapi mapayachishkamanta (contaminación) kawsay pachamantapash uyashkankichu?',
      '',
      'A) Mana haykapish imatapash uyashkanichu',
      'B) Ashatami uyashkani, shinapash mana ashtakata yachanichu',
      'C) Ari, ayllullaktapi kutin kutin rimanchikmi',
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
      '¿"Radiación" shimita uyashkankichu?',
      '',
      'A) Mana, mana haykapish',
      'B) Ari, shinapash imami kan mana yachanichu',
      'C) Ari, imami kan ashatami yachani',
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
      '¿Radiación imatak kan yuyanki?',
      '',
      'A) Antawayra wasikunamanta llukshik llakichikllami kan',
      'B) Pachamama charishka, shinallatak runa rurashka ushaymi (energía) kan',
      'C) Antanikik (celular), wifi nishka uykunallami kan',
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
      '¿Ecuador mamallakta Amasunikapi (Amazonía) pachamamamanta radiación tiyanchu yuyanki?',
      '',
      'A) Mana, kaypika imasami radiación mana tiyanchu',
      'B) Mana yachanichu, mana chaymanta yuyashkanichu',
      'C) Ari, tukuy Allpapika pachamamamanta radiación tiyanmi',
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
      '*Tapuy 8 de 8 — ¡Tukurimi!* 🎯',
      '¿Pachamama radiacionwan runa rurashka radiacionwan imatak chikan kan?',
      '',
      'A) Mana chikan kanchu, tukuy radiacionmi llakichik kan',
      'B) Pachamama radiacionka Allpamanta hawa pachamantapash shamun; runa rurashkataka ñukanchikmi rurarkanchik',
      'C) Pachamama radiacionmi llakichik kan, runa rurashkaka allimi kan',
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
        'e imágenes.',
        '',
        'No te preocupes — ¡aprenderás mucho! 💪',
        '',
        'Escribe *INICIAR* para comenzar tu primera lección.'
      ].join('\n'),
      ki: [
        '🌱 *Kutichishkamanta yupaychani*',
        '',
        'Kikinpa kallari yachayka: Maskakmi kan,',
        'Kallarimantami, pisi pisilla rurashun, shuyukunawanpash alli hamutankapak',
        'Ama llakikuychu — ¡ashkatami yachakunki! 💪',
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
        'Kikinpa kallari yachayka: Taripukmi kan.',
        'Ñami ashataka yachanki. Ashtawan utka rishun,',
        'minishtishka yachaykunatapash ashtawan riksishun.',
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
        '🏆 *¡Ashtawan allimi!*',
        '',
        'Kikinpa kallari yachayka: Ayllullakta Yachayukmi kan',
        'Alli yachaykunatami charinki. Ashtawan sinchi',
        'yachaykunata, ruranakunatapash kunchikmi.',
        '',
        'Escribe *INICIAR* yachana kallarinkapak.'
      ].join('\n')
    }
  };
  return mensajes[nivel][idioma] || mensajes[nivel]['es'];
}

module.exports = { PREGUNTAS_DIAGNOSTICO, clasificarNivel, mensajeResultado };