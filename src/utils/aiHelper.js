// src/utils/aiHelper.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

const genAI = new GoogleGenerativeAI(config.ai.geminiApiKey);

// --- Tambahkan fungsi untuk menampilkan daftar model ---
async function listAvailableModels() {
    try {
        console.log("Mencoba mendapatkan daftar model yang tersedia...");
        const { models } = await genAI.listModels();
        console.log("Model yang tersedia:");
        for (const model of models) {
            console.log(`- ID: ${model.name}, Versi: ${model.version}, Fitur: ${model.supportedGenerationMethods.join(', ')}`);
        }
        console.log("Pastikan Anda menggunakan ID model yang mendukung 'generateContent'.");
    } catch (error) {
        console.error("Gagal mendapatkan daftar model:", error);
    }
}
// --- Akhir dari fungsi baru ---

async function getAiResponse(userMessage, mode, emotionalChoice) {
    try {
        // --- Panggil fungsi ini sekali di awal aplikasi atau saat debugging ---
        // Anda bisa memanggilnya di app.js saat server mulai, atau secara manual dari konsol
        // listAvailableModels(); // Hapus atau komentari ini setelah Anda mendapatkan daftar model

        // Gunakan nama model yang benar berdasarkan output listAvailableModels
        const model = genAI.getGenerativeModel({ model: config.ai.defaultAiModel }); // Menggunakan dari config

        let prompt = `Anda adalah teman virtual CEMMY. Tujuan Anda adalah menanggapi keluh kesah pengguna secara anonim.`;
        if (mode === 'mendengarkan') {
            prompt += ` Mode Anda saat ini adalah MENDENGARKAN. Berikan respons yang empatik dan suportif tanpa banyak memberikan saran langsung. Fokuslah pada validasi perasaan pengguna.`;
        } else if (mode === 'saran/ngobrol') {
            prompt += ` Mode Anda saat ini adalah MEMBERI SARAN atau NGOBROL. Anda dapat memberikan saran ringan atau melanjutkan percakapan secara umum, tetap menjaga empati.`;
        }
        if (emotionalChoice) {
            prompt += ` Pengguna menyatakan kondisi emosionalnya adalah "${emotionalChoice}". Sesuaikan nada dan empati Anda.`;
        }
        prompt += `\n\nPesan pengguna: "${userMessage}"\n\nRespon Anda:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;

    } catch (error) {
        console.error('Error saat mendapatkan respons AI:', error);
        // Tangani error spesifik dari Gemini API
        if (error.status === 404 && error.message.includes('models/gemini-pro is not found')) {
            console.error("INFO: Model 'gemini-pro' mungkin tidak tersedia. Coba panggil listAvailableModels() untuk melihat model yang benar.");
            return "Maaf, ada masalah saat memproses pesan Anda. Sepertinya layanan AI sedang sibuk atau model tidak tersedia. Bisakah Anda coba lagi nanti?";
        }
        return "Maaf, saya sedang mengalami masalah teknis. Bisakah Anda mengulanginya?";
    }
}

module.exports = { getAiResponse, listAvailableModels }; // Ekspor juga listAvailableModels