const { SuccessResponse } = require("../responseHandle/success.response");
const ContactService = require("../services/contact.service");

class ContactController {
  getContacts = async (req, res) => {
    const contacts = await ContactService.getContacts();
    new SuccessResponse({
      message: "Lấy danh sách contact thành công",
      data: contacts,
    }).send(res);
  };

  createContact = async (req, res) => {
    const contact = await ContactService.createContact(req.body);
    new SuccessResponse({
      message: "Tạo contact mới thành công",
      data: contact,
    }).send(res);
  };

  deleteContact = async (req, res) => {
    await ContactService.deleteContact(req.params.id);
    new SuccessResponse({
      message: "Xóa contact thành công",
    }).send(res);
  };

  updateContact = async (req, res) => {
    await ContactService.updateContact(req.params.id, req.body);
    new SuccessResponse({
      message: "Cập nhật contact thành công",
    }).send(res);
  };
}

module.exports = new ContactController();
