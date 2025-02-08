import { api } from "./api";

export const getContacts = async () => {
    try {
      const response = await api.get("/contact");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      throw error;
    }
  };

export const createContact = async (contact) => {
  console.log("📌 Tạo contact mới:", contact);
  const response = await api.post("/contact", contact);
  return response.data;
};

export const updateContact = async (id, contact) => {
  console.log("📌 Cập nhật contact:", id, contact);
  const response = await api.put(`/contact/${id}`, contact);
  return response.data;
};

export const deleteContact = async (id) => {
  console.log("📌 Xóa contact:", id);
  const response = await api.delete(`/contact/${id}`);
  return response.data;
};

