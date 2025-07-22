// src/app.js
require('dotenv').config(); // Untuk memuat variabel dari .env

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { processChatMessage } = require('./api/chat');
const { listAvailableModels } = require('./utils/aiHelper');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const config = require('./config');
const PORT = config.app.port;
// listAvailableModels();
// Middleware untuk melayani file statis (HTML, CSS, JS frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Handler koneksi Socket.IO
io.on('connection', (socket) => {
    console.log('Pengguna terhubung:', socket.id);

    // Ketika klien mengirim pesan
    socket.on('sendMessage', async (messageData) => {
        const { message, mode, emotionalChoice } = messageData;
        console.log(`Pesan dari ${socket.id} (Mode: ${mode}, Emosi: ${emotionalChoice}): ${message}`);

        // --- Logika AI untuk memproses pesan dan mendapatkan respons ---
        const aiResponse = await require('./utils/aiHelper').getAiResponse(message, mode, emotionalChoice);

        // Gunakan fungsi dari api/chat.js
        // const aiResponse = await processChatMessage(socket.id, message, mode, emotionalChoice);


        // Mengirim respons kembali ke klien yang mengirim pesan
        socket.emit('receiveMessage', { sender: 'AI', text: aiResponse });
    });

    // Ketika klien memutuskan koneksi
    socket.on('disconnect', () => {
        console.log('Pengguna terputus:', socket.id);
    });
});

// Jalankan server
server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});