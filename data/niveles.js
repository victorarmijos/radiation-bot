// data/niveles.js — 4 niveles sintetizados
// Correctas distribuidas: N1=C, N2=A, N3=B, N4=A
// Ninguna respuesta correcta es obvia por posición

const NIVELES = {

  // ══════════════════════════════════════════
  // NIVEL 1 — CAPIBARA — Correcta: C
  // ══════════════════════════════════════════
  capibara: {
    id: 'capibara', numero: 1, animal: 'Capibara',
    etapa_inicio: 'nivel1_msg1', etapa_fin: 'nivel1_completado',
    siguiente_nivel: 'guacamayo', siguiente_etapa: 'nivel2_msg1',

    mensajes: {
      nivel1_msg1: {
        texto: [
          '👋 Hola! Soy *Capi*, tu guía.',
          '',
          'En Sucumbíos todos conocen el petróleo 🛢️.',
          'Pero la industria dejó otro peligro — invisible.',
          '',
          '☢️ Se llama *RADIACIÓN*.',
          'No se ve, no huele, no hace ruido.',
          'Está atrapada en los tubos viejos de los pozos.',
          '',
          'Escribe *SIGUIENTE*. _(1 de 3)_'
        ].join('\n'),
        siguiente: 'nivel1_msg2'
      },

      nivel1_msg2: {
        texto: [
          'La radiación *no es de otro mundo* 🌎.',
          'Está en el suelo, en el sol, en el banano 🍌.',
          '',
          'Lo que importa es *CUÁNTA* hay.',
          'Igual que el sol: un rato es bueno, horas te quema.',
          '',
          'Cuando se saca petróleo, suben minerales radiactivos',
          'que forman una *costra blanquecina* en las tuberías.',
          'A eso se llama *TENORM* ☢️.',
          '',
          'Parece óxido normal. Ese es el peligro.',
          '',
          'Escribe *SIGUIENTE*. _(2 de 3)_'
        ].join('\n'),
        siguiente: 'nivel1_msg3'
      },

      nivel1_msg3: {
        texto: [
          '*Regla del Capibara* 🦫:',
          '',
          'Si ves un tubo viejo de pozo petrolero:',
          '⚠️ Costra blanca o amarilla → *No tocar*',
          '⚠️ Botado sin señalización → *Alejarse*',
          '🛑 Alguien lo quiere reutilizar → *DETENER*',
          '',
          'Reutilizar esos tubos para cercas, cimientos o riego',
          'expone a toda la familia sin saberlo.',
          '',
          'Escribe *QUIZ* para ganar tu insignia. _(3 de 3)_'
        ].join('\n'),
        siguiente: 'nivel1_quiz'
      }
    },

    quiz: {
      etapa: 'nivel1_quiz',
      pregunta: [
        '*PREGUNTA — Nivel 1* 🤓',
        '',
        'Tu vecino encontró tubos viejos cerca de un pozo',
        'y quiere usarlos para construir una cerca.',
        '',
        '*¿Qué le recomiendas?*',
        '',
        'A) Que los lave bien antes de usarlos, así elimina el riesgo.',
        'B) Que los pinte para sellar la costra y ya no hay peligro.',
        'C) Que no los use — pueden tener TENORM radiactivo\n   y exponer a su familia las 24 horas del día.'
      ].join('\n'),
      correcta: 'C',
      respuestas: {
        A: {
          texto: '❌ Lavar disuelve el TENORM directamente en el agua.\nEso es más peligroso que dejarlo quieto.\n\nIntenta de nuevo: A, B o C',
          puntaje: 0, correcto: false
        },
        B: {
          texto: '❌ La pintura no bloquea la radiación gamma.\nEsta atraviesa cualquier capa superficial.\n\nIntenta de nuevo: A, B o C',
          puntaje: 0, correcto: false
        },
        C: {
          texto: '✅ *Correcto!* Los tubos viejos de pozos no deben reutilizarse.\nEl TENORM emite radiación continua cerca de quien vive ahí.\n\n🦫 *INSIGNIA DEL CAPIBARA DESBLOQUEADA*\n\nEscribe *SIGUIENTE* para el Nivel 2.',
          puntaje: 2, correcto: true
        }
      }
    },

    insignia: '🦫 *NIVEL 1 COMPLETADO*\nInsignia del Capibara desbloqueada.\n\nEscribe *SIGUIENTE* para el Nivel 2: El Guacamayo 🦜'
  },

  // ══════════════════════════════════════════
  // NIVEL 2 — GUACAMAYO — Correcta: A
  // ══════════════════════════════════════════
  guacamayo: {
    id: 'guacamayo', numero: 2, animal: 'Guacamayo Rojo',
    etapa_inicio: 'nivel2_msg1', etapa_fin: 'nivel2_completado',
    siguiente_nivel: 'anaconda', siguiente_etapa: 'nivel3_msg1',

    mensajes: {
      nivel2_msg1: {
        texto: [
          '🦜 Ahora tienes la visión del *Guacamayo*.',
          '',
          'Hay dos formas en que la radiación afecta al cuerpo.',
          '',
          '*TIPO 1 — EXTERNA:*',
          'La radiación gamma sale del tubo y atraviesa tu cuerpo.',
          'No la sientes. El daño se acumula con el tiempo.',
          'Clave: *alejarte* y *reducir el tiempo* cerca.',
          '',
          'Escribe *SIGUIENTE*. _(1 de 2)_'
        ].join('\n'),
        siguiente: 'nivel2_msg2'
      },

      nivel2_msg2: {
        texto: [
          '*TIPO 2 — INTERNA* ⚠️ (la más peligrosa)',
          '',
          'Al *cortar, lijar o soldar* un tubo con TENORM',
          'se libera polvo radiactivo al aire.',
          '',
          'Si lo *respiras* → entra a tus pulmones y se queda.',
          'Emite radiación desde adentro, sin que lo sientas.',
          '',
          '🛑 *NUNCA* cortes tuberías viejas de pozos petroleros.',
          '',
          'No es culpa de quien lo hace — es falta de información.',
          '*Por eso estamos aquí.*',
          '',
          'Escribe *QUIZ* para tu evaluación. _(2 de 2)_'
        ].join('\n'),
        siguiente: 'nivel2_quiz'
      }
    },

    quiz: {
      etapa: 'nivel2_quiz',
      pregunta: [
        '*PREGUNTA — Nivel 2*',
        '',
        'Una persona vive en una casa donde el cerco',
        'está hecho de tuberías viejas de un pozo cercano.',
        '',
        '*¿Cuál es el riesgo principal?*',
        '',
        'A) Recibe radiación externa continua día y noche\n   al vivir tan cerca de las tuberías con TENORM.',
        'B) Solo hay riesgo si toca directamente los tubos.',
        'C) El riesgo es solo para los niños, no para adultos.'
      ].join('\n'),
      correcta: 'A',
      respuestas: {
        A: {
          texto: '✅ *Correcto!* La radiación gamma viaja por el aire.\nVivir cerca 24 horas acumula exposición externa significativa.\n\n🦜 *PLUMA DEL GUACAMAYO DESBLOQUEADA*\n\nEscribe *SIGUIENTE* para el Nivel 3.',
          puntaje: 2, correcto: true
        },
        B: {
          texto: '❌ La radiación gamma no requiere contacto.\nAtravesar el espacio desde la fuente ya genera exposición.\n\nIntenta de nuevo: A, B o C',
          puntaje: 0, correcto: false
        },
        C: {
          texto: '❌ La radiación gamma afecta a todas las personas por igual.\nLos niños incluso son más vulnerables por su desarrollo celular.\n\nIntenta de nuevo: A, B o C',
          puntaje: 0, correcto: false
        }
      }
    },

    insignia: '🦜 *NIVEL 2 COMPLETADO*\nPluma del Guacamayo desbloqueada.\n\nEscribe *SIGUIENTE* para el Nivel 3: La Anaconda 🐍'
  },

  // ══════════════════════════════════════════
  // NIVEL 3 — ANACONDA — Correcta: B
  // ══════════════════════════════════════════
  anaconda: {
    id: 'anaconda', numero: 3, animal: 'Anaconda Verde',
    etapa_inicio: 'nivel3_msg1', etapa_fin: 'nivel3_completado',
    siguiente_nivel: 'jaguar', siguiente_etapa: 'nivel4_msg1',

    mensajes: {
      nivel3_msg1: {
        texto: [
          '🐍 Eres la *Anaconda* — actúas desde el conocimiento.',
          '',
          '*¿Cómo se mide la radiación?*',
          'En *mSv* (milisievert). Igual que medimos la lluvia.',
          '',
          'Para ubicarte:',
          '✈️ Vuelo Quito-Madrid → 0.08 mSv',
          '🏥 Radiografía de pecho → 0.1 mSv',
          '🌍 Fondo natural anual → 2.4 mSv',
          '⚠️ Límite legal Ecuador → 1.0 mSv',
          '',
          'La radiación se *mide y se controla*.',
          'Eso la hace manejable — no temible.',
          '',
          'Escribe *SIGUIENTE*. _(1 de 2)_'
        ].join('\n'),
        siguiente: 'nivel3_msg2'
      },

      nivel3_msg2: {
        texto: [
          '*La medicina usa radiación para curar* 🏥',
          '',
          '- *Rayos X* → ver huesos sin cirugía',
          '- *Tomografía* → detectar tumores internos',
          '- *Radioterapia* → destruir células cancerosas',
          '',
          'La misma física que existe en el subsuelo de Sucumbíos',
          'salva millones de vidas cada año.',
          '',
          '*La dosis y el control son lo que importa.*',
          '',
          'Escribe *QUIZ*. _(2 de 2)_'
        ].join('\n'),
        siguiente: 'nivel3_quiz'
      }
    },

    quiz: {
      etapa: 'nivel3_quiz',
      pregunta: [
        '*PREGUNTA — Nivel 3*',
        '',
        'Alguien dice: "La radiografía que me hicieron',
        'me va a enfermar igual que los pozos petroleros."',
        '',
        '*¿Cuál es la respuesta más correcta?*',
        '',
        'A) Tiene razón, cualquier radiación acumula y enferma.',
        'B) No es correcto: una radiografía entrega 0.1 mSv,\n   una dosis muy baja y controlada con beneficio claro.',
        'C) Depende de la edad del paciente, en jóvenes sí es peligroso.'
      ].join('\n'),
      correcta: 'B',
      respuestas: {
        A: {
          texto: '❌ No toda dosis acumula daño detectable.\nDosis muy bajas como 0.1 mSv son manejadas por el cuerpo\nsin consecuencias documentadas.\n\nIntenta de nuevo: A, B o C',
          puntaje: 0, correcto: false
        },
        B: {
          texto: '✅ *Correcto!* El contexto y la dosis lo cambian todo.\n0.1 mSv de una radiografía vs exposición crónica sin control\nson situaciones completamente distintas.\n\n🐍 *ESCAMA DE LA ANACONDA DESBLOQUEADA*\n\nEscribe *SIGUIENTE* para el nivel final.',
          puntaje: 2, correcto: true
        },
        C: {
          texto: '❌ La edad no es el factor determinante aquí.\nEl factor clave siempre es la dosis y el contexto de exposición.\n\nIntenta de nuevo: A, B o C',
          puntaje: 0, correcto: false
        }
      }
    },

    insignia: '🐍 *NIVEL 3 COMPLETADO*\nEscama de la Anaconda desbloqueada.\n\nEscribe *SIGUIENTE* para el Nivel 4 final: El Jaguar 🐆'
  },

  // ══════════════════════════════════════════
  // NIVEL 4 — JAGUAR — Correcta: A
  // ══════════════════════════════════════════
  jaguar: {
    id: 'jaguar', numero: 4, animal: 'Jaguar',
    etapa_inicio: 'nivel4_msg1', etapa_fin: 'nivel4_completado',
    siguiente_nivel: null, siguiente_etapa: 'programa_completado',

    mensajes: {
      nivel4_msg1: {
        texto: [
          '🐆 Eres el *Jaguar* — guardián científico de Sucumbíos.',
          '',
          'Principio clave — Paracelso, siglo XVI:',
          '_"La dosis hace al veneno."_',
          '',
          '💧 Agua en exceso → puede matar',
          '☀️ Sol en exceso → cáncer de piel',
          '☢️ Radiación en dosis bajas → el cuerpo la tolera',
          '',
          'La pregunta correcta no es *"¿es peligrosa?"*',
          'sino *"¿cuánta es y en qué contexto?"*',
          '',
          'Escribe *SIGUIENTE*. _(1 de 2)_'
        ].join('\n'),
        siguiente: 'nivel4_msg2'
      },

      nivel4_msg2: {
        texto: [
          '*Tu participación ya es parte de la ciencia* 🔬',
          '',
          'Los habitantes de Pacayacu conocen el territorio',
          'mejor que cualquier científico de afuera.',
          'Eso se llama *ciencia ciudadana*.',
          '',
          '━━━━━━━━━━━━━━━━━━━',
          '🦫 N1 → Reconoces lo invisible',
          '🦜 N2 → Entiendes las vías de exposición',
          '🐍 N3 → La ciencia como herramienta',
          '🐆 N4 → Pensamiento crítico',
          '━━━━━━━━━━━━━━━━━━━',
          '',
          'Escribe *QUIZ* para la evaluación final. _(2 de 2)_'
        ].join('\n'),
        siguiente: 'nivel4_quiz'
      }
    },

    quiz: {
      etapa: 'nivel4_quiz',
      pregunta: [
        '*PREGUNTA FINAL — Nivel 4*',
        '',
        'Dos vecinos discuten sobre Pacayacu:',
        '— "Toda la zona es radiactiva, nadie debería vivir aquí."',
        '— "Es mentira, aquí no pasa nada, todo está bien."',
        '',
        '*¿Cuál es la postura más científica?*',
        '',
        'A) Ninguna es correcta: ambas generalizan sin datos.\n   Lo correcto es preguntar: ¿dónde exactamente?,\n   ¿cuánta radiación?, ¿comparada con qué límite?',
        'B) El primero tiene razón, es mejor prevenir.',
        'C) El segundo tiene razón, la radiación natural no hace daño.'
      ].join('\n'),
      correcta: 'A',
      respuestas: {
        A: {
          texto: '✅ *Correcto!* Ni alarmismo ni negación.\nLa ciencia pide datos específicos antes de concluir.\nAlgunos puntos tienen niveles elevados — no toda la parroquia.\n\n🐆 *EMBLEMA DEL JAGUAR DESBLOQUEADO*\n\nEscribe *CERTIFICADO* para tu reconocimiento.',
          puntaje: 2, correcto: true
        },
        B: {
          texto: '❌ Prevenir está bien, pero sin datos no es ciencia.\nGeneralizar que "toda la zona es peligrosa" puede\ncausar pánico injustificado y desplazamiento innecesario.\n\nIntenta de nuevo: A, B o C',
          puntaje: 0, correcto: false
        },
        C: {
          texto: '❌ Hay puntos documentados con niveles elevados en Pacayacu.\nIgnorar esa evidencia tampoco es correcto.\nSiempre: datos específicos, lugares concretos.\n\nIntenta de nuevo: A, B o C',
          puntaje: 0, correcto: false
        }
      }
    },

    insignia: '🐆 *NIVEL 4 COMPLETADO*\nEmblema del Jaguar desbloqueado.\n\nEscribe *CERTIFICADO* para tu reconocimiento.'
  }
};

// Mapa de etapas para enrutamiento
const ETAPA_A_NIVEL = {};
for (const [nivelId, nivel] of Object.entries(NIVELES)) {
  for (const etapa of Object.keys(nivel.mensajes)) {
    ETAPA_A_NIVEL[etapa] = nivelId;
  }
  ETAPA_A_NIVEL[nivel.quiz.etapa] = nivelId;
}

module.exports = { NIVELES, ETAPA_A_NIVEL };
