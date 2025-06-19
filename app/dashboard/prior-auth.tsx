"use client";
import { useState } from "react";

export default function PriorAuthDashboard() {
  const [form, setForm] = useState({ patientId: '', procedure: '', payer: '', reason: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/mcp/prior-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError("Failed to submit prior auth");
    }
    setLoading(false);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 p-8">
      <h1 className="text-3xl font-bold mb-6">Prior Authorization Workflow</h1>
      <form onSubmit={handleSubmit} className="mb-6 max-w-2xl">
        <div className="mb-4">
          <label htmlFor="patientId" className="block mb-1 font-semibold">Patient ID</label>
          <input id="patientId" name="patientId" value={form.patientId} onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-800 text-white" placeholder="12345" required />
        </div>
        <div className="mb-4">
          <label htmlFor="procedure" className="block mb-1 font-semibold">Procedure</label>
          <input id="procedure" name="procedure" value={form.procedure} onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-800 text-white" placeholder="MRI Brain" required />
        </div>
        <div className="mb-4">
          <label htmlFor="payer" className="block mb-1 font-semibold">Payer</label>
          <input id="payer" name="payer" value={form.payer} onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-800 text-white" placeholder="Aetna" required />
        </div>
        <div className="mb-4">
          <label htmlFor="reason" className="block mb-1 font-semibold">Reason</label>
          <input id="reason" name="reason" value={form.reason} onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-800 text-white" placeholder="Rule out tumor" required />
        </div>
        <button type="submit" className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 font-bold text-lg shadow-lg transition" disabled={loading}>
          {loading ? "Submitting..." : "Submit Prior Auth"}
        </button>
      </form>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      {result && (
        <div className="bg-gray-900 rounded-xl p-6 shadow-lg max-w-2xl">
          <h2 className="text-xl font-bold mb-2 text-blue-200">Result</h2>
          <div className="mb-2">
            <span className="font-semibold text-gray-300">Status:</span> <span className="text-green-400">{result.status}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-300">FHIR Request:</span>
            <pre className="bg-gray-800 rounded p-2 text-xs text-gray-200 overflow-x-auto">{JSON.stringify(form, null, 2)}</pre>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-300">Agent Message:</span>
            <pre className="bg-gray-800 rounded p-2 text-xs text-gray-200 overflow-x-auto">{result.message}</pre>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-300">Submitted At:</span> <span className="text-gray-200">{result.submittedAt}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-300">Request ID:</span> <span className="text-gray-200">{result.requestId}</span>
          </div>
        </div>
      )}
    </div>
  );
}