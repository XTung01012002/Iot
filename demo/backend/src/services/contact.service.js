const { BadRequestError } = require("../responseHandle/error.response");
const { contactSchema } = require("../models/contact.model");
const OAuthBitrixService = require("./OauthBitrix.service");

class ContactService {
  static getContacts = async () => {
    console.log("Lấy danh sách contact từ Bitrix");
    // const bitrixContacts = await OAuthBitrixService.callBitrixAPI(
    //   "crm.contact.list"
    // );

    // if (!bitrixContacts || !bitrixContacts.result) {
    //   console.error("Lỗi khi lấy danh sách contact từ Bitrix:", bitrixContacts);
    //   return [];
    // }
    // console.log("Danh sách contact từ Bitrix:", bitrixContacts.result);

    const dbContacts = await contactSchema.find();

    // // Gộp dữ liệu từ Bitrix và DB
    // const formattedContacts = bitrixContacts.result.map((contact) => {
    //   const dbContact =
    //     dbContacts.find((db) => db.bitrixId === contact.ID) || {};

    //   return {
    //     bitrixId: contact.ID,
    //     name: contact.NAME || "Không có tên",
    //     email:
    //       contact.HAS_EMAIL === "Y" && contact.EMAIL?.length
    //         ? contact.EMAIL[0].VALUE
    //         : "N/A",
    //     phone:
    //       contact.HAS_PHONE === "Y" && contact.PHONE?.length
    //         ? contact.PHONE[0].VALUE
    //         : "N/A",
    //     website: contact.WEBSITE || "N/A",
    //     address: {
    //       ward: contact.ADDRESS_2 || "",
    //       district: contact.ADDRESS_REGION || "",
    //       city: contact.ADDRESS_CITY || "",
    //     },
    //     bank: {
    //       name: contact.UF_CRM_1678901234 || dbContact.bank?.name || "",
    //       account: contact.UF_CRM_1678905678 || dbContact.bank?.account || "",
    //     },
    //   };
    // });
    // console.log("Danh sách contact:", formattedContacts);

    return dbContacts;
  };

  static createContact = async (contactData) => {
    console.log("Tạo contact mới:", contactData);

    // Chuyển đổi dữ liệu đúng format Bitrix24 yêu cầu
    const formattedData = {
      NAME: contactData.name,
      EMAIL: [{ VALUE: contactData.email, VALUE_TYPE: "WORK" }],
      PHONE: [{ VALUE: contactData.phone, VALUE_TYPE: "WORK" }],
      WEBSITE: contactData.website || "",
      UF_CRM_1678901234: contactData.bank?.name || "", // Custom field: Tên ngân hàng
      UF_CRM_1678905678: contactData.bank?.account || "", // Custom field: Số tài khoản
    };

    const response = await OAuthBitrixService.callBitrixAPI("crm.contact.add", {
      fields: formattedData,
    });

    const newContact = new contactSchema({
      ...contactData,
      bitrixId: response.result,
    });
    await newContact.save();
    return newContact;
  };

  static deleteContact = async (id) => {
    console.log("Xóa contact:", id);
    await OAuthBitrixService.callBitrixAPI("crm.contact.delete", { id });
    await contactSchema.findOneAndDelete({ bitrixId: id });

    return true;
  };

  static updateContact = async (id, contactData) => {
    console.log("Cập nhật contact:", id, contactData);

    // Format dữ liệu cho Bitrix
    const formattedData = {
      NAME: contactData.name,
      EMAIL: [{ VALUE: contactData.email, VALUE_TYPE: "WORK" }],
      PHONE: [{ VALUE: contactData.phone, VALUE_TYPE: "WORK" }],
      WEBSITE: contactData.website || "",
      UF_CRM_1678901234: contactData.bank?.name || "", // Custom field: Tên ngân hàng
      UF_CRM_1678905678: contactData.bank?.account || "", // Custom field: Số tài khoản
    };

    // Cập nhật trên Bitrix
    await OAuthBitrixService.callBitrixAPI("crm.contact.update", {
      id,
      fields: formattedData,
    });

    // Cập nhật trên DB
    await contactSchema.findOneAndUpdate({ bitrixId: id }, contactData, {
      new: true,
    });

    return { success: true };
  };
}

module.exports = ContactService;
