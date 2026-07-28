import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";

const API = "http://localhost:4000/api/medicine";

function QRScanner() {
  const scannerRef = useRef(null);     // holds the Html5Qrcode instance
  const isRunningRef = useRef(false);  // tracks whether camera is actually running

  const [mode, setMode] = useState("camera");   // "camera" | "manual"
  const [camError, setCamError] = useState("");
  const [manualId, setManualId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);    // { status, data }

  // ---- core verify logic (shared by camera + manual) ----
  const verifyBatch = async (batchId) => {
    if (!batchId || !batchId.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.get(`${API}/verify/${batchId.trim()}`);
      const d = res.data;

      let status = "SAFE";
      if (!d) status = "FAKE";
      else if (new Date(d.expiry) < new Date()) status = "EXPIRED";
      else if (d.scanCount > 5) status = "SUSPICIOUS";

      setResult({ status, data: d });
    } catch {
      setResult({ status: "FAKE", data: null });
    } finally {
      setLoading(false);
    }
  };

  // ---- camera lifecycle ----
  useEffect(() => {
    if (mode !== "camera") return;

    const qr = new Html5Qrcode("reader");
    scannerRef.current = qr;
    setCamError("");

    qr.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        // stop first so we don't fire multiple times, then verify
        if (isRunningRef.current) {
          isRunningRef.current = false;
          try { await qr.stop(); } catch (_) {}
        }
        verifyBatch(decodedText);
      },
      () => {} // ignore per-frame decode errors
    )
      .then(() => { isRunningRef.current = true; })
      .catch((err) => {
        // permission denied, no camera, or insecure context
        setCamError(
          "Camera unavailable. Use manual entry instead. " +
          "(Tip: camera only works on localhost or https.)"
        );
      });

    return () => {
      if (isRunningRef.current && scannerRef.current) {
        isRunningRef.current = false;
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [mode]);

  const statusColors = {
    SAFE: "#16a34a",
    EXPIRED: "#eab308",
    SUSPICIOUS: "#f97316",
    FAKE: "#dc2626",
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Scan & Verify</h1>
      <p style={styles.subtitle}>
        Scan a medicine QR code, or enter a Batch ID manually.
      </p>

      {/* mode toggle */}
      <div style={styles.toggle}>
        <button
          style={{ ...styles.toggleBtn, ...(mode === "camera" ? styles.toggleActive : {}) }}
          onClick={() => { setMode("camera"); setResult(null); }}
        >
          📷 Camera
        </button>
        <button
          style={{ ...styles.toggleBtn, ...(mode === "manual" ? styles.toggleActive : {}) }}
          onClick={() => { setMode("manual"); setResult(null); }}
        >
          ⌨️ Manual
        </button>
      </div>

      <div style={styles.card}>
        {mode === "camera" ? (
          <>
            <div id="reader" style={styles.reader} />
            {camError && <p style={styles.camError}>{camError}</p>}
            {!camError && (
              <p style={styles.hint}>Point the camera at a medicine QR code.</p>
            )}
          </>
        ) : (
          <>
            <label style={styles.label}>Batch ID</label>
            <input
              style={styles.input}
              placeholder="e.g. BATCH-2026-001"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verifyBatch(manualId)}
            />
            <button style={styles.btn} onClick={() => verifyBatch(manualId)}>
              Verify
            </button>
          </>
        )}

        {loading && <p style={styles.hint}>Checking blockchain…</p>}

        {result && (
          <div style={styles.resultBox}>
            <div
              style={{
                ...styles.statusBadge,
                background: statusColors[result.status] || "#dc2626",
                color: result.status === "EXPIRED" ? "#000" : "#fff",
              }}
            >
              {result.status === "SAFE" && "✓ AUTHENTIC"}
              {result.status === "EXPIRED" && "⚠ EXPIRED"}
              {result.status === "SUSPICIOUS" && "⚠ SUSPICIOUS"}
              {result.status === "FAKE" && "✗ NOT FOUND / FAKE"}
            </div>

            {result.data && (
              <div style={styles.dataGrid}>
                <Row k="Name" v={result.data.name} />
                <Row k="Manufacturer" v={result.data.manufacturer} />
                <Row k="Current Owner" v={result.data.owner} />
                <Row k="Batch ID" v={result.data.batchId} />
                <Row k="Expiry" v={result.data.expiry} />
                <Row k="Scan Count" v={result.data.scanCount} />
                <Row k="Status" v={result.data.status} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div style={styles.row}>
      <span style={styles.rowKey}>{k}</span>
      <span style={styles.rowVal}>{v ?? "—"}</span>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#fff",
    padding: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: { fontSize: 32, fontWeight: "bold", margin: 0 },
  subtitle: { color: "#94a3b8", marginBottom: 24, textAlign: "center" },
  toggle: { display: "flex", gap: 10, marginBottom: 20 },
  toggleBtn: {
    padding: "10px 20px",
    borderRadius: 10,
    border: "1px solid #334155",
    background: "#1e293b",
    color: "#94a3b8",
    cursor: "pointer",
    fontWeight: "bold",
  },
  toggleActive: { background: "#22c55e", color: "#000", border: "1px solid #22c55e" },
  card: {
    background: "#1e293b",
    padding: 30,
    borderRadius: 12,
    width: "100%",
    maxWidth: 420,
    borderTop: "4px solid #22c55e",
  },
  reader: { width: "100%", borderRadius: 8, overflow: "hidden" },
  hint: { color: "#94a3b8", fontSize: 14, textAlign: "center", marginTop: 12 },
  camError: {
    color: "#fca5a5",
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
    lineHeight: 1.5,
  },
  label: { display: "block", marginBottom: 6 },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
  },
  btn: {
    width: "100%",
    marginTop: 16,
    padding: 14,
    border: "none",
    borderRadius: 10,
    background: "linear-gradient(to right, #22c55e, #06b6d4)",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  },
  resultBox: { marginTop: 24 },
  statusBadge: {
    padding: 14,
    borderRadius: 8,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  dataGrid: {
    marginTop: 16,
    background: "#0f172a",
    borderRadius: 10,
    border: "1px solid #334155",
    padding: 16,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: "1px solid #1e293b",
  },
  rowKey: { color: "#94a3b8", fontSize: 14 },
  rowVal: { fontWeight: 500, fontSize: 14 },
};

export default QRScanner;


/* added a comment to explain the return statement */