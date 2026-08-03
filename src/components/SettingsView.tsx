import React, { useState, useRef } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Moon, 
  Sun, 
  Volume2, 
  Vibrate, 
  Clock, 
  Database, 
  Copy, 
  Check, 
  Trash2, 
  LogOut,
  Sparkles,
  ShieldCheck,
  Upload,
  Camera,
  RotateCcw
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { SUPABASE_SQL_SCHEMA, isSupabaseConfigured } from '../lib/supabase';

interface SettingsViewProps {
  onOpenProfileSetup?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenProfileSetup }) => {
  const [state, actions] = useAppStore();
  const { user, settings } = state;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecione um arquivo de imagem (JPG, PNG ou WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarUrl(compressed);
        } else {
          setAvatarUrl(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    actions.updateProfile(name, avatarUrl);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Settings Header */}
      <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3">
          <SettingsIcon className="w-8 h-8 text-lime-400" />
          <span>Configurações & Perfil</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Personalize sua imagem de perfil, descanso entre séries, preferências de áudio e integração Supabase.
        </p>
      </div>

      {/* Edit Profile Form */}
      <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <User className="w-5 h-5 text-lime-400" />
            <span>Perfil do Atleta & Foto</span>
          </h2>

          {onOpenProfileSetup && (
            <button
              onClick={onOpenProfileSetup}
              className="px-4 py-2 rounded-xl bg-lime-400/10 border border-lime-500/30 text-lime-400 font-bold text-xs hover:bg-lime-400/20 transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Novo Cadastro (Zerar Perfil)</span>
            </button>
          )}
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-lime-500/20 text-lime-400 border border-lime-500/30 text-xs font-bold flex items-center space-x-2">
            <Check className="w-4 h-4 text-lime-400" />
            <span>Perfil atualizado com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
          {/* Avatar File Upload Box */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
            <label className="text-xs font-bold text-zinc-300 block">Foto de Perfil (Upload do Dispositivo)</label>
            <div className="flex items-center space-x-4">
              <div className="relative group shrink-0">
                <img
                  src={avatarUrl || user?.avatar_url}
                  alt={name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-lime-400/80 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-5 h-5 text-lime-400" />
                </button>
              </div>

              <div className="space-y-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-extrabold border border-zinc-800 flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4 text-lime-400" />
                  <span>Fazer Upload de Foto</span>
                </button>
                <p className="text-[11px] text-zinc-500">Selecione uma imagem do seu celular ou PC</p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Seu Nome</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-lime-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Ou digite uma URL da Foto (Opcional)</label>
            <input
              type="url"
              placeholder="https://..."
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-lime-400"
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-lime-400 text-black font-extrabold text-xs shadow-md shadow-lime-500/20 hover:bg-lime-300 transition-all"
            >
              Salvar Perfil
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('Deseja zerar todas as estatísticas para começar do zero (0 XP, Nível 1)?')) {
                  actions.resetToZeroProfile();
                }
              }}
              className="px-4 py-3 rounded-2xl bg-zinc-950 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <RotateCcw className="w-4 h-4 text-lime-400" />
              <span>Zerar Dados Iniciais</span>
            </button>
          </div>
        </form>
      </div>

      {/* Preferences Section */}
      <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-white">Preferências de Treino & Áudio</h2>

        <div className="space-y-4 max-w-xl">
          {/* Default Rest Timer */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-zinc-200">Descanso Padrão entre Séries</div>
              <div className="text-xs text-zinc-400">Iniciado automaticamente ao marcar uma série.</div>
            </div>

            <select
              value={settings.descanso}
              onChange={e => actions.updateSettings({ descanso: Number(e.target.value) })}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400 focus:outline-none"
            >
              <option value={30}>30s</option>
              <option value={45}>45s</option>
              <option value={60}>60s (Padrão)</option>
              <option value={90}>90s</option>
              <option value={120}>120s</option>
            </select>
          </div>

          {/* Sound Toggle */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-sm font-bold text-zinc-200">Sons & Chimes do Cronômetro</div>
                <div className="text-xs text-zinc-400">Efeitos sonoros ao concluir descansar e subir nível.</div>
              </div>
            </div>

            <button
              onClick={() => actions.updateSettings({ som: !settings.som })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${settings.som ? 'bg-emerald-500' : 'bg-zinc-800'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-zinc-950 transition-transform ${settings.som ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Vibration Toggle */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Vibrate className="w-5 h-5 text-teal-400" />
              <div>
                <div className="text-sm font-bold text-zinc-200">Vibração Hática (Mobile)</div>
                <div className="text-xs text-zinc-400">Feedback tátil ao marcar exercícios no celular.</div>
              </div>
            </div>

            <button
              onClick={() => actions.updateSettings({ vibracao: !settings.vibracao })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${settings.vibracao ? 'bg-emerald-500' : 'bg-zinc-800'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-zinc-950 transition-transform ${settings.vibracao ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Supabase Integration & RLS Schema Exporter */}
      <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Estrutura do Banco de Dados Supabase</h2>
              <p className="text-xs text-zinc-400">
                Status: {isSupabaseConfigured ? '🟢 Conectado ao Supabase Cloud' : '🟡 Modo Local (Pronto para Supabase)'}
              </p>
            </div>
          </div>

          <button
            onClick={handleCopySql}
            className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-emerald-400 hover:bg-zinc-800 transition-colors flex items-center space-x-1.5"
          >
            {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSql ? 'Copiado!' : 'Copiar Script SQL + RLS'}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-400 max-h-48 overflow-y-auto">
          <pre>{SUPABASE_SQL_SCHEMA}</pre>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-3xl bg-rose-950/20 border border-rose-500/30 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-rose-400">Zona de Perigo</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => actions.logout()}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 text-zinc-200 border border-zinc-800 text-xs font-bold hover:bg-zinc-800"
          >
            Sair da Conta (Logout)
          </button>

          <button
            onClick={() => {
              if (confirm('Tem certeza que deseja resetar todo o seu progresso?')) {
                actions.resetAllData();
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-bold hover:bg-rose-500/30"
          >
            Resetar Todos os Dados
          </button>
        </div>
      </div>

    </div>
  );
};
