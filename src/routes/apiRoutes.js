const express = require('express');
const router = express.Router();
const botController = require('../controllers/botController');

// Verificación del Webhook (Lo pide WhatsApp al inicio)
router.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
            console.log('WEBHOOK VERIFICADO');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Recepción de mensajes (Aquí entra la magia)
router.post('/webhook', botController.recibirMensaje);

module.exports = router;