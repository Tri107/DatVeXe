const express = require('express');
const router = express.Router();

router.use('/', require('./auth'));       
router.use('/loaixe', require('./loaixe'));


module.exports = router;