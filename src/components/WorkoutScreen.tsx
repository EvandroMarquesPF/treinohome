import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Dumbbell, 
  ChevronRight, 
  Info, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Trophy, 
  Flame, 
  Award, 
  Zap 
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { DayOfWeek, Exercise } from '../types';

interface WorkoutScreenProps {
  onSelectTab?: (tab: string) => void;
}

export const WorkoutScreen: React.FC<WorkoutScreenProps> = () => {
  const [state, actions] = useAppStore();
  const { workouts, activeWorkoutDay, settings } = state;

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(activeWorkoutDay);
  const [selectedExerciseModal, setSelectedExerciseModal] = useState<Exercise | null>(null);

  // Timer tracking for current active workout session
  const [workoutTimerRunning, setWorkoutTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    setSelectedDay(activeWorkoutDay);
  }, [activeWorkoutDay]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (workoutTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workoutTimerRunning]);

  const currentWorkout = workouts[selectedDay];
  const daysList: DayOfWeek[] = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleSet = (exId: string) => {
    if (!workoutTimerRunning) {
      setWorkoutTimerRunning(true);
    }
    actions.toggleSeriesCompletion(selectedDay, exId);
  };

  const handleCompleteWorkout = () => {
    setWorkoutTimerRunning(false);
    actions.completeWorkout(selectedDay, elapsedSeconds || 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* Day Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {daysList.map(day => {
          const w = workouts[day];
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => {
                setSelectedDay(day);
                actions.setActiveDay(day);
              }}
              id={`workout-tab-${day}`}
              className={`px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 border cursor-pointer ${
                isSelected 
                  ? 'bg-lime-400 text-black border-lime-300 font-extrabold shadow-md shadow-lime-500/20' 
                  : w.completed 
                    ? 'bg-emerald-50/70 text-emerald-800 border-emerald-400/40 dark:bg-zinc-950 dark:text-lime-400 dark:border-emerald-500/30' 
                    : 'bg-white/80 text-zinc-600 border-emerald-500/20 hover:text-zinc-900 dark:bg-zinc-950/60 dark:text-zinc-400 dark:border-zinc-800 dark:hover:text-white'
              }`}
            >
              <span className="capitalize">{day}</span>
              {w.completed && <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />}
            </button>
          );
        })}
      </div>

      {/* Workout Overview Header */}
      <div className="rounded-3xl bg-gradient-to-br from-white via-white to-emerald-50/80 border border-emerald-500/25 dark:bg-gradient-to-br dark:from-black dark:via-zinc-950 dark:to-emerald-950/80 dark:border-emerald-500/30 p-6 sm:p-8 space-y-4 relative overflow-hidden shadow-md dark:shadow-xl text-center sm:text-left transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/10 dark:bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-extrabold text-lime-700 dark:text-lime-400 uppercase tracking-wider">
                Treino de {selectedDay}
              </span>
              {currentWorkout.completed && (
                <span className="px-2.5 py-0.5 rounded-full bg-lime-500/15 text-lime-800 dark:bg-emerald-500/20 dark:text-lime-400 text-[10px] font-extrabold border border-lime-500/30 dark:border-emerald-500/30">
                  Concluído 🎉
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white">{currentWorkout.title}</h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 font-medium">{currentWorkout.target_muscles}</p>
          </div>

          {/* Session Timer & Finish Action */}
          <div className="flex flex-col items-center sm:items-end space-y-3">
            <div className="flex items-center space-x-2 bg-white/90 dark:bg-zinc-950/80 border border-emerald-500/20 dark:border-zinc-800 px-4 py-2 rounded-2xl">
              <Clock className="w-4 h-4 text-lime-600 dark:text-lime-400 animate-spin" />
              <span className="font-mono text-base font-bold text-zinc-900 dark:text-white">{formatTime(elapsedSeconds)}</span>
            </div>

            <button
              onClick={handleCompleteWorkout}
              id="finish-workout-btn"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-extrabold text-xs shadow-md shadow-lime-500/20 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir Treino (+100 XP)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Exercise Cards List */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center justify-center sm:justify-start space-x-2">
          <Dumbbell className="w-5 h-5 text-lime-600 dark:text-lime-400" />
          <span>Exercícios do Programa ({currentWorkout.exercises.length})</span>
        </h2>

        {currentWorkout.exercises.map((exercise, idx) => {
          const isFinished = exercise.completed;

          return (
            <div 
              key={exercise.id}
              className={`rounded-3xl border transition-all p-5 sm:p-6 space-y-4 shadow-sm dark:shadow-md ${
                isFinished 
                  ? 'bg-gradient-to-br from-emerald-50/80 to-emerald-100/50 border-emerald-500/30 dark:bg-gradient-to-br dark:from-black dark:via-zinc-950 dark:to-emerald-950/60 dark:border-emerald-500/35' 
                  : 'bg-gradient-to-br from-white via-white to-emerald-50/70 border-emerald-500/25 hover:border-lime-500/40 dark:bg-gradient-to-br dark:from-black dark:via-zinc-950 dark:to-emerald-950/70 dark:border-emerald-500/30 dark:hover:border-emerald-500/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                
                {/* Exercise Info & Thumbnail */}
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="relative group cursor-pointer shrink-0" onClick={() => setSelectedExerciseModal(exercise)}>
                    <img 
                      src={exercise.image_url} 
                      alt={exercise.name} 
                      className="w-20 h-20 sm:w-20 sm:h-20 rounded-2xl object-cover ring-1 ring-zinc-300 dark:ring-zinc-700 group-hover:scale-105 transition-transform shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Info className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center sm:items-start">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">#{idx + 1}</span>
                      <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white">{exercise.name}</h3>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-lg line-clamp-2 font-medium">{exercise.description}</p>

                    <div className="flex items-center space-x-3 mt-2 text-xs font-semibold justify-center sm:justify-start">
                      <span className="px-2.5 py-0.5 rounded-full bg-lime-500/15 text-lime-800 dark:bg-lime-500/10 dark:text-lime-400 border border-lime-500/30 dark:border-lime-500/20 font-bold">
                        {exercise.repeticoes}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400">{exercise.target_muscle}</span>
                    </div>
                  </div>
                </div>

                {/* Info Button */}
                <button
                  onClick={() => setSelectedExerciseModal(exercise)}
                  className="p-2.5 rounded-xl bg-white/80 hover:bg-emerald-50/80 text-zinc-700 hover:text-zinc-900 border border-emerald-500/20 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white dark:border-zinc-800 transition-colors self-center text-xs flex items-center space-x-1 font-semibold shadow-xs cursor-pointer"
                  title="Ver Técnica"
                >
                  <Info className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  <span>Técnica</span>
                </button>
              </div>

              {/* Set Checkboxes Bar */}
              <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                  Séries Concluídas: {exercise.completed_series}/{exercise.series}
                </span>

                <div className="flex items-center justify-center space-x-2">
                  {[...Array(exercise.series)].map((_, sIdx) => {
                    const isDone = sIdx < exercise.completed_series;
                    return (
                      <button
                        key={sIdx}
                        onClick={() => handleToggleSet(exercise.id)}
                        id={`set-check-${exercise.id}-${sIdx}`}
                        className={`w-10 h-10 rounded-xl font-extrabold text-xs flex items-center justify-center border transition-all cursor-pointer ${
                          isDone 
                            ? 'bg-lime-400 text-black border-lime-300 shadow-md shadow-lime-500/20 scale-105' 
                            : 'bg-white/90 text-zinc-600 border-emerald-500/25 hover:border-lime-500 hover:text-zinc-900 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-800 dark:hover:border-lime-500/40 dark:hover:text-white'
                        }`}
                      >
                        {isDone ? <Check className="w-5 h-5 stroke-[3] text-black" /> : sIdx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-lg bg-gradient-to-br from-white via-white to-emerald-50/80 border border-emerald-500/25 dark:bg-gradient-to-br dark:from-black dark:via-zinc-950 dark:to-emerald-950/80 dark:border-emerald-500/30 rounded-3xl p-6 space-y-5 text-zinc-900 dark:text-zinc-100 shadow-2xl relative transition-colors">
            <button
              onClick={() => setSelectedExerciseModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/80 dark:bg-zinc-950 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-emerald-500/20 dark:border-zinc-800 cursor-pointer"
            >
              ✕
            </button>

            <img 
              src={selectedExerciseModal.image_url} 
              alt={selectedExerciseModal.name} 
              className="w-full h-52 object-cover rounded-2xl border border-emerald-500/20 dark:border-zinc-800"
              referrerPolicy="no-referrer"
            />

            <div className="space-y-2">
              <span className="text-xs font-extrabold text-lime-700 dark:text-lime-400 uppercase tracking-wider">
                {selectedExerciseModal.target_muscle}
              </span>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">{selectedExerciseModal.name}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">{selectedExerciseModal.description}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 dark:bg-zinc-950 border border-emerald-500/20 dark:border-zinc-800 text-xs space-y-2">
              <div className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                <span>Dica de Execução:</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Mantenha a respiração cadenciada. Solte o ar na fase concêntrica (ao fazer a força) e inspire no retorno.
              </p>
            </div>

            <button
              onClick={() => setSelectedExerciseModal(null)}
              className="w-full py-3.5 rounded-2xl bg-lime-400 text-black font-extrabold text-xs shadow-md shadow-lime-500/20 hover:bg-lime-300 transition-all cursor-pointer"
            >
              Entendido! Voltar ao Treino
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
