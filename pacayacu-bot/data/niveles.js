// data/niveles.js — 2-3 subniveles cortos por nivel antes del quiz
// Correctas: N1=C, N2=A, N3=B, N4=A

const LINK_CONTENIDO_ADICIONAL = 'https://radiation-bot.onrender.com/recursos';

const NIVELES = {

  // ══════════════════════════════════════
  // NIVEL 1 — CAPIBARA — Correcta: C
  // ══════════════════════════════════════
  capibara: {
    id: 'capibara', numero: 1, animal: 'Capibara',
    etapa_inicio: 'nivel1_msg1', etapa_fin: 'nivel1_completado',
    siguiente_nivel: 'guacamayo', siguiente_etapa: 'nivel2_msg1',

    mensajes: {
      nivel1_msg1: {
        texto: [
          '🦫 *Hola, soy Capi tu primer guía.*',
          '',
          'La palabra "radiación" asusta,',
          'pero es simplemente *energía que viaja por el espacio* en forma de ondas o partículas.',
          '',
          'Existen dos tipos:',
          '📶 *No ionizante*: Radiación de baja energía. Cuando entra en contacto con la materia, provoca principalmente calor o vibraciones. Ejemplos: Luz visible, Wi-Fi, radio, microondas, etc. ¡Sin ella no hay tecnología de comunicación inalámbrica!.',
          '',
          '⚡ *Ionizante:* Tiene mucha energía y requiere cuidado. Aquí entran los rayos X y la radiación gamma (que es muy penetrante) capaz de arrancar los electrones de los átomos y moléculas. ',
          '',
          'Convivimos con ambas desde el comienzo del Universo.'
        ].join('\n'),
        siguiente: 'nivel1_msg2'
      },

      nivel1_msg2: {
        texto: [
          '🦫 *Capi te cuenta:*',
          '',
          'Desde el auge del petróleo en Ecuador en 1972, al extraerlo, minerales del subsuelo suben y concentran materiales radiactivos de origen natural (NORM), como las *costras blanquecina* en los tubos.',
          '',
          'A eso la ciencia lo llama *TENORM* ☢️.Parece óxido normal, ese es el problema.',
          '',
          'El riesgo no está en toda la zona.',
          '*Es localizado en puntos específicos.*'
        ].join('\n'),
        siguiente: 'nivel1_msg3'
      },

      nivel1_msg3: {
        texto: [
          '🦫 *Regla de Oro del Capibara:*',
          '',
          'Si ves un tubo viejo de pozo petrolero:',
          '⚠️ Costra blanca o amarilla → *no tocar*',
          '⚠️ Botado sin señalización → *alejarse*',
          '🛑 Alguien quiere reutilizarlo → *comparte lo que sabes*',
          '',
          'Reutilizarlos para cercas o cimientos expone a la familia sin saberlo.',
        ].join('\n'),
        siguiente: 'nivel1_quiz'
      }
    },

    quiz: {
      etapa: 'nivel1_quiz',
      pregunta: [
        '*MISIÓN CAPIBARA* 🦫 — 🌟10 pts',
        '',
        'Tu vecino quiere usar tubos viejos de pozo para construir una cerca en su finca.',
        '',
        '*¿Qué le recomiendas?*',
        '',
        'A) Que los lave bien antes de usarlos.',
        'B) Que los pinte para sellar la costra.',
        'C) Que no los use, pueden tener TENORM y exponer a su familia las 24 horas.'
      ].join('\n'),
      correcta: 'C',
      respuestas: {
        A: {
          texto: '🦫 *Capi:* Lavar puede disolver el TENORM y esparcirlo en el agua o suelo.La mejor protección: no manipularlos.\n\nIntenta de nuevo: A, B o C',
          puntaje: 0, correcto: false
        },
        B: {
          texto: '🦫 *Capi:* La pintura no bloquea la radiación gamma. Esta atraviesa capas superficiales sin problema.\n\nIntenta de nuevo: A, B o C',
          puntaje: 0, correcto: false
        },
        C: {
          texto: '✅ *¡Correcto!*\n🦫 *Capi:* ¡La decisión más inteligente!\nInformar a la comunidad es hacer ciencia ciudadana.\n\n🏆 *INSIGNIA CAPIBARA* 🌟+10 pts',
          puntaje: 2, correcto: true
        }
      }
    },

    insignia: [
      '🦫 *NIVEL 1 COMPLETADO* — 🌟+10 pts',
      '',
      '📚 _Eje Temático:_ Espectro electromagnético y diferenciación entre radiación ionizante y no ionizante.',
      '🎯 _Competencia:_ Clasificación de fuentes energéticas y superación de la barrera de percepción inicial frente a la terminología física.'
    ].join('\n')
  },

  // ══════════════════════════════════════
  // NIVEL 2 — GUACAMAYO — Correcta: A
  // ══════════════════════════════════════
  guacamayo: {
    id: 'guacamayo', numero: 2, animal: 'Guacamayo Rojo',
    etapa_inicio: 'nivel2_msg1', etapa_fin: 'nivel2_completado',
    siguiente_nivel: 'anaconda', siguiente_etapa: 'nivel3_msg1',

    mensajes: {
      nivel2_msg1: {
        texto: [
          '🦜 *¡Hola! Soy Guaca.*',
          'Volaremos sobre los mitos.',
          '',
          '¿Sabías que a nuestro alrededor existe radiación que no se puede ver?, Esto es lo que llamamos el fondo radiactivo natural.',
          'Pero, *¿Toda la radiación viene de la naturaleza?* 🤔',
          '¡No! Algunas fuentes de radiación son naturales, pero otras son creadas por el ser humano. Por ejemplo, la radioterapia que se usa en hospitales para tratar el cáncer utiliza radiación producida con tecnología especial. 🏥⚛️',
          'También hay fuentes de radiación en el entorno son naturales, pero que pueden ser concentradas, como los tubos de los pozos petroleros.',
          'Y eso es lo que nos preocupe en Pacayacu.',
          'Hay dos formas de exponerse al TENORM:',
          '',
          '1️⃣ *Externa* — la energía viaja por el aire.',
          '2️⃣ *Interna* — partículas entran al cuerpo.',
          '',
          'Son distintas y se previenen distinto.'
        ].join('\n'),
        siguiente: 'nivel2_msg2'
      },

      nivel2_msg2: {
        texto: [
          '🦜 *Guaca explica cada tipo:*',
          '',
          '*1️⃣ Externa:*',
          'La energía sale del tubo como luz invisible.',
          '🛡️ Tu escudo: *alejarte* y no reutilizar los tubos.',
          '',
          '*2️⃣ Interna* ⚠️:',
          'Cortar o lijar los tubos viejos de los pozos puede liberar polvo radiactivo.',
          'Si se inhala, entra a los pulmones y se queda.',
          '🛑 *Nunca cortes tuberías viejas de pozos*, sin saber su historia.',
          '',
          'Dejar los residuos en su lugar',
          'reduce tu riesgo casi a cero.'
        ].join('\n'),
        siguiente: 'nivel2_quiz'
      }
    },

    quiz: {
      etapa: 'nivel2_quiz',
      pregunta: [
        '*MISIÓN GUACAMAYO* 🦜 — 🌟20 pts',
        '',
        'Una familia usa tubos viejos de pozo como cerca y viven a pocos metros de esos tubos',
        '',
        '*¿Cuál es el riesgo principal?*',
        '',
        'A) Reciben radiación externa continua día y noche.',
        'B) Solo hay riesgo si tocan los tubos directamente.',
        'C) El riesgo es solo para los niños, no los adultos.'
      ].join('\n'),
      correcta: 'A',
      respuestas: {
        A: {
          texto: '✅ *¡Excelente vuelo!*\n🦜 *Guaca:* La radiación gamma viaja por el aire sin necesitar contacto físico.\nVivir cerca 24 horas acumula exposición.\n\n🏆 *INSIGNIA GUACAMAYO* 🌟+20 pts',
          puntaje: 2, correcto: true
        },
        B: {
          texto: '🦜 *Guaca:* No requiere contacto, la energía viaja por el aire continuamente. El tiempo de exposición es el factor clave.\n\nIntenta de nuevo: A, B o C',
          puntaje: 0, correcto: false
        },
        C: {
          texto: '🦜 *Guaca:* La radiación gamma afecta a todos.El factor principal no es la edad, es el tiempo cercano a la fuente.\n\nIntenta de nuevo: A, B o C',
          puntaje: 0, correcto: false
        }
      }
    },

    insignia: [
      '🦜 *NIVEL 2 COMPLETADO* — 🌟+20 pts',
      '',
      '📚 _Eje Temático:_ Radiación Natural vs. TENORM',
      '🎯 _Competencia:_ Diferenciación entre fenómenos radiactivos endémicos del ambiente y pasivos ambientales de origen antropogénico.'
    ].join('\n')
  },

  // ══════════════════════════════════════
  // NIVEL 3 — ANACONDA — Correcta: B
  // ══════════════════════════════════════
  anaconda: {
    id: 'anaconda', numero: 3, animal: 'Anaconda Verde',
    etapa_inicio: 'nivel3_msg1', etapa_fin: 'nivel3_completado',
    siguiente_nivel: 'jaguar', siguiente_etapa: 'nivel4_msg1',

    mensajes: {
      nivel3_msg1: {
        texto: [
          '🐍 Ssss... Soy Ana. Ha llegado el momento de hablar de cómo medimos la radiación cuando ingresa al cuerpo (contaminación interna) o nos expone desde afuera (irradiación externa)',
          'Todo se puede medir, también la radiación.',
          '',
          'Existen dos formas de medirla que no debes confundir:',
          '📏 *Actividad (Bq)*: Medimos la radiación que emite el material radiactivo en Becquerelios', 
          '🩺 *Afectación biológica (mSv)*: Medimos el efecto biológico o el daño como consecuencia de esa radiación en nuestro cuerpo en milisieverts..',
          '',
          'Para que te ubiques:',
          '',
          '🍌 Comer un plátano → 0.0001 mSv, eso no significa que sea peligroso',
          '✈️ Vuelo Quito-Madrid → 0.08 mSv, puedes volar sin miedo',
          '🩻 Radiografía médica → 0.1 mSv, es una dosis controlada',
          '🌎 Dosis efectiva global → 1 mSv/año, dosis máxima anual recomendada',
          '🩺 Tomografía (CT scan) →  1-10mSv, dosis controlada con beneficio claro',
          '',
          'Cuando sabemos la medida exacta, podemos decidir sin pánico.',
          '',
        ].join('\n'),
        siguiente: 'nivel3_msg2'
      },

      nivel3_msg2: {
        texto: [
          '🐍 *Ana te muestra los datos de Pacayacu:*',
          '',
          'Científicos midieron radiación en *77 puntos de la parroquia Pacayacu en Sucumbíos, pozos, vías y fincas.',
          '',
          '✅ *Mayoría de puntos:* niveles normales y seguros.',
          '⚠️ *Pozo SHR-04:* superó el límite de 0.3 mSv, medido a 5cm del cerramiento del pozo, superando lo establecido por las autoridades ecuatorianas.',
          '',
          'Conclusión científica:',
          'El riesgo en Pacayacu es *real pero localizado*. No toda la zona, solo en algunos puntos específicos.',
        ].join('\n'),
        siguiente: 'nivel3_quiz'
      }
    },

    quiz: {
      etapa: 'nivel3_quiz',
      pregunta: [
        '*MISIÓN ANACONDA* 🐍 — 🌟30 pts',
        '',
        'Un vecino dice: "La radiografía me va a enfermar igual que los pozos de Pacayacu.',
        '',
        '*¿Cuál es la respuesta más objetiva?*',
        '',
        'A) Tiene razón, cualquier radiación acumula y enferma.',
        'B) No es correcto: 0.1 mSv de radiografía es una dosis controlada con beneficio claro. No es lo mismo que exposición crónica.',
        'C) Depende, en jóvenes la radiografía sí es peligrosa.'
      ].join('\n'),
      correcta: 'B',
      respuestas: {
        A: {
          texto: '🐍 *Ana:* No toda dosis produce daño, 0.1 mSv es manejado normalmente por el cuerpo. El contexto y la dosis lo cambian todo.\n\nIntenta de nuevo: A, B o C',
          puntaje: 0, correcto: false
        },
        B: {
          texto: '✅ *¡Genio de los datos!*\n🐍 *Ana:* Exposición controlada con beneficio claro. \n¡La dosis y el contexto son la clave!\n\n🏆 *INSIGNIA ANACONDA* 🌟+30 pts',
          puntaje: 2, correcto: true
        },
        C: {
          texto: '🐍 *Ana:* El factor clave siempre es la cantidad de energía y el contexto, no la edad del paciente.\n\nIntenta de nuevo: A, B o C',
          puntaje: 0, correcto: false
        }
      }
    },

    insignia: [
      '🐍 *NIVEL 3 COMPLETADO* — 🌟+30 pts',
      '',
      '📚 _Eje Temático:_ Rutas de Exposición y Dosimetría: Irradiación externa vs. contaminación interna por material particulado proveniente de tuberías petroleras. Uso del Sievert (mSv).',
      '🎯 _Competencia:_ Identificación de mecanismos de transferencia de energía y estimación crítica del riesgo basado en proximidad y tiempo.'
    ].join('\n')
  },

  // ══════════════════════════════════════
  // NIVEL 4 — JAGUAR — Correcta: A
  // ══════════════════════════════════════
  jaguar: {
    id: 'jaguar', numero: 4, animal: 'Jaguar',
    etapa_inicio: 'nivel4_msg1', etapa_fin: 'nivel4_completado',
    siguiente_nivel: null, siguiente_etapa: 'programa_completado',

    mensajes: {
      nivel4_msg1: {
        texto: [
          '🐆 *¡Llegaste a la cima! Soy el Jaguar.*',
          '',
          'Principio científico clave:',
          '"La dosis hace al veneno." Paracelso',
          '',
          '💧 Mucha agua puede matar',
          '☀️ Mucho sol daña la piel',
          '☢️ Radiación en dosis bajas el cuerpo la tolera, nos ayuda en tratamientos médicos, radiografías, etc',
          '',
          'La pregunta correcta ante cualquier riesgo:',
          '¿Cuánto hay y dónde exactamente?'
        ].join('\n'),
        siguiente: 'nivel4_msg2'
      },

      nivel4_msg2: {
        texto: [
          '🐆 *El Jaguar te da tu superpoder:*',
          '',
          'Los habitantes de Pacayacu conocen su territorio mejor que nadie.',
          'Saben dónde hay tubos viejos, dónde cambió el agua, qué desapareció.',
          '',
          'Eso se llama *ciencia ciudadana*.',
          '',
          'Tu observación + datos científicos = verdad.',
          '',
          'Al participar en este programa ya estás haciendo ciencia.'
        ].join('\n'),
        siguiente: 'nivel4_quiz'
      }
    },

    quiz: {
      etapa: 'nivel4_quiz',
      pregunta: [
        '*MISIÓN FINAL — JAGUAR* 🐆 — 🌟40 pts',
        '',
        'Dos vecinos discuten:',
        '- "Toda Pacayacu es zona peligrosa."',
        '- "Aquí no pasa absolutamente nada."',
        '',
        '*¿Cuál es la postura más científica?*',
        '',
        'A) Ninguna: ambas generalizan sin datos. Lo correcto: ¿dónde exactamente?, ¿cuánto?, ¿comparado con qué límite?',
        'B) El primero, es mejor prevenir.',
        'C) El segundo, la radiación natural no daña.'
      ].join('\n'),
      correcta: 'A',
      respuestas: {
        A: {
          texto: '✅ *¡Guardián de la Amazonía!*\n🐆 *Jaguar:* La mayoría de Pacayacu es segura. El pozo SHR-04 sí supera el límite, eso es real. Ni pánico ni negación: datos específicos siempre.\n\n🏆 *EMBLEMA JAGUAR* 🌟+40 pts',
          puntaje: 2, correcto: true
        },
        B: {
          texto: '🐆 *Jaguar:* Los estudios muestran que la mayoría de Pacayacu tiene niveles normales. El riesgo es localizado, no generalizado.\n\nIntenta de nuevo: A, B o C',
          puntaje: 0, correcto: false
        },
        C: {
          texto: '🐆 *Jaguar:* El pozo SHR-04 superó el límite, esa evidencia es real. Ignorarla no protege a nadie.\n\nIntenta de nuevo: A, B o C',
          puntaje: 0, correcto: false
        }
      }
    },

    insignia: [
      '🐆 *NIVEL 4 COMPLETADO* — 🌟+40 pts',
      '',
      '📚 _Eje Temático:_ Protocolos de Actuación y Ciencia Ciudadana: El principio de dosis-respuesta. Adopción de conductas seguras frente a la manipulación mecánica de material industrial.',
      '🎯 _Competencia:_ Resolución de dilemas comunitarios mediante evidencia dosimétrica, evitando sesgos de negación o pánico generalizado.',
      '',
      '🎓 *Eres Agente de Cambio de Pacayacu:*',
      '🦫 N1 — Clasificación de fuentes energéticas',
      '🦜 N2 — Diferenciación de fenómenos radiactivos',
      '🐍 N3 — Estimación crítica del riesgo',
      '🐆 N4 — Resolución de dilemas con evidencia',
      '',
      '━━━━━━━━━━━━━━━━━',
      `📚 Más info: ${LINK_CONTENIDO_ADICIONAL}`
    ].join('\n')
  }
};

// Mapa de etapas
const ETAPA_A_NIVEL = {};
for (const [nivelId, nivel] of Object.entries(NIVELES)) {
  for (const etapa of Object.keys(nivel.mensajes)) {
    ETAPA_A_NIVEL[etapa] = nivelId;
  }
  ETAPA_A_NIVEL[nivel.quiz.etapa] = nivelId;
}

module.exports = { NIVELES, ETAPA_A_NIVEL };
