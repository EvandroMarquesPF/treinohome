import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Trophy 
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { WorkoutLog } from '../types';

export const CalendarView: React.FC = () => {
  const [state] = useAppStore();
  const { workoutLogs, progress } = state;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayLog, setSelectedDayLog] = useState<{ date: string; logs: WorkoutLog[] } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Calculate days in month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const todayStr = new Date().toISOString().split('T')[0];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDayStatus = (dayNum: number) => {
    const formattedDay = dayNum.toString().padStart(2, '0');
    const formattedMonth = (month + 1).toString().padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    const isToday = dateStr === todayStr;
    const logsOnDay = workoutLogs.filter(l => l.date === dateStr);
    const dayOfWeekIndex = new Date(year, month, dayNum).getDay();
    const isRestDay = dayOfWeekIndex === 0 || dayOfWeekIndex === 4; // Sun or Thu rest

    if (logsOnDay.length > 0) return { status: 'done', color: 'bg-emerald-500 text-zinc-950', border: 'border-emerald-400', dateStr, logs: logsOnDay };
    if (isToday) return { status: 'today', color: 'bg-amber-400 text-zinc-950', border: 'border-amber-300 ring-2 ring-amber-400/40', dateStr, logs: [] };
    if (dateStr < todayStr && !isRestDay) return { status: 'missed', color: 'bg-rose-500/20 text-rose-400', border: 'border-rose-500/30', dateStr, logs: [] };
    if (isRestDay) return { status: 'rest', color: 'bg-indigo-500/20 text-indigo-400', border: 'border-indigo-500/30', dateStr, logs: [] };

    return { status: 'future', color: 'bg-zinc-950 text-zinc-500', border: 'border-zinc-800', dateStr, logs: [] };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Calendar Header */}
      <div className="rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-emerald-950/30 border border-emerald-500/20 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3">
              <CalendarIcon className="w-8 h-8 text-lime-400" />
              <span>Calendário de Consistência</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Acompanhe visualmente seus dias treinados e garanta sua frequência.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrevMonth}
              className="p-2.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-base font-extrabold text-white min-w-32 text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Legend Bar */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold pt-4 border-t border-zinc-800/80">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-zinc-300">Treino Feito</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-zinc-300">Hoje</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-indigo-400" />
            <span className="text-zinc-300">Descanso</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-zinc-300">Faltou</span>
          </div>
        </div>
      </div>

      {/* Grid Calendar */}
      <div className="rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-emerald-950/25 border border-emerald-500/20 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="grid grid-cols-7 gap-2 text-center font-bold text-xs text-zinc-400 pb-2 border-b border-zinc-800">
          {weekDays.map(wd => (
            <div key={wd}>{wd}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {/* Empty pre-padding cells */}
          {[...Array(firstDayIndex)].map((_, idx) => (
            <div key={`empty-${idx}`} className="h-12 sm:h-16 rounded-2xl bg-zinc-950/20" />
          ))}

          {/* Month Day Cells */}
          {[...Array(totalDays)].map((_, idx) => {
            const dayNum = idx + 1;
            const dayInfo = getDayStatus(dayNum);

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDayLog({ date: dayInfo.dateStr, logs: dayInfo.logs })}
                className={`h-12 sm:h-16 rounded-2xl border ${dayInfo.border} ${dayInfo.color} font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition-all hover:scale-105 relative group shadow-sm`}
              >
                <span>{dayNum}</span>
                {dayInfo.status === 'done' && (
                  <span className="text-[10px] font-extrabold uppercase mt-0.5">✓</span>
                )}
                {dayInfo.status === 'today' && (
                  <span className="w-5 h-1 rounded-full bg-zinc-950 mt-1 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Log Modal */}
      {selectedDayLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-5 text-zinc-100 shadow-2xl relative">
            <button
              onClick={() => setSelectedDayLog(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-950 text-zinc-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-lg font-black text-white">Detalhamento do Dia {selectedDayLog.date}</h3>

            {selectedDayLog.logs.length === 0 ? (
              <p className="text-xs text-zinc-400 py-4 text-center">Nenhum treino registrado nesta data.</p>
            ) : (
              <div className="space-y-3">
                {selectedDayLog.logs.map(log => (
                  <div key={log.id} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex justify-between font-bold text-sm text-white">
                      <span>{log.workout_title}</span>
                      <span className="text-amber-400">+{log.xp_ganho} XP</span>
                    </div>
                    <div className="text-xs text-zinc-400 flex items-center space-x-4">
                      <span>Duração: {Math.round(log.tempo_segundos / 60)} min</span>
                      <span>Séries: {log.series_concluidas}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setSelectedDayLog(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
