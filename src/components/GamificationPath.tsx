import React from 'react';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Star, 
  Award, 
  Zap,
  ChevronRight,
  Play
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { GamificationPhase } from '../types';

interface GamificationPathProps {
  onSelectTab: (tab: string) => void;
}

export const GamificationPath: React.FC<GamificationPathProps> = ({ onSelectTab }) => {
  const [state, actions] = useAppStore();
  const { phases, progress } = state;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-emerald-950/30 border border-emerald-500/20 p-6 sm:p-8 space-y-4 text-center relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-lime-400 text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Jornada de Evolução Gamificada</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Caminho de Fases do Atleta
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Cada semana concluída destrava sua próxima medalha, garante XP massivo e eleva seu nível físico. Não quebre sua sequência!
        </p>

        <div className="flex justify-center items-center space-x-6 pt-2 text-xs font-bold">
          <div className="flex items-center space-x-1.5 text-amber-400">
            <Trophy className="w-4 h-4" />
            <span>Nível {progress.level}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-lime-400">
            <Zap className="w-4 h-4" />
            <span>{progress.xp} Total XP</span>
          </div>
          <div className="flex items-center space-x-1.5 text-orange-400">
            <Flame className="w-4 h-4" />
            <span>{progress.sequencia_dias} Dias Seguidos</span>
          </div>
        </div>
      </div>

      {/* Evolution Vertical Path */}
      <div className="relative py-8">
        
        {/* Connecting Vertical Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-2.5 bg-gradient-to-b from-lime-400 via-emerald-500 to-zinc-800 rounded-full z-0" />

        <div className="space-y-16 relative z-10">
          {phases.map((phase, idx) => {
            const isDone = phase.completed;
            const isCurrent = phase.is_current;
            const isLocked = !isDone && !isCurrent;

            // Offset left/right for serpentine progression effect
            const offsetClass = idx % 2 === 0 ? 'sm:-translate-x-12' : 'sm:translate-x-12';

            return (
              <div 
                key={phase.id}
                className={`flex flex-col items-center text-center space-y-4 transition-all duration-300 ${offsetClass}`}
              >
                {/* Node Circle */}
                <div className="relative group">
                  
                  {/* Glowing Ring Effect for Current */}
                  {isCurrent && (
                    <div className="absolute -inset-3 rounded-3xl bg-lime-400 opacity-60 blur-lg animate-pulse" />
                  )}

                  <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-4 flex items-center justify-center text-3xl shadow-2xl transition-all ${
                    isDone 
                      ? 'bg-gradient-to-br from-lime-400 to-emerald-400 border-lime-300 text-zinc-950 scale-105 font-extrabold shadow-lime-500/20' 
                      : isCurrent
                        ? 'bg-lime-400 border-b-8 border-lime-600 text-black scale-110 shadow-[0_0_40px_rgba(163,230,53,0.3)]'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-600'
                  }`}>
                    {isDone ? (
                      <CheckCircle2 className="w-10 h-10 text-zinc-950 stroke-[3]" />
                    ) : isLocked ? (
                      <Lock className="w-8 h-8 text-zinc-600" />
                    ) : (
                      <span>{phase.medal_icon}</span>
                    )}

                    {/* Badge Indicator */}
                    <span className="absolute -bottom-2.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md bg-zinc-950 border border-zinc-800 text-lime-400">
                      Semana {phase.week_number}
                    </span>
                  </div>
                </div>

                {/* Phase Info Card */}
                <div className={`w-full max-w-sm rounded-3xl p-5 border transition-all shadow-lg ${
                  isCurrent 
                    ? 'bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-emerald-950/30 border-lime-400/60 shadow-xl shadow-lime-500/10' 
                    : isDone
                      ? 'bg-gradient-to-br from-zinc-950 via-zinc-950 to-emerald-950/20 border-emerald-500/30'
                      : 'bg-zinc-950/60 border-zinc-800 opacity-60'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-extrabold uppercase tracking-wider ${isCurrent ? 'text-lime-400' : 'text-zinc-400'}`}>
                      {phase.title}
                    </span>
                    <span className="text-[10px] font-extrabold text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded-full border border-lime-500/20">
                      +250 XP
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 mb-4">{phase.subtitle}</p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-semibold text-zinc-400">
                      <span>Metas da Semana</span>
                      <span className="text-lime-400 font-bold">{phase.current_workouts}/{phase.target_workouts} Treinos</span>
                    </div>

                    <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="bg-lime-400 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${phase.percentage}%` }}
                      />
                    </div>
                  </div>

                  {isCurrent && (
                    <button
                      onClick={() => onSelectTab('workout')}
                      id={`phase-start-btn-${phase.id}`}
                      className="w-full mt-4 py-3 rounded-2xl bg-lime-400 text-black font-extrabold text-xs hover:bg-lime-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-md shadow-lime-500/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Continuar Treino da Semana</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
