const { SuccessResponse } = require("../responseHandle/success.response");
const OAuthBitrixService = require("../services/OauthBitrix.service");

class OAuthBitrixController {
  installApp = async (req, res, next) => {
    const tokens = await OAuthBitrixService.installApp(req);
    new SuccessResponse({
      message: "Cài đặt ứng dụng thành công",
      data: tokens,
    }).send(res);
  };

  getContacts = async (req, res, next) => {
    const contacts = await OAuthBitrixService.getContacts();
    new SuccessResponse({
      message: "Lấy danh sách contact thành công",
      data: contacts,
    }).send(res);
  };
}

module.exports = new OAuthBitrixController();
