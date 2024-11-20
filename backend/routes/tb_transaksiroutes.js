const express = require('express');
const router = express.Router();
const transactionController = require('../controller/tb_transaksicontroller.js');


router.post('/transactions', transactionController.createTransaction);
router.get('/status/:order_id', transactionController.checkTransactionStatus);
router.get('/all',transactionController. getAllTransactions);
router.get('/detail/:order_id',transactionController. getDetailTransaksi);
module.exports = router;
