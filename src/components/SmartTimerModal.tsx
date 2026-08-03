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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-zinc-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 text-zinc-100 shadow-2xl relative text-center">
        
        {/* Header Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Descanso Inteligente</span>
          </div>
          <h3 className="text-sm font-semibold text-zinc-400 mt-2 truncate max-w-xs mx-auto">
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
              className="stroke-zinc-800"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="88"
              cy="88"
              r="76"
              className="stroke-emerald-400 transition-all duration-1000 ease-linear"
              strokeWidth="10"
              strokeDasharray={477.5}
              strokeDashoffset={477.5 - (477.5 * progressPercentage) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-mono text-5xl font-black tracking-tight text-white">
              {remainingSeconds}s
            </span>
            <span className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Respire fundo</span>
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
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  settings.descanso === sec 
                    ? 'bg-emerald-500 text-zinc-950' 
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
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
            className="py-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-200 font-bold text-xs hover:bg-zinc-800 transition-colors flex items-center justify-center space-x-1"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>+10 Segundos</span>
          </button>

          <button
            onClick={() => actions.skipRestTimer()}
            id="skip-rest-timer-btn"
            className="py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-zinc-950 font-extrabold text-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-1 shadow-lg shadow-emerald-500/20"
          >
            <span>Próxima Série</span>
            <SkipForward className="w-4 h-4 fill-zinc-950" />
          </button>
        </div>

      </div>
    </div>
  );
};
