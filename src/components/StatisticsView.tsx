import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Flame, 
  Trophy, 
  Dumbbell, 
  Award,
  Calendar
} from 'lucide-react';
import { useAppStore } from '../lib/store';

export const StatisticsView: React.FC = () => {
  const [state] = useAppStore();
  const { progress, workoutLogs, workouts } = state;

  const totalMin = progress.tempo_total_minutos;
  const hours = (totalMin / 60).toFixed(1);

  // Muscle group frequency estimation
  const muscleGroups = [
    { name: 'Peitoral & Tríceps', count: 18, pct: 35, color: 'bg-emerald-400' },
    { name: 'Costas & Bíceps', count: 14, pct: 28, color: 'bg-teal-400' },
    { name: 'Pernas & Ombros', count: 12, pct: 22, color: 'bg-indigo-400' },
    { name: 'Core & Abdômen', count: 8, pct: 15, color: 'bg-amber-400' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 dark:bg-zinc-900 dark:border-zinc-800 p-6 sm:p-8 space-y-4 text-center sm:text-left shadow-md dark:shadow-xl transition-colors">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center justify-center sm:justify-start space-x-3">
          <BarChart3 className="w-8 h-8 text-lime-600 dark:text-emerald-400" />
          <span>Estatísticas de Desempenho</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
          Análise completa do seu tempo investido, evolução de XP e métricas corporais.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 dark:bg-zinc-900 dark:border-zinc-800 space-y-2 flex flex-col items-center text-center sm:items-start sm:text-left shadow-sm dark:shadow-none">
          <Clock className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
          <div className="text-2xl font-black text-zinc-900 dark:text-white">{hours}h</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Tempo Total em Treino</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 dark:bg-zinc-900 dark:border-zinc-800 space-y-2 flex flex-col items-center text-center sm:items-start sm:text-left shadow-sm dark:shadow-none">
          <Flame className="w-6 h-6 text-orange-500 dark:text-orange-400" />
          <div className="text-2xl font-black text-orange-600 dark:text-white">{progress.sequencia_dias} dias</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Sequência Atual</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 dark:bg-zinc-900 dark:border-zinc-800 space-y-2 flex flex-col items-center text-center sm:items-start sm:text-left shadow-sm dark:shadow-none">
          <Trophy className="w-6 h-6 text-amber-500 dark:text-amber-400" />
          <div className="text-2xl font-black text-zinc-900 dark:text-white">{progress.xp} XP</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Pontuação Total</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 dark:bg-zinc-900 dark:border-zinc-800 space-y-2 flex flex-col items-center text-center sm:items-start sm:text-left shadow-sm dark:shadow-none">
          <Dumbbell className="w-6 h-6 text-lime-600 dark:text-emerald-400" />
          <div className="text-2xl font-black text-zinc-900 dark:text-white">{progress.series_concluidas}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Séries Concluídas</div>
        </div>
      </div>

      {/* Muscle Group Breakdown Card */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 dark:bg-zinc-900 dark:border-zinc-800 p-6 sm:p-8 space-y-6 text-center sm:text-left shadow-md dark:shadow-xl transition-colors">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center justify-center sm:justify-start space-x-2">
          <Dumbbell className="w-5 h-5 text-lime-600 dark:text-emerald-400" />
          <span>Grupos Musculares Mais Treinados</span>
        </h2>

        <div className="space-y-4 text-left">
          {muscleGroups.map((mg, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <span>{mg.name}</span>
                <span className="text-lime-700 dark:text-emerald-400 font-extrabold">{mg.pct}% ({mg.count} sessões)</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-950 h-3 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <div 
                  className={`h-full ${mg.color} rounded-full transition-all duration-700`}
                  style={{ width: `${mg.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log History Data Table */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 dark:bg-zinc-900 dark:border-zinc-800 p-6 sm:p-8 space-y-4 shadow-md dark:shadow-xl transition-colors">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Registro Detalhado de Sessões</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
            <thead className="text-[10px] uppercase font-extrabold text-zinc-500 bg-zinc-100 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="p-3">Data</th>
                <th className="p-3">Treino</th>
                <th className="p-3">Duração</th>
                <th className="p-3">Séries</th>
                <th className="p-3">XP Ganho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60 font-medium">
              {workoutLogs.map(log => (
                <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/40 transition-colors">
                  <td className="p-3 font-mono text-zinc-700 dark:text-zinc-300 font-bold">{log.date}</td>
                  <td className="p-3 font-bold text-zinc-900 dark:text-white">{log.workout_title}</td>
                  <td className="p-3">{Math.round(log.tempo_segundos / 60)} min</td>
                  <td className="p-3">{log.series_concluidas}</td>
                  <td className="p-3 font-extrabold text-amber-600 dark:text-amber-400">+{log.xp_ganho} XP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
