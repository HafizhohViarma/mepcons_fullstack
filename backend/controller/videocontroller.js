const db = require('../models');
const { Video, VideoFile } = db;
const { v4: uuidv4 } = require('uuid');

// Menyimpan video baru
exports.createVideo = async (req, res) => {
    const { judul_video, keterangan_video, harga_video } = req.body;

    if (!judul_video) {
        return res.status(400).json({ message: 'Judul video is required' });
    }

    try {
        const sampulVideoUrl = req.files['sampul_video']
            ? `${req.protocol}://${req.get('host')}/uploads/${req.files['sampul_video'][0].filename}`
            : null;

        // Generate UUID untuk id_video secara manual
        const id_video = uuidv4(); // Generate id_video
        const newVideo = await Video.create({
            id_video,  // Set id_video dengan UUID manual
            judul_video,
            keterangan_video,
            harga_video,
            sampul_video: sampulVideoUrl,
        });

        if (req.files['video_file']) {
            const videoFiles = req.files['video_file'].map(file => ({
                id_file: uuidv4(),  // Set id_file dengan UUID manual untuk setiap video file
                id_video, // Pastikan menggunakan id_video yang sama
                sub_judul: file.originalname,
                video_file: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
            }));

            await VideoFile.bulkCreate(videoFiles);
        }

        res.status(201).json({ message: 'Video added successfully', video: newVideo });
    } catch (error) {
        console.error('Error adding video:', error);
        res.status(500).json({ message: 'Error adding video', error: error.message });
    }
};

// Mendapatkan semua video beserta file terkait
exports.getAllVideos = async (req, res) => {
    try {
        const videos = await Video.findAll({
            include: {
                model: VideoFile,
                as: 'file',
                attributes: ['id_file', 'id_video', 'sub_judul', 'video_file'],
            },
        });
        res.status(200).json(videos);
    } catch (error) {
        console.error('Error retrieving videos:', error);
        res.status(500).json({ message: 'Error retrieving videos', error: error.message });
    }
};


// Mendapatkan video berdasarkan ID
exports.getDetailVideo = async (req, res) => {
    const videoId = req.params.id_video.trim();
    console.log("Mencari video dengan ID:", videoId);  

    try {
        const video = await Video.findOne({
            where: { id_video: videoId },
            attributes: ['id_video'],  
            include: [
                {
                    model: VideoFile,
                    as: 'file',
                    attributes: ['id_file', 'sub_judul', 'video_file'],  
                },
            ],
        });

        if (!video) {
            console.log("Video tidak ditemukan");  
            return res.status(404).json({ message: 'Video not found' });
        }

        // Membuat responseData dengan data yang benar
        const responseData = {
            id_video: video.id_video,
            files: video.file.map(f => ({
                id_file: f.id_file,  // Menambahkan id_file
                sub_judul: f.sub_judul,
                video_file: f.video_file,
            })),
        };

        res.json(responseData); 
    } catch (error) {
        console.error('Error retrieving video:', error);
        res.status(500).json({ message: 'Error retrieving video', error: error.message });
    }
};


exports.updateVideo = async (req, res) => {
    const videoId = req.params.id_video.trim();
    const { judul_video, keterangan_video, harga_video } = req.body;

    try {
        // Mencari video berdasarkan id_video
        const video = await Video.findByPk(videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Update data utama dari video
        video.judul_video = judul_video || video.judul_video;
        video.keterangan_video = keterangan_video || video.keterangan_video;
        video.harga_video = harga_video || video.harga_video;
        
        if (req.files['sampul_video']) {
            video.sampul_video = `${req.protocol}://${req.get('host')}/uploads/${req.files['sampul_video'][0].filename}`;
        }
        
        await video.save();

        // Update atau Tambahkan VideoFile jika ada file baru yang di-upload
        if (req.files['video_file']) {
            const updatedFiles = req.files['video_file'].map(file => ({
                id_video: video.id_video,
                sub_judul: file.originalname,
                video_file: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
            }));

            
            await VideoFile.destroy({ where: { id_video: videoId } });

            
            await VideoFile.bulkCreate(updatedFiles);
        }

        res.status(200).json({ message: 'Video updated successfully', video });
    } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({ message: 'Error updating video', error: error.message });
    }
};

exports.deleteVideo = async (req, res) => {
    const { id_video } = req.params;

    try {
        // Hapus file video terkait jika ada
        await VideoFile.destroy({ where: { id_video } });

        // Hapus video dari tabel tb_video
        const result = await Video.destroy({ where: { id_video } });

        if (result === 0) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ message: 'Error deleting video', error: error.message });
    }
};

exports.addVideoFile = async (req, res) => {
    const { id_video } = req.params; 
    const { sub_judul } = req.body; 

    try {
        // Validasi apakah video ada atau tidak
        const video = await Video.findByPk(id_video);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Mendapatkan file video yang diunggah
        const videoFile = req.file;
        if (!videoFile) {
            return res.status(400).json({ message: 'File video harus diunggah' });
        }

        // Menambahkan file baru untuk video yang sudah ada
        const newVideoFile = await VideoFile.create({
            id_file: uuidv4(),
            id_video,
            sub_judul,
            video_file: `${req.protocol}://${req.get('host')}/uploads/${videoFile.filename}`
        });

        res.status(201).json({ message: 'File video berhasil ditambahkan', videoFile: newVideoFile });
    } catch (error) {
        console.error('Error adding video file:', error);
        res.status(500).json({ message: 'Error adding video file', error: error.message });
    }
};

exports.updateVideoFile = async (req, res) => {
    const { id_video, id_file } = req.params;
    const { sub_judul } = req.body;

    try {
        // Validasi apakah video ada atau tidak
        const video = await Video.findByPk(id_video);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Cari file video berdasarkan id_file
        const videoFile = await VideoFile.findOne({
            where: {
                id_file: id_file,
                id_video: id_video,
            }
        });

        if (!videoFile) {
            return res.status(404).json({ message: 'File video not found' });
        }

        // Jika ada file baru yang diunggah, perbarui dengan file baru
        if (req.file) {
            videoFile.video_file = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        // Perbarui sub judul jika ada
        if (sub_judul) {
            videoFile.sub_judul = sub_judul;
        }

        // Simpan perubahan
        await videoFile.save();

        res.status(200).json({ message: 'File video berhasil diperbarui', videoFile });
    } catch (error) {
        console.error('Error updating video file:', error);
        res.status(500).json({ message: 'Error updating video file', error: error.message });
    }
};

exports.deleteVideoFile = async (req, res) => {
    const { id_video, id_file } = req.params;

    try {
        // Cari file video berdasarkan id_file dan id_video
        const videoFile = await VideoFile.findOne({
            where: {
                id_file: id_file,
                id_video: id_video,
            }
        });

        if (!videoFile) {
            return res.status(404).json({ message: 'File video not found' });
        }

        // Hapus file video
        await videoFile.destroy();

        res.status(200).json({ message: 'File video berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting video file:', error);
        res.status(500).json({ message: 'Error deleting video file', error: error.message });
    }
};
// Menghitung jumlah video yang ada
exports.countVideos = async (req, res) => {
    try {
        // Menghitung jumlah video berdasarkan id_video
        const count = await Video.count({
            distinct: true,  
            col: 'id_video'  
        });

        
        res.status(200).json({
            message: 'Total videos',
            count: count
        });
    } catch (error) {
        // Menangani error jika terjadi
        console.error('Error counting videos:', error);
        res.status(500).json({
            message: 'Error counting videos',
            error: error.message
        });
    }
};


////