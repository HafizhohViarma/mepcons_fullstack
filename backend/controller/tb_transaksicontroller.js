const midtransClient = require('midtrans-client');
const { tb_Transaksi, Users, detail_Transaksi } = require('../models');
const { Sequelize } = require('sequelize');

// Konfigurasi Midtrans Client
let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: 'SB-Mid-server-Umo98FDRhYMe_i8LtdPQjo_b',
  clientKey: 'SB-Mid-client-4lyU63vBBMu5aRhO',
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
    status,
  } = req.body;

  try {
    // Validasi input
    if (!id_user || !tipe_produk || !harga || !payment) {
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
      bukti_bayar,
      status: status || 'pending', // Set default status sebagai 'pending'
      tgl_transaksi: new Date(),
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
        full_name: user.nama, // Nama lengkap pengguna
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
      bukti_bayar,
      status: status || 'pending',
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

//  mendapatkan semua transaksi
const getAllTransactions = async (req, res) => {
  try {
    // Ambil semua transaksi
    const transactions = await tb_Transaksi.findAll({
      where: { status: { [Sequelize.Op.ne]: 'pending' } },
      include: [
        {
          model: detail_Transaksi,
          as: 'detail_Transaksi',
        },
      ],
    });

    // Sinkronisasi status transaksi dan detail transaksi
    const updatedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        try {
          // Ambil status dari Midtrans
          const midtransStatus = await snap.transaction.status(`ORDER-${transaction.id_transaksi}`);

          // Update status transaksi jika berbeda
          if (transaction.status !== midtransStatus.transaction_status) {
            await transaction.update({ status: midtransStatus.transaction_status });
          }

          // Perbarui status di detail transaksi terkait
          const detailTransaksis = transaction.detail_Transaksi;
          for (const detail of detailTransaksis) {
            if (detail.status !== midtransStatus.transaction_status) {
              await detail.update({ status: midtransStatus.transaction_status });
            }
          }

          return {
            ...transaction.toJSON(),
            status: midtransStatus.transaction_status,
            detail_Transaksi: detailTransaksis.map((detail) => ({
              ...detail.toJSON(),
              status: midtransStatus.transaction_status, // Pastikan data yang dikembalikan sinkron
            })),
          };
        } catch (error) {
          console.error(`Error sinkronisasi transaksi ID ${transaction.id_transaksi}:`, error);
          return transaction; // Jika gagal sinkron, kembalikan data lama
        }
      })
    );

    // Kembalikan hasil transaksi yang sudah disinkronkan
    res.status(200).json({
      message: 'Data transaksi berhasil diambil dan disinkronisasi',
      transactions: updatedTransactions,
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
    // Cari detail transaksi berdasarkan `order_id`
    const detailTransaksi = await detail_Transaksi.findOne({
      where: { order_id },
      include: [
        {
          model: tb_Transaksi,
          as: 'tb_transaksi',
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
      return res.status(404).json({ message: 'Detail transaksi tidak ditemukan!' });
    }

    // Ambil transaksi terkait untuk sinkronisasi
    const transaksi = await tb_Transaksi.findOne({
      where: { id_transaksi: detailTransaksi.id_transaksi },
    });

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi terkait tidak ditemukan!' });
    }

    // Sinkronisasi status transaksi dengan Midtrans
    const midtransStatus = await snap.transaction.status(order_id);
    if (transaksi.status !== midtransStatus.transaction_status) {
      await transaksi.update({ status: midtransStatus.transaction_status });
    }

    // Perbarui detail transaksi jika diperlukan
    detailTransaksi.status = midtransStatus.transaction_status;

    // Kembalikan detail transaksi yang sudah disinkronkan
    res.status(200).json({
      message: 'Detail transaksi ditemukan dan disinkronkan',
      detailTransaksi,
    });
  } catch (error) {
    console.error('Error saat mendapatkan detail transaksi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

// sinkron status transaksi 
const syncTransactionStatus = async (transactions) => {
  const updatedTransactions = [];
  for (const transaction of transactions) {
    try {
    
      const midtransStatus = await snap.transaction.status(`ORDER-${transaction.id_transaksi}`);
      
      
      if (transaction.status !== midtransStatus.transaction_status) {
        await transaction.update({ status: midtransStatus.transaction_status });
      }

      updatedTransactions.push({ 
        ...transaction.toJSON(), 
        status: midtransStatus.transaction_status 
      });
    } catch (error) {
      console.error(`Error sinkronisasi transaksi ID ${transaction.id_transaksi}:`, error);
      updatedTransactions.push(transaction); 
    }
  }
  return updatedTransactions;
};


module.exports = { createTransaction, checkTransactionStatus, getAllTransactions, getDetailTransaksi };
