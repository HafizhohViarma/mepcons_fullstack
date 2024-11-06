const { Testi } = require('../models'); // Pastikan path ke model benar

// Fungsi untuk mendapatkan semua testimoni
exports.getAllTesti = async (req, res) => {
    try {
        const testimoni = await Testi.findAll();
        return res.status(200).json(testimoni);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil testimoni' });
    }
};

// Fungsi untuk mendapatkan testimoni berdasarkan ID
exports.getTestiById = async (req, res) => {
    try {
        const { id } = req.params;
        const testi = await Testi.findOne({
            where: { id_testi: id }
        });

        if (!testi) {
            return res.status(404).json({ message: 'Testimoni tidak ditemukan' });
        }

        return res.status(200).json(testi);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil testimoni' });
    }
};

// Fungsi untuk membuat testimoni baru
exports.createTesti = async (req, res) => {
    try {
        const sampulTesti = req.file ? req.file.filename : null;
        const sampulUrl = sampulTesti ? `${req.protocol}://${req.get('host')}/uploads/${sampulTesti}` : null;

        const testiData = {
            ...req.body,
            sampul: sampulUrl
        };

        const newTesti = await Testi.create(testiData);
        return res.status(201).json(newTesti);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat membuat testimoni' });
    }
};

// Fungsi untuk memperbarui testimoni
exports.updateTesti = async (req, res) => {
    try {
        const { id } = req.params;
        const sampulTesti = req.file ? req.file.filename : null;
        const sampulUrl = sampulTesti ? `${req.protocol}://${req.get('host')}/uploads/${sampulTesti}` : null;

        const testiData = {
            ...req.body,
            sampul: sampulUrl || req.body.sampul
        };

        const [updated] = await Testi.update(testiData, {
            where: { id_testi: id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Testimoni tidak ditemukan' });
        }

        return res.status(200).json({ message: 'Testimoni berhasil diperbarui' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui testimoni' });
    }
};

// Fungsi untuk menghapus testimoni
exports.deleteTesti = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Testi.destroy({
            where: { id_testi: id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Testimoni tidak ditemukan' });
        }

        return res.status(200).json({ message: 'Testimoni berhasil dihapus' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat menghapus testimoni' });
    }
};
