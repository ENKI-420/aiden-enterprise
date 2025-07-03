"use client";

export default function AICopilotSidebar() {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-semibold text-blue-300 mb-3">AI Assistant</h3>
      <div className="space-y-3">
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
            Text
          </button>
          <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm">
            Voice
          </button>
          <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm">
            Image
          </button>
        </div>
        <textarea
          className="w-full h-20 bg-gray-900 border border-gray-600 rounded p-2 text-sm resize-none"
          placeholder="Ask AI anything..."
        />
        <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded font-medium">
          Send
        </button>
      </div>
    </div>
  );
}