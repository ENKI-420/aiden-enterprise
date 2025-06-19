"use client";
import { useState, useEffect } from "react";

export default function AgentsDashboard() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editAgent, setEditAgent] = useState(null);

  async function fetchAgents() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mcp/agents");
      const data = await res.json();
      setAgents(data);
    } catch (e) {
      setError("Failed to load agents");
    }
    setLoading(false);
  }

  useEffect(() => { fetchAgents(); }, []);

  async function handleSave(agent) {
    setError("");
    try {
      if (agent.id) {
        await fetch("/api/mcp/agents", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(agent) });
      } else {
        await fetch("/api/mcp/agents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(agent) });
      }
      fetchAgents();
    } catch (e) {
      setError("Failed to save agent");
    }
    setShowModal(false);
  }

  async function handleDelete(agent) {
    setError("");
    try {
      await fetch("/api/mcp/agents", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: agent.id }) });
      fetchAgents();
    } catch (e) {
      setError("Failed to delete agent");
    }
  }

  function handleAdd() {
    setEditAgent(null);
    setShowModal(true);
  }
  function handleEdit(agent) {
    setEditAgent(agent);
    setShowModal(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 p-8">
      <h1 className="text-3xl font-bold mb-6">Agent Management</h1>
      <button onClick={handleAdd} className="mb-4 px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 font-bold text-lg shadow-lg transition">Add Agent</button>
      {loading ? (
        <div className="text-gray-300">Loading agents...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <table className="w-full bg-gray-900 rounded-xl shadow-lg">
          <thead>
            <tr className="text-blue-200">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => (
              <tr key={agent.id} className="border-t border-blue-900">
                <td className="p-3">{agent.name}</td>
                <td className="p-3">{agent.role}</td>
                <td className="p-3">{agent.status}</td>
                <td className="p-3">
                  <button onClick={() => handleEdit(agent)} className="px-3 py-1 rounded bg-yellow-500 text-black font-bold mr-2">Edit</button>
                  <button onClick={() => handleDelete(agent)} className="px-3 py-1 rounded bg-red-600 text-white font-bold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showModal && (
        <AgentModal agent={editAgent} onSave={handleSave} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

function AgentModal({ agent, onSave, onClose }) {
  const [name, setName] = useState(agent?.name || "");
  const [role, setRole] = useState(agent?.role || "");
  const [status, setStatus] = useState(agent?.status || "Active");
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-8 shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{agent ? "Edit Agent" : "Add Agent"}</h2>
        <div className="mb-4">
          <label htmlFor="agent-name" className="block mb-1">Name</label>
          <input id="agent-name" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-800 text-white" placeholder="Agent Name" />
        </div>
        <div className="mb-4">
          <label htmlFor="agent-role" className="block mb-1">Role</label>
          <input id="agent-role" value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-800 text-white" placeholder="Agent Role" />
        </div>
        <div className="mb-4">
          <label htmlFor="agent-status" className="block mb-1">Status</label>
          <select id="agent-status" value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-800 text-white">
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <div className="flex gap-4 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-700 text-white">Cancel</button>
          <button onClick={() => onSave({ id: agent?.id, name, role, status })} className="px-4 py-2 rounded bg-blue-600 text-white font-bold">Save</button>
        </div>
      </div>
    </div>
  );
}