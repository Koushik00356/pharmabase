import { useState } from "react";
import axios from "axios";
import "./Verify.css";

function Verify() {
  const [id, setId] = useState("");
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");

  const verify = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/medicine/verify/${id}`
      );
      const d = res.data;

      if (!d) setStatus("FAKE");
      else if (new Date(d.expiry) < new Date()) setStatus("EXPIRED");
      else if (d.scanCount > 5) setStatus("SUSPICIOUS");
      else setStatus("SAFE");

      setData(d);
    } catch {
      setStatus("FAKE");
      setData(null);
    }
  };

  return (
    <div className="transfer-container"> {/* SAME AS TRANSFER */}
      <h1 className="title">Verify Medicine</h1>
      <p className="subtitle">Scan and verify medicine authenticity.</p>

      <div className="form-card">
        <h2 className="form-title">🔍 Verification</h2>
        <p className="form-sub">Enter details carefully.</p>

        <label>Batch ID</label>
        <input
          type="text"
          placeholder="e.g. BATCH-2026-001"
          onChange={(e) => setId(e.target.value)}
        />

        <button onClick={verify}>Scan & Verify</button>

        {status && (
          <div className={`status ${status.toLowerCase()}`}>
            {status}
          </div>
        )}

        {data && (
          <div className="data-card">
            <p><strong>Name:</strong> {data.name}</p>
            <p><strong>Owner:</strong> {data.owner}</p>
            <p><strong>Scans:</strong> {data.scanCount}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Verify;