const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/Payment');

router.post('/vnpay/create', PaymentController.createPayment);
router.get('/vnpay/return', PaymentController.vnpayReturn);

module.exports = router;
