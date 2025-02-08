import { useEffect, useState } from "react";
import {
  getContacts,
  createContact,
  deleteContact,
  updateContact,
} from "../services/contactService";
import { Pagination } from "react-bootstrap";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    address: { ward: "", district: "", city: "" },
    bank: { name: "", account: "" },
  });
  const [editingContact, setEditingContact] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 7;

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await getContacts();
      setContacts(response.data || []);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách contact:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setNewContact({
        ...newContact,
        address: { ...newContact.address, [field]: value },
      });
    } else if (name.startsWith("bank.")) {
      const field = name.split(".")[1];
      setNewContact({
        ...newContact,
        bank: { ...newContact.bank, [field]: value },
      });
    } else {
      setNewContact({ ...newContact, [name]: value });
    }
  };

  const handleAdd = async () => {
    if (!newContact.name || !newContact.email || !newContact.phone) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    try {
      await createContact(newContact);
      setNewContact({
        name: "",
        email: "",
        phone: "",
        website: "",
        address: { ward: "", district: "", city: "" },
        bank: { name: "", account: "" },
      });
      fetchContacts();
    } catch (error) {
      console.error("Lỗi khi thêm contact:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa contact này?")) return;
    try {
      await deleteContact(id);
      fetchContacts();
    } catch (error) {
      console.error("Lỗi khi xóa contact:", error);
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setNewContact(contact);
  };

  const handleUpdate = async () => {
    if (!editingContact) return;
    try {
      await updateContact(editingContact.bitrixId, newContact);
      setEditingContact(null);
      setNewContact({
        name: "",
        email: "",
        phone: "",
        website: "",
        address: { ward: "", district: "", city: "" },
        bank: { name: "", account: "" },
      });
      fetchContacts();
    } catch (error) {
      console.error("Lỗi khi cập nhật contact:", error);
    }
  };

  // Phân trang
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );
  const totalPages = Math.ceil(contacts.length / contactsPerPage);

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="text-center text-primary">Quản lý Contact</h2>

        {/* Form nhập contact */}
        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="text"
              name="name"
              value={newContact.name}
              onChange={handleChange}
              placeholder="Tên"
              className="form-control"
            />
          </div>
          <div className="col-md-4">
            <input
              type="email"
              name="email"
              value={newContact.email}
              onChange={handleChange}
              placeholder="Email"
              className="form-control"
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              name="phone"
              value={newContact.phone}
              onChange={handleChange}
              placeholder="Điện thoại"
              className="form-control"
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <input
              type="text"
              name="website"
              value={newContact.website}
              onChange={handleChange}
              placeholder="Website"
              className="form-control"
            />
          </div>
        </div>

        <h5>Địa chỉ</h5>
        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="text"
              name="address.ward"
              value={newContact.address.ward}
              onChange={handleChange}
              placeholder="Phường/Xã"
              className="form-control"
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              name="address.district"
              value={newContact.address.district}
              onChange={handleChange}
              placeholder="Quận/Huyện"
              className="form-control"
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              name="address.city"
              value={newContact.address.city}
              onChange={handleChange}
              placeholder="Tỉnh/Thành phố"
              className="form-control"
            />
          </div>
        </div>

        <h5>Thông tin ngân hàng</h5>
        <div className="row mb-4">
          <div className="col-md-6">
            <input
              type="text"
              name="bank.name"
              value={newContact.bank.name}
              onChange={handleChange}
              placeholder="Tên ngân hàng"
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              name="bank.account"
              value={newContact.bank.account}
              onChange={handleChange}
              placeholder="Số tài khoản"
              className="form-control"
            />
          </div>
        </div>

        <div className="text-center mb-4">
          {editingContact ? (
            <button onClick={handleUpdate} className="btn btn-warning">
              Cập nhật
            </button>
          ) : (
            <button onClick={handleAdd} className="btn btn-primary">
              Thêm
            </button>
          )}
        </div>

        {/* Bảng danh sách */}
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Điện thoại</th>
                <th>Website</th>
                <th>Địa chỉ</th>
                <th>Ngân hàng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentContacts.map((contact) => (
                <tr key={contact.bitrixId}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.website}</td>
                  <td>
                    {contact.address
                      ? `${contact.address.ward || ""}, ${
                          contact.address.district || ""
                        }, ${contact.address.city || ""}`
                      : "Chưa có"}
                  </td>
                  <td>
                    {contact.bank
                      ? `${contact.bank.name || "Chưa có"} - ${
                          contact.bank.account || "Chưa có"
                        }`
                      : "Chưa có"}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(contact)}
                      className="btn btn-success btn-sm me-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(contact.bitrixId)}
                      className="btn btn-danger btn-sm"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PHÂN TRANG */}
        {totalPages > 1 && (
          <Pagination className="justify-content-center">
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default ContactList;
