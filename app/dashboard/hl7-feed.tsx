"use client";
import { useState } from "react";

export default function HL7FeedDashboard() {
  const [hl7, setHl7] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/mcp/hl7/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hl7 }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError("Failed to process HL7 message");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 p-8">
      <h1 className="text-3xl font-bold mb-6">Synthetic HL7 Feed</h1>
      <form onSubmit={handleSubmit} className="mb-6 max-w-2xl">
        <label htmlFor="hl7-input" className="block mb-2 font-semibold">Paste HL7 Message:</label>
        <textarea
          id="hl7-input"
          value={hl7}
          onChange={e => setHl7(e.target.value)}
          className="w-full min-h-[100px] px-4 py-2 rounded bg-gray-800 text-white mb-2"
          placeholder="MSH|^~\&|..."
          required
        />
        <button type="submit" className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 font-bold text-lg shadow-lg transition" disabled={loading}>
          {loading ? "Processing..." : "Submit HL7"}
        </button>
      </form>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      {result && (
        <div className="bg-gray-900 rounded-xl p-6 shadow-lg max-w-2xl">
          <h2 className="text-xl font-bold mb-2 text-blue-200">Result</h2>
          <div className="mb-2">
            <span className="font-semibold text-gray-300">HL7:</span>
            <pre className="bg-gray-800 rounded p-2 text-xs text-gray-200 overflow-x-auto">{result.hl7}</pre>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-300">Parsed:</span>
            <pre className="bg-gray-800 rounded p-2 text-xs text-gray-200 overflow-x-auto">{JSON.stringify(result.parsed, null, 2)}</pre>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-300">FHIR:</span>
            <pre className="bg-gray-800 rounded p-2 text-xs text-gray-200 overflow-x-auto">{JSON.stringify(result.fhir, null, 2)}</pre>
          </div>
          <div>
            <span className="font-semibold text-gray-300">Agent Response:</span>
            <pre className="bg-gray-800 rounded p-2 text-xs text-gray-200 overflow-x-auto">{JSON.stringify(result.agentResult, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}