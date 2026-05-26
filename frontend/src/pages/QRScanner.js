import { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";

function QRScanner() {
  useEffect(() => {
    const qr = new Html5Qrcode("reader");

    qr.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250
      },
      async (decodedText) => {
        try {
          const res = await axios.get(
            `http://localhost:4000/api/medicine/verify/${decodedText}`
          );

          alert("✅ Authentic Medicine\n" + JSON.stringify(res.data, null, 2));
        } catch {
          alert("🚨 FAKE MEDICINE DETECTED!");
        }

        qr.stop(); // stop after scan
      },
      (errorMessage) => {
        // ignore scan errors
      }
    );

    return () => {
      qr.stop().catch(() => {});
    };
  }, []);

  return (
    <div>
      <h2>Scan QR Code</h2>
      <div id="reader" style={{ width: "300px" }}></div>
    </div>
  );
}

export default QRScanner;