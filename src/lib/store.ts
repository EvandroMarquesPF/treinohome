import { useState, useEffect } from 'react';
import { 
  Profile, 
  Workout, 
  DayOfWeek, 
  Progress, 
  Achievement, 
  UserSettings, 
  WorkoutLog, 
  GamificationPhase 
} from '../types';
import { PRESET_WORKOUTS } from '../data/presetWorkouts';
import { INITIAL_ACHIEVEMENTS, INITIAL_PHASES } from '../data/achievementsAndGamification';
import { soundEngine } from './audio';
import confetti from 'canvas-confetti';

import { isSupabaseConfigured, supabase } from './supabase';

const STORAGE_KEY = 'treino_home_data_v1';

export interface AppState {
  user: Profile | null;
  isLoggedIn: boolean;
  workouts: Record<DayOfWeek, Workout>;
  progress: Progress;
  achievements: Achievement[];
  settings: UserSettings;
  workoutLogs: WorkoutLog[];
  phases: GamificationPhase[];
  activeWorkoutDay: DayOfWeek;
  activeRestTimer: {
    active: boolean;
    remainingSeconds: number;
    initialSeconds: number;
    exerciseName: string;
  } | null;
  levelUpModal: { show: boolean; level: number } | null;
  phaseCompleteModal: { show: boolean; title: string; xp: number } | null;
}

const DEFAULT_USER: Profile = {
  id: 'usr-evandro-123',
  name: 'Evandro',
  email: 'evandromarquespf@gmail.com',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  created_at: new Date().toISOString()
};

const DEFAULT_PROGRESS: Progress = {
  id: 'prog-1',
  user_id: 'usr-evandro-123',
  xp: 1420,
  level: 3,
  sequencia_dias: 7,
  treinos_concluidos: 12,
  series_concluidas: 84,
  tempo_total_minutos: 240,
  last_workout_date: new Date().toISOString().split('T')[0]
};

const DEFAULT_SETTINGS: UserSettings = {
  user_id: 'usr-evandro-123',
  descanso: 60,
  notificacoes: true,
  horario_notificacao: '08:00',
  som: true,
  vibracao: true,
  tema: 'dark'
};

function getInitialWorkouts(): Record<DayOfWeek, Workout> {
  const result: Partial<Record<DayOfWeek, Workout>> = {};
  const days: DayOfWeek[] = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
  
  days.forEach(day => {
    const preset = PRESET_WORKOUTS[day];
    result[day] = {
      ...preset,
      id: `w-${day}`,
      user_id: 'usr-evandro-123',
      created_at: new Date().toISOString(),
      exercises: preset.exercises.map(ex => ({ ...ex }))
    };
  });

  return result as Record<DayOfWeek, Workout>;
}

// Global Store State
let state: AppState = loadInitialState();
const listeners = new Set<() => void>();

function loadInitialState(): AppState {
  if (typeof window === 'undefined') {
    return createFreshState();
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...createFreshState(),
        ...parsed,
        activeRestTimer: null,
        levelUpModal: null,
        phaseCompleteModal: null
      };
    }
  } catch {
    // fallback
  }

  return createFreshState();
}

function createFreshState(): AppState {
  const todayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const daysOrder: DayOfWeek[] = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
  const todayDay = daysOrder[todayIndex] || 'segunda';

  return {
    user: null,
    isLoggedIn: false, // Default unauthenticated - Landing page renders on start
    workouts: getInitialWorkouts(),
    progress: DEFAULT_PROGRESS,
    achievements: INITIAL_ACHIEVEMENTS,
    settings: DEFAULT_SETTINGS,
    workoutLogs: [
      {
        id: 'log-1',
        user_id: 'usr-evandro-123',
        date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
        workout_id: 'w-segunda',
        workout_title: 'Peito e Tríceps',
        dia_semana: 'segunda',
        tempo_segundos: 1450,
        xp_ganho: 180,
        series_concluidas: 10,
        exercicios_concluidos: 3
      },
      {
        id: 'log-2',
        user_id: 'usr-evandro-123',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        workout_id: 'w-terca',
        workout_title: 'Costas e Bíceps',
        dia_semana: 'terca',
        tempo_segundos: 1620,
        xp_ganho: 210,
        series_concluidas: 11,
        exercicios_concluidos: 3
      }
    ],
    phases: INITIAL_PHASES.map((p, idx) => ({
      ...p,
      current_workouts: idx === 0 ? 3 : 0,
      percentage: idx === 0 ? 60 : 0
    })),
    activeWorkoutDay: todayDay,
    activeRestTimer: null,
    levelUpModal: null,
    phaseCompleteModal: null
  };
}

function saveState() {
  if (typeof window === 'undefined') return;
  try {
    const toSave = {
      user: state.user,
      isLoggedIn: state.isLoggedIn,
      workouts: state.workouts,
      progress: state.progress,
      achievements: state.achievements,
      settings: state.settings,
      workoutLogs: state.workoutLogs,
      phases: state.phases,
      activeWorkoutDay: state.activeWorkoutDay
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // quota exceeded or local storage error
  }
}

function syncToSupabaseAsync() {
  if (!isSupabaseConfigured || !state.user || !state.isLoggedIn) return;

  const syncAll = async () => {
    try {
      if (state.user) {
        await supabase.from('profiles').upsert({
          id: state.user.id,
          nome: state.user.name,
          email: state.user.email,
          foto: state.user.avatar_url,
          data_criacao: state.user.created_at || new Date().toISOString()
        });
      }

      await supabase.from('progress').upsert({
        id: state.progress.id,
        user_id: state.user?.id || 'usr-123',
        xp: state.progress.xp,
        nivel: state.progress.level,
        sequencia_dias: state.progress.sequencia_dias,
        treinos_concluidos: state.progress.treinos_concluidos,
        series_concluidas: state.progress.series_concluidas,
        updated_at: new Date().toISOString()
      });

      await supabase.from('settings').upsert({
        user_id: state.user?.id || 'usr-123',
        descanso: state.settings.descanso,
        notificacoes: state.settings.notificacoes,
        horario_notificacao: state.settings.horario_notificacao,
        som: state.settings.som,
        vibracao: state.settings.vibracao,
        tema: state.settings.tema
      });
    } catch {
      // safe fallback if offline or table uninitialized
    }
  };

  syncAll();
}

function notify() {
  saveState();
  syncToSupabaseAsync();
  listeners.forEach(fn => fn());
}

// Store Hooks & Actions
export function useAppStore(): [AppState, typeof storeActions] {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return [state, storeActions];
}

export const storeActions = {
  getState: () => state,

  login: (name: string, email: string, avatarUrl?: string) => {
    state = {
      ...state,
      user: {
        id: `usr-${Date.now()}`,
        name: name || 'Atleta',
        email: email || 'usuario@treinohome.app',
        avatar_url: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        created_at: new Date().toISOString()
      },
      isLoggedIn: true
    };
    notify();
  },

  registerCleanProfile: (params: { name: string; email: string; avatarUrl?: string }) => {
    const userId = `usr-${Date.now()}`;
    const cleanUser: Profile = {
      id: userId,
      name: params.name || 'Novo Atleta',
      email: params.email || 'atleta@treinohome.app',
      avatar_url: params.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      created_at: new Date().toISOString()
    };

    const zeroProgress: Progress = {
      id: `prog-${Date.now()}`,
      user_id: userId,
      xp: 0,
      level: 1,
      sequencia_dias: 0,
      treinos_concluidos: 0,
      series_concluidas: 0,
      tempo_total_minutos: 0,
      last_workout_date: ''
    };

    const cleanWorkouts = getInitialWorkouts();
    Object.keys(cleanWorkouts).forEach(k => {
      const day = k as DayOfWeek;
      cleanWorkouts[day].completed = false;
      cleanWorkouts[day].tempo_total = undefined;
      cleanWorkouts[day].exercises = cleanWorkouts[day].exercises.map(ex => ({
        ...ex,
        completed_series: 0,
        completed: false
      }));
    });

    const cleanPhases = INITIAL_PHASES.map((p, idx) => ({
      ...p,
      current_workouts: 0,
      percentage: 0,
      completed: false,
      is_current: idx === 0
    }));

    const cleanAchievements = INITIAL_ACHIEVEMENTS.map(a => ({
      ...a,
      progress_current: 0,
      unlocked: false
    }));

    state = {
      ...state,
      user: cleanUser,
      isLoggedIn: true,
      progress: zeroProgress,
      workoutLogs: [],
      workouts: cleanWorkouts,
      phases: cleanPhases,
      achievements: cleanAchievements
    };

    notify();
  },

  resetToZeroProfile: () => {
    const userId = state.user?.id || `usr-${Date.now()}`;
    const zeroProgress: Progress = {
      id: `prog-${Date.now()}`,
      user_id: userId,
      xp: 0,
      level: 1,
      sequencia_dias: 0,
      treinos_concluidos: 0,
      series_concluidas: 0,
      tempo_total_minutos: 0,
      last_workout_date: ''
    };

    const cleanWorkouts = getInitialWorkouts();
    Object.keys(cleanWorkouts).forEach(k => {
      const day = k as DayOfWeek;
      cleanWorkouts[day].completed = false;
      cleanWorkouts[day].tempo_total = undefined;
      cleanWorkouts[day].exercises = cleanWorkouts[day].exercises.map(ex => ({
        ...ex,
        completed_series: 0,
        completed: false
      }));
    });

    const cleanPhases = INITIAL_PHASES.map((p, idx) => ({
      ...p,
      current_workouts: 0,
      percentage: 0,
      completed: false,
      is_current: idx === 0
    }));

    const cleanAchievements = INITIAL_ACHIEVEMENTS.map(a => ({
      ...a,
      progress_current: 0,
      unlocked: false
    }));

    state = {
      ...state,
      progress: zeroProgress,
      workoutLogs: [],
      workouts: cleanWorkouts,
      phases: cleanPhases,
      achievements: cleanAchievements
    };

    notify();
  },

  logout: () => {
    state = {
      ...state,
      user: null,
      isLoggedIn: false
    };
    if (isSupabaseConfigured) {
      supabase.auth.signOut().catch(() => null);
    }
    notify();
  },

  setActiveDay: (day: DayOfWeek) => {
    state = { ...state, activeWorkoutDay: day };
    notify();
  },

  toggleSeriesCompletion: (day: DayOfWeek, exerciseId: string) => {
    const workout = state.workouts[day];
    if (!workout) return;

    const exercises = workout.exercises.map(ex => {
      if (ex.id === exerciseId) {
        const nextCompletedSeries = ex.completed_series >= ex.series ? 0 : ex.completed_series + 1;
        const isExCompleted = nextCompletedSeries >= ex.series;

        // Play feedback sound and vibration
        soundEngine.playCheckSound(state.settings.som);
        soundEngine.vibrate(50, state.settings.vibracao);

        return {
          ...ex,
          completed_series: nextCompletedSeries,
          completed: isExCompleted
        };
      }
      return ex;
    });

    const isAllCompleted = exercises.every(e => e.completed);

    state = {
      ...state,
      workouts: {
        ...state.workouts,
        [day]: {
          ...workout,
          exercises,
          completed: isAllCompleted
        }
      },
      progress: {
        ...state.progress,
        xp: state.progress.xp + 5, // +5 XP per set
        series_concluidas: state.progress.series_concluidas + 1
      }
    };

    // Auto trigger rest timer if set was completed and not full exercise complete
    const targetEx = exercises.find(e => e.id === exerciseId);
    if (targetEx && targetEx.completed_series > 0 && targetEx.completed_series < targetEx.series) {
      storeActions.startRestTimer(state.settings.descanso, targetEx.name);
    }

    storeActions.checkLevelUpAndAchievements();
    notify();
  },

  completeWorkout: (day: DayOfWeek, elapsedSeconds: number = 1200) => {
    const workout = state.workouts[day];
    if (!workout) return;

    const updatedExercises = workout.exercises.map(e => ({
      ...e,
      completed_series: e.series,
      completed: true
    }));

    const isFirstTime = !workout.completed;
    const xpBonus = isFirstTime ? 100 : 50;

    // Check streak
    const today = new Date().toISOString().split('T')[0];
    const newStreak = state.progress.sequencia_dias + (isFirstTime ? 1 : 0);

    // Create workout log
    const newLog: WorkoutLog = {
      id: `log-${Date.now()}`,
      user_id: state.user?.id || 'usr-123',
      date: today,
      workout_id: workout.id,
      workout_title: workout.title,
      dia_semana: day,
      tempo_segundos: elapsedSeconds,
      xp_ganho: xpBonus,
      series_concluidas: updatedExercises.reduce((acc, curr) => acc + curr.series, 0),
      exercicios_concluidos: updatedExercises.length
    };

    // Update gamification phases
    const updatedPhases = state.phases.map((phase, idx) => {
      if (phase.is_current) {
        const nextWorkouts = phase.current_workouts + 1;
        const pct = Math.min(100, Math.round((nextWorkouts / phase.target_workouts) * 100));
        const isPhaseDone = nextWorkouts >= phase.target_workouts;
        
        if (isPhaseDone) {
          setTimeout(() => {
            storeActions.triggerPhaseCompleteModal(phase.title, 250);
          }, 600);
        }

        return {
          ...phase,
          current_workouts: nextWorkouts,
          percentage: pct,
          completed: isPhaseDone,
          is_current: !isPhaseDone
        };
      } else if (idx > 0 && state.phases[idx - 1].completed && !phase.completed) {
        return { ...phase, is_current: true };
      }
      return phase;
    });

    state = {
      ...state,
      workouts: {
        ...state.workouts,
        [day]: {
          ...workout,
          completed: true,
          exercises: updatedExercises,
          tempo_total: elapsedSeconds
        }
      },
      progress: {
        ...state.progress,
        xp: state.progress.xp + xpBonus,
        sequencia_dias: newStreak,
        treinos_concluidos: state.progress.treinos_concluidos + (isFirstTime ? 1 : 0),
        tempo_total_minutos: state.progress.tempo_total_minutos + Math.round(elapsedSeconds / 60),
        last_workout_date: today
      },
      workoutLogs: [newLog, ...state.workoutLogs],
      phases: updatedPhases
    };

    // Trigger celebration sounds & confetti
    soundEngine.playRestFinishedChime(state.settings.som);
    soundEngine.vibrate([100, 50, 100, 50, 200], state.settings.vibracao);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    storeActions.checkLevelUpAndAchievements();
    notify();
  },

  startRestTimer: (seconds: number, exerciseName: string) => {
    state = {
      ...state,
      activeRestTimer: {
        active: true,
        remainingSeconds: seconds,
        initialSeconds: seconds,
        exerciseName
      }
    };
    notify();
  },

  tickRestTimer: () => {
    if (!state.activeRestTimer || !state.activeRestTimer.active) return;
    const remaining = state.activeRestTimer.remainingSeconds - 1;

    if (remaining <= 0) {
      soundEngine.playRestFinishedChime(state.settings.som);
      soundEngine.vibrate([150, 80, 150], state.settings.vibracao);
      state = { ...state, activeRestTimer: null };
    } else {
      if (remaining <= 3) {
        soundEngine.playTick(state.settings.som);
      }
      state = {
        ...state,
        activeRestTimer: {
          ...state.activeRestTimer,
          remainingSeconds: remaining
        }
      };
    }
    notify();
  },

  skipRestTimer: () => {
    state = { ...state, activeRestTimer: null };
    notify();
  },

  addRestTimerTime: (secondsToAdd: number) => {
    if (!state.activeRestTimer) return;
    state = {
      ...state,
      activeRestTimer: {
        ...state.activeRestTimer,
        remainingSeconds: state.activeRestTimer.remainingSeconds + secondsToAdd,
        initialSeconds: state.activeRestTimer.initialSeconds + secondsToAdd
      }
    };
    notify();
  },

  updateSettings: (newSettings: Partial<UserSettings>) => {
    state = {
      ...state,
      settings: {
        ...state.settings,
        ...newSettings
      }
    };
    notify();
  },

  updateProfile: (name: string, avatar_url?: string) => {
    if (!state.user) return;
    state = {
      ...state,
      user: {
        ...state.user,
        name,
        avatar_url: avatar_url || state.user.avatar_url
      }
    };
    notify();
  },

  claimAchievementReward: (achievementId: string) => {
    const ach = state.achievements.find(a => a.id === achievementId);
    if (!ach || !ach.unlocked) return;

    state = {
      ...state,
      progress: {
        ...state.progress,
        xp: state.progress.xp + ach.reward_xp
      }
    };

    soundEngine.playLevelUpFanfare(state.settings.som);
    confetti({ particleCount: 80, spread: 60 });
    storeActions.checkLevelUpAndAchievements();
    notify();
  },

  checkLevelUpAndAchievements: () => {
    // Level calculation formula: Level = Math.floor(XP / 500) + 1
    const currentLevel = state.progress.level;
    const calculatedLevel = Math.floor(state.progress.xp / 500) + 1;

    if (calculatedLevel > currentLevel) {
      state = {
        ...state,
        progress: {
          ...state.progress,
          level: calculatedLevel
        },
        levelUpModal: { show: true, level: calculatedLevel }
      };
      soundEngine.playLevelUpFanfare(state.settings.som);
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
    }

    // Check achievement conditions
    const updatedAchievements = state.achievements.map(ach => {
      let currentVal = ach.progress_current;
      let isUnlocked = ach.unlocked;

      switch (ach.key) {
        case 'first_workout':
          currentVal = state.progress.treinos_concluidos >= 1 ? 1 : 0;
          break;
        case 'streak_7':
          currentVal = state.progress.sequencia_dias;
          break;
        case 'streak_15':
          currentVal = state.progress.sequencia_dias;
          break;
        case 'streak_30':
          currentVal = state.progress.sequencia_dias;
          break;
        case 'series_100':
          currentVal = state.progress.series_concluidas;
          break;
        case 'pushups_1000':
          currentVal = state.progress.series_concluidas * 12; // estimated reps
          break;
        case 'first_pullup':
          currentVal = state.workouts.terca.completed ? 1 : 0;
          break;
        case 'workouts_10':
          currentVal = state.progress.treinos_concluidos;
          break;
        case 'workouts_50':
          currentVal = state.progress.treinos_concluidos;
          break;
        case 'workouts_100':
          currentVal = state.progress.treinos_concluidos;
          break;
      }

      if (currentVal >= ach.progress_target && !isUnlocked) {
        isUnlocked = true;
        soundEngine.playLevelUpFanfare(state.settings.som);
      }

      return {
        ...ach,
        progress_current: Math.min(ach.progress_target, currentVal),
        unlocked: isUnlocked
      };
    });

    state = { ...state, achievements: updatedAchievements };
  },

  closeLevelUpModal: () => {
    state = { ...state, levelUpModal: null };
    notify();
  },

  triggerPhaseCompleteModal: (title: string, xp: number) => {
    state = { ...state, phaseCompleteModal: { show: true, title, xp } };
    notify();
  },

  closePhaseCompleteModal: () => {
    state = { ...state, phaseCompleteModal: null };
    notify();
  },

  resetAllData: () => {
    state = createFreshState();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    notify();
  }
};
