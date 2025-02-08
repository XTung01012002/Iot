require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const { BadRequestError } = require("../responseHandle/error.response");

const TOKEN_FILE = process.env.TOKEN_FILE;
const CLIENT_ID = process.env.BITRIX_CLIENT_ID;
const CLIENT_SECRET = process.env.BITRIX_CLIENT_SECRET;
const BITRIX_API_URL = process.env.BITRIX_API_URL;

// Đọc & ghi file token
const saveTokens = (tokens) =>
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
const getTokens = () =>
  fs.existsSync(TOKEN_FILE) ? JSON.parse(fs.readFileSync(TOKEN_FILE)) : {};

class OAuthBitrixService {
  static installApp = async (req, res) => {
    const { AUTH_ID, REFRESH_ID, AUTH_EXPIRES, member_id } = req.body;
    // console.log("AUTH_ID, REFRESH_ID, AUTH_EXPIRES, member_id", AUTH_ID, REFRESH_ID, AUTH_EXPIRES, member_id);
    if (!AUTH_ID || !REFRESH_ID) {
      throw new BadRequestError("AUTH_ID hoặc REFRESH_ID không hợp lệ");
    }

    const tokens = {
      access_token: AUTH_ID,
      refresh_token: REFRESH_ID,
      expires_at: Date.now() + AUTH_EXPIRES * 1000, 
      member_id,
    };
    saveTokens(tokens);
    return tokens;
  };

  static callBitrixAPI = async (method, params = {}) => {
    let tokens = getTokens();
    if (!tokens.access_token) {
      throw new BadRequestError("Không có access token");
    }
    // Kiểm tra token còn hạn không
    if (Date.now() > tokens.expires_at) {
      tokens = await this.refreshAccessToken();
    }

    try {
      const response = await axios.get(`${BITRIX_API_URL}${method}`, {
        params: { ...params, auth: tokens.access_token },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(" Token hết hạn, đang làm mới...");
        tokens = await this.refreshAccessToken();
        return this.callBitrixAPI(method, params);
      }
      throw new BadRequestError(error.message);
    }
  };

  static refreshAccessToken = async () => {
    const tokens = getTokens();
    if (!tokens.refresh_token) {
      throw new BadRequestError("Không có refresh token");
    }

    try {
      const response = await axios.post(
        "https://oauth.bitrix.info/oauth/token/",
        {
          grant_type: "refresh_token",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: tokens.refresh_token,
        }
      );

      if (!response.data.access_token) {
        throw new Error("Làm mới token thất bại, cần cài đặt lại ứng dụng");
      }

      const newTokens = {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_at: Date.now() + response.data.expires_in * 1000, // Cập nhật expires_at mới
      };

      saveTokens(newTokens);
      return newTokens;
    } catch (error) {
      console.log("Lỗi khi làm mới token:", error.message);
      throw new BadRequestError(error.message);
    }
  };

  static getContacts = async () => {
    const tokens = getTokens();
    console.log("🔑 Access Token:", tokens.access_token);
    const contacts = await this.callBitrixAPI("crm.contact.list");
    console.log("📋 Contacts API Response:", contacts);
    return contacts.result;                                            
  };
}

module.exports = OAuthBitrixService;
