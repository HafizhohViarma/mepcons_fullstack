const express = require('express');
const router = express.Router();
const transactionController = require('../controller/tb_transaksicontroller.js');

// Route untuk membuat transaksi
router.post('/transactions', transactionController.createTransaction);
router.get('/status/:order_id', transactionController.checkTransactionStatus);
router.get('/all',transactionController. getAllTransactions);
module.exports = router;
