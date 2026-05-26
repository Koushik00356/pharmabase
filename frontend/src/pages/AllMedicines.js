import { useEffect, useState } from "react";
import axios from "axios";
import "./AllMedicines.css";

function AllMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
  try {
    const res = await axios.get("http://localhost:4000/api/medicine/all");

    // 🔥 IMPORTANT (handle string + object)
    const parsed = res.data.map(item => {
      try {
        return typeof item === "string" ? JSON.parse(item) : item;
      } catch {
        return item;
      }
    });

    setMedicines(parsed);

  } catch (err) {
    console.error("Error:", err);
  }
};

  // 🔍 FILTER
  const filtered = medicines.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.batchId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inventory-page">

      {/* HEADER */}
      <div className="inventory-header">
        <div>
          <h1>Inventory</h1>
          <p>{filtered.length} medicines in stock.</p>
        </div>

        <input
          className="search"
          placeholder="Search medicines..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div className="inventory-grid">
        {filtered.map((med, index) => (
          <div className="medicine-card" key={index}>

            {/* TOP */}
            <div className="card-top">
              <div className="pill-icon">💊</div>

              <span className={`status ${getStatus(med)}`}>
                {getStatusLabel(med)}
              </span>
            </div>

            {/* NAME */}
            <h2>{med.name}</h2>
            <p className="manufacturer">{med.manufacturer}</p>

            {/* DETAILS */}
            <div className="card-bottom">
              <span>{med.batchId}</span>
              <span>{med.expiry}</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

/* 🔥 STATUS LOGIC */
function getStatus(med) {
  const today = new Date();
  const exp = new Date(med.expiry);

  if (exp < today) return "expired";
  return "active";
}

function getStatusLabel(med) {
  const today = new Date();
  const exp = new Date(med.expiry);

  if (exp < today) return "Expired";
  return "Active";
}

export default AllMedicines;