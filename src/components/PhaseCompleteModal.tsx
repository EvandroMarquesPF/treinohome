import React from 'react';
import { Award, Sparkles, ArrowRight, Star } from 'lucide-react';
import { useAppStore } from '../lib/store';

export const PhaseCompleteModal: React.FC = () => {
  const [state, actions] = useAppStore();
  const { phaseCompleteModal } = state;

  if (!phaseCompleteModal || !phaseCompleteModal.show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-gradient-to-br from-white via-white to-emerald-50/80 border border-emerald-500/25 dark:bg-gradient-to-br dark:from-black dark:via-zinc-950 dark:to-emerald-950/80 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 text-center text-zinc-900 dark:text-zinc-100 shadow-2xl relative overflow-hidden transition-colors">
        
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-800 dark:text-emerald-300 text-xs font-black animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>TRILHA DE EVOLUÇÃO: FASE CONCLUÍDA!</span>
        </div>

        <div className="text-6xl animate-pulse">🎉</div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">🎉 Parabéns!</h2>
          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Você concluiu a {phaseCompleteModal.title}!</p>
          <div className="text-xs text-amber-800 dark:text-amber-300 font-extrabold bg-amber-400/20 py-1.5 px-3 rounded-full inline-block border border-amber-400/30">
            +{phaseCompleteModal.xp} XP Bônus
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
            Continue assim! O hábito diário transforma o seu corpo.
          </p>
        </div>

        <button
          onClick={() => actions.closePhaseCompleteModal()}
          id="close-phase-modal-btn"
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-extrabold text-sm shadow-xl shadow-lime-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>Ir para a Próxima Fase</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
