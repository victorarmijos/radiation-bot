require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./src/routes/apiRoutes');

const app = express();
app.use(bodyParser.json());

// Conectar las rutas
app.use('/api', apiRoutes);

// Ruta simple para ver si funciona en el navegador
app.get('/', (req, res) => res.send('El Bot de Pacayacu está vivo 🤖🌿'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});