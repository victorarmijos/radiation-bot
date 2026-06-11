require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // <-- AÑADIDO: Módulo nativo para manejar rutas de carpetas
const apiRoutes = require('./pacayacu-bot/routes/apiRoutes');

const app = express();
app.use(bodyParser.json());

// <-- AÑADIDO: Configuración maestra de archivos estáticos
// Esto le dice a Render que exponga públicamente todo lo que está en 'pacayacu-bot/public'
app.use(express.static(path.join(__dirname, 'pacayacu-bot', 'public')));

// Conectar las rutas
app.use('/api', apiRoutes);

// Ruta simple para ver si funciona en el navegador
app.get('/', (req, res) => res.send('El Bot de Pacayacu está vivo 🤖🌿'));

// Ruta para las políticas de privacidad
app.get('/privacy.html', (req, res) => {
    res.send(`
        <h1>Políticas de Privacidad - Bot de Pacayacu</h1>
        <p>Este es un proyecto educativo de la Universidad Estatal de Milagro. Únicamente utilizamos tu número de teléfono para enviar los mensajes interactivos solicitados. No compartimos, vendemos ni analizamos tus datos con terceros.</p>
        <p>Para solicitar la eliminación de tus datos, contáctanos a nuestro correo de soporte.</p>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});