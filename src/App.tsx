import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw, Activity, Terminal, AlertCircle, Sparkles, Code2, Download } from 'lucide-react';
import { PredictionData } from './types';
import { PredictionCard } from './components/PredictionCard';
import { StatsTracker } from './components/StatsTracker';
import { HistoryTable } from './components/HistoryTable';
import { PythonCodeModal } from './components/PythonCodeModal';

export default function App() {
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(30);
  const [showPythonModal, setShowPythonModal] = useState<boolean>(false);
  const lastIssueRef = useRef<string>('');

  // Fetch prediction data from Python backend
  const fetchPrediction = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch('/api/prediction');
      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`);
      }
      const json: PredictionData = await res.json();
      if (json.success) {
        setData(json);
        setError(null);
        // If a new issue was drawn, reset countdown
        if (json.latest_drawn_issue && json.latest_drawn_issue !== lastIssueRef.current) {
          lastIssueRef.current = json.latest_drawn_issue;
          setCountdown(30);
        }
      } else {
        setError('Python engine returned incomplete data.');
      }
    } catch (err: any) {
      console.error('Error fetching prediction:', err);
      if (!data) {
        setError(err.message || 'Unable to connect to Python backend.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [data]);

  // Initial load
  useEffect(() => {
    fetchPrediction();
  }, [fetchPrediction]);

  // Polling every 7 seconds to catch 30s draws seamlessly
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPrediction(false);
    }, 7000);
    return () => clearInterval(interval);
  }, [fetchPrediction]);

  // 1-second countdown ticker for 30s cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              PT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  Pension Prediction Tool
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Multi-Strategy Python Engine
                </span>
                {data?.memory_depth ? (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {data.memory_depth} Draws Cached
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                WinGo 30S Multi-Model Signal Predictor & Real-time Audit Tracker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setShowPythonModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
              title="View pure Python source code"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
              Python Script (.py)
            </button>

            <button
              onClick={() => fetchPrediction(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Syncing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchPrediction(true)}
              className="underline font-semibold hover:text-rose-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !data ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-base font-bold text-slate-800">Initializing Python Prediction Engine</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Connecting to WinGo 30S API, evaluating historical sequences, and computing real-time signal probabilities...
            </p>
          </div>
        ) : data ? (
          <>
            {/* 1. Signal Prediction Card */}
            <section aria-labelledby="signal-prediction">
              <PredictionCard
                prediction={data.prediction}
                nextIssue={data.next_issue}
                countdown={countdown}
                latestIssue={data.latest_drawn_issue}
              />
            </section>

            {/* 2. Win / Loss Tracker Metrics */}
            <section aria-labelledby="tracker-stats">
              <StatsTracker stats={data.stats} />
            </section>

            {/* 3. Detailed Win / Loss History Table */}
            <section aria-labelledby="history-records">
              <HistoryTable history={data.history} />
            </section>
          </>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span>WinGo 30S API:</span>
            <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono text-[11px]">
              draw.ar-lottery01.com
            </code>
          </div>
          <div>
            {data?.last_updated ? `Engine updated: ${data.last_updated}` : 'Polling live signals'}
          </div>
        </div>
      </footer>

      {/* Pure Python Source Code Modal */}
      <PythonCodeModal
        isOpen={showPythonModal}
        onClose={() => setShowPythonModal(false)}
      />
    </div>
  );
}
