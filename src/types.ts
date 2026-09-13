export interface PredictionInfo {
  signal: 'BIG' | 'SMALL';
  confidence: number;
  pattern: string;
  color: string;
  target_numbers: number[];
  action?: 'BET_SNIPER' | 'BET_NORMAL' | 'SKIP_CHOP' | 'COOLDOWN_PROTECT' | string;
  action_label?: string;
  advice?: string;
  martingale_level?: number;
  martingale_multiplier?: string;
}

export interface HistoryItem {
  issueNumber: string;
  actualNumber: number;
  actualSize: 'BIG' | 'SMALL';
  actualColor: string;
  predictedSignal: 'BIG' | 'SMALL';
  confidence: number;
  pattern: string;
  result: 'WIN' | 'LOSS';
  timestamp: string;
  action?: string;
  level?: number;
}

export interface Stats {
  total: number;
  wins: number;
  losses: number;
  win_rate: number;
  current_streak: number;
  streak_type: 'WIN' | 'LOSS' | 'NONE';
  max_win_streak: number;
  max_loss_streak: number;
  sniper_wins?: number;
  sniper_total?: number;
  sniper_win_rate?: number;
  consecutive_losses?: number;
  cooldown_active?: boolean;
  current_level?: number;
  multiplier?: string;
}

export interface PredictionData {
  success: boolean;
  next_issue: string;
  latest_drawn_issue: string;
  prediction: PredictionInfo;
  stats: Stats;
  history: HistoryItem[];
  last_updated: string;
  api_endpoint: string;
  memory_depth?: number;
}
