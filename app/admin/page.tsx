"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import ScreenWrapper from "@/components/ScreenWrapper";
import { STORE_CONFIG } from "@/config/store";

export default function AdminPage() {
  const [storeName, setStoreName] = useState(STORE_CONFIG.name);
  const [mapsUrl, setMapsUrl] = useState(STORE_CONFIG.googleReviewUrl());
  const [customChips, setCustomChips] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const generateQRCode = async () => {
    try {
      // Build the URL with parameters
      const url = new URL(window.location.origin);
      if (storeName && storeName !== STORE_CONFIG.name) {
        url.searchParams.set("name", btoa(encodeURIComponent(storeName)));
      }
      if (mapsUrl && mapsUrl !== STORE_CONFIG.googleReviewUrl()) {
        url.searchParams.set("url", btoa(encodeURIComponent(mapsUrl)));
      }
      if (customChips.trim()) {
        const chipsArray = customChips.split(",").map((c) => c.trim()).filter(Boolean);
        if (chipsArray.length > 0) {
          url.searchParams.set("chips", btoa(encodeURIComponent(JSON.stringify(chipsArray))));
        }
      }

      const finalUrl = url.toString();
      setGeneratedLink(finalUrl);

      const qrDataUrl = await QRCode.toDataURL(finalUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
      setQrCodeUrl(qrDataUrl);
    } catch (err) {
      console.error("Error generating QR code:", err);
    }
  };

  useEffect(() => {
    generateQRCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-root" style={{ padding: "20px", overflowY: "auto" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", color: "#333" }}>ReviewTap Admin Panel</h1>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#555" }}>Store Name</label>
          <input 
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            placeholder="e.g. My Phone Store"
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#555" }}>Google Maps Review Link</label>
          <input 
            type="url"
            value={mapsUrl}
            onChange={(e) => setMapsUrl(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            placeholder="e.g. https://search.google.com/local/writereview?placeid=..."
          />
          <p style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>The exact URL where customers should leave their review.</p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#555" }}>Custom Highlights (Chips)</label>
          <textarea 
            value={customChips}
            onChange={(e) => setCustomChips(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", minHeight: "80px" }}
            placeholder="e.g. Fast Service, Great Ambiance, Friendly Staff (Comma separated)"
          />
          <p style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>Leave blank to use default phone store chips. Separate multiple with commas.</p>
        </div>

        <button 
          onClick={generateQRCode}
          style={{ width: "100%", padding: "12px", backgroundColor: "#007AFF", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
        >
          Generate QR Code
        </button>

        {qrCodeUrl && (
          <div style={{ marginTop: "32px", textAlign: "center" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px", color: "#333" }}>Your Custom QR Code</h2>
            <img src={qrCodeUrl} alt="QR Code" style={{ maxWidth: "100%", borderRadius: "12px", border: "1px solid #eee", padding: "8px", backgroundColor: "#fff" }} />
            
            <div style={{ marginTop: "16px", display: "flex", gap: "10px", justifyContent: "center" }}>
              <a 
                href={qrCodeUrl} 
                download="reviewtap-qr.png"
                style={{ padding: "10px 16px", backgroundColor: "#34C759", color: "#fff", textDecoration: "none", borderRadius: "8px", fontWeight: "600" }}
              >
                Download PNG
              </a>
              <button 
                onClick={() => navigator.clipboard.writeText(generatedLink)}
                style={{ padding: "10px 16px", backgroundColor: "#E5E5EA", color: "#333", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
              >
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
