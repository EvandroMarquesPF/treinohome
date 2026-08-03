import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Volume2, 
  Sparkles 
} from 'lucide-react';
import { useAppStore } from '../lib/store';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const [state, actions] = useAppStore();
  const { settings } = state;

  const [enabled, setEnabled] = useState(settings.notificacoes);
  const [time, setTime] = useState(settings.horario_notificacao || '08:00');
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    actions.updateSettings({
      notificacoes: enabled,
      horario_notificacao: time
    });
    onClose();
  };

  const handleSendTestNotification = () => {
    setTestSent(true);

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('💪 Está na hora do Treino Home', {
          body: 'Não quebre sua sequência de dias! Seu treino de hoje está pronto.',
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('💪 Está na hora do Treino Home', {
              body: 'Não quebre sua sequência de dias! Seu treino de hoje está pronto.'
            });
          }
        });
      }
    }

    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 text-zinc-100 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Lembretes Diários</h2>
            <p className="text-xs text-zinc-400">Notificações automáticas para manter seu hábito.</p>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <span className="text-sm font-bold text-zinc-200">Ativar Notificações Diárias</span>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${enabled ? 'bg-emerald-500' : 'bg-zinc-800'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-zinc-950 transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Time Picker */}
        {enabled && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Horário do Lembrete</span>
            </label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-base text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {/* Example Preview Banner */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
          <div className="font-bold text-emerald-400 flex items-center space-x-1">
            <Flame className="w-4 h-4" />
            <span>Exemplo de Notificação Push:</span>
          </div>
          <p className="text-zinc-300">
            "💪 Está na hora do Treino Home. Não quebre sua sequência!"
          </p>
        </div>

        {testSent && (
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs text-center font-bold">
            ✓ Notificação de teste enviada!
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleSendTestNotification}
            className="py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-800"
          >
            Testar Notificação
          </button>

          <button
            onClick={handleSave}
            className="py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
          >
            Salvar Configuração
          </button>
        </div>

      </div>
    </div>
  );
};
