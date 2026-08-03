import React from 'react';
import { Trophy, Sparkles, ArrowRight, Zap, Flame } from 'lucide-react';
import { useAppStore } from '../lib/store';

export const LevelUpModal: React.FC = () => {
  const [state, actions] = useAppStore();
  const { levelUpModal } = state;

  if (!levelUpModal || !levelUpModal.show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-gradient-to-b from-zinc-900 via-zinc-900 to-amber-950/40 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 space-y-6 text-center text-zinc-100 shadow-2xl relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>PARABÉNS! SUBIU DE NÍVEL!</span>
        </div>

        {/* Level Emblem */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 opacity-60 blur-md animate-pulse" />
          <div className="relative w-full h-full rounded-full bg-zinc-950 border-4 border-amber-400 text-amber-300 font-black text-4xl flex items-center justify-center shadow-2xl">
            Nível {levelUpModal.level}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Você Alcançou o Nível {levelUpModal.level}!</h2>
          <p className="text-xs text-zinc-300">
            Sua disciplina está valendo a pena. Novos desafios e medalhas estão disponíveis!
          </p>
        </div>

        <button
          onClick={() => actions.closeLevelUpModal()}
          id="close-level-up-modal-btn"
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
        >
          <span>Continuar Evoluindo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
