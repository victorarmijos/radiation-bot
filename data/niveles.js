// data/niveles.js — Contenido de los 4 niveles de ensenanza Zetesis
// Capibara -> Guacamayo -> Anaconda -> Jaguar

const NIVELES = {

  // ═══════════════════════════════════════════════════════════
  // NIVEL 1 — CAPIBARA
  // ═══════════════════════════════════════════════════════════
  capibara: {
    id: 'capibara',
    numero: 1,
    animal: 'Capibara',
    emoji: 'C1',
    etapa_inicio: 'nivel1_msg1',
    etapa_fin: 'nivel1_completado',
    siguiente_nivel: 'guacamayo',
    siguiente_etapa: 'nivel2_msg1',

    mensajes: {
      nivel1_msg1: {
        texto: [
          '!Que más!, Soy *Capi*, tu guía en este camino.',
          'Los capibaras siempre andamos en manada, acolitandonos para sobrevivir en la selva.',
          '',
          'Se conoce que en Sucumbíos hay una mancha negra de petróleo.',
          'Se ve, se huele, mancha las manos. Eso lo sabemos.',
          '',
          'Pero la industria nos dejó un peligro *diferente*.',
          'Es como un fantasma: no se ve, no huele, no hace ruido.',
          '',
          'Se llama *RADIACIÓN*.',
          'Y esta atrapada en los tubos viejos y oxidados de los pozos.',
          '',
          'Escribe *SIGUIENTE* para aprender mas. _(1 de 4)_'
        ].join('\n'),
        siguiente: 'nivel1_msg2'
      },

      nivel1_msg2: {
        texto: [
          '*Pero fresco.* La radiación no es algo raro o de otro mundo.',
          'Existe en la naturaleza desde siempre. Está en todas partes.',
          '',
          'Está en el suelo bajo tus pies ahora mismo.',
          'Está en los rayos del sol cuando te calienta la cara.',
          'Está incluso en el banano que te comiste hoy.',
          '',
          'No toda la radiación es peligrosa.',
          'Lo que importa es *CUANTA* y *DE QUE TIPO*.',
          '',
          'Piensa en el sol:',
          '- Un ratito al sol es bueno, te da vitamina D.',
          '- Horas bajo el sol del mediodia te quema la piel.',
          '',
          'Con la radiación pasa exactamente igual. *La cantidad lo es todo.*',
          '',
          'Escribe *SIGUIENTE*. _(2 de 4)_'
        ].join('\n'),
        siguiente: 'nivel1_msg3'
      },

      nivel1_msg3: {
        texto: [
          'Cuando se saca petróleo del subsuelo, también suben materiales',
          'que tienen radiación natural atrapada adentro.',
          'Esos materiales forman una *costra dura, blanquecina*,',
          'que se pega en las tuberías por dentro.',
          '',
          'A eso los cientificos le llaman *TENORM*.',
          '_(Materiales Radiactivos de Origen Natural modificados por la extracción)_',
          '',
          'En Pacayacu se midió un pozo cerrado.',
          'El cual emitía una radiacion *5 veces mayor* al límite permitido por ley.',
          '',
          'El problema: ese pozo parece un tubo viejo y oxidado, nada más.',
          'Un fantasma que no se ve.',
          '',
          'Escribe *SIGUIENTE*. _(3 de 4)_'
        ].join('\n'),
        siguiente: 'nivel1_msg4'
      },

      nivel1_msg4: {
        texto: [
          'No necesitas un detector especial. Aquí va la *Regla del Capibara*:',
          '',
          'Si ves un tubo, válvula o estructura metálica vieja',
          'que estuvo conectada a un pozo petrolero:',
          '',
          '- Tiene costra blanquecina o amarillenta? -> *Cuidado.*',
          '- Está botado sin cercado ni señalización? -> *Cuidado.*',
          '- Alguien lo quiere usar para cerca, cimientos o riego? -> *ALTO.*',
          '',
          'No necesitas tocarlo para saber que puede ser peligroso.',
          '*El capibara no mete el hocico donde no debe.*',
          '',
          'Escribe *QUIZ* para responder una pregunta rápida y ganar tu insignia. _(4 de 4)_'
        ].join('\n'),
        siguiente: 'nivel1_quiz'
      },
    },

    quiz: {
      etapa: 'nivel1_quiz',
      pregunta: [
        '*MINI EVALUACIÓN — Nivel 1*',
        '',
        'Estás caminando por un campo petrolero y ves un tubo metálico viejo',
        'con una costra blanquecina por fuera.',
        '',
        '*Qué haces?*',
        '',
        'A) Lo recojo para usarlo de poste en mi finca, total es solo óxido.',
        'B) Me alejo, no lo toco y aviso a la comunidad.',
        'C) Lo lavo con agua del río para limpiar la costra.'
      ].join('\n'),
      correcta: 'B',
      respuestas: {
        A: {
          texto: [
            'Ese es el error mas común.',
            'La costra de ese tubo puede tener TENORM radiactivo.',
            'Si lo usas en tu finca, expones a toda tu familia día y noche.',
            '',
            'Recuerda: *no toda la radiación se vé o se huele.*',
            'El peligro invisible es el más traicionero.',
            '',
            'Intenta de nuevo: A, B o C'
          ].join('\n'),
          puntaje: 0,
          correcto: false
        },
        B: {
          texto: [
            'Exacto! Eso es lo que hace un Capibara sabio.',
            'Alejarse y avisar es la única accion correcta.',
            '',
            'La comunidad informada protege a la comunidad entera.',
            '',
            '*INSIGNIA DEL CAPIBARA DESBLOQUEADA*',
            'Has aprendido a reconocer lo que no se vé.',
            '',
            'Escribe *SIGUIENTE* para continuar al Nivel 2.'
          ].join('\n'),
          puntaje: 2,
          correcto: true
        },
        C: {
          texto: [
            'Cuidado! Lavar esa costra con agua del río es el peor escenario.',
            'Disuelve los materiales radiactivos directamente en el agua',
            'que tú comunidad puede estar usando para beber o cocinar.',
            '',
            'Nunca limpies ni manipules tuberias viejas de pozos.',
            '',
            'Intenta de nuevo: A, B o C'
          ].join('\n'),
          puntaje: 0,
          correcto: false
        }
      }
    },

    insignia: [
      '*NIVEL 1 COMPLETADO*',
      '',
      'Insignia del Capibara desbloqueada.',
      'Has aprendido a reconocer lo invisible.',
      '',
      'Escribe *SIGUIENTE* para el Nivel 2: El Guacamayo.'
    ].join('\n')
  },

  // ═══════════════════════════════════════════════════════════
  // NIVEL 2 — GUACAMAYO
  // ═══════════════════════════════════════════════════════════
  guacamayo: {
    id: 'guacamayo',
    numero: 2,
    animal: 'Guacamayo Rojo',
    emoji: 'N2',
    etapa_inicio: 'nivel2_msg1',
    etapa_fin: 'nivel2_completado',
    siguiente_nivel: 'anaconda',
    siguiente_etapa: 'nivel3_msg1',

    mensajes: {
      nivel2_msg1: {
        texto: [
          '*Bacán!* Has subido a los árboles.',
          'Ahora tienes la visión del *Guacamayo*.',
          '',
          'Desde aquí arriba vemos dos tipos de peligro diferentes.',
          'Confundirlos es un error que puede costar caro.',
          '',
          'El primer tipo: la radiacion te llega desde *AFUERA*.',
          'El segundo tipo: la radiacion entra *ADENTRO* de tu cuerpo.',
          '',
          'Son muy distintos y se previenen de maneras distintas.',
          '',
          'Escribe *SIGUIENTE* para entender la diferencia. _(1 de 4)_'
        ].join('\n'),
        siguiente: 'nivel2_msg2'
      },

      nivel2_msg2: {
        texto: [
          '*TIPO 1: IRRADIACIÓN EXTERNA*',
          '',
          'Imagina que estás parado cerca de un tubo con TENORM.',
          'La radiación gamma sale del metal como una luz invisible.',
          'Atraviesa tu ropa, atraviesa tu piel, llega a tus organos.',
          '',
          'No lo sientes. No duele. No pica. No huele.',
          'Pero sí te quedas mucho tiempo cerca, el daño se acumula.',
          '',
          'Es igual que el sol fuerte de Lago Agrio:',
          '- El primer día no pasa nada.',
          '- Despues de años sin protección, el daño es profundo.',
          '',
          'La clave: *alejarte* y *reducir el tiempo* cerca.',
          '',
          'Escribe *SIGUIENTE*. _(2 de 4)_'
        ].join('\n'),
        siguiente: 'nivel2_msg3'
      },

      nivel2_msg3: {
        texto: [
          '*TIPO 2: CONTAMINACIÓN INTERNA*',
          'Este es el mas peligroso de los dos.',
          '',
          'Cuando alguien *corta, lima, suelda o rompe* un tubo con TENORM,',
          'se libera un polvo muy fino al aire.',
          'Ese polvo tiene partículas radiactivas adentro.',
          '',
          'Si *respiras* ese polvo -> entra a tus pulmones y se queda ahí.',
          'Si lo *tragas* -> entra a tú estomago.',
          '',
          'Una vez adentro, esas partículas siguen emitiendo radiación',
          'desde el interior de tu cuerpo, directo a tus células.',
          '*Sin parar. Sin que lo sientas.*',
          '',
          'Por eso el guacamayo es muy cuidadoso con lo que mete al pico.',
          '',
          '*NUNCA* cortes, sueldes o limes tuberias viejas de pozos petroleros.',
          '',
          'Escribe *SIGUIENTE*. _(3 de 4)_'
        ].join('\n'),
        siguiente: 'nivel2_msg4'
      },

      nivel2_msg4: {
        texto: [
          'En el sector petrolero pasa algo muy común y muy peligroso:',
          '',
          'Las tuberias descartadas por las empresas son recicladas para:',
          '- Cercas para ganado',
          '- Cimientos para casas',
          '- Canales de riego',
          '',
          'Esto expone a toda la familia:',
          '',
          '*PELIGRO EXTERNO:* La familia vive cerca del tubo 24 horas.',
          'La radiacion gamma llega a todos, incluidos los niños.',
          '',
          '*PELIGRO INTERNO:* Al cortar con amoladora,',
          'el polvo de la costra se inhala.',
          'Partículas que duran años haciendo daño desde los pulmones.',
          '',
          'No es culpa de quien lo hace. *Es falta de información.*',
          'Por eso estamos aquí.',
          '',
          'Escribe *QUIZ* para tu mini evaluacion. _(4 de 4)_'
        ].join('\n'),
        siguiente: 'nivel2_quiz'
      },
    },

    quiz: {
      etapa: 'nivel2_quiz',
      pregunta: [
        '*MINI EVALUACIÓN — Nivel 2*',
        '',
        'Un vecino está a punto de usar una amoladora para cortar',
        'una tuberia vieja que encontró o compró en los alrededores.',
        '',
        '*Qué le dices?*',
        '',
        'A) Que se ponga guantes de cuero y listo, así se protege.',
        'B) Que el riesgo no es la chispa, sino inhalar el polvo de la costra que puede ser radiactivo.',
        'C) Que lo corte rápido para no contaminarse.'
      ].join('\n'),
      correcta: 'B',
      respuestas: {
        A: {
          texto: [
            'Los guantes de cuero no protegen de la radiación gamma',
            'ni del polvo particulado que se inhala.',
            'El riesgo principal no es quemarse con la chispa.',
            '',
            'Piensa en que tipo de peligro representa cortar ese tubo.',
            '',
            'Intenta de nuevo: A, B o C'
          ].join('\n'),
          puntaje: 0,
          correcto: false
        },
        B: {
          texto: [
            'Exacto! La contaminación interna por inhalacion es el riesgo principal.',
            '',
            'Al cortar la tubería con amoladora, la costra TENORM',
            'se convierte en polvo que entra directo a los pulmones.',
            'Ningún guante ni mascarilla de tela protege de eso.',
            '',
            '*PLUMA DEL GUACAMAYO DESBLOQUEADA*',
            'Ahora ves el peligro desde arriba: externo e interno.',
            '',
            'Escribe *SIGUIENTE* para el Nivel 3.'
          ].join('\n'),
          puntaje: 2,
          correcto: true
        },
        C: {
          texto: [
            'Cortar rápido no reduce el peligro.',
            'En el tiempo que dura un corte con amoladora ya se libera',
            'polvo radiactivo suficiente para contaminación interna.',
            '',
            'El tiempo no es el factor aquí — es el acto mismo de cortar.',
            '',
            'Intenta de nuevo: A, B o C'
          ].join('\n'),
          puntaje: 0,
          correcto: false
        }
      }
    },

    insignia: [
      '*NIVEL 2 COMPLETADO*',
      '',
      'Pluma del Guacamayo desbloqueada.',
      'Ahora entiendes como la radiación entra al cuerpo.',
      '',
      'Escribe *SIGUIENTE* para el Nivel 3: La Anaconda.'
    ].join('\n')
  },

 // ═══════════════════════════════════════════════════════════
  // NIVEL 3 — ANACONDA
  // La ciencia de la radiacion: medicion, medicina y ambiente
  // ═══════════════════════════════════════════════════════════
  anaconda: {
    id: 'anaconda',
    numero: 3,
    animal: 'Anaconda Verde',
    etapa_inicio: 'nivel3_msg1',
    etapa_fin: 'nivel3_completado',
    siguiente_nivel: 'jaguar',
    siguiente_etapa: 'nivel4_msg1',

    mensajes: {
      nivel3_msg1: {
        texto: [
          'Te mueves con calma y con sabiduría.',
          'Eres la *Anaconda Verde* — la más grande de la selva amazónica.',
          '',
          'La anaconda no actúa por miedo.',
          'Actúa porque *conoce* perfectamente su entorno.',
          '',
          'En este nivel vas a conocer la radiación de verdad:',
          '- Como se *mide*',
          '- Como la *medicina* la usa para curar',
          '- Como los *científicos* estudian el ambiente con ella',
          '',
          'Porque conocer algo es muy diferente a temerle.',
          '',
          'Escribe *SIGUIENTE*. _(1 de 4)_'
        ].join('\n'),
        siguiente: 'nivel3_msg2'
      },

      nivel3_msg2: {
        texto: [
          '*CÓMO SE MIDE LA RADIACIÓN*',
          '',
          'Los científicos miden la radiación igual que medimos la lluvia:',
          'con unidades especificas.',
          '',
          'La unidad más común es el *mSv* (milisievert).',
          'Mide cuanta energía de radiación absorbe tu cuerpo.',
          '',
          'Para que te des una idea de lo cotidiano que es esto:',
          '',
          '- Un vuelo Quito-Madrid: *0.08 mSv*',
          '- Una radiografía del pecho: *0.1 mSv*',
          '- Lo que recibe cualquier persona al año en la Tierra: *2.4 mSv*',
          '- Límite legal en Ecuador por actividad industrial: *1.0 mSv*',
          '',
          'Nadie sale corriendo del hospital después de una radiografía.',
          'Porque la dosis es pequeña y controlada.',
          '',
          '*Eso es lo que hace la ciencia: medir para entender.*',
          '',
          'Escribe *SIGUIENTE*. _(2 de 4)_'
        ].join('\n'),
        siguiente: 'nivel3_msg3'
      },

      nivel3_msg3: {
        texto: [
          '*CÓMO LA MEDICINA USA LA RADIACIÓN PARA CURAR*',
          '',
          'La misma radiación que existe en el subsuelo de Sucumbíos',
          'se usa todos los días en hospitales de todo el mundo',
          '*para salvar vidas.*',
          '',
          '*Rayos X:*',
          'Permiten ver huesos rotos sin abrir el cuerpo.',
          '',
          '*Tomografia (TAC):*',
          'Imagen detallada de organos internos.',
          'Detecta tumores y enfermedades que antes eran invisibles.',
          '',
          '*Radioterapia:*',
          'Rayos dirigidos con precisión para destruir celulas de cáncer.',
          'Ha curado a millones de personas en el mundo.',
          '',
          '*Medicina nuclear:*',
          'Pequeñas cantidades de material radiactivo para rastrear',
          'como funciona el corazon, el tiroides o el cerebro.',
          '',
          'La radiación no es el enemigo.',
          '*La dosis y el control son lo que importa.*',
          '',
          'Escribe *SIGUIENTE*. _(3 de 4)_'
        ].join('\n'),
        siguiente: 'nivel3_msg4'
      },

      nivel3_msg4: {
        texto: [
          '*CÓMO LA CIENCIA ESTUDIA EL AMBIENTE CON RADIACIÓN*',
          '',
          '*Datación por carbono-14:*',
          'Usando un isotopo radiactivo del carbono, los arqueologos',
          'saben exactamente cuantos años tiene un hueso o una semilla.',
          'Asi conocemos la edad de civilizaciones antiguas.',
          '',
          '*Monitoreo ambiental:*',
          'Detectores instalados en rios y suelos permiten saber',
          'si una zona esta contaminada mucho antes de que',
          'los efectos sean visibles.',
          '',
          '*Estudio de ecosistemas amazonicos:*',
          'En Pacayacu, cientificos',
          'miden la radiación natural para entender el estado',
          'del suelo y el agua en zonas de extracción petrolera.',
          '',
          'La radiacion es una *lente científica* para leer el mundo.',
          'En Sucumbíos, esa lente nos ayuda a entender',
          'lo que pasa en nuestra propia tierra.',
          '',
          'Escribe *QUIZ* para tu mini evaluacion. _(4 de 4)_'
        ].join('\n'),
        siguiente: 'nivel3_quiz'
      },
    },

    quiz: {
      etapa: 'nivel3_quiz',
      pregunta: [
        '*MINI EVALUACIÓN — Nivel 3*',
        '',
        'Un médico le recomienda a tu mama una tomografía (TAC)',
        'para revisar un dolor de cabeza fuerte.',
        'Tu primo dice que no vaya porque "los rayos la van a contaminar".',
        '',
        '*Que le dices a tu primo?*',
        '',
        'A) Que tiene razón, mejor que no vaya al hospital.',
        'B) Que la radiación medica se usa en dosis controladas y precisas,',
        '   y que detectar una enfermedad a tiempo supera el riesgo mínimo.',
        'C) Que la radiación del hospital no tiene nada que ver.'
      ].join('\n'),
      correcta: 'B',
      respuestas: {
        A: {
          texto: [
            'Este es exactamente el sesgo que queremos eliminar.',
            '',
            'La radiación médica se usa con dosis muy pequeñas y controladas.',
            'Una tomografía entrega una dosis similar a la que recibes',
            'naturalmente en unos pocos meses de vida cotidiana.',
            '',
            'El miedo irracional puede hacer que la gente evite examenes',
            'que pueden salvar su vida.',
            '',
            'Intenta de nuevo: A, B o C'
          ].join('\n'),
          puntaje: 0, correcto: false
        },
        B: {
          texto: [
            'Exacto. Eso es pensamiento científico.',
            '',
            'La clave siempre es la dosis y el control.',
            'La medicina usa la radiación de forma precisa y con beneficio claro.',
            '',
            '*ESCAMA DE LA ANACONDA DESBLOQUEADA*',
            'Conoces la radiación desde la ciencia, no desde el miedo.',
            '',
            'Escribe *SIGUIENTE* para el nivel final.'
          ].join('\n'),
          puntaje: 2, correcto: true
        },
        C: {
          texto: [
            'Parcialmente correcto — es el mismo fenomeno físico.',
            'Solo cambian el contexto y la dosis.',
            '',
            'La respuesta mas completa incluye el concepto',
            'de dosis controlada y balance beneficio-riesgo.',
            '',
            'Intenta de nuevo: A, B o C'
          ].join('\n'),
          puntaje: 0, correcto: false
        }
      }
    },

    insignia: [
      '*NIVEL 3 COMPLETADO*',
      '',
      'Escama de la Anaconda desbloqueada.',
      'Conoces la radiación como herramienta cientifica.',
      '',
      'Escribe *SIGUIENTE* para el Nivel 4 final: El Jaguar.'
    ].join('\n')
  },

  // ═══════════════════════════════════════════════════════════
  // NIVEL 4 — JAGUAR
  // Cierre del sesgo + ciencia ciudadana + sintesis final
  // ═══════════════════════════════════════════════════════════
  jaguar: {
    id: 'jaguar',
    numero: 4,
    animal: 'Jaguar',
    etapa_inicio: 'nivel4_msg1',
    etapa_fin: 'nivel4_completado',
    siguiente_nivel: null,
    siguiente_etapa: 'programa_completado',

    mensajes: {
      nivel4_msg1: {
        texto: [
          'Has llegado al nivel más alto.',
          'Eres el *Jaguar* — el guardián científico de Sucumbíos.',
          '',
          'El jaguar no actúa por miedo.',
          'Conoce su territorio tan bien que vive en el',
          'con *inteligencia y confianza*.',
          '',
          'La radiación ha cargado con un estigma enorme.',
          'Se la asocia casi siempre con muerte, con Chernobyl, con armas.',
          '',
          'Pero eso es como asociar el fuego solo con incendios',
          'y olvidar que tambien calienta tu comida y da luz.',
          '',
          'Hoy vamos a ver la radiación completa — sin sesgos.',
          '',
          'Escribe *SIGUIENTE*. _(1 de 4)_'
        ].join('\n'),
        siguiente: 'nivel4_msg2'
      },

      nivel4_msg2: {
        texto: [
          '*LA RADIACIÓN NO ES BUENA NI MALA — DEPENDE DE LA DOSIS*',
          '',
          'Este es el principio más importante de toda la toxicología:',
          '',
          '_"La dosis hace al veneno"_ — Paracelso, siglo XVI.',
          '',
          'El agua en exceso puede matar.',
          'El oxígeno en exceso daña los pulmones.',
          'El sol en exceso causa cancer de piel.',
          '',
          'Y la radiación en dosis muy altas causa daño celular.',
          'Pero en dosis bajas — como la que existe naturalmente',
          'en Sucumbios — tu cuerpo la ha tolerado toda la vida.',
          '',
          'Cuando escuches hablar de radiación,',
          'la primera pregunta no es *"es peligrosa?"*',
          'sino *"cuanta es y en que contexto?"*',
          '',
          'Ese cambio de pregunta es alfabetización científica.',
          '',
          'Escribe *SIGUIENTE*. _(2 de 4)_'
        ].join('\n'),
        siguiente: 'nivel4_msg3'
      },

      nivel4_msg3: {
        texto: [
          '*TÚ COMO PARTE DE LA CIENCIA — CIENCIA CIUDADANA*',
          '',
          'Los datos mas valiosos de la ciencia ambiental',
          'no siempre vienen de laboratorios caros.',
          '',
          'A veces vienen de *comunidades que conocen su propio territorio.*',
          '',
          'Eso se llama *ciencia ciudadana.*',
          '',
          'En Pacayacu, los habitantes conocen el territorio mejor',
          'que cualquier científico que llega de afuera.',
          'Saben donde hay tubos viejos, donde el agua cambio de color,',
          'donde antes había animales y ya no los hay.',
          '',
          'Esa información local, combinada con mediciones científicas,',
          'produce conocimiento real sobre el estado del ambiente.',
          '',
          'La ciencia permite unir esos dos mundos:',
          'el conocimiento de Pacayacu con la metodología científica.',
          '',
          '*Tu participación en este programa ya es parte de esa ciencia.*',
          '',
          'Escribe *SIGUIENTE*. _(3 de 4)_'
        ].join('\n'),
        siguiente: 'nivel4_msg4'
      },

      nivel4_msg4: {
        texto: [
          '*SÍNTESIS — EL CAMINO RECORRIDO*',
          '',
          '*Nivel 1 Capibara:*',
          'La radiación existe en la naturaleza.',
          'El TENORM es un pasivo industrial en tuberías de Pacayacu.',
          '',
          '*Nivel 2 Guacamayo:*',
          'Hay exposición externa e interna.',
          'El conocimiento permite tomar decisiones informadas.',
          '',
          '*Nivel 3 Anaconda:*',
          'La radiación se mide en mSv.',
          'La medicina y la ciencia ambiental la usan como herramienta.',
          '',
          '*Nivel 4 Jaguar:*',
          'La dosis lo es todo.',
          'Tu comunidad puede ser parte activa de la ciencia.',
          '',
          '_"El miedo nace de la ignorancia._',
          '_El respeto informado nace del conocimiento."_',
          '',
          'Eso es exactamente lo que lograste aqui.',
          '',
          'Escribe *QUIZ* para tu evaluacion final. _(4 de 4)_'
        ].join('\n'),
        siguiente: 'nivel4_quiz'
      },
    },

    quiz: {
      etapa: 'nivel4_quiz',
      pregunta: [
        '*EVALUACIÓN FINAL — Nivel 4*',
        '',
        'Un periodista llega a Pacayacu y publica:',
        '"La zona esta llena de radiación mortal. Todos estan en peligro."',
        '',
        '*Que piensas con lo que aprendiste?*',
        '',
        'A) Que tiene razon, hay que irse de Pacayacu lo antes posible.',
        'B) Que esa afirmación necesita datos: cuanta radiación, de qué tipo,',
        '   en qué lugares específicos y comparada con que límites.',
        '   Sin esos datos es alarma sin información.',
        'C) Que la radiaci+on no es peligrosa y el periodista exagera todo.'
      ].join('\n'),
      correcta: 'B',
      respuestas: {
        A: {
          texto: [
            'Ese es el efecto del alarmismo sin datos.',
            '',
            'Recuerda: la pregunta correcta no es "es peligrosa?"',
            'sino "cuanta es, de que tipo y en que lugar específico?"',
            '',
            'Pacayacu tiene radiación natural de fondo como todo el planeta.',
            'Algunos puntos tienen niveles elevados — eso es real.',
            'Pero eso no convierte a toda la parroquia en zona de exclusión.',
            '',
            'La ciencia necesita datos, no generalizaciones.',
            '',
            'Intenta de nuevo: A, B o C'
          ].join('\n'),
          puntaje: 0, correcto: false
        },
        B: {
          texto: [
            'Eso es exactamente el pensamiento científico que buscamos.',
            '',
            'Pedir datos específicos antes de concluir.',
            'Ni dejarse llevar por el pánico ni por la negación.',
            'Entender que "radiación" sin contexto no dice nada.',
            '',
            'Eso es lo que hace un habitante alfabetizado en ciencia ambiental.',
            '',
            '*EMBLEMA DEL JAGUAR DESBLOQUEADO*',
            '',
            'Escribe *CERTIFICADO* para recibir tu reconocimiento.'
          ].join('\n'),
          puntaje: 2, correcto: true
        },
        C: {
          texto: [
            'Cuidado con el extremo opuesto.',
            '',
            'Hay puntos en Pacayacu con niveles elevados documentados.',
            'Eso es real y merece atención científica.',
            '',
            'La respuesta correcta no es negar el riesgo',
            'ni tampoco generalizar el peligro a toda la zona.',
            '',
            'Siempre: pedir datos específicos.',
            '',
            'Intenta de nuevo: A, B o C'
          ].join('\n'),
          puntaje: 0, correcto: false
        }
      }
    },

    insignia: [
      '*NIVEL 4 COMPLETADO*',
      '',
      'Emblema del Jaguar desbloqueado.',
      '',
      'Has completado los 4 niveles.',
      'Escribe *CERTIFICADO* para recibir tu reconocimiento.'
    ].join('\n')
  }
};

// ─── MAPA DE ETAPAS PARA ENRUTAMIENTO RAPIDO ──────────────────────────────
const ETAPA_A_NIVEL = {};
for (const [nivelId, nivel] of Object.entries(NIVELES)) {
  for (const etapa of Object.keys(nivel.mensajes)) {
    ETAPA_A_NIVEL[etapa] = nivelId;
  }
  ETAPA_A_NIVEL[nivel.quiz.etapa] = nivelId;
}

module.exports = { NIVELES, ETAPA_A_NIVEL };
