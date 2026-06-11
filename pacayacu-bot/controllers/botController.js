const { iniciarDiagnostico, procesarRespuestaDiagnostico } = require('./diagnosticoController');
const { iniciarNivel, procesarNivel, mostrarPuntaje } = require('./nivelesController');
const { iniciarPosttest, procesarRespuestaPosttest } = require('./posttestController');
const db = require('../config/db');

// Variables configurables (Si quieres, puedes poner tu número real aquí para probar todo el flujo sin filtros)
const MODO_PRUEBA = false; 
const NUMEROS_ADMIN = ['393514770998']; 

const recibirMensaje = async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];

        if (message) {
            const numeroUsuario = message.from;
            const textoMensaje = message.text?.body.toLowerCase().trim() || "";

            // --- LÓGICA DE USUARIOS ---
            let usuarioResult = await db.query('SELECT * FROM usuarios WHERE telefono = $1', [numeroUsuario]);
            
            if (usuarioResult.rows.length === 0) {
                // Nuevo usuario: Inicia en el diagnóstico
                await db.query('INSERT INTO usuarios (telefono, etapa) VALUES ($1, $2)', [numeroUsuario, 'inicio']);
                await iniciarDiagnostico(numeroUsuario);
                return res.sendStatus(200);
            }

            const usuario = usuarioResult.rows[0];
            const etapaActual = usuario.etapa;

            // --- EL DIRECTOR DE ORQUESTA (Enrutador) ---
            
            // 1. Fase de Diagnóstico Inicial
            if (etapaActual.startsWith('esperando_') || etapaActual.startsWith('diagnostico_')) {
                // Si la función requiere más parámetros según diagnosticoController.js, asegúrate de importarlas y usarlas aquí. 
                // Por ahora, asumimos que procesarRespuestaDiagnostico maneja las respuestas A/B/C
                await procesarRespuestaDiagnostico(numeroUsuario, textoMensaje, etapaActual);
            }
            
            // 2. Transición del Diagnóstico a los Niveles
            else if (etapaActual === 'diagnostico_completado') {
                await iniciarNivel(numeroUsuario, 'capibara', 'es', process.env.BASE_URL || 'https://radiation-bot.onrender.com');
            }

            // 3. Fase de Enseñanza (Niveles Capibara -> Jaguar)
            else if (etapaActual.startsWith('nivel') || etapaActual.includes('quiz')) {
                await procesarNivel(numeroUsuario, textoMensaje, etapaActual, 'es', process.env.BASE_URL);
            }

            // 4. Transición al Post-Test
            else if (etapaActual === 'programa_completado') {
                if (textoMensaje === 'posttest') {
                     await iniciarPosttest(numeroUsuario);
                }
            }

            // 5. Fase Final (Ganancia de Hake)
            else if (etapaActual.startsWith('posttest_')) {
                await procesarRespuestaPosttest(numeroUsuario, textoMensaje, etapaActual);
            }

            // 6. Comandos Generales (En cualquier momento)
            else if (textoMensaje === 'puntaje' || textoMensaje === 'progreso') {
                 await mostrarPuntaje(numeroUsuario);
            }

            // 7. Fallback o Finalizado
            else {
               // En este punto, el usuario ya terminó todo el proceso de Zétesis
               // Se podría guardar el mensaje en interacciones con un tipo 'fallback' si es necesario.
               await db.query(
                    'INSERT INTO interacciones (telefono, tipo_mensaje, mensaje_usuario, etapa_al_momento) VALUES ($1, $2, $3, $4)',
                    [numeroUsuario, 'fallback', textoMensaje, etapaActual]
                );
            }
        }
        res.sendStatus(200);
    } catch (error) {
        console.error("Error crítico en botController:", error);
        res.sendStatus(500);
    }
};

module.exports = { recibirMensaje };