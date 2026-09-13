import React from 'react';
import { Target, TrendingUp, Sparkles, Clock, Compass } from 'lucide-react';
import { PredictionInfo } from '../types';

interface PredictionCardProps {
  prediction: PredictionInfo;
  nextIssue: string;
  countdown: number;
  latestIssue: string;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  nextIssue,
  countdown,
  latestIssue
}) => {
  const isBig = prediction.signal === 'BIG';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7 relative overflow-hidden">
      {/* Background subtle accent */}
      <div 
        className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isBig ? 'bg-emerald-500' : 'bg-amber-500'
        }`}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              <Sparkles className="w-3 h-3 mr-1 text-indigo-600" />
              Python Signal Engine
            </span>
            <span className="text-xs text-slate-500">
              Last Draw: <strong className="font-mono text-slate-700">{latestIssue.slice(-5)}</strong>
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1.5 flex items-center gap-2">
            Target Issue: <span className="font-mono text-indigo-600 font-extrabold">{nextIssue}</span>
          </h2>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-xl self-start sm:self-auto">
          <Clock className="w-4 h-4 text-slate-500" />
          <div className="text-right">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Next Draw In</div>
            <div className="text-base font-bold font-mono text-slate-900 leading-none mt-0.5">
              00:{countdown < 10 ? `0${countdown}` : countdown}
            </div>
          </div>
        </div>
      </div>

      {/* Main Signal Display */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Predicted Signal
          </span>
          <div className="relative my-2">
            <span
              className={`text-5xl sm:text-6xl font-black tracking-tight ${
                isBig ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {prediction.signal}
            </span>
            <span
              className={`block text-xs font-semibold mt-1 px-3 py-0.5 rounded-full inline-block ${
                isBig
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isBig ? 'Numbers 5, 6, 7, 8, 9' : 'Numbers 0, 1, 2, 3, 4'}
            </span>
          </div>

          <div className="w-full max-w-xs mt-4">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-600 font-medium">Model Confidence</span>
              <span className="font-bold text-slate-900 font-mono">{prediction.confidence}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isBig ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${prediction.confidence}%` }}
              />
            </div>
          </div>
        </div>

        {/* Secondary Indicators */}
        <div className="md:col-span-5 space-y-3.5">
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-indigo-500" />
              Detected Pattern
            </div>
            <div className="text-sm font-bold text-slate-800 mt-1">
              {prediction.pattern}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Favored Color</div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`w-3.5 h-3.5 rounded-full ${
                    prediction.color === 'red'
                      ? 'bg-rose-500'
                      : prediction.color === 'green'
                      ? 'bg-emerald-500'
                      : 'bg-violet-500'
                  }`}
                />
                <span className="text-sm font-bold capitalize text-slate-800">
                  {prediction.color}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hot Numbers</div>
              <div className="flex items-center gap-1.5 mt-1 font-mono font-bold text-sm text-slate-800">
                {prediction.target_numbers && prediction.target_numbers.length > 0
                  ? prediction.target_numbers.map((num) => (
                      <span
                        key={num}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {num}
                      </span>
                    ))
                  : 'N/A'}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            Signals are derived from real-time streak reversal heuristics, moving averages, and pattern frequency from the WinGo 30S API.
          </div>
        </div>
      </div>
    </div>
  );
};
