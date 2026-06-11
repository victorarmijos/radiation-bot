const { iniciarDiagnostico, procesarRespuestaDiagnostico } = require('./diagnosticoController');
const { iniciarNivel, procesarNivel, mostrarPuntaje } = require('./nivelesController');
const { iniciarPosttest, procesarRespuestaPosttest } = require('./posttestController');
const db = require('../config/db');

const { enviarMensaje, enviarBotones } = require('../services/whatsapp'); 

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
            
            // ─── SOLUCIÓN AQUÍ: Definimos baseUrl para todo el enrutador ───
            const baseUrl = 'https://' + req.get('host');

            // Lector de texto y botones
            let textoMensaje = "";
            if (message.type === 'text') {
                textoMensaje = message.text.body.toLowerCase().trim();
            } else if (message.type === 'interactive') {
                textoMensaje = message.interactive.button_reply.id.toLowerCase().trim();
            }

            // --- LÓGICA DE USUARIOS ---
            let usuarioResult = await db.query('SELECT * FROM usuarios WHERE telefono = $1', [numeroUsuario]);
            
            if (usuarioResult.rows.length === 0) {
                // Nuevo usuario: Da la bienvenida y pide el nombre primero
                await db.query(
                    "INSERT INTO usuarios (telefono, etapa) VALUES ($1, 'recurso_esperando_nombre')", 
                    [numeroUsuario]
                );
                await enviarMensaje(
                    numeroUsuario, 
                    "🌿 *¡Bienvenido/a a Zétesis!*\n\nPara que la experiencia sea más personalizada, ¿cuál es tu nombre?\nEscríbelo como prefieres que te llamemos (Ej: *Rosa* o *Juan Carlos*)."
                );
                return res.sendStatus(200);
            }

            const usuario = usuarioResult.rows[0];
            const etapaActual = usuario.etapa;

            // --- COMANDOS GLOBALES ---

            if (textoMensaje === 'reiniciar') {
                await db.query(
                    "UPDATE usuarios SET etapa = 'recurso_esperando_nombre', puntos = 0, nivel = NULL, nombre = NULL, edad = NULL, localidad = NULL WHERE telefono = $1", 
                    [numeroUsuario]
                );
                await enviarMensaje(
                    numeroUsuario, 
                    "🔄 *Progreso reiniciado.*\n\n🌿 *¡Bienvenido/a de nuevo!*\n\n¿Cuál es tu nombre?\nEscríbelo como prefieres que te llamemos."
                );
                return res.sendStatus(200); 
            }

            if (textoMensaje === 'diagnostico') {
                await db.query(
                    "UPDATE usuarios SET etapa = 'inicio', puntos = 0, nivel = NULL WHERE telefono = $1", 
                    [numeroUsuario]
                );
                await iniciarDiagnostico(numeroUsuario);
                return res.sendStatus(200); 
            }

            if (textoMensaje === 'ayuda') {
                await enviarBotones(numeroUsuario, "Aquí tienes los comandos disponibles:", [
                    { id: 'REINICIAR', title: 'Reiniciar Todo' },
                    { id: 'DIAGNOSTICO', title: 'Test Diagnóstico' },
                    { id: 'PUNTAJE', title: 'Ver puntaje' } 
                ]);
                return res.sendStatus(200); 
            }

            if (textoMensaje === 'puntaje' || textoMensaje === 'progreso') {
                 await mostrarPuntaje(numeroUsuario);
                 return res.sendStatus(200); 
            }

            // --- ENRUTADOR PRINCIPAL ---
            
            // 1. Captura del Nombre
            if (etapaActual === 'recurso_esperando_nombre') {
                if (textoMensaje.length < 2) {
                    await enviarMensaje(numeroUsuario, "Por favor escribe tu nombre válido, ej: *Rosa* o *Juan*");
                    return res.sendStatus(200);
                }
                const nombreFormateado = textoMensaje.charAt(0).toUpperCase() + textoMensaje.slice(1);
                
                await db.query(
                    "UPDATE usuarios SET nombre = $1, etapa = 'recurso_esperando_edad' WHERE telefono = $2", 
                    [nombreFormateado, numeroUsuario]
                );
                await enviarMensaje(numeroUsuario, `¡Mucho gusto, *${nombreFormateado}*! 👋\n\n¿Cuántos años tienes?\nEscribe solo el número. Ej: *34*`);
                return res.sendStatus(200);
            }

            // 2. Captura de la Edad y Salto a los Niveles
            else if (etapaActual === 'recurso_esperando_edad') {
                const edadNum = parseInt(textoMensaje);
                if (isNaN(edadNum) || edadNum < 10 || edadNum > 100) {
                    await enviarMensaje(numeroUsuario, "⚠️ Por favor escribe solo tu edad en números. Ej: *34*");
                    return res.sendStatus(200);
                }
                
                await db.query(
                    "UPDATE usuarios SET edad = $1, etapa = 'diagnostico_completado' WHERE telefono = $2", 
                    [edadNum, numeroUsuario]
                );
                
                // Ahora baseUrl tiene el valor correcto y no colapsará
                await iniciarNivel(numeroUsuario, 'capibara', 'es', baseUrl);
                return res.sendStatus(200);
            }

            // 3. Fase de Diagnóstico
            else if (etapaActual.startsWith('esperando_') || etapaActual.startsWith('diagnostico_')) {
                await procesarRespuestaDiagnostico(numeroUsuario, textoMensaje, etapaActual);
            }
            
            // 4. Continuar niveles
            else if (etapaActual === 'diagnostico_completado') {
                await iniciarNivel(numeroUsuario, 'capibara', 'es', baseUrl);
            }

            // 5. Fase de Enseñanza (Niveles Capibara -> Jaguar)
            else if (etapaActual.startsWith('nivel') || etapaActual.includes('quiz')) {
                await procesarNivel(numeroUsuario, textoMensaje, etapaActual, 'es', baseUrl);
            }

            // 6. Transición al Post-Test
            else if (etapaActual === 'programa_completado') {
                if (textoMensaje === 'posttest') {
                     await iniciarPosttest(numeroUsuario);
                }
            }

            // 7. Fase Final (Ganancia de Hake)
            else if (etapaActual.startsWith('posttest_')) {
                await procesarRespuestaPosttest(numeroUsuario, textoMensaje, etapaActual);
            }

            // 8. Fallback o Finalizado
            else {
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