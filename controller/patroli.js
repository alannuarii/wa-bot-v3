const db = require('../db/connection');

const { promisify } = require("util");
const dbQuery = promisify(db.query).bind(db);

const checkData = async (isAuthenticated, client, groupId) => {
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

module.exports = { checkData };
