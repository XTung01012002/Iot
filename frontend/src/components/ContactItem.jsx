import { deleteContact } from "../services/contactService";
import { useContext } from "react";
import { ContactContext } from "../context/ContactContext";

const ContactItem = ({ contact }) => {
  const { fetchContacts } = useContext(ContactContext);

  const handleDelete = async () => {
    await deleteContact(contact.id);
    fetchContacts();
  };

  return (
    <tr>
      <td>{contact.name}</td>
      <td>{contact.email}</td>
      <td>{contact.phone}</td>
      <td>{contact.website}</td>
      <td>
        <button onClick={handleDelete}>Xóa</button>
      </td>
    </tr>
  );
};

export default ContactItem;
