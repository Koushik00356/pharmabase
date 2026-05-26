import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddMedicine from "./pages/AddMedicine";
import Verify from "./pages/Verify";
import Transfer from "./pages/Transfer";
import Dashboard from "./pages/Dashboard";
import QRScanner from "./pages/QRScanner";
import History from "./pages/History";
import AllMedicines from "./pages/AllMedicines";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddMedicine />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/scan" element={<QRScanner />} />
        <Route path="/history" element={<History />} />
        <Route path="/all" element={<AllMedicines />} />
      </Routes>
    </Router>
  );
}

export default App;