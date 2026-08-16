import React from 'react';
import { 
  Award, 
  Trophy, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Crown, 
  Dumbbell, 
  Star, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';
import { useAppStore } from '../lib/store';

export const AchievementsView: React.FC = () => {
  const [state, actions] = useAppStore();
  const { achievements, progress } = state;

  const getIconComponent = (name: string) => {
    switch (name) {
      case 'Flame': return Flame;
      case 'Zap': return Zap;
      case 'ShieldCheck': return ShieldCheck;
      case 'Crown': return Crown;
      case 'Dumbbell': return Dumbbell;
      case 'Award': return Award;
      case 'Trophy': return Trophy;
      case 'Star': return Star;
      default: return Award;
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Achievements Header */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 dark:bg-gradient-to-r dark:from-amber-950/40 dark:via-zinc-900 dark:to-emerald-950/40 dark:border-zinc-800 p-6 sm:p-8 space-y-4 text-center sm:text-left shadow-md dark:shadow-xl transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center space-x-3">
              <Award className="w-8 h-8 text-amber-500 dark:text-amber-400" />
              <span>Quadro de Conquistas & Medalhas</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 font-medium">
              Desbloqueie troféus exclusivos completando desafios e aumente seu XP!
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-amber-50 dark:bg-zinc-950 border border-amber-200 dark:border-zinc-800 px-4 py-2 rounded-2xl text-amber-800 dark:text-amber-400 font-extrabold text-sm">
            <Trophy className="w-4 h-4" />
            <span>Desbloqueadas: {unlockedCount}/{achievements.length}</span>
          </div>
        </div>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map(ach => {
          const IconComponent = getIconComponent(ach.icon);
          const isUnlocked = ach.unlocked;
          const pct = Math.min(100, Math.round((ach.progress_current / ach.progress_target) * 100));

          return (
            <div 
              key={ach.id}
              className={`rounded-3xl p-6 border transition-all space-y-4 relative overflow-hidden text-center sm:text-left flex flex-col items-center sm:items-stretch ${
                isUnlocked 
                  ? 'bg-amber-50/40 border-amber-400/60 shadow-sm dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900 dark:to-amber-950/20 dark:border-amber-500/40 dark:shadow-lg dark:shadow-amber-500/10' 
                  : 'bg-white border-zinc-200/90 dark:bg-zinc-950/80 dark:border-zinc-800 opacity-80 dark:opacity-70'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                  isUnlocked 
                    ? 'bg-amber-500/15 text-amber-600 border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/30' 
                    : 'bg-zinc-100 text-zinc-400 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-600 dark:border-zinc-800'
                }`}>
                  <IconComponent className="w-7 h-7" />
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-800 bg-amber-500/15 dark:text-amber-400 dark:bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30 dark:border-amber-400/20">
                  <Zap className="w-3.5 h-3.5 fill-amber-400/20" />
                  <span>+{ach.reward_xp} XP</span>
                </div>
              </div>

              <div className="w-full">
                <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center justify-center sm:justify-start space-x-2">
                  <span>{ach.title}</span>
                  {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 inline" />}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed font-medium">{ach.description}</p>
              </div>

              {/* Progress Indicator */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800/80 w-full text-left">
                <div className="flex justify-between text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                  <span>Progresso</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{ach.progress_current}/{ach.progress_target}</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isUnlocked ? 'bg-amber-500 dark:bg-amber-400' : 'bg-emerald-500'}`} 
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {isUnlocked && (
                <button
                  onClick={() => actions.claimAchievementReward(ach.id)}
                  id={`claim-reward-btn-${ach.id}`}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-zinc-950 font-extrabold text-xs shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-1"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Resgatar Recompensa (+{ach.reward_xp} XP)</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
