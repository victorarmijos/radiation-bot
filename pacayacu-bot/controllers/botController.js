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
                // Reiniciar manda a pedir el nombre nuevamente
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


            // 
            
            // 1. Captura del Nombre
            if (etapaActual === 'recurso_esperando_nombre') {
                if (textoMensaje.length < 2) {
                    await enviarMensaje(numeroUsuario, "Por favor escribe tu nombre válido, ej: *Rosa* o *Juan*");
                    return res.sendStatus(200);
                }
                // 