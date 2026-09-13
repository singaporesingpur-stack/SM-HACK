import React from 'react';
import { Trophy, CheckCircle2, XCircle, Flame, BarChart3, Award } from 'lucide-react';
import { Stats } from '../types';

interface StatsTrackerProps {
  stats: Stats;
}

export const StatsTracker: React.FC<StatsTrackerProps> = ({ stats }) => {
  const isWinStreak = stats.streak_type === 'WIN';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* Win Rate */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Win Rate</span>
          <Trophy className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-black text-indigo-600 font-mono">
            {stats.win_rate}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(stats.win_rate, 100)}%` }}
          />
        </div>
      </div>

      {/* Total Tracked */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Evaluated</span>
          <BarChart3 className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-black text-slate-900 font-mono">
            {stats.total}
          </span>
          <span className="text-xs text-slate-400 block mt-0.5">Issues evaluated</span>
        </div>
      </div>

      {/* Wins */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Wins</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-black text-emerald-600 font-mono">
            {stats.wins}
          </span>
          <span className="text-xs text-emerald-700/80 block mt-0.5 font-medium">
            Accurate signals
          </span>
        </div>
      </div>

      {/* Losses */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Losses</span>
          <XCircle className="w-4 h-4 text-rose-500" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-black text-rose-600 font-mono">
            {stats.losses}
          </span>
          <span className="text-xs text-rose-700/80 block mt-0.5 font-medium">
            Mismatches
          </span>
        </div>
      </div>

      {/* Current Streak */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Streak</span>
          <Flame
            className={`w-4 h-4 ${
              isWinStreak && stats.current_streak > 1 ? 'text-amber-500 animate-pulse' : 'text-slate-400'
            }`}
          />
        </div>
        <div className="mt-2">
          <span
            className={`text-2xl font-black font-mono ${
              isWinStreak ? 'text-emerald-600' : stats.current_streak > 0 ? 'text-rose-600' : 'text-slate-700'
            }`}
          >
            {stats.current_streak > 0
              ? `${stats.current_streak}${stats.streak_type === 'WIN' ? 'W' : 'L'}`
              : '0'}
          </span>
          <span className="text-xs text-slate-400 block mt-0.5">
            {stats.streak_type === 'WIN' ? 'Consecutive Wins' : stats.streak_type === 'LOSS' ? 'Loss streak' : 'Neutral'}
          </span>
        </div>
      </div>

      {/* Max Win Streak */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Best Run</span>
          <Award className="w-4 h-4 text-amber-500" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-black text-amber-600 font-mono">
            {stats.max_win_streak}W
          </span>
          <span className="text-xs text-slate-400 block mt-0.5">Max win streak</span>
        </div>
      </div>
    </div>
  );
};
