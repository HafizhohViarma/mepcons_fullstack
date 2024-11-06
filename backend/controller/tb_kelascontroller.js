const { Kelas } = require('../models');

// Fungsi untuk membuat kelas baru dengan upload sampul_kelas
exports.createKelas = async (req, res) => {
    try {
        // Cek apakah file sampul_kelas ada dalam request
        const sampulKelas = req.file ? req.file.filename : null;

        // Buat URL untuk sampul_kelas jika ada file yang di-upload
        const sampulKelasUrl = sampulKelas ? `${req.protocol}://${req.get('host')}/uploads/${sampulKelas}` : null;

        // Data yang akan disimpan ke database
        const kelasData = {
            ...req.body, // Semua data dari req.body
            sampul_kelas: sampulKelasUrl // Menyimpan URL lengkap sampul_kelas
        };

        // Membuat kelas baru
        const newKelas = await Kelas.create(kelasData);

        return res.status(201).json(newKelas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat membuat kelas' });
    }
};


// Fungsi untuk mendapatkan semua kelas
exports.getAllKelas = async (req, res) => {
    try {
        const kelasList = await Kelas.findAll();
        return res.status(200).json(kelasList);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data kelas' });
    }
};

// Fungsi untuk mendapatkan kelas berdasarkan ID
exports.getKelasById = async (req, res) => {
    try {
        const { id } = req.params;
        const kelas = await Kelas.findByPk(id);
        if (!kelas) {
            return res.status(404).json({ message: 'Kelas tidak ditemukan' });
        }
        return res.status(200).json(kelas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data kelas' });
    }
};

// Fungsi untuk memperbarui kelas
// Fungsi untuk memperbarui kelas
exports.updateKelas = async (req, res) => {
    try {
        const { id } = req.params;

        // Cek apakah file sampul_kelas ada dalam request
        const sampulKelas = req.file ? req.file.filename : null;

        // Buat URL untuk sampul_kelas jika ada file yang di-upload
        const sampulKelasUrl = sampulKelas ? `${req.protocol}://${req.get('host')}/uploads/${sampulKelas}` : null;

        // Ambil data kelas yang akan diperbarui
        const kelas = await Kelas.findByPk(id);
        if (!kelas) {
            return res.status(404).json({ message: 'Kelas tidak ditemukan' });
        }

        // Data yang akan diupdate
        const updateData = {
            ...req.body, // Semua data dari req.body
            sampul_kelas: sampulKelasUrl || kelas.sampul_kelas // Jika ada sampul baru, gunakan URL baru; jika tidak, pertahankan URL lama
        };

        // Perbarui data kelas
        const [updated] = await Kelas.update(updateData, {
            where: { id_kelas: id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Kelas tidak ditemukan' });
        }

        return res.status(200).json({ message: 'Kelas berhasil diperbarui' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui kelas' });
    }
};

// Fungsi untuk menghapus kelas
exports.deleteKelas = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Kelas.destroy({
            where: { id_kelas: id }
        });
        if (!deleted) {
            return res.status(404).json({ message: 'Kelas tidak ditemukan' });
        }
        return res.status(200).json({ message: 'Kelas berhasil dihapus' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat menghapus kelas' });
    }
};
