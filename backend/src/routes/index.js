const express = require("express");
const router = express.Router();

router.use("/api/oAuthBitrix", require("./oAuthBitrix.router"));
router.use("/api/contact", require("./contact.router"));

module.exports = router;
