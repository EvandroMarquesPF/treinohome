import React from 'react';
import { 
  Flame, 
  Trophy, 
  Zap, 
  Dumbbell, 
  Clock, 
  Award, 
  Calendar, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { DayOfWeek } from '../types';

interface DashboardProps {
  onSelectTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectTab }) => {
  const [state, actions] = useAppStore();
  const { user, progress, workouts, workoutLogs, phases, activeWorkoutDay } = state;

  const daysOrder: DayOfWeek[] = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
  const todayWorkout = workouts[activeWorkoutDay];

  const currentLevel = progress.level;
  const currentXp = progress.xp;
  const nextLevelXp = currentLevel * 500;
  const prevLevelXp = (currentLevel - 1) * 500;
  const xpPercentage = Math.min(100, Math.max(0, Math.round(((currentXp - prevLevelXp) / 500) * 100)));

  const currentPhase = phases.find(p => p.is_current) || phases[0];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-lime-50/50 border border-lime-500/30 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/30 dark:border-emerald-500/20 p-6 sm:p-8 shadow-md dark:shadow-xl transition-colors">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-lime-400/15 dark:bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.name} 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-lime-500/50 shadow-md"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-lime-400 text-zinc-950 font-black text-2xl flex items-center justify-center shadow-md">
                  {user?.name?.[0] || 'A'}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-zinc-900 dark:bg-zinc-950 border border-zinc-700 dark:border-zinc-800 text-lime-400 font-black text-[10px] shadow-sm">
                Nível {currentLevel}
              </span>
            </div>

            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                  Olá, {user?.name || 'Atleta'} 👋
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 font-medium">
                A disciplina de hoje constrói o resultado de amanhã.
              </p>
            </div>
          </div>

          {/* Quick Stats Pill Header */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-emerald-500/20 text-amber-600 dark:text-amber-400 font-bold text-sm shadow-sm">
              <Trophy className="w-4 h-4 fill-amber-400/20" />
              <span>{currentXp} XP</span>
            </div>

            <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-lime-500/15 dark:bg-emerald-500/10 border border-lime-500/30 dark:border-emerald-500/20 text-lime-800 dark:text-lime-400 font-bold text-sm shadow-sm">
              <Flame className="w-4 h-4 text-lime-600 dark:text-lime-400 fill-lime-400/20 animate-pulse" />
              <span>{progress.sequencia_dias} Dias Seguidos</span>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800/80 space-y-2">
          <div className="flex justify-between items-center text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            <span>Progresso do Nível {currentLevel}</span>
            <span className="text-lime-700 dark:text-lime-400 font-bold">{xpPercentage}% ({currentXp - prevLevelXp}/500 XP)</span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-950 h-3 rounded-full overflow-hidden p-0.5 border border-zinc-300 dark:border-zinc-800">
            <div 
              className="bg-gradient-to-r from-lime-500 to-emerald-500 dark:from-lime-400 dark:to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Today's Workout Quick Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Workout Card */}
        <div className="lg:col-span-8 rounded-3xl bg-white border border-zinc-200/90 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/30 dark:border-emerald-500/20 p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-md dark:shadow-xl text-center sm:text-left transition-colors">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-lime-500 dark:via-lime-400 to-transparent opacity-80 animate-pulse" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-1 bg-gradient-to-r from-lime-500 to-emerald-500 dark:from-lime-400 dark:to-emerald-400 rounded-full animate-pulse shadow-sm shadow-lime-400/40" />
              <span className="text-xs font-bold text-lime-700 dark:text-lime-400 uppercase tracking-wider">Treino Recomendado Hoje</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold capitalize">
              {todayWorkout.dia_semana}
            </span>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">{todayWorkout.title}</h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 font-medium">{todayWorkout.target_muscles}</p>
          </div>

          {/* Exercise Preview List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {todayWorkout.exercises.map((ex) => (
              <div 
                key={ex.id}
                className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/90 dark:bg-zinc-950/80 dark:border-zinc-800 flex items-center space-x-3 hover:border-lime-500/40 dark:hover:border-emerald-500/30 transition-colors shadow-xs"
              >
                <img 
                  src={ex.image_url} 
                  alt={ex.name} 
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-300 dark:ring-zinc-700"
                  referrerPolicy="no-referrer"
                />
                <div className="overflow-hidden text-left">
                  <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{ex.name}</div>
                  <div className="text-[10px] text-lime-700 dark:text-lime-400 font-bold">{ex.repeticoes}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Trigger */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
            <div className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center justify-center space-x-4 font-medium">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-zinc-500" />
                <span>~25 min</span>
              </span>
              <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 font-bold">
                <Trophy className="w-4 h-4" />
                <span>+100 XP ao concluir</span>
              </span>
            </div>

            <button
              onClick={() => {
                actions.setActiveDay(activeWorkoutDay);
                onSelectTab('workout');
              }}
              id="dashboard-start-workout-btn"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-extrabold text-sm shadow-md shadow-lime-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>{todayWorkout.completed ? 'Treino Concluído (Ver Novamente)' : 'Iniciar Treino Agora'}</span>
            </button>
          </div>
        </div>

        {/* Gamification Path Preview Card */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-zinc-200/90 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/30 dark:border-emerald-500/20 p-6 space-y-5 flex flex-col justify-between shadow-md dark:shadow-xl text-center sm:text-left transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-lime-700 dark:text-lime-400 uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <span>Caminho de Evolução</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-lime-500/15 text-lime-800 dark:bg-emerald-500/10 dark:text-lime-400 font-bold border border-lime-500/30 dark:border-emerald-500/20">
                Trilha de Fases
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90 dark:bg-zinc-950/80 dark:border-zinc-800 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
                <span className="text-3xl">{currentPhase.medal_icon}</span>
                <div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-white">{currentPhase.title}</div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">{currentPhase.subtitle}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                  <span>Meta Semanal: {currentPhase.current_workouts}/{currentPhase.target_workouts} Treinos</span>
                  <span className="text-lime-700 dark:text-lime-400 font-bold">{currentPhase.percentage}%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-900 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-lime-500 to-emerald-500 dark:from-lime-400 dark:to-emerald-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${currentPhase.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('evolution')}
            id="dashboard-open-evolution-btn"
            className="w-full py-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 dark:bg-zinc-950/80 dark:hover:bg-zinc-800 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white font-bold text-xs transition-colors flex items-center justify-center space-x-2 group"
          >
            <span>Ver Mapa Completo de Fases</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* Grid Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Treinos Concluídos',
            value: progress.treinos_concluidos,
            icon: CheckCircle2,
            color: 'text-lime-600 dark:text-lime-400',
            bg: 'bg-lime-500/15 border-lime-500/30 dark:bg-emerald-500/10 dark:border-emerald-500/20'
          },
          {
            label: 'Séries Executadas',
            value: progress.series_concluidas,
            icon: Dumbbell,
            color: 'text-teal-600 dark:text-teal-400',
            bg: 'bg-teal-500/15 border-teal-500/30 dark:bg-teal-500/10 dark:border-teal-500/20'
          },
          {
            label: 'Tempo de Treino',
            value: `${progress.tempo_total_minutos} min`,
            icon: Clock,
            color: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-500/15 border-indigo-500/30 dark:bg-indigo-500/10 dark:border-indigo-500/20'
          },
          {
            label: 'Maior Sequência',
            value: `${progress.sequencia_dias} dias`,
            icon: Flame,
            color: 'text-orange-600 dark:text-orange-400',
            bg: 'bg-orange-500/15 border-orange-500/30 dark:bg-orange-500/10 dark:border-orange-500/20'
          }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx}
              className="p-5 rounded-2xl bg-white border border-zinc-200/90 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/20 dark:border-emerald-500/20 space-y-2 shadow-sm dark:shadow-md flex flex-col items-center text-center sm:items-start sm:text-left transition-colors"
            >
              <div className={`w-9 h-9 rounded-xl ${stat.bg} border flex items-center justify-center ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Weekly Visual Schedule Tracker */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/25 dark:border-emerald-500/20 p-6 space-y-4 shadow-md dark:shadow-xl transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-lime-600 dark:text-lime-400" />
            <span>Sua Semana de Treinos</span>
          </h3>
          <button 
            onClick={() => onSelectTab('calendar')}
            className="text-xs text-lime-700 dark:text-lime-400 font-bold hover:underline"
          >
            Abrir Calendário Mensal
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4">
          {daysOrder.map(day => {
            const w = workouts[day];
            const isToday = activeWorkoutDay === day;
            return (
              <button
                key={day}
                onClick={() => {
                  actions.setActiveDay(day);
                  onSelectTab('workout');
                }}
                className={`p-3 sm:p-4 rounded-2xl border transition-all flex flex-col items-center space-y-2 text-center ${
                  isToday 
                    ? 'bg-lime-50 border-lime-500 text-zinc-900 ring-2 ring-lime-400/40 dark:bg-zinc-950 dark:border-lime-400 dark:text-white dark:ring-lime-400/30' 
                    : w.completed 
                      ? 'bg-emerald-50/50 border-emerald-500/40 text-emerald-800 dark:bg-zinc-950 dark:border-emerald-500/40 dark:text-lime-400' 
                      : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-lime-500/30 dark:bg-zinc-950/60 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-emerald-500/30'
                }`}
              >
                <span className="text-[10px] uppercase font-extrabold tracking-wider">{day.slice(0, 3)}</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  {w.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-lime-600 dark:text-lime-400" />
                  ) : w.is_rest_day ? (
                    <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400">💤</span>
                  ) : (
                    <Dumbbell className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                  )}
                </div>
                <span className="text-[10px] font-bold line-clamp-1 truncate w-full">{w.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/25 dark:border-emerald-500/20 p-6 space-y-4 shadow-md dark:shadow-xl transition-colors">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white text-center sm:text-left">Histórico Recente de Treinos</h3>
        {workoutLogs.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 text-center">Nenhum treino registrado ainda. Inicie o treino de hoje!</p>
        ) : (
          <div className="space-y-3">
            {workoutLogs.slice(0, 3).map(log => (
              <div 
                key={log.id}
                className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
              >
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-lime-500/15 text-lime-700 dark:bg-lime-500/10 dark:text-lime-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-900 dark:text-white">{log.workout_title}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                      {log.date} • {Math.round(log.tempo_segundos / 60)} min • {log.series_concluidas} séries
                    </div>
                  </div>
                </div>

                <div className="text-xs font-bold text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full bg-amber-400/15 dark:bg-amber-400/10 border border-amber-400/30 dark:border-amber-400/20">
                  +{log.xp_ganho} XP
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
