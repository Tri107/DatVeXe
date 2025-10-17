const express = require('express');
const router = express.Router();
const controllers = require('../controllers/Auth');
const { requireLogin } = require('../middleware/auth');


router.post('/register', controllers.register);
router.post('/login', controllers.login);
router.post('/logout', requireLogin, controllers.logout);
router.post('/send-otp', controllers.sendOtp);
router.post('/verify-otp', controllers.verifyOtp);
//check login
router.get('/me', requireLogin, controllers.me);

module.exports = router;
