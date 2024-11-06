const { Ebook } = require('../models'); 
const path = require('path'); 

// Fungsi untuk membuat ebook baru
exports.createEbook = async (req, res) => {
    try {
        console.log(req.files); 
        const sampulEbook = req.files['sampul_ebook'] ? req.files['sampul_ebook'][0].filename : null;
        const ebookFile = req.files['ebook_file'] ? req.files['ebook_file'][0].filename : null;

        // Validasi format file ebook
        if (ebookFile && path.extname(ebookFile) !== '.pdf') {
            return res.status(400).json({ message: 'File ebook harus dalam format PDF' });
        }

        // Data yang akan disimpan ke database
        const ebookData = {
            sampul_ebook: sampulEbook ? `${req.protocol}://${req.get('host')}/uploads/${sampulEbook}` : null,
            ebook_file: ebookFile ? `${req.protocol}://${req.get('host')}/uploads/${ebookFile}` : null,
            judul_ebook: req.body.judul_ebook,
            deskripsi_ebook: req.body.deskripsi_ebook,
            harga_ebook: req.body.harga_ebook,
        };

        // Membuat ebook baru
        const newEbook = await Ebook.create(ebookData);
        return res.status(201).json(newEbook);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat membuat ebook' });
    }
};

// Fungsi untuk mendapatkan semua ebook
exports.getAllEbooks = async (req, res) => {
    try {
        const ebooks = await Ebook.findAll();
        return res.status(200).json(ebooks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil semua ebook' });
    }
};

// Fungsi untuk mendapatkan ebook berdasarkan ID
exports.getEbookById = async (req, res) => {
    try {
        const { id } = req.params;
        const ebook = await Ebook.findOne({ where: { id_ebook: id } });

        if (!ebook) {
            return res.status(404).json({ message: 'Ebook tidak ditemukan' });
        }

        return res.status(200).json(ebook);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil ebook' });
    }
};

// Fungsi untuk memperbarui ebook
exports.updateEbook = async (req, res) => {
    try {
        const { id } = req.params;

        // Ambil nama file dari unggahan baru
        const sampulEbook = req.files['sampul_ebook'] ? req.files['sampul_ebook'][0].filename : null;
        const ebookFile = req.files['ebook_file'] ? req.files['ebook_file'][0].filename : null;

        // Validasi format file ebook jika ada file baru yang di-upload
        if (ebookFile && path.extname(ebookFile) !== '.pdf') {
            return res.status(400).json({ message: 'File ebook harus dalam format PDF' });
        }

        // Data yang akan diperbarui
        const ebookData = {
            sampul_ebook: sampulEbook ? `${req.protocol}://${req.get('host')}/uploads/${sampulEbook}` : req.body.sampul_ebook,
            ebook_file: ebookFile ? `${req.protocol}://${req.get('host')}/uploads/${ebookFile}` : req.body.ebook_file,
            judul_ebook: req.body.judul_ebook,
            deskripsi_ebook: req.body.deskripsi_ebook,
            harga_ebook: req.body.harga_ebook,
        };

        const [updated] = await Ebook.update(ebookData, {
            where: { id_ebook: id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Ebook tidak ditemukan' });
        }

        return res.status(200).json({ message: 'Ebook berhasil diperbarui' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui ebook' });
    }
};

// Fungsi untuk menghapus ebook
exports.deleteEbook = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Ebook.destroy({
            where: { id_ebook: id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Ebook tidak ditemukan' });
        }

        return res.status(200).json({ message: 'Ebook berhasil dihapus' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat menghapus ebook' });
    }
};
