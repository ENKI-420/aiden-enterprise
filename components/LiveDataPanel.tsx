"use client";

export default function LiveDataPanel() {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <h4 className="text-lg font-semibold text-green-300 mb-3">Live Data Stream</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">System Status</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400">Online</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Active Agents</span>
          <span className="text-blue-400">3</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Response Time</span>
          <span className="text-yellow-400">127ms</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Processing</span>
          <span className="text-purple-400">2 tasks</span>
        </div>
      </div>
      <div className="mt-4 p-2 bg-gray-900/50 rounded text-xs text-gray-400">
        Real-time monitoring dashboard
      </div>
    </div>
  );
}