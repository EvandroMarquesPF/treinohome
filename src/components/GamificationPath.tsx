import React, { useMemo } from 'react';
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
  Play, 
  TrendingUp, 
  ShieldCheck, 
  Dumbbell, 
  Target,
  Crown,
  CalendarCheck2
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { GamificationPhase } from '../types';
import { soundEngine } from '../lib/audio';

interface GamificationPathProps {
  onSelectTab: (tab: string) => void;
}

export const GamificationPath: React.FC<GamificationPathProps> = ({ onSelectTab }) => {
  const [state] = useAppStore();
  const { phases, progress, settings } = state;

  const currentLevel = progress.level || 1;
  const currentXp = progress.xp || 0;
  const xpForNextLevel = currentLevel * 500;
  const currentLevelBaseXp = (currentLevel - 1) * 500;
  const xpInCurrentLevel = Math.max(0, currentXp - currentLevelBaseXp);
  const xpNeeded = 500;
  const levelPercentage = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeeded) * 100)));

  // Athlete Rank Title based on Level
  const athleteRank = useMemo(() => {
    if (currentLevel >= 10) return { title: 'Lenda da Calistenia', icon: Crown, color: 'text-amber-300', tier: 'Diamante' };
    if (currentLevel >= 7) return { title: 'Guerreiro de Elite', icon: Trophy, color: 'text-lime-300', tier: 'Platina' };
    if (currentLevel >= 4) return { title: 'Atleta Avançado', icon: Award, color: 'text-emerald-400', tier: 'Ouro' };
    if (currentLevel >= 2) return { title: 'Praticante Focado', icon: Star, color: 'text-teal-400', tier: 'Prata' };
    return { title: 'Iniciante Determinado', icon: Zap, color: 'text-lime-400', tier: 'Bronze' };
  }, [currentLevel]);

  // Current active phase
  const activePhase = phases.find(p => p.is_current) || phases[0];
  const completedPhasesCount = phases.filter(p => p.completed).length;

  const handleStartWorkout = () => {
    if (settings.som) soundEngine.playClick();
    onSelectTab('workout');
  };

  const RankIcon = athleteRank.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Header Banner - Symmetrical & Clean */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/30 dark:border-emerald-500/20 p-6 sm:p-8 space-y-6 shadow-md dark:shadow-xl relative overflow-hidden text-center sm:text-left transition-colors">
        <div className="absolute top-0 right-0 w-80 h-80 bg-lime-400/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 flex flex-col items-center sm:items-start">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-800 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-lime-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Jornada de Evolução & Fases</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              Caminho de Maestria do Atleta
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed font-medium">
              Complete sua programação semanal para destravar medalhas, acumular XP e progredir nos patamares de calistenia.
            </p>
          </div>

          {/* Current Rank Badge */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-3.5 shrink-0 self-stretch sm:self-auto justify-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-400/20 to-emerald-500/20 border border-lime-400/30 flex items-center justify-center">
              <RankIcon className={`w-6 h-6 ${athleteRank.color}`} />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Patamar Atual</div>
              <div className={`text-sm font-extrabold ${athleteRank.color}`}>{athleteRank.title}</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Liga {athleteRank.tier}</div>
            </div>
          </div>
        </div>

        {/* Level Progression Bar & Metrics */}
        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 space-y-1 flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 flex items-center space-x-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Nível Atual</span>
              </span>
              <div className="text-base font-black text-zinc-900 dark:text-white">Nível {currentLevel}</div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 space-y-1 flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                <span>Total XP</span>
              </span>
              <div className="text-base font-black text-zinc-900 dark:text-white">{currentXp.toLocaleString()} XP</div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 space-y-1 flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Sequência</span>
              </span>
              <div className="text-base font-black text-orange-600 dark:text-orange-300">{progress.sequencia_dias} Dias</div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 space-y-1 flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Fases Concluídas</span>
              </span>
              <div className="text-base font-black text-emerald-700 dark:text-emerald-300">{completedPhasesCount} de {phases.length}</div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="space-y-1.5 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 text-left">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-zinc-700 dark:text-zinc-300">Progresso para o Nível {currentLevel + 1}</span>
              <span className="text-lime-700 dark:text-lime-400 font-extrabold">{xpInCurrentLevel} / {xpNeeded} XP ({levelPercentage}%)</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <div 
                className="bg-gradient-to-r from-lime-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${levelPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Spotlight: Active Phase Focus Card */}
      {activePhase && (
        <div className="rounded-3xl bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/40 border-2 border-lime-400 p-6 sm:p-8 space-y-4 shadow-md dark:shadow-xl relative overflow-hidden text-center sm:text-left transition-colors">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 flex flex-col items-center sm:items-start">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-1 bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-lime-700 dark:text-lime-400">
                  Fase Ativa Atual • Semana {activePhase.week_number}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">{activePhase.title}</h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">{activePhase.subtitle}</p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <div className="px-3.5 py-1.5 rounded-xl bg-lime-500/15 border border-lime-500/30 text-lime-800 dark:bg-lime-500/10 dark:text-lime-400 text-xs font-extrabold flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>+250 XP Recompensa</span>
              </div>
            </div>
          </div>

          {/* Active Phase Progress & Action Button */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-2">
            <div className="sm:col-span-2 space-y-2 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 text-left">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-zinc-700 dark:text-zinc-300">Meta de Treinos Semanais</span>
                <span className="text-lime-700 dark:text-lime-400 font-extrabold">{activePhase.current_workouts} de {activePhase.target_workouts} Treinos</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-900 h-3 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <div 
                  className="bg-gradient-to-r from-lime-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${activePhase.percentage}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleStartWorkout}
              id="active-phase-cta-btn"
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-black text-sm hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-md shadow-lime-500/20"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Treinar Agora</span>
            </button>
          </div>
        </div>
      )}

      {/* Symmetrical & Aligned Phase Timeline */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/30 dark:border-emerald-500/20 p-6 sm:p-8 space-y-6 shadow-md dark:shadow-xl transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-lime-600 dark:text-lime-400" />
              <span>Trilha Completa de Fases & Metas</span>
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 font-medium">
              Progressão estruturada semana a semana com metas graduais.
            </p>
          </div>

          <span className="text-xs font-bold text-zinc-500 hidden sm:inline">
            5 Fases do Ciclo
          </span>
        </div>

        {/* Timeline List */}
        <div className="relative pl-6 sm:pl-8 space-y-6 sm:space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-lime-400 before:via-emerald-500 before:to-zinc-300 dark:before:to-zinc-800">
          {phases.map((phase, idx) => {
            const isDone = phase.completed;
            const isCurrent = phase.is_current;
            const isLocked = !isDone && !isCurrent;

            return (
              <div key={phase.id} className="relative group">
                
                {/* Node Milestone Icon on Timeline */}
                <div className={`absolute -left-6 sm:-left-8 top-4 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all z-10 ${
                  isDone 
                    ? 'bg-emerald-400 border-emerald-300 text-black shadow-md shadow-emerald-500/30 scale-105'
                    : isCurrent
                      ? 'bg-lime-400 border-lime-300 text-black shadow-lg shadow-lime-500/40 ring-4 ring-lime-400/20 scale-110'
                      : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500'
                }`}>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  ) : isCurrent ? (
                    <Zap className="w-4 h-4 fill-black text-black" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                  )}
                </div>

                {/* Milestone Content Card */}
                <div className={`rounded-2xl p-5 sm:p-6 border transition-all ${
                  isCurrent
                    ? 'bg-lime-50/40 border-lime-400 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/98 dark:to-emerald-950/40 dark:border-lime-400/50 shadow-sm dark:shadow-xl dark:shadow-lime-500/5 ring-1 ring-lime-400/20'
                    : isDone
                      ? 'bg-zinc-50 border-emerald-500/30 dark:bg-zinc-950/80 dark:border-emerald-500/30'
                      : 'bg-zinc-50/50 border-zinc-200 dark:bg-zinc-950/40 dark:border-zinc-800/80 opacity-70'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl sm:text-2xl">{phase.medal_icon}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-black uppercase tracking-wider text-lime-700 dark:text-lime-400">
                            Semana {phase.week_number}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-lime-500/15 text-lime-800 border border-lime-400/40 dark:bg-lime-400/10 dark:text-lime-300 dark:border-lime-400/30">
                              Em Andamento
                            </span>
                          )}
                          {isDone && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                              Concluída
                            </span>
                          )}
                          {isLocked && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-200 text-zinc-600 border border-zinc-300 dark:bg-zinc-900 dark:text-zinc-500 dark:border-zinc-800">
                              Bloqueada
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">{phase.title}</h3>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-start sm:self-auto">
                      <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">Recompensa:</span>
                      <span className="text-xs font-black text-lime-800 bg-lime-500/15 dark:text-lime-400 dark:bg-lime-500/10 px-2.5 py-1 rounded-xl border border-lime-500/30 dark:border-lime-500/20">
                        +250 XP
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed font-medium">{phase.subtitle}</p>

                  {/* Progress Details */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                      <span>Progresso da Fase</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        {phase.current_workouts} de {phase.target_workouts} treinos ({phase.percentage}%)
                      </span>
                    </div>

                    <div className="w-full bg-zinc-200 dark:bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isDone 
                            ? 'bg-emerald-400' 
                            : isCurrent 
                              ? 'bg-gradient-to-r from-lime-400 to-emerald-400' 
                              : 'bg-zinc-400 dark:bg-zinc-700'
                        }`}
                        style={{ width: `${phase.percentage}%` }}
                      />
                    </div>
                  </div>

                  {isCurrent && (
                    <div className="pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center space-x-1.5 self-start sm:self-auto font-medium">
                        <CalendarCheck2 className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                        <span>Faltam {Math.max(0, phase.target_workouts - phase.current_workouts)} treinos para finalizar esta fase.</span>
                      </div>

                      <button
                        onClick={handleStartWorkout}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-lime-400 text-black font-black text-xs hover:bg-lime-300 transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-lime-500/10"
                      >
                        <span>Continuar Treinos</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Calisthenics Mastery Tiers Overview */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/30 dark:border-emerald-500/20 p-6 sm:p-8 space-y-6 shadow-md dark:shadow-xl transition-colors">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-lime-600 dark:text-lime-400" />
            <span>Patamares de Maestria & Ligas</span>
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Sua graduação evolui conforme você acumula treinos concluídos e sobe de nível.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              tier: 'Bronze', 
              level: 'Nível 1+', 
              title: 'Iniciante', 
              desc: 'Adaptação neuromuscular e criação do hábito.',
              active: currentLevel < 2,
              unlocked: true,
              color: 'text-amber-600 dark:text-amber-400',
              border: 'border-amber-500/30'
            },
            { 
              tier: 'Prata', 
              level: 'Nível 2+', 
              title: 'Praticante Focado', 
              desc: 'Volume de séries constantes e flexões sólidas.',
              active: currentLevel >= 2 && currentLevel < 4,
              unlocked: currentLevel >= 2,
              color: 'text-teal-600 dark:text-teal-400',
              border: 'border-teal-500/30'
            },
            { 
              tier: 'Ouro', 
              level: 'Nível 4+', 
              title: 'Atleta Avançado', 
              desc: 'Alta densidade de treino e domínio de puxada.',
              active: currentLevel >= 4 && currentLevel < 7,
              unlocked: currentLevel >= 4,
              color: 'text-yellow-600 dark:text-yellow-400',
              border: 'border-yellow-500/30'
            },
            { 
              tier: 'Diamante', 
              level: 'Nível 7+', 
              title: 'Lenda da Calistenia', 
              desc: 'Consistência inabalável e condicionamento de elite.',
              active: currentLevel >= 7,
              unlocked: currentLevel >= 7,
              color: 'text-lime-700 dark:text-lime-400',
              border: 'border-lime-500/30'
            }
          ].map(item => (
            <div 
              key={item.tier}
              className={`p-4 rounded-2xl border space-y-2 transition-all ${
                item.active 
                  ? 'bg-lime-50/50 border-lime-400 ring-1 ring-lime-400/30 shadow-sm dark:bg-emerald-500/10 dark:border-lime-400/60 dark:ring-1 dark:ring-lime-400/30 dark:shadow-md' 
                  : item.unlocked 
                    ? 'bg-zinc-50 border-zinc-200 dark:bg-zinc-950/80 dark:border-zinc-800' 
                    : 'bg-zinc-50/40 border-zinc-200/60 opacity-50 dark:bg-zinc-950/40 dark:border-zinc-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-wider ${item.color}`}>
                  Liga {item.tier}
                </span>
                <span className="text-[10px] font-bold text-zinc-500">{item.level}</span>
              </div>

              <div className="text-sm font-black text-zinc-900 dark:text-white">{item.title}</div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug font-medium">{item.desc}</p>

              {item.active && (
                <div className="pt-2">
                  <span className="text-[10px] font-black text-lime-800 bg-lime-500/20 px-2 py-0.5 rounded-full border border-lime-500/30 dark:text-lime-400 dark:bg-lime-400/10 dark:border-lime-400/20">
                    Seu Patamar Atual
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
