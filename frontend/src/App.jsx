import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, CheckCircle, Brain, AlertTriangle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState("checking");

  // Health Check
  useEffect(() => {
    axios.get(`${API_URL}/`).then(() => setServerStatus("online")).catch(() => setServerStatus("offline"));
  }, []);

  const handlePredict = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/predict`, { headline: input });
      console.log(res.data);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Prediction failed. Is backend running?");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto p-6 font-sans text-slate-800">

      {/* HEADER */}
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-black text-slate-900 flex justify-center items-center gap-3 tracking-tighter">
          <ShieldAlert className="text-indigo-600" size={48} /> Being Sarcastic
        </h1>
        <p className="text-indigo-900/60 mt-2 font-medium">Sarcasm Detector</p>

        <div className="flex justify-center mt-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${serverStatus === 'online' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
            }`}>
            Backend System: {serverStatus === 'online' ? 'Online 🟢' : 'Offline 🔴'}
          </span>
        </div>
      </header>

      {/* MAIN CARD */}
      <div className="grid gap-8 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-50">

          <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Enter Headline</label>
          <textarea
            className="w-full h-32 p-4 text-xl border-2 border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all resize-none placeholder:text-slate-300"
            placeholder="e.g. 'Area man consumes entire pizza in act of heroism...'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={handlePredict}
            disabled={loading || !input}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 text-lg shadow-lg shadow-indigo-200"
          >
            {loading ? "Scanning Nuance..." : "Analyze Headline"}
          </button>

          {/* RESULT AREA */}
          {result && (
            <div className={`mt-8 p-6 rounded-2xl border-l-8 animate-fadeIn ${result.is_sarcastic ? "bg-amber-50 border-amber-500 text-amber-900" : "bg-blue-50 border-blue-500 text-blue-900"
              }`}>
              <div className="flex items-center gap-4">
                {result.is_sarcastic ? <AlertTriangle size={32} /> : <CheckCircle size={32} />}
                <div>
                  <h2 className="text-2xl font-bold">{result.label.toUpperCase()}</h2>
                  <p className="opacity-80">Confidence Score: {(result.confidence * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ACADEMIC INFO SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
          <Brain size={20} className="text-slate-500" />
          <h3 className="font-bold text-slate-700">Model Architecture & Performance</h3>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-indigo-600 mb-2">🏆 Selected Model</h4>
            <p className="text-slate-600 mb-4">
              <strong className="text-slate-900">Support Vector Machine (Linear SVC)</strong> with Grid Search Optimization.
            </p>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex gap-2"><span>⚙️</span> <span>Kernel: Linear (C=1.0)</span></li>
              <li className="flex gap-2"><span>📊</span> <span>Features: TF-IDF (Bigrams)</span></li>
              <li className="flex gap-2"><span>🎯</span> <span>Accuracy: <b>78%</b> (Test Set)</span></li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-50 p-6 text-xs text-slate-400 text-center border-t border-slate-200">
          Dataset: Kaggle Sarcasm Headlines (The Onion vs HuffPost) • Total Records: 26,709
        </div>
      </div>

    </div>
  );
}

function ModelStat({ name, acc, color }) {
  return (
    <div className={`flex justify-between items-center p-2 rounded-lg ${color} text-sm`}>
      <span className="font-medium">{name}</span>
      <span className="font-bold">{acc}</span>
    </div>
  );
}

export default App;