// src/config/index.js
require('dotenv').config(); // Pastikan dotenv dimuat di sini juga, atau di app.js utama

const config = {
    app: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development', // 'development', 'production', 'staging'
    },
    ai: {
        geminiApiKey: process.env.GEMINI_API_KEY,
        // Tambahan pengaturan AI, misalnya model default
        defaultAiModel: "gemini-1.5-flash",
    },
    database: {
        // Contoh konfigurasi MongoDB (jika digunakan)
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cemmy_db',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // ...opsi lain
        },
    },
    // Pengaturan lain yang mungkin diperlukan, misalnya untuk musik latar
    audio: {
        relaxingMusicPath: '/audio/relaxing-music.mp3',
    }
};

// Validasi penting: Pastikan kunci API AI tersedia
if (!config.ai.geminiApiKey) {
    console.error('ERROR: Kunci API GEMINI (GEMINI_API_KEY) tidak ditemukan di .env!');
    console.error('Pastikan Anda telah membuat file .env dan mengaturnya.');
    process.exit(1); // Keluar dari aplikasi jika kunci API penting tidak ada
}

module.exports = config;