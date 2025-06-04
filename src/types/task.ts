export interface Note {
  id: string;
  text: string;
  timestamp: string;
}

export interface HistoryItem {
  action: 'created' | 'updated' | 'completed' | 'note_added' | 'deleted';
  timestamp: string;
  details: Record<string, any>;
}

export interface TaskMetrics {
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  priority: 1 | 2 | 3 | 4 | 5;
  category?: string;
  tags: string[];
  streak: number;
  completionRate: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  color: string;
  status: 'active' | 'completed';
  createdAt: string;
  completedAt: string | null;
  completionNote: string | null;
  notes: Note[];
  history: HistoryItem[];
  metrics: TaskMetrics;
}

export interface TaskFilters {
  searchText: string;
  startDate: string | null;
  endDate: string | null;
  status: 'all' | 'active' | 'completed';
  color: string | null;
  category?: string;
  priority?: number;
  tags?: string[];
}

export interface UserStats {
  level: number;
  xp: number;
  tasksCompleted: number;
  currentStreak: number;
  bestStreak: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  target: number;
}