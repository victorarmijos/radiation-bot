const axios = require('axios');
const db = require('../config/db'); // Importamos la conexión real a Postgres

const recibirMensaje = async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];

        if (message) {
            const numeroUsuario = message.from;
            const textoMensaje = message.text?.body.toLowerCase().trim();

            // 1. BUSCAR USUARIO EN BASE DE DATOS
            // (Si no existe, la base de datos nos lo dirá)
            let usuarioResult = await db.query('SELECT * FROM usuarios WHERE telefono = $1', [numeroUsuario]);
            
            // Si es nuevo, lo creamos
            if (usuarioResult.rows.length === 0) {
                await db.query('INSERT INTO usuarios (telefono) VALUES ($1)', [numeroUsuario]);
                // Volvemos a leerlo para tener los datos frescos
                usuarioResult = await db.query('SELECT * FROM usuarios WHERE telefono = $1', [numeroUsuario]);
            }

            const usuario = usuarioResult.rows[0]; // Aquí están sus puntos reales

            // 2. LÓGICA DE RESPUESTA (Igual que antes, pero guardando en BD)
            let respuestaBot = "";
            let nuevaEtapa = usuario.etapa_actual;
            let nuevosPuntos = usuario.puntos;

            // --- FLUJO CONVERSACIONAL ---

            if (textoMensaje === 'hola' || textoMensaje === 'menu') {
                respuestaBot = `👋 Hola de nuevo. Tienes ${usuario.puntos} puntos.\n\n1️⃣ Aprender\n2️⃣ Quiz (+10 pts)\n3️⃣ Ver Ranking`;
                nuevaEtapa = 'menu';
            }
            
            else if (textoMensaje === '2' || textoMensaje.includes('quiz')) {
                respuestaBot = "☢️ PREGUNTA: ¿El sol emite radiación?\n\nA) Sí\nB) No";
                nuevaEtapa = 'pregunta_sol';
            }

            else if (usuario.etapa_actual === 'pregunta_sol') {
                if (textoMensaje === 'a' || textoMensaje.includes('si')) {
                    nuevosPuntos += 10;
                    respuestaBot = "✅ ¡Correcto! +10 Puntos para ti.";
                    nuevaEtapa = 'menu';
                } else {
                    respuestaBot = "❌ Incorrecto. El sol es nuestra mayor fuente de radiación.";
                    nuevaEtapa = 'menu';
                }
            }
            
            else {
                respuestaBot = "No entendí. Escribe 'Hola' para ver el menú.";
            }

            // 3. GUARDAR CAMBIOS EN LA BASE DE DATOS (Persistencia)
            // Actualizamos puntos y etapa del usuario
            await db.query(
                'UPDATE usuarios SET puntos = $1, etapa_actual = $2 WHERE telefono = $3',
                [nuevosPuntos, nuevaEtapa, numeroUsuario]
            );

            // Guardamos el log para tu investigación (Tabla interacciones)
            await db.query(
                'INSERT INTO interacciones (telefono, mensaje_usuario, respuesta_bot) VALUES ($1, $2, $3)',
                [numeroUsuario, textoMensaje, respuestaBot]
            );

            // 4. ENVIAR A WHATSAPP
            await enviarMensaje(numeroUsuario, respuestaBot);
        }
        res.sendStatus(200);
    } catch (error) {
        console.error("Error en base de datos:", error);
        res.sendStatus(500);
    }
};

// ... (Mantén la función enviarMensaje igual que antes) ...
// Copia aquí la función enviarMensaje del paso anterior
const enviarMensaje = async (to, text) => {
    /* ... código de axios ... */
     try {
        await axios({
            method: 'POST',
            url: `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`,
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: {
                messaging_product: 'whatsapp',
                to: to,
                text: { body: text }
            }
        });
    } catch (error) {
        console.error("Error enviando:", error.message);
    }
};

module.exports = { recibirMensaje };