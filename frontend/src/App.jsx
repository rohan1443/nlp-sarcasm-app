import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, CheckCircle, Brain, AlertTriangle, Microscope, XCircle, Zap, Cpu } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function App() {
  const [input, setInput] = useState("Update: Traffic jams continue — shocking development nobody could have predicted.");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState("checking");
  const [modelType, setModelType] = useState("svm"); // 'svm' or 'dl'

  // Health Check
  useEffect(() => {
    axios.get(`${API_URL}/`).then(() => setServerStatus("online")).catch(() => setServerStatus("offline"));
  }, []);

  const handlePredict = async () => {
    if (!input) return;
    setLoading(true);
    setResult(null); // Clear previous result
    try {
      const res = await axios.post(`${API_URL}/predict`, {
        headline: input,
        model_type: modelType
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Prediction failed. Is backend running?");
    }
    setLoading(false);
  };

  // Helper to quickly load the failure example
  const loadFailureExample = () => {
    setInput("NASA discovers new exoplanet in habitable zone");
    setResult(null);
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto p-6 font-sans text-slate-800">

      {/* HEADER */}
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-black text-slate-900 flex justify-center items-center gap-3 tracking-tighter">
          <ShieldAlert className="text-indigo-600" size={48} /> Being Sarcastic
        </h1>
        <p className="text-indigo-900/60 mt-2 font-medium">News Headlines Dataset For Sarcasm Detection</p>
        <a href="https://www.kaggle.com/datasets/rmisra/news-headlines-dataset-for-sarcasm-detection/data?select=Sarcasm_Headlines_Dataset.json" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline">
          View Dataset on Kaggle
        </a>

        <div className="flex justify-center mt-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${serverStatus === 'online' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
            }`}>
            Backend System: {serverStatus === 'online' ? 'Online 🟢' : 'Offline 🔴'}
          </span>
        </div>
      </header>

      {/* ACADEMIC INFO SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-12">
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
          <Brain size={20} className="text-slate-500" />
          <h3 className="font-bold text-slate-700">Model Architecture & Performance</h3>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-indigo-600 mb-2">Selected Model</h4>
            <p className="text-slate-600 mb-4">
              We are currently comparing two architectures. Use the toggle below to switch between the <strong>Statistical SVM</strong> and the <strong>Neural Network</strong>.
            </p>
          </div>

          <div>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex gap-2"><span>⚙️</span> <span><strong>SVM:</strong> Linear Kernel (Acc: 78%)</span></li>
              <li className="flex gap-2"><span>🧠</span> <span><strong>Deep Learning:</strong> Multi-Layer Perceptron (Acc: ~79%)</span></li>
              <li className="flex gap-2"><span>📊</span> <span>Features: TF-IDF (Bigrams) for both</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="grid gap-8 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-50">

          {/* MODEL SWITCHER */}
          <div className="flex justify-center mb-6">
            <div className="bg-slate-100 p-1 rounded-xl inline-flex">
              <button
                onClick={() => setModelType('svm')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${modelType === 'svm' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <Zap size={16} /> Statistical SVM
              </button>
              <button
                onClick={() => setModelType('dl')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${modelType === 'dl' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <Cpu size={16} /> Deep Learning
              </button>
            </div>
          </div>

          <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Enter Headline</label>
          <textarea
            className="w-full h-32 p-4 text-xl border-2 border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all resize-none placeholder:text-slate-300"
            placeholder="e.g. 'Area man consumes entire pizza in act of heroism...'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="flex gap-4 mt-4">
            <button
              onClick={handlePredict}
              disabled={loading || !input}
              className={`flex-1 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 text-lg shadow-lg ${modelType === 'svm' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                }`}
            >
              {loading ? "Processing..." : `Analyze with ${modelType === 'svm' ? 'SVM' : 'Neural Net'}`}
            </button>

            <button
              onClick={loadFailureExample}
              className="px-6 py-4 rounded-xl border-2 border-amber-200 text-amber-700 font-bold hover:bg-amber-50 transition-colors text-sm"
            >
              Try "Bias Test" Case
            </button>
          </div>

          {/* RESULT AREA */}
          {result && (
            <div className={`mt-8 p-6 rounded-2xl border-l-8 animate-fadeIn ${result.is_sarcastic ? "bg-amber-50 border-amber-500 text-amber-900" : "bg-blue-50 border-blue-500 text-blue-900"
              }`}>
              <div className="flex items-center gap-4">
                {result.is_sarcastic ? <AlertTriangle size={32} /> : <CheckCircle size={32} />}
                <div>
                  <h2 className="text-2xl font-bold">{result.label.toUpperCase()}</h2>
                  <div className="flex gap-3 text-sm opacity-80 mt-1">
                    <span>Model: <strong>{result.model_used}</strong></span>
                    <span>•</span>
                    <span>Confidence: <strong>{(result.confidence * 100).toFixed(1)}%</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAILURE ANALYSIS SECTION */}
      <div className="bg-amber-50 rounded-3xl shadow-sm border border-amber-200 overflow-hidden">
        <div className="bg-amber-100 p-4 border-b border-amber-200 flex items-center gap-2">
          <Microscope size={20} className="text-amber-700" />
          <h3 className="font-bold text-amber-900">Failure Analysis & Bias Report</h3>
        </div>

        <div className="p-8">
          <p className="text-amber-900/80 mb-6 leading-relaxed">
            While highly accurate, our model exhibits <strong>Dataset Bias</strong>. It sometimes mistakes genuine scientific news for sarcasm if it contains specific entities like "NASA" or "Scientists".
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-amber-100 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">The Failure Case</h4>
              <p className="font-mono text-sm text-slate-600 mb-3 bg-slate-50 p-2 rounded border border-slate-100">
                "NASA discovers new exoplanet in habitable zone"
              </p>
              <div className="flex items-center gap-2 text-red-500 font-bold text-sm bg-red-50 p-2 rounded inline-block">
                <XCircle size={16} />
                <span>Prediction: SARCASTIC (Incorrect)</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-amber-100 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Why this happens</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>Topical Correlation vs. Semantics.</strong>
                <br className="mb-2" />
                In our training data, we found <strong>26 sarcastic</strong> NASA headlines vs only <strong>11 genuine</strong> ones. The model learned that "NASA" usually implies a joke.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-slate-400 text-xs mt-12 mb-6">
        MSc AI Assignment • Dataset: Kaggle Sarcasm Headlines • 26,709 Records
      </div>

    </div>
  );
}

export default App;