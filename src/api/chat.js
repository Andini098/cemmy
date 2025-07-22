// src/api/chat.js
const { getAiResponse } = require('../utils/aiHelper');
// Jika Anda menggunakan database, import model di sini
// const ChatLog = require('../models/ChatLog'); // Contoh, jika ada model database

/**
 * Memproses pesan masuk dari pengguna dan menghasilkan respons AI.
 * Ini adalah fungsi inti untuk komunikasi chat.
 *
 * @param {string} userId - ID unik pengguna (misalnya, socket ID untuk anonimitas).
 * @param {string} message - Pesan teks dari pengguna.
 * @param {string} mode - Mode AI yang dipilih pengguna ('mendengarkan' atau 'saran/ngobrol').
 * @param {string} emotionalChoice - Pilihan emosi pengguna (opsional).
 * @returns {Promise<string>} - Respons teks dari AI.
 */
async function processChatMessage(userId, message, mode, emotionalChoice) {
    try {
        console.log(`[Chat API] Menerima pesan dari ${userId}: "${message}" (Mode: ${mode}, Emosi: ${emotionalChoice})`);

        // Dapatkan respons dari AI Helper
        const aiResponse = await getAiResponse(message, mode, emotionalChoice);

        // --- Logika tambahan di sini (Opsional) ---
        // Contoh: Simpan log chat ke database (Pastikan anonimitas!)
        /*
        await ChatLog.create({
            userId: userId, // Gunakan socket ID sebagai identifier anonim
            userMessage: message,
            aiResponse: aiResponse,
            mode: mode,
            emotionalChoice: emotionalChoice,
            timestamp: new Date()
        });
        */

        return aiResponse;

    } catch (error) {
        console.error('[Chat API] Gagal memproses pesan chat:', error);
        // Berikan respons yang ramah kepada pengguna jika ada error
        return "Maaf, ada masalah saat memproses pesan Anda. Bisakah Anda coba lagi?";
    }
}

module.exports = {
    processChatMessage,
};