import { useState, useContext } from "react";
import { ContactContext } from "../context/ContactContext";

const ContactForm = () => {
  const { addContact } = useContext(ContactContext); // Dùng addContact từ context
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addContact(form); // Dùng addContact (nó sẽ tự gọi fetchContacts)
    setForm({ name: "", email: "", phone: "", website: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Tên" value={form.name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input type="text" name="phone" placeholder="Điện thoại" value={form.phone} onChange={handleChange} required />
      <input type="text" name="website" placeholder="Website" value={form.website} onChange={handleChange} />
      <button type="submit">Thêm</button>
    </form>
  );
};

export default ContactForm;
