const express = require("express");
const router = express.Router();

const ContactController = require("../controllers/contact.controller");
const asyncHandle = require("../helpers/asyncHandler");

router.get("/", asyncHandle(ContactController.getContacts));
router.post("/", asyncHandle(ContactController.createContact));
router.delete("/:id", asyncHandle(ContactController.deleteContact));
router.put("/:id", asyncHandle(ContactController.updateContact));

module.exports = router;
