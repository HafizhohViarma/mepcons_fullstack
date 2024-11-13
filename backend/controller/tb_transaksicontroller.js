const midtransClient = require('midtrans-client');
const { tb_Transaksi, Users, Video, Ebook, Kelas } = require('../models');

// Inisialisasi Midtrans Snap
let snap = new midtransClient.Snap({
  isProduction: false, 
  serverKey: 'SB-Mid-server-Umo98FDRhYMe_i8LtdPQjo_b',
  clientKey: 'SB-Mid-client-4lyU63vBBMu5aRhO'
});

// Fungsi untuk membuat transaksi
const createTransaction = async (req, res) => {
  const {
    id_user,
    id_video,
    id_ebook,
    id_kelas,
    tipe_produk,
    tgl_transaksi,
    harga,
    payment,
    bukti_bayar,
    status
  } = req.body;

  try {
    // Validasi input
    if (!id_user || !tipe_produk || !tgl_transaksi || !harga || !payment) {
      return res.status(400).json({ message: "Data tidak lengkap!" });
    }

    // Membuat transaksi baru di database
    const transaction = await tb_Transaksi.create({
      id_user,
      id_video,
      id_ebook,
      id_kelas,
      tipe_produk,
      tgl_transaksi,
      harga,
      payment,
      bukti_bayar,
      status
    });

    // Membuat transaksi Midtrans untuk mendapatkan payment URL
    const parameter = {
      transaction_details: {
        order_id: `ORDER-${transaction.id_transaksi}`,
        gross_amount: harga,
      },
      customer_details: {
        first_name: "Customer",
        email: "customer@example.com"
      },
      item_details: [
        {
          id: id_video || id_ebook || id_kelas,
          price: harga,
          quantity: 1,
          name: tipe_produk === 'video' ? 'Video' : tipe_produk === 'ebook' ? 'Ebook' : 'Kelas'
        }
      ]
    };

    const response = await snap.createTransaction(parameter);

    // Menyimpan payment_url ke dalam transaksi
    await transaction.update({ payment_url: response.redirect_url });

    // Mengirimkan respon dengan URL pembayaran
    res.status(201).json({
      message: 'Transaksi berhasil dibuat',
      transaction,
      payment_url: response.redirect_url
    });
  } catch (error) {
    console.error("Error saat membuat transaksi:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// Fungsi untuk memeriksa status transaksi
const checkTransactionStatus = async (req, res) => {
  const { order_id } = req.params; // Mengambil order_id dari parameter URL

  try {
    // Memeriksa status transaksi dari Midtrans
    const statusResponse = await snap.transaction.status(order_id);

    
    const transaction = await tb_Transaksi.findOne({ where: { id_transaksi: order_id.split('-')[1] } });
    if (transaction) {
      await transaction.update({ status: statusResponse.transaction_status });
    }

  
    res.status(200).json({
      message: 'Status transaksi berhasil diperoleh',
      status: statusResponse.transaction_status,
      response: statusResponse
    });
  } catch (error) {
    console.error("Error memeriksa status transaksi:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// Fungsi untuk mendapatkan semua transaksi
const getAllTransactions = async (req, res) => {
  try {
    // Mengambil semua data transaksi dari database tanpa menggabungkan model lain
    const transactions = await tb_Transaksi.findAll();

    // Mengirimkan respon JSON dengan semua data transaksi
    res.status(200).json({
      message: 'Semua transaksi berhasil diperoleh',
      transactions
    });
  } catch (error) {
    console.error("Error saat mengambil semua transaksi:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};



module.exports = { createTransaction, checkTransactionStatus, getAllTransactions };




