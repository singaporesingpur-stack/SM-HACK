import React from 'react';
import { HistoryItem } from '../types';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface HistoryTableProps {
  history: HistoryItem[];
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ history }) => {
  const getNumberColorClasses = (color: string) => {
    if (color.includes('violet')) {
      return 'bg-violet-100 text-violet-800 border-violet-200';
    } else if (color.includes('green')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    } else {
      return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            Win / Loss History Tracker
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit of past predictions evaluated against verified WinGo 30S draw outcomes
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 self-start sm:self-auto">
          {history.length} Records Verified
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Issue Number</th>
              <th className="py-3 px-4">Drawn Number</th>
              <th className="py-3 px-4">Actual Size</th>
              <th className="py-3 px-4">Predicted Signal</th>
              <th className="py-3 px-4">Pattern Used</th>
              <th className="py-3 px-4 text-center">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {history.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-400">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                  No draw history records loaded yet. Polling API...
                </td>
              </tr>
            ) : (
              history.map((item) => {
                const isWin = item.result === 'WIN';
                const isBigActual = item.actualSize === 'BIG';
                const isBigPred = item.predictedSignal === 'BIG';

                return (
                  <tr
                    key={item.issueNumber}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Issue Number */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-800 text-xs">
                      {item.issueNumber}
                    </td>

                    {/* Actual Number & Color */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs border ${getNumberColorClasses(
                            item.actualColor
                          )}`}
                        >
                          {item.actualNumber}
                        </span>
                        <span className="text-xs capitalize text-slate-500 hidden sm:inline">
                          {item.actualColor}
                        </span>
                      </div>
                    </td>

                    {/* Actual Size */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
                          isBigActual
                            ? 'bg-slate-100 text-slate-800 border border-slate-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {item.actualSize}
                      </span>
                    </td>

                    {/* Predicted Signal */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-xs font-black tracking-wide ${
                          isBigPred
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {item.predictedSignal}
                      </span>
                    </td>

                    {/* Pattern */}
                    <td className="py-3 px-4 text-xs text-slate-500 max-w-[200px] truncate" title={item.pattern}>
                      {item.pattern}
                    </td>

                    {/* Outcome Badge */}
                    <td className="py-3 px-4 text-center">
                      {isWin ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          WIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          LOSS
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
