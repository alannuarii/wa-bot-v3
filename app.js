const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const db = require('./db/connection');

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

const { promisify } = require("util");
const dbQuery = promisify(db.query).bind(db);

const checkData = async (groupId) => {
    try {
        // Hanya lanjut jika sudah otentikasi
        if (!isAuthenticated) {
            console.log('Belum terotentikasi. Menunggu...');
            return;
        }

        const sql = "SELECT patroli.nama, patroli.waktu FROM note_patroli JOIN patroli ON note_patroli.kode = patroli.kode ORDER BY note_patroli.id_npatroli DESC LIMIT ?";
        const values = [1];
        const result = await dbQuery(sql, values);
        if (result) {
            await client.sendMessage(groupId, 'Automatic message from Bot!');
        }
    } catch (error) {
        console.error("Kesalahan koneksi ke database:", error);
    }
}

const groupId = '120363204122320229@g.us';

setInterval(() => checkData(groupId), 10000);
