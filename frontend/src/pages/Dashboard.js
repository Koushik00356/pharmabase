import "./Dashboard.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      {/* 🔝 NAVBAR */}
      <div className="navbar">

  {/* LEFT */}
  <div className="nav-left">
    <div className="logo-box">P</div>
    <div className="brand">
      <div>PharmaBase</div>
      
    </div>
  </div>

  {/* CENTER SEARCH */}
  <div className="nav-center">
    <input
      type="text"
      placeholder="Search by batch ID, medicine name..."
      className="search-bar"
    />
  </div>

  {/* RIGHT */}
  <div className="nav-right">

    <div className="status">
      <span className="dot pulse"></span>
      Blockchain connected
    </div>

    <div className="divider"></div>

    <span className="icon">🔔</span>
    <span className="icon">⚙️</span>

    <div className="user">
      <div className="avatar">👤</div>
        
    </div>

    <div className="time">{time}</div>

  </div>
</div>
      

      {/* 🧭 MAIN LAYOUT */}
      <div className="main">
        {/* SIDEBAR */}
        <div className="sidebar">

  <Link to="/dashboard" className="side-item">
    <span className="icon">🏠</span>
    Dashboard
  </Link>

  <Link to="/all" className="side-item">
    <span className="icon">📦</span>
    All Medicines
  </Link>

  <Link to="/add" className="side-item active">
    <span className="icon">➕</span>
    Add Medicine
  </Link>

  <Link to="/verify" className="side-item">
    <span className="icon">🛡️</span>
    Verify
  </Link>

  <Link to="/history" className="side-item">
    <span className="icon">🕒</span>
    History
  </Link>

  <Link to="/transfer" className="side-item">
    <span className="icon">📤</span>
    Transfer
  </Link>

  <Link to="/scan" className="side-item">
    <span className="icon">📷</span>
    Scan
  </Link>

</div>

        {/* DASHBOARD CONTENT */}
        <div className="content">
  <h1 className="welcome">
    Welcome to <span>Pharmabase</span>
  </h1>
  <p className="subtitle">
    Manage and track your pharmaceutical inventory with ease.
  </p>

  {/* 📊 STATS */}
  <div className="stats-grid">

    <div className="stat-box">
      <div className="icon green">💊</div>
      <div>
        <h2>3</h2>
        <p>Total Medicines</p>
      </div>
    </div>

    <div className="stat-box">
      <div className="icon blue">✔</div>
      <div>
        <h2>2</h2>
        <p>Active</p>
      </div>
    </div>

    <div className="stat-box">
      <div className="icon yellow">⚠</div>
      <div>
        <h2>0</h2>
        <p>Expiring Soon</p>
      </div>
    </div>

    <div className="stat-box danger">
      <div className="icon red">⚠</div>
      <div>
        <h2>1</h2>
        <p>Expired</p>
      </div>
    </div>

  </div>

  {/* ⚡ QUICK ACTIONS */}
  <h2 className="quick-title">Quick Actions</h2>

  <div className="actions">

    <Link to="/add" className="action-card">
      <div className="action-icon">➕</div>
      <h3>Add Medicine</h3>
      <p>Register a new batch</p>
    </Link>

    <Link to="/verify" className="action-card">
      <div className="action-icon">📦</div>
      <h3>View Inventory</h3>
      <p>Browse all medicines</p>
    </Link>

    <Link to="/verify" className="action-card">
      <div className="action-icon">🔍</div>
      <h3>Track Batch</h3>
      <p>Search by batch ID</p>
    </Link>

  </div>
  {/* 🆕 RECENTLY ADDED */}
<div className="recent-header">
  <h2>Recently Added</h2>
  <span className="view-all">View all →</span>
</div>

<div className="recent-list">

  <div className="recent-item">
    <div className="recent-left">
      <div className="recent-icon">💊</div>
      <div>
        <h3>Amoxicillin 500mg</h3>
        <p>PharmaCorp Inc. · BATCH-2026-001</p>
      </div>
    </div>
    <div className="badge">Exp: 15/06/2027</div>
  </div>

  <div className="recent-item">
    <div className="recent-left">
      <div className="recent-icon">💊</div>
      <div>
        <h3>Ibuprofen 200mg</h3>
        <p>MedLife Labs · BATCH-2026-002</p>
      </div>
    </div>
    <div className="badge danger">Exp: 01/03/2026</div>
  </div>

  <div className="recent-item">
    <div className="recent-left">
      <div className="recent-icon">💊</div>
      <div>
        <h3>Paracetamol 650mg</h3>
        <p>HealthGen Pharma · BATCH-2026-003</p>
      </div>
    </div>
    <div className="badge">Exp: 20/12/2026</div>
  </div>

</div>
</div>
    

      </div>
    </div>
  );
}

function Stat({ title, value, danger }) {
  return (
    <div className={`stat-card ${danger ? "danger" : ""}`}>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

export default Dashboard;