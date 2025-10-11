const express = require('express');
const router = express.Router();
const controllers = require('../controllers/Auth');
const { requireLogin } = require('../middleware/auth');


router.post('/register', controllers.register);
router.post('/login', controllers.login);
router.post('/logout', requireLogin, controllers.logout);
//check login
router.get('/me', requireLogin, controllers.me);

module.exports = router;
