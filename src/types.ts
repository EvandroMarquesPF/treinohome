export type DayOfWeek = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

export interface Exercise {
  id: string;
  workout_id: string;
  name: string;
  series: number;
  repeticoes: string; // e.g. "4x12", "3x10", "4xFalha", "3x40s"
  completed: boolean;
  completed_series: number;
  image_url: string;
  description: string;
  target_muscle: string;
  is_time_based?: boolean;
  target_seconds?: number;
}

export interface Workout {
  id: string;
  user_id: string;
  dia_semana: DayOfWeek;
  title: string;
  target_muscles: string;
  completed: boolean;
  tempo_total: number; // in seconds
  created_at: string;
  exercises: Exercise[];
  is_rest_day?: boolean;
  rest_type?: 'active' | 'total';
}

export interface Progress {
  id: string;
  user_id: string;
  xp: number;
  level: number;
  sequencia_dias: number;
  treinos_concluidos: number;
  series_concluidas: number;
  tempo_total_minutos: number;
  last_workout_date?: string; // YYYY-MM-DD
  updated_at?: string;
}

export interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_date?: string;
  reward_xp: number;
  progress_current: number;
  progress_target: number;
}

export interface UserSettings {
  user_id: string;
  descanso: number; // in seconds (30, 45, 60, 90, 120)
  notificacoes: boolean;
  horario_notificacao: string; // "08:00"
  som: boolean;
  vibracao: boolean;
  tema: 'dark' | 'light' | 'system';
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  workout_id: string;
  workout_title: string;
  dia_semana: DayOfWeek;
  tempo_segundos: number;
  xp_ganho: number;
  series_concluidas: number;
  exercicios_concluidos: number;
}

export interface GamificationPhase {
  id: number;
  week_number: number;
  title: string;
  subtitle: string;
  min_level: number;
  min_xp: number;
  medal_icon: string;
  target_workouts: number;
  current_workouts: number;
  percentage: number;
  completed: boolean;
  is_current: boolean;
}
