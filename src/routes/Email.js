const express = require("express");
const router = express.Router();
const EmailController = require("../controllers/Email");

router.post("/send-ticket-email", EmailController.sendTicketEmail);

module.exports = router;
