import { useState } from "react";
import axios from "axios";
import "./Transfer.css";

function Transfer() {
  const [batchId, setBatchId] = useState("");
  const [owner, setOwner] = useState("");

  const transfer = async () => {
    try {
      await axios.post("http://localhost:4000/api/medicine/transfer", {
        batchId,
        newOwner: owner,
      });
      alert("✅ Transferred successfully!");
    } catch (err) {
      alert("❌ Transfer failed");
      console.error(err);
    }
  };

  return (
    <div className="transfer-container">
      <h1 className="title">Transfer Medicine</h1>
      <p className="subtitle">Transfer ownership of a medicine batch.</p>

      <div className="form-card">
        <h2 className="form-title">🔄 Transfer Entry</h2>
        <p className="form-sub">Fill in the details below carefully.</p>

        <label>Batch ID</label>
        <input
          type="text"
          placeholder="e.g. BATCH-2026-001"
          onChange={(e) => setBatchId(e.target.value)}
        />

        <label>New Owner</label>
        <input
          type="text"
          placeholder="e.g. Distributor A"
          onChange={(e) => setOwner(e.target.value)}
        />

        <button onClick={transfer}>Transfer Ownership</button>
      </div>
    </div>
  );
}

export default Transfer;