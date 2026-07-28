import "./AddMedicine.css";
import { useState } from "react";
import axios from "axios";

function AddMedicine() {
  const [form, setForm] = useState({
    batchId: "",
    name: "",
    manufacturer: "",
    expiry: ""
  });

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:4000/api/medicine/create", form);
      alert("✅ Medicine Added!");
    } catch {
      alert("❌ Error adding medicine");
    }
  };
  /* added a comment to explain the return statement */

  return (
    <div className="add-container">
      <h1 className="title">Add Medicine</h1>
      <p className="subtitle">
        Register a new medicine batch to the inventory.
      </p>

      <div className="form-card">
        <h2 className="form-title">➕ New Entry</h2>
        <p className="form-sub">Fill in the details below carefully.</p>

        <label>Batch ID</label>
        <input
          placeholder="e.g. BATCH-2026-001"
          onChange={(e) =>
            setForm({ ...form, batchId: e.target.value })
          }
        />

        <label>Medicine Name</label>
        <input
          placeholder="e.g. Amoxicillin 500mg"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <label>Manufacturer</label>
        <input
          placeholder="e.g. PharmaCorp Inc."
          onChange={(e) =>
            setForm({ ...form, manufacturer: e.target.value })
          }
        />

        <label>Expiry Date</label>
        <input
          type="date"
          onChange={(e) =>
            setForm({ ...form, expiry: e.target.value })
          }
        />

        <button onClick={handleSubmit}>
          Add to Inventory
        </button>
      </div>
    </div>
  );
}

export default AddMedicine;