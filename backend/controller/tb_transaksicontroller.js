const midtransClient = require('midtrans-client');
const { tb_Transaksi, Users, Video, Ebook, Kelas,detail_Transaksi } = require('../models');
const { Sequelize } = require('sequelize');


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
    harga,
    payment,
    bukti_bayar,
    status
  } = req.body;

  try {
    if (!id_user || !tipe_produk || !harga || !payment) {
      return res.status(400).json({ message: "Data tidak lengkap!" });
    }

    const tgl_transaksi = new Date();

    if (!(id_video || id_ebook || id_kelas)) {
      return res.status(400).json({ message: "Produk yang dipilih tidak valid!" });
    }

    const user = await Users.findOne({ where: { id_user } });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan!" });
    }
    const email = user.email;

    const transaction = await tb_Transaksi.create({
      id_user,
      id_video,
      id_ebook,
      id_kelas,
      tipe_produk,
      harga,
      payment,
      bukti_bayar,
      status,
      tgl_transaksi 
    });

    let productId = id_video || id_ebook || id_kelas;
    let productName = tipe_produk;
    let paymentDetails = payment === 'bank_transfer'
      ? { payment_type: 'bank_transfer', bank_transfer: { bank: 'bca' } }
      : { payment_type: payment };

    const parameter = {
      transaction_details: {
        order_id: `ORDER-${transaction.id_transaksi}`,
        gross_amount: harga,
      },
      customer_details: {
        first_name: user.nama_user,
        email,
      },
      item_details: [
        { id: productId, price: harga, quantity: 1, name: productName },
      ],
      ...paymentDetails,
    };

    const response = await snap.createTransaction(parameter);
    await transaction.update({ payment_url: response.redirect_url });

    const detail_Transaksi = await detail_Transaksi.create({
      id_transaksi: transaction.id_transaksi,
      order_id: `ORDER-${transaction.id_transaksi}`,
      id_user,
      id_video,
      id_ebook,
      id_kelas,
      tipe_produk,
      harga,
      payment,
      bukti_bayar,
      status,
    });

    res.status(201).json({
      message: 'Transaksi berhasil dibuat',
      transaction,
      detail_Transaksi,
      payment_url: response.redirect_url,
    });
  } catch (error) {
    console.error("Error saat membuat transaksi:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// Fungsi untuk memeriksa status transaksi
const checkTransactionStatus = async (req, res) => {
  const { order_id } = req.params; 

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
    // Mengambil semua transaksi dengan status bukan 'pending'
    const transactions = await tb_Transaksi.findAll({
      where: {
        status: { [Sequelize.Op.ne]: 'pending' } 
      },
      include: [{
        model: detail_Transaksi,
        as: 'detail_Transaksi' 
      }]
    });

    res.status(200).json({
      message: 'Data transaksi berhasil diambil',
      transactions
    });
  } catch (error) {
    console.error('Error mengambil transaksi:', error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};



const getDetailTransaksi = async (req, res) => {
  const { order_id } = req.params;

  // Validasi input
  if (!order_id) {
    return res.status(400).json({ message: "Order ID tidak ditemukan!" });
  }

  try {
    const detailTransaksi = await detail_Transaksi.findOne({
      where: { order_id },
      include: [
        {
          model: tb_Transaksi,
          as: 'tb_transaksi',  // Alias sesuai dengan asosiasi
          attributes: ['id_transaksi', 'payment', 'status'],
        },
        {
          model: Users,
          as: 'users',
          attributes: ['nama'],
        },
      ],
    });

    if (!detailTransaksi) {
      return res.status(404).json({ message: "Detail transaksi tidak ditemukan!" });
    }

    res.status(200).json({ message: 'Detail transaksi ditemukan', detailTransaksi });
  } catch (error) {
    console.error("Error saat mendapatkan detail transaksi:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

module.exports = { createTransaction, checkTransactionStatus, getAllTransactions,getDetailTransaksi };
