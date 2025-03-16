import React, { useState, useEffect } from "react";
import axios from "axios";

export default function IntelligenceDashboard() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState([]);

  useEffect(() => {
    document.title = "BLACKNET Intelligence System";
  }, []);

  const runQuery = async () => {
    if (!query) return;
    setLoading(true);
    setTerminalOutput((prev) => [...prev, `$ root@blacknet:~$ ${query}`]);
    try {
      const response = await axios.post("http://YOUR_SERVER_IP:8000/run-query", { query });
      setResult(response.data);
      setTerminalOutput((prev) => [...prev, JSON.stringify(response.data, null, 2)]);
    } catch (error) {
      console.error("Error running query", error);
      setTerminalOutput((prev) => [...prev, "Error: Failed to fetch data."]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-10 bg-black text-green-400 font-mono">
      <h1 className="text-4xl font-bold mb-6 text-green-500">BLACKNET Intelligence System</h1>
      <div className="w-3/4 bg-gray-900 p-5 rounded-md border border-green-400 shadow-lg">
        <div className="h-80 overflow-auto bg-black p-3 rounded-md text-green-300 text-sm">
          {terminalOutput.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <input
          type="text"
          placeholder="root@blacknet:~$ Enter command..."
          className="w-full p-3 text-black rounded-md border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 mt-4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={runQuery}
          className="mt-4 px-6 py-2 bg-green-500 text-black font-bold rounded-lg hover:bg-green-600 transition-all"
        >
          {loading ? "Executing..." : "Run Command"}
        </button>
      </div>
    </div>
  );
}
