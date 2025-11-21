"use client";

import { useState } from "react";
import { scamDatabase } from "@/lib/scam-database";
import { fetchSuspiciousLinks } from "@/utils/fetchSuspiciousLinks";

export default function ScannerPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const scanUrl = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    // 1️⃣ Load Firestore suspicious links
    const firestoreLinks = await fetchSuspiciousLinks();

    // 2️⃣ Merge static + dynamic databases
    const combined = [...scamDatabase, ...firestoreLinks];

    // 3️⃣ Match against all known threats
    const lowercaseInput = url.toLowerCase();
    const match = combined.find((entry) =>
      lowercaseInput.includes(entry.url.toLowerCase())
    );

    if (match) {
      setResult({
        status: "danger",
        message: `⚠️ Suspicious link detected: ${match.url}`,
        details: {
          type: match.type,
          severity: match.severity,
          description: match.description,
          reports: match.reports,
        },
      });
    } else {
      setResult({
        status: "safe",
        message: "✅ This link does not match any known threats.",
      });
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 className="text-2xl font-bold mb-4">Safeπ Link Scanner</h1>

      <input
        type="text"
        placeholder="Enter URL to scan..."
        className="border p-2 w-full mb-4"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        onClick={scanUrl}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Scanning..." : "Scan URL"}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">
            {result.status === "safe" ? "🟢 Safe" : "🔴 Dangerous"}
          </h2>
          <p>{result.message}</p>

          {result.details && (
            <div className="mt-3 text-sm text-gray-700">
              <p><strong>Type:</strong> {result.details.type}</p>
              <p><strong>Severity:</strong> {result.details.severity}</p>
              <p><strong>Description:</strong> {result.details.description}</p>
              <p><strong>Reports:</strong> {result.details.report
