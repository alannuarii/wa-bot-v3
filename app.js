const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { checkData } = require('./controller/patroli')

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox'],
    }
});

let isAuthenticated = false; // Tambahkan variabel untuk melacak status otentikasi

client.on('authenticated', (session) => {
    console.log(session);
    isAuthenticated = true; // Setel status otentikasi ke true
});

client.initialize();
client.on("qr", qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log("ready to message");
});


setInterval(() => checkData(isAuthenticated, client, '120363204122320229@g.us'), 10000);
