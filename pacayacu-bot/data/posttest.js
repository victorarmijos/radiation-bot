// data/posttest.js — 8 preguntas de evaluacion final
// Cubre los 4 niveles: Capibara, Guacamayo, Anaconda, Jaguar
// NO permite reintentos — retroalimentacion y avanza

const PREGUNTAS_POSTTEST = [

  // ── NIVEL 1 — CAPIBARA: Reconocimiento TENORM ─────────────────
  {
    id: 'PT_01',
    nivel_evaluado: 'capibara',
    texto_es: [
      '*PREGUNTA 1 de 8*',
      '',
      'La costra blanquecina que se forma dentro de las tuberías',
      'de los pozos petroleros se llama:',
      '',
      'A) Oxido industrial común',
      'B) TENORM, material radiactivo de origen natural tecnológicamente mejorado',
      'C) Residuo de gasolina solidificada'
    ].join('\n'),
    correcta: 'B',
    puntaje: { A: 0, B: 2, C: 0 },
    retroalimentacion: {
      A: '❌ El óxido es corrosión del metal, no tiene relación con radiactividad.\n\n✅ *Correcto era B:* Esa costra es TENORM — materiales radiactivos de origen natural que suben junto con el petróleo y se concentran en las tuberías.',
      B: '✅ *Correcto!* TENORM es el material radiactivo de origen natural que se concentra como costra dentro de las tuberías petroleras.',
      C: '❌ La gasolina solidificada no forma costras radiactivas.\n\n✅ *Correcto era B:* Esa costra es TENORM — materiales radiactivos que suben con el petróleo desde el subsuelo.'
    }
  },

  // ── NIVEL 1 — CAPIBARA: Detección sin instrumentos ────────────
  {
    id: 'PT_02',
    nivel_evaluado: 'capibara',
    texto_es: [
      '*PREGUNTA 2 de 8*',
      '',
      'Encuentras un tubo metálico viejo cerca de un pozo abandonado.¿Cuál señal visual te indica que puede tener TENORM?',
      '',
      'A) El metal está muy caliente al tacto',
      'B) Tiene un olor fuerte a azufre',
      'C) Tiene una costra blanquecina o amarillenta por dentro o por fuera'
    ].join('\n'),
    correcta: 'C',
    puntaje: { A: 0, B: 0, C: 2 },
    retroalimentacion: {
      A: '❌ La radiación por TENORM no genera calor detectable al tacto.\n\n✅ *Correcto era C:* La señal visual es la costra blanquecina o amarillenta, es el depósito de sales de radio y bario que se acumula en las tuberías.',
      B: '❌ El olor a azufre es característico del petróleo crudo, no de TENORM.\n\n✅ *Correcto era C:* La costra blanquecina o amarillenta es la señal visual clave del TENORM.',
      C: '✅ *Correcto!* La costra blanquecina o amarillenta es el indicador visual del depósito de TENORM en las tuberías petroleras.'
    }
  },

  // ── NIVEL 2 — GUACAMAYO: Contaminación interna vs externa ─────
  {
    id: 'PT_03',
    nivel_evaluado: 'guacamayo',
    texto_es: [
      '*PREGUNTA 3 de 8*',
      '',
      'Un trabajador pasa 8 horas al día cerca de una tubería con TENORM, ¿Qué tipo de exposición está recibiendo?',
      '',
      'A) Contaminación interna por ingestión',
      'B) Irradiación externa por radiación gamma',
      'C) No hay exposición si no la toca'
    ].join('\n'),
    correcta: 'B',
    puntaje: { A: 0, B: 2, C: 0 },
    retroalimentacion: {
      A: '❌ La contaminación interna ocurre cuando partículas entran al cuerpo, no es el caso aquí.\n\n✅ *Correcto era B:* Estar cerca de una fuente emisora sin tocarla es irradiación externa, la radiación gamma atraviesa el aire y llega al cuerpo.',
      B: '✅ *Correcto!* Estar cerca de una fuente TENORM sin tocarla produce irradiación externa, la radiación gamma atraviesa el espacio y llega al organismo.',
      C: '❌ La radiación gamma no requiere contacto físico, viaja por el aire desde la fuente.\n\n✅ *Correcto era B:* Eso es irradiación externa, y ocurre solo por proximidad prolongada.'
    }
  },

  // ── NIVEL 2 — GUACAMAYO: Riesgo de manipulación ───────────────
  {
    id: 'PT_04',
    nivel_evaluado: 'guacamayo',
    texto_es: [
      '*PREGUNTA 4 de 8*',
      '',
      'Alguien corta con amoladora una tubería vieja de un pozo.',
      '¿Por qué esto es especialmente peligroso?',
      '',
      'A) Porque la chispa puede incendiar el TENORM',
      'B) Porque libera polvo fino con partículas radiactivas que se inhalan',
      'C) Porque la electricidad de la amoladora activa la radiación'
    ].join('\n'),
    correcta: 'B',
    puntaje: { A: 0, B: 2, C: 0 },
    retroalimentacion: {
      A: '❌ El TENORM no es inflamable ni explosivo.\n\n✅ *Correcto era B:* Al cortar la tubería se libera polvo de la costra TENORM. Ese polvo contiene partículas alfa y beta que, al inhalarse, producen contaminación interna, el tipo más peligroso de exposición.',
      B: '✅ *Correcto!* Cortar libera polvo radiactivo que al inhalarse entra a los pulmones y emite radiación desde adentro del cuerpo.',
      C: '❌ La electricidad no int eractúa con la radiactividad del material.\n\n✅ *Correcto era B:* El peligro es el polvo de la costra que se inhala, contaminación interna.'
    }
  },

  // ── NIVEL 3 — ANACONDA: Unidades de medición ──────────────────
  {
    id: 'PT_05',
    nivel_evaluado: 'anaconda',
    texto_es: [
      '*PREGUNTA 5 de 8*',
      '',
      'El pozo de Pacayacu emite 1.51 mSv al año.',
      'El límite recomendado en Ecuador para el público es 0.3 mSv.',
      '',
      '¿Qué significa esto?',
      '',
      'A) El pozo emite exactamente el límite permitido',
      'B) El pozo emite casi cinco veces más del límite legal permitido',
      'C) El valor es tan pequeño que no tiene importancia práctica'
    ].join('\n'),
    correcta: 'B',
    puntaje: { A: 0, B: 2, C: 0 },
    retroalimentacion: {
      A: '❌ 1.51 mSv es mayor que 0.3 mSv, no son iguales.\n\n✅ *Correcto era B:* 1.51 mSv supera el límite de 0.3 mSv establecido por Ecuador',
      B: '✅ *Correcto!* 1.51 mSv supera el límite legal de 0.3 mSv. Esto justifica la atención científica y el monitoreo del sitio.',
      C: '❌ Superar el límite legal tiene importancia real para la salud pública a largo plazo.\n\n✅ *Correcto era B:* El pozo supera el límite permitido.'
    }
  },

  // ── NIVEL 3 — ANACONDA: Uso médico de la radiación ────────────
  {
    id: 'PT_06',
    nivel_evaluado: 'anaconda',
    texto_es: [
      '*PREGUNTA 6 de 8*',
      '',
      'Un médico usa radioterapia para tratar el cáncer de un paciente. Teniendo en cuenta la diferencia entre los orígenes de la radiación, ¿cuál de estas afirmaciones es correcta?',
      '',
      'A) Utiliza radiación ionizante generada por fuentes artificiales (como equipos de rayos X de alta energía), en dosis controladas y dirigidas con precisión.',
      'B) Utiliza radiación proveniente exclusivamente de la naturaleza (fondo radiactivo natural), que es concentrada en el hospital.',
      'C) La radioterapia no usa radiación real, solo aplica calor intenso para destruir las células.'
    ].join('\n'),
    correcta: 'A',
    puntaje: { A: 2, B: 0, C: 0 },
    retroalimentacion: {
      A: '✅ *Correcto!* Aunque la radiación ionizante existe en la naturaleza, la radioterapia emplea radiación creada por fuentes artificiales (como reactores o aceleradores lineales) para administrar dosis exactas al tumor.',
      B: '❌ La radioterapia médica no recoge la radiación natural del ambiente.\n\n✅ *La correcta era A:* Utiliza radiación ionizante generada por fuentes artificiales (equipos médicos de alta energía) bajo estrictos controles.',
      C: '❌ La radioterapia sí usa radiación ionizante real, no solo calor.\n\n✅ *La correcta era A:* Utiliza radiación generada de forma artificial y dirigida con precisión al tejido canceroso.'
    }
  },

  // ── NIVEL 4 — JAGUAR: Principio de la dosis ───────────────────
  {
    id: 'PT_07',
    nivel_evaluado: 'jaguar',
    texto_es: [
      '*PREGUNTA 7 de 8*',
      '',
      '"La dosis hace al veneno" es un principio atribuido a Paracelso.',
      '¿Cuál de estas situaciones ilustra mejor ese principio aplicado a la radiación?',
      '',
      'A) Cualquier cantidad de radiación, por mínima que sea, es mortal',
      'B) Una radiografía médica y vivir al lado de un pozo implican el mismo riesgo porque usan el mismo tipo de radiación',
      'C) Una radiografía médica tiene riesgo mínimo por la dosis baja.',
    ].join('\n'),
    correcta: 'C',
    puntaje: { A: 0, B: 0, C: 2 },
    retroalimentacion: {
      A: '❌ Dosis muy bajas como las de la radiación natural de fondo no causan daño detectable.\n\n✅ *Correcto era C:* El principio de Paracelso dice que la dosis determina el efecto. Una radiografía tiene dosis mínima y controlada.',
      B: '❌ El tipo de radiación no es el único factor, la dosis y el tiempo de exposición son igual de importantes.\n\n✅ *Correcto era C:* Mismo fenómeno físico, dosis completamente diferentes, por eso los riesgos son completamente diferentes.',
      C: '✅ *Correcto!* Ese es exactamente el principio de Paracelso: mismo fenómeno, dosis diferentes, efectos diferentes. La dosis y el tiempo de exposición lo determinan todo.'
    }
  },

  // ── NIVEL 4 — JAGUAR: Pensamiento científico crítico ──────────
  {
    id: 'PT_08',
    nivel_evaluado: 'jaguar',
    texto_es: [
      '*PREGUNTA 8 de 8*',
      '',
      'Un vecino dice: "En Pacayacu todos vamos a morir de cáncer por la radiación de los pozos."',
      'Otra persona dice: "Eso es mentira, aquí no pasa nada."',
      '',
      '¿Cuál es la respuesta más científicamente correcta?',
      '',
      'A) El primer vecino tiene razón, la radiación de los pozos es mortal para todos los habitantes.',
      'B) El segundo vecino tiene razón, la radiación natural no representa ningún riesgo.',
      'C) Ambas son generalizaciones sin datos. Lo correcto es preguntar: ¿en qué puntos específicos, cuánta radiación, comparada con qué límites y durante cuánto tiempo?'
    ].join('\n'),
    correcta: 'C',
    puntaje: { A: 0, B: 0, C: 2 },
    retroalimentacion: {
      A: '❌ Afirmar que "todos van a morir" es alarmismo sin datos específicos.\n\n✅ *Correcto era C:* La ciencia requiere datos concretos: ubicación exacta, nivel de emisión, tiempo de exposición. Sin esos datos no se puede concluir nada.',
      B: '❌ Ignorar los datos medidos en los sitios tampoco es correcto.\n\n✅ *Correcto era C:* Ni el alarmismo ni la negación son científicos. La respuesta correcta siempre pide datos específicos antes de concluir.',
      C: '✅ *Correcto!* Ese es el pensamiento científico: ni pánico ni negación. Siempre: datos específicos, ubicación concreta, comparación con límites establecidos.'
    }
  }
];

// Puntaje máximo posible del post-test
const PUNTAJE_MAXIMO_POSTTEST = PREGUNTAS_POSTTEST.reduce(
  (acc, p) => acc + Math.max(...Object.values(p.puntaje)), 0
);

module.exports = { PREGUNTAS_POSTTEST, PUNTAJE_MAXIMO_POSTTEST };
