const TELEGRAM_BOT_TOKEN = '7961283450:AAGvj_tjUn4kGwQzruOepP-3S32uTqpoKto';
const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/`;

const IP_SERVER = '123.456.789.101'; // Ganti dengan IP server Anda
const PORT_VLESS = '443'; // Port untuk VLESS
const PORT_TROJAN = '443'; // Port untuk Trojan
const UUID_DEFAULT = '6ac83a31-453a-45a3-b01d-1bd20ee9101f'; // UUID default
const DOMAIN = 'example.com'; // Ganti dengan domain Anda

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'POST') {
    const update = await request.json();

    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text;

      if (text.startsWith('/start')) {
        return sendMessage(chatId, 'Selamat datang! Gunakan perintah /adduser <username> <hari> untuk membuat akun VLESS/Trojan.');
      }

      if (text.startsWith('/adduser')) {
        const parts = text.split(' ');
        if (parts.length < 3) {
          return sendMessage(chatId, 'Format salah. Gunakan /adduser <username> <hari>.');
        }

        const username = parts[1];
        const days = parseInt(parts[2]);

        if (isNaN(days) || days <= 0) {
          return sendMessage(chatId, 'Jumlah hari harus berupa angka positif.');
        }

        // Buat akun dengan detail
        const accountDetails = createAccount(username, days);

        const message = `
Akun berhasil dibuat:

**VLESS**
IP: ${IP_SERVER}
Port: ${PORT_VLESS}
UUID: ${UUID_DEFAULT}
Path: /vless
Domain: ${DOMAIN}
Masa Aktif: ${days} hari

**Trojan**
IP: ${IP_SERVER}
Port: ${PORT_TROJAN}
Password: ${UUID_DEFAULT}
Domain: ${DOMAIN}
Masa Aktif: ${days} hari
        `.trim();

        return sendMessage(chatId, message);
      }
    }
  }

  return new Response('OK', { status: 200 });
}

function createAccount(username, days) {
  // Fungsi simulasi membuat akun (Anda dapat menambahkan logika pengelolaan user di sini)
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);

  return {
    username: username,
    uuid: UUID_DEFAULT,
    expiry: expiryDate.toISOString(),
  };
}

async function sendMessage(chatId, text) {
  const url = `${telegramApiUrl}sendMessage`;
  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown',
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return response;
}
