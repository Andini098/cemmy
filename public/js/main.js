// public/js/main.js
const socket = io();

const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const modeSelect = document.getElementById('mode');
const emotionalChoiceSelect = document.getElementById('emotionalChoice');
const backgroundMusic = document.getElementById('backgroundMusic');


// Fungsi untuk menambahkan pesan ke chatbox
function addMessageToChatBox(sender, text) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message');
    messageContainer.classList.add(sender === 'AI' ? 'ai' : 'user');

    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = text;

   const avatarSpan = document.createElement('span');
avatarSpan.classList.add('avatar');

// Buat elemen <img> untuk avatar
const avatarImg = document.createElement('img');

// Tentukan path gambar berdasarkan sender
avatarImg.src = sender === 'AI' ? '../images/ai.png' : '../images/user.png';
avatarImg.alt = sender === 'AI' ? 'Avatar AI' : 'Avatar Pengguna';

// Styling agar gambar tampil sempurna di dalam .avatar
avatarImg.style.width = '100%';
avatarImg.style.height = '100%';
avatarImg.style.objectFit = 'cover';
avatarImg.style.borderRadius = '50%';

// Masukkan gambar ke dalam span.avatar
avatarSpan.appendChild(avatarImg);


    if (sender === 'AI') {
        messageContainer.appendChild(avatarSpan);
        messageContainer.appendChild(messageParagraph);
    } else {
        messageContainer.appendChild(messageParagraph);
        messageContainer.appendChild(avatarSpan);
    }

    chatBox.appendChild(messageContainer);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll ke bawah
}

// Handler saat tombol kirim diklik atau Enter ditekan
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    const selectedMode = modeSelect.value;
    const selectedEmotionalChoice = emotionalChoiceSelect.value;

    if (message) {
        addMessageToChatBox('user', message);
        socket.emit('sendMessage', {
            message: message,
            mode: selectedMode,
            emotionalChoice: selectedEmotionalChoice
        });
        messageInput.value = '';
    }
}

// Menerima pesan dari server (AI)
socket.on('receiveMessage', (data) => {
    addMessageToChatBox(data.sender, data.text);
});

// Listener untuk otomatis scroll saat ada pesan baru
const observer = new MutationObserver(() => {
    chatBox.scrollTop = chatBox.scrollHeight;
});
observer.observe(chatBox, { childList: true });