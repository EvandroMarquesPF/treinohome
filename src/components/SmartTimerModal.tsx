import React, { useEffect } from 'react';
import { 
  Clock, 
  Play, 
  SkipForward, 
  Plus, 
  Volume2, 
  VolumeX, 
  Vibrate, 
  Sparkles 
} from 'lucide-react';
import { useAppStore } from '../lib/store';

export const SmartTimerModal: React.FC = () => {
  const [state, actions] = useAppStore();
  const { activeRestTimer, settings } = state;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeRestTimer && activeRestTimer.active) {
      timer = setInterval(() => {
        actions.tickRestTimer();
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeRestTimer, actions]);

  if (!activeRestTimer || !activeRestTimer.active) return null;

  const { remainingSeconds, initialSeconds, exerciseName } = activeRestTimer;
  const progressPercentage = Math.max(0, Math.min(100, (remainingSeconds / initialSeconds) * 100));

  const presetTimes = [30, 45, 60, 90, 120];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-gradient-to-br from-white via-white to-emerald-50/80 border border-emerald-500/25 dark:bg-gradient-to-br dark:from-black dark:via-zinc-950 dark:to-emerald-950/80 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 text-zinc-900 dark:text-zinc-100 shadow-2xl relative text-center transition-colors">
        
        {/* Header Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Descanso Inteligente</span>
          </div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-400 mt-2 truncate max-w-xs mx-auto">
            {exerciseName || 'Série Concluída'}
          </h3>
        </div>

        {/* Circular Countdown Progress Ring */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform">
            <circle
              cx="88"
              cy="88"
              r="76"
              className="stroke-zinc-200 dark:stroke-zinc-800"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="88"
              cy="88"
              r="76"
              className="stroke-emerald-500 dark:stroke-emerald-400 transition-all duration-1000 ease-linear"
              strokeWidth="10"
              strokeDasharray={477.5}
              strokeDashoffset={477.5 - (477.5 * progressPercentage) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-mono text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
              {remainingSeconds}s
            </span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase mt-1">Respire fundo</span>
          </div>
        </div>

        {/* Preset Time Buttons */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Ajustar Tempo Padrão</span>
          <div className="flex justify-center space-x-1.5">
            {presetTimes.map(sec => (
              <button
                key={sec}
                onClick={() => {
                  actions.updateSettings({ descanso: sec });
                  actions.startRestTimer(sec, exerciseName);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  settings.descanso === sec 
                    ? 'bg-lime-400 text-black font-black shadow-xs shadow-lime-500/20' 
                    : 'bg-white/80 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-emerald-500/20 dark:border-zinc-800'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* Control Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => actions.addRestTimerTime(10)}
            className="py-3 rounded-2xl bg-white/90 dark:bg-zinc-950 border border-emerald-500/25 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs hover:bg-emerald-50/70 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center space-x-1 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-lime-600 dark:text-lime-400" />
            <span>+10 Segundos</span>
          </button>

          <button
            onClick={() => actions.skipRestTimer()}
            id="skip-rest-timer-btn"
            className="py-3 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-extrabold text-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-1 shadow-md shadow-lime-500/20 cursor-pointer"
          >
            <span>Próxima Série</span>
            <SkipForward className="w-4 h-4 fill-black" />
          </button>
        </div>

      </div>
    </div>
  );
};
