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

const DEFAULT_USER_ID = '';

const DEFAULT_PROGRESS: Progress = {
  id: '00000000-0000-0000-0000-000000000001',
  user_id: '',
  xp: 0,
  level: 1,
  sequencia_dias: 0,
  treinos_concluidos: 0,
  series_concluidas: 0,
  tempo_total_minutos: 0,
  last_workout_date: ''
};

const DEFAULT_SETTINGS: UserSettings = {
  user_id: '',
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
      user_id: '',
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
      const hasCachedUser = Boolean(parsed.user && parsed.user.id);
      return {
        ...createFreshState(),
        ...parsed,
        isLoggedIn: hasCachedUser ? (parsed.isLoggedIn !== false) : false,
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
    workoutLogs: [],
    phases: INITIAL_PHASES.map((p, idx) => ({
      ...p,
      current_workouts: 0,
      percentage: 0,
      completed: false,
      is_current: idx === 0
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
        user_id: state.user.id,
        xp: state.progress.xp,
        nivel: state.progress.level,
        sequencia_dias: state.progress.sequencia_dias,
        treinos_concluidos: state.progress.treinos_concluidos,
        series_concluidas: state.progress.series_concluidas,
        updated_at: new Date().toISOString()
      });

      await supabase.from('settings').upsert({
        user_id: state.user.id,
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

// Initialize Supabase Auth Listener once in browser
let authListenerInitialized = false;

function initSupabaseAuthListener() {
  if (authListenerInitialized || typeof window === 'undefined' || !isSupabaseConfigured) return;
  authListenerInitialized = true;

  try {
    // 1. Check existing session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        const meta = u.user_metadata || {};
        const userName = meta.name || meta.full_name || u.email?.split('@')[0] || 'Atleta';
        const userAvatar = meta.avatar_url || meta.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';
        
        state = {
          ...state,
          user: {
            id: u.id,
            name: userName,
            email: u.email || 'atleta@treinohome.app',
            avatar_url: userAvatar,
            created_at: u.created_at || new Date().toISOString()
          },
          isLoggedIn: true
        };
        storeActions.loadFromSupabaseAsync(u.id);
        notify();
      }
    }).catch(() => null);

    // 2. Listen to ongoing auth state changes (OAuth redirect, sign in, sign out)
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION')) {
        const u = session.user;
        const meta = u.user_metadata || {};
        const userName = meta.name || meta.full_name || u.email?.split('@')[0] || 'Atleta';
        const userAvatar = meta.avatar_url || meta.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';

        state = {
          ...state,
          user: {
            id: u.id,
            name: userName,
            email: u.email || 'atleta@treinohome.app',
            avatar_url: userAvatar,
            created_at: u.created_at || new Date().toISOString()
          },
          isLoggedIn: true
        };
        storeActions.loadFromSupabaseAsync(u.id);
        notify();
      } else if (event === 'SIGNED_OUT') {
        state = {
          ...state,
          user: null,
          isLoggedIn: false
        };
        notify();
      }
    });
  } catch (err) {
    console.warn('Could not initialize Supabase auth listener:', err);
  }
}

// Auto-run if running in browser
if (typeof window !== 'undefined') {
  setTimeout(() => {
    initSupabaseAuthListener();
  }, 50);
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

  loadFromSupabaseAsync: async (userId: string) => {
    if (!isSupabaseConfigured) return;
    try {
      const [profileRes, progressRes, settingsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('progress').select('*').eq('user_id', userId).single(),
        supabase.from('settings').select('*').eq('user_id', userId).single()
      ]);

      let newState = { ...state };

      if (profileRes.data) {
        newState.user = {
          id: profileRes.data.id,
          name: profileRes.data.nome,
          email: profileRes.data.email,
          avatar_url: profileRes.data.foto,
          created_at: profileRes.data.data_criacao
        };
      }

      if (progressRes.data) {
        newState.progress = {
          ...newState.progress,
          id: progressRes.data.id,
          user_id: progressRes.data.user_id,
          xp: progressRes.data.xp,
          level: progressRes.data.nivel,
          sequencia_dias: progressRes.data.sequencia_dias,
          treinos_concluidos: progressRes.data.treinos_concluidos,
          series_concluidas: progressRes.data.series_concluidas,
          updated_at: progressRes.data.updated_at
        };
      }

      if (settingsRes.data) {
        newState.settings = {
          ...newState.settings,
          descanso: settingsRes.data.descanso,
          notificacoes: settingsRes.data.notificacoes,
          horario_notificacao: settingsRes.data.horario_notificacao,
          som: settingsRes.data.som,
          vibracao: settingsRes.data.vibracao,
          tema: settingsRes.data.tema
        };
      }

      state = newState;
      notify();
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
    }
  },

  login: (name: string, email: string, avatarUrl?: string, id?: string) => {
    state = {
      ...state,
      user: {
        id: id || crypto.randomUUID(),
        name: name || 'Atleta',
        email: email || 'usuario@treinohome.app',
        avatar_url: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        created_at: new Date().toISOString()
      },
      isLoggedIn: true
    };
    notify();
  },

  registerCleanProfile: (params: { 
    name: string; 
    email: string; 
    avatarUrl?: string; 
    id?: string;
    gender?: 'masculino' | 'feminino' | 'outro' | 'nao_informado';
    age?: number;
    weight?: number;
    height?: number;
    fitness_goal?: 'hipertrofia' | 'emagrecimento' | 'definicao' | 'forca' | 'resistencia' | 'saude';
    experience_level?: 'iniciante' | 'intermediario' | 'avancado';
    weekly_days_target?: number;
    session_duration_minutes?: number;
    limitations?: string[];
    onboarding_completed?: boolean;
  }) => {
    const userId = params.id || state.user?.id || crypto.randomUUID();
    const cleanUser: Profile = {
      id: userId,
      name: params.name || 'Novo Atleta',
      email: params.email || 'atleta@treinohome.app',
      avatar_url: params.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      created_at: new Date().toISOString(),
      gender: params.gender || 'nao_informado',
      age: params.age || 25,
      weight: params.weight || 70,
      height: params.height || 175,
      fitness_goal: params.fitness_goal || 'hipertrofia',
      experience_level: params.experience_level || 'iniciante',
      weekly_days_target: params.weekly_days_target || 5,
      session_duration_minutes: params.session_duration_minutes || 30,
      limitations: params.limitations || ['nenhuma'],
      onboarding_completed: params.onboarding_completed !== undefined ? params.onboarding_completed : true
    };

    const zeroProgress: Progress = {
      id: crypto.randomUUID(),
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
    const userId = state.user?.id || crypto.randomUUID();
    const zeroProgress: Progress = {
      id: crypto.randomUUID(),
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

  updateAthleteProfile: (updates: Partial<Profile>) => {
    if (!state.user) return;
    state = {
      ...state,
      user: {
        ...state.user,
        ...updates
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
