"use client";
import { useState } from "react";

const models = [
  { name: "GPT-4o", value: "gpt-4o" },
  { name: "Claude 3", value: "claude-3" },
  { name: "BioGPT", value: "biogpt" },
  { name: "Mistral", value: "mistral" },
];

export default function AICopilotSidebar() {
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [model, setModel] = useState(models[0].value);
  const [type, setType] = useState("text");
  const [response, setResponse] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResponse("");
    setImage("");
    setError("");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, model, type }),
      });
      const data = await res.json();
      if (data.text) setResponse(data.text);
      if (data.image) setImage(data.image);
      if (data.error) setError(data.error);
    } catch (e) {
      setError("AI API error");
    }
    setLoading(false);
  }

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  return (
    <div className="flex-1 bg-gray-800 rounded-lg p-4 mb-4 text-gray-300 flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-2">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question, paste text, or describe your task..."
          className="w-full px-3 py-2 rounded bg-gray-900 text-white mb-1 min-h-[60px]"
        />
        <label htmlFor="ai-file-upload" className="text-xs text-gray-400">Upload file (text, image, audio):</label>
        <input id="ai-file-upload" type="file" accept=".txt,.pdf,.jpg,.png,.mp3,.wav" onChange={handleFileChange} className="mb-1" placeholder="Choose file" />
        <label htmlFor="ai-model-select" className="text-xs text-gray-400">Select AI Model:</label>
        <select id="ai-model-select" value={model} onChange={e => setModel(e.target.value)} className="px-3 py-2 rounded bg-gray-900 text-white mb-1">
          {models.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
        </select>
        <label htmlFor="ai-type-select" className="text-xs text-gray-400">Type:</label>
        <select id="ai-type-select" value={type} onChange={e => setType(e.target.value)} className="px-3 py-2 rounded bg-gray-900 text-white mb-1">
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 font-bold text-white" disabled={loading}>
          {loading ? "Processing..." : "Send"}
        </button>
      </form>
      <div className="flex-1 overflow-y-auto bg-gray-900 rounded p-2 text-sm">
        {loading ? <span className="text-blue-300">Thinking...</span> : error ? <span className="text-red-400">{error}</span> : image ? <img src={image} alt="Generated" className="rounded max-w-full mx-auto" /> : response ? <span>{response}</span> : <span className="text-gray-500">AI responses will appear here.</span>}
      </div>
    </div>
  );
}