import React, { useState, useEffect } from 'react';
import { Terminal, Download, Copy, Check, X, Code2, Play } from 'lucide-react';

interface PythonCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonCodeModal: React.FC<PythonCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/python-code')
        .then((res) => res.json())
        .then((data) => {
          if (data.code) setCode(data.code);
        })
        .catch(() => {
          setCode('# Run: python3 pension_tool.py\n# File is located at the project root: /pension_tool.py');
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    window.location.href = '/api/download-python';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                Pure Python Implementation <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">pension_tool.py</span>
              </h3>
              <p className="text-xs text-slate-400">
                100% Python Standard Library (urllib, json, ssl, http.server) — Zero external dependencies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Command instructions */}
        <div className="px-6 py-3.5 bg-slate-950 border-b border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Run via terminal:</span>
            <code className="bg-slate-800/80 px-2 py-0.5 rounded text-emerald-300 font-mono text-[11px] border border-slate-700">
              python3 pension_tool.py --cli
            </code>
            <span className="text-slate-600">or</span>
            <code className="bg-slate-800/80 px-2 py-0.5 rounded text-indigo-300 font-mono text-[11px] border border-slate-700">
              python3 pension_tool.py --server
            </code>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Code'}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download .py
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 flex-1 overflow-auto bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed">
          {loading ? (
            <div className="py-20 text-center text-slate-500">Loading pure Python script...</div>
          ) : (
            <pre className="whitespace-pre overflow-x-auto selection:bg-indigo-500 selection:text-white">
              {code}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
