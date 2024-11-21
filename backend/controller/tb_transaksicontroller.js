const midtransClient = require('midtrans-client');
const { tb_Transaksi, Users, detail_Transaksi, sequelize } = require('../models');

// Konfigurasi Midtrans Client
let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: 'SB-Mid-server-Umo98FDRhYMe_i8LtdPQjo_b',
  clientKey: 'SB-Mid-client-4lyU63vBBMu5aRhO',
});

// Fungsi untuk membuat transaksi
// Fungsi untuk membuat transaksi
const createTransaction = async (req, res) => {
  const { id_user, id_video, id_ebook, id_kelas, tipe_produk, harga, payment, status, nama } = req.body;

  try {
    // Validasi input
    if (!id_user || !tipe_produk || !harga || !payment || !nama) {
      return res.status(400).json({ message: 'Data tidak lengkap!' });
    }

    if (!(id_video || id_ebook || id_kelas)) {
      return res.status(400).json({ message: 'Produk yang dipilih tidak valid!' });
    }

    // Ambil data pengguna
    const user = await Users.findOne({ where: { id_user } });
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan!' });
    }

    // Buat transaksi utama
    const transaction = await tb_Transaksi.create({
      id_user,
      id_video,
      id_ebook,
      id_kelas,
      tipe_produk,
      harga,
      payment,
      status: status || 'pending', // Set default status sebagai 'pending'
      tgl_transaksi: new Date(),
      nama, // Tambahkan field nama ke transaksi utama
    });

    // Parameter transaksi Midtrans
    const parameter = {
      transaction_details: {
        order_id: `ORDER-${transaction.id_transaksi}`, // Order ID unik
        gross_amount: harga, // Total harga transaksi
      },
      customer_details: {
        first_name: user.nama_user, // Nama pengguna
        email: user.email, // Email pengguna
        phone: user.telp || '-', // Tambahkan telepon (default jika kosong)
        full_name: nama, // Gunakan field nama untuk nama lengkap
      },
      item_details: [
        {
          id: id_video || id_ebook || id_kelas, // ID produk
          price: harga, // Harga produk
          quantity: 1,
          name: tipe_produk, // Nama produk (tipe)
        },
      ],
      payment_type: 'bank_transfer', // Jenis pembayaran
      bank_transfer: { bank: 'bca' }, // Bank transfer BCA
    };

    // Panggil Midtrans API untuk membuat transaksi
    const response = await snap.createTransaction(parameter);

    // Perbarui URL pembayaran ke transaksi utama
    await transaction.update({ payment_url: response.redirect_url });

    // Buat detail transaksi
    const detailTransaksi = await detail_Transaksi.create({
      id_transaksi: transaction.id_transaksi,
      order_id: `ORDER-${transaction.id_transaksi}`,
      id_user,
      id_video,
      id_ebook,
      id_kelas,
      tipe_produk,
      harga,
      payment,
      status: status || 'pending',
      nama, // Tambahkan nama ke detail transaksi
    });

    // Kembalikan respons sukses
    res.status(201).json({
      message: 'Transaksi berhasil dibuat',
      transaction,
      detailTransaksi,
      payment_url: response.redirect_url, // URL untuk pengguna melakukan pembayaran
    });
  } catch (error) {
    console.error('Error saat membuat transaksi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

// Fungsi untuk memeriksa status transaksi
const checkTransactionStatus = async (req, res) => {
  const { order_id } = req.params;

  try {
    if (!order_id) {
      return res.status(400).json({ message: 'Order ID tidak ditemukan!' });
    }

    const statusResponse = await snap.transaction.status(order_id);

    const transactionId = order_id.split('-')[1];
    const transaction = await tb_Transaksi.findOne({ where: { id_transaksi: transactionId } });
    if (transaction) {
      await transaction.update({ status: statusResponse.transaction_status });
    }

    // Perbarui status di detail transaksi terkait
    const detailTransaksis = await detail_Transaksi.findAll({ where: { id_transaksi: transactionId } });
    for (const detail of detailTransaksis) {
      if (detail.status !== statusResponse.transaction_status) {
        await detail.update({ status: statusResponse.transaction_status });
      }
    }

    res.status(200).json({
      message: 'Status transaksi berhasil diperoleh',
      status: statusResponse.transaction_status,
      response: statusResponse,
    });
  } catch (error) {
    console.error('Error memeriksa status transaksi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

// Mendapatkan semua transaksi
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await tb_Transaksi.findAll({
      include: [
        {
          model: detail_Transaksi,
          as: 'detail_Transaksi',
        },
        {
          model: Users,
          as: 'Users',
          attributes: ['nama'],
        },
      ],
    });

    res.status(200).json({
      message: 'Data transaksi berhasil diambil',
      transactions,
    });
  } catch (error) {
    console.error('Error mengambil transaksi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

// Fungsi untuk mendapatkan detail transaksi
const getDetailTransaksi = async (req, res) => {
  const { order_id } = req.params;

  if (!order_id) {
    return res.status(400).json({ message: 'Order ID tidak ditemukan!' });
  }

  try {
    const detailTransaksi = await detail_Transaksi.findOne({
      where: { order_id },
      include: [
        {
          model: tb_Transaksi,
          as: 'tb_transaksi',
          attributes: ['status'],
        },
        {
          model: Users,
          as: 'users',
          attributes: ['nama', 'email'],
        },
      ],
    });

    if (!detailTransaksi) {
      return res.status(404).json({ message: 'Detail transaksi tidak ditemukan!' });
    }

    res.status(200).json({
      message: 'Detail transaksi berhasil ditemukan',
      detailTransaksi,
    });
  } catch (error) {
    console.error('Error mengambil detail transaksi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

module.exports = {
  createTransaction,
  checkTransactionStatus,
  getAllTransactions,
  getDetailTransaksi,
};
