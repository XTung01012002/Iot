const express = require("express");
const router = express.Router();

const OAuthBitrixController = require("../controllers/oAuthBitrix.controller");
const asyncHandle = require("../helpers/asyncHandler");

router.post("/install-app", asyncHandle(OAuthBitrixController.installApp));
router.get("/get-contacts", asyncHandle(OAuthBitrixController.getContacts));

module.exports = router;
