// src/routes/Booking.js
const express = require('express');
const router = express.Router();
const Booking = require('../controllers/Booking');

// KHÔNG dùng router.use ở đây!
// Dùng đúng method: GET/POST với handler tương ứng
router.get('/:veId/summary',  Booking.summary);
router.post('/:veId/quote',    Booking.quote);
router.post('/:veId/checkout', Booking.checkout);

module.exports = router; // xuất RA CHÍNH router, không phải object khác
