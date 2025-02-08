import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ContactProvider } from "./context/ContactContext";
import ContactsPage from "./pages/ContactsPage";

function App() {
  return (
    <ContactProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ContactsPage />} />
        </Routes>
      </Router>
    </ContactProvider>
  );
}

export default App;
