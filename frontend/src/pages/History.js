import { useState } from "react";
import axios from "axios";
import "./History.css";

function History() {
  const [id, setId] = useState("");
  const [data, setData] = useState(null);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/medicine/history/${id}`
      );

      const parsed = res.data.map(item => {
        try {
          return typeof item === "string" ? JSON.parse(item) : item;
        } catch {
          return item;
        }
      });

      // 👉 take latest state (first after reverse)
      const latest = parsed.reverse()[0];

      setData(latest);

    } catch (err) {
      console.error(err);
      alert("❌ Error fetching history");
    }
  };

  return (
    <div className="history-page">

      {/* HEADER */}
      <h1>Track Medicine</h1>
      <p className="subtitle">
        Enter a batch ID to view full medicine details
      </p>

      {/* SEARCH */}
      <div className="search-box">
        <input
          placeholder="Enter Batch ID..."
          onChange={(e) => setId(e.target.value)}
        />
        <button onClick={fetchHistory}>Search</button>
      </div>

      {/* 🔥 MAIN CARD */}
      {data && (
        <div className="main-card">

          {/* TOP */}
          <div className="card-top">
            <div className="icon">💊</div>

            <span className={`status ${data.status?.toLowerCase().replace(" ", "-")}`}>
              {data.status}
            </span>
          </div>

          {/* NAME */}
          <h2>{data.name}</h2>
          <p className="manufacturer">{data.manufacturer}</p>

          {/* GRID DETAILS */}
          <div className="details-grid">
            <div>
              <label>Batch ID</label>
              <p>{data.batchId}</p>
            </div>

            <div>
              <label>Expiry</label>
              <p>{data.expiry}</p>
            </div>

            <div>
              <label>Owner</label>
              <p>{data.owner}</p>
            </div>

            <div>
              <label>Status</label>
              <p>{data.status}</p>
            </div>

            <div>
              <label>Scan Count</label>
              <p>{data.scanCount}</p>
            </div>

            <div>
              <label>Last Location</label>
              <p>{data.lastScannedLocation || "Not scanned yet"}</p>
            </div>

            <div>
              <label>History Records</label>
              <p>{data.history?.length || 0}</p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default History;