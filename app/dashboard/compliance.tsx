"use client";
import { useState, useEffect } from "react";

export default function ComplianceDashboard() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState({ user: '', role: '', action: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLogs(); }, []);

  async function fetchLogs() {
    setLoading(true);
    const res = await fetch("/api/mcp/compliance/logs");
    const data = await res.json();
    setLogs(data);
    setLoading(false);
  }

  function handleFilterChange(e) {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  }

  function filteredLogs() {
    return logs.filter(log =>
      (!filter.user || log.user?.toLowerCase().includes(filter.user.toLowerCase())) &&
      (!filter.role || log.role?.toLowerCase().includes(filter.role.toLowerCase())) &&
      (!filter.action || log.action?.toLowerCase().includes(filter.action.toLowerCase()))
    );
  }

  function exportLogs() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredLogs(), null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "compliance_logs.json");
    dlAnchorElem.click();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 p-8">
      <h1 className="text-3xl font-bold mb-6">Compliance Logs</h1>
      <div className="flex gap-4 mb-4">
        <input name="user" value={filter.user} onChange={handleFilterChange} placeholder="Filter by user" className="px-4 py-2 rounded bg-gray-800 text-white" />
        <input name="role" value={filter.role} onChange={handleFilterChange} placeholder="Filter by role" className="px-4 py-2 rounded bg-gray-800 text-white" />
        <input name="action" value={filter.action} onChange={handleFilterChange} placeholder="Filter by action" className="px-4 py-2 rounded bg-gray-800 text-white" />
        <button onClick={exportLogs} className="px-4 py-2 rounded bg-blue-600 text-white font-bold">Export JSON</button>
      </div>
      {loading ? (
        <div className="text-gray-300">Loading logs...</div>
      ) : (
        <table className="w-full bg-gray-900 rounded-xl shadow-lg">
          <thead>
            <tr className="text-blue-200">
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Resource</th>
              <th className="p-3 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs().map(log => (
              <tr key={log.id} className="border-t border-blue-900">
                <td className="p-3">{log.user}</td>
                <td className="p-3">{log.role}</td>
                <td className="p-3">{log.action}</td>
                <td className="p-3">{log.resource}</td>
                <td className="p-3 text-xs text-gray-400">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}