import React, { useState, useRef, useMemo } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Volume2, 
  Vibrate, 
  Clock, 
  Cloud,
  Check, 
  Trash2, 
  LogOut,
  Sparkles,
  ShieldCheck,
  Upload,
  Camera,
  FileText,
  Lock,
  Key,
  CheckCircle2,
  AlertCircle,
  Scale,
  Ruler,
  Activity,
  Target,
  Dumbbell,
  Calendar
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { 
  isSupabaseConfigured,
  isVercelEnvDetected,
  supabaseUrl,
  supabaseAnonKey,
  setCustomSupabaseConfig,
  testSupabaseConnection
} from '../lib/supabase';
import { BrandLogo } from './BrandLogo';

interface SettingsViewProps {
  onOpenProfileSetup?: () => void;
  onOpenTerms?: (tab: 'terms' | 'privacy') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenProfileSetup, onOpenTerms }) => {
  const [state, actions] = useAppStore();
  const { user, settings } = state;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showAdvancedSync, setShowAdvancedSync] = useState(false);

  // Supabase credentials editing (discreet)
  const [customUrl, setCustomUrl] = useState(supabaseUrl || '');
  const [customKey, setCustomKey] = useState(supabaseAnonKey || '');
  const [testResult, setTestResult] = useState<{ loading: boolean; success?: boolean; message: string } | null>(null);

  // Calculate user BMI for quick display
  const bmiInfo = useMemo(() => {
    const weight = user?.weight || 70;
    const height = user?.height || 175;
    if (!weight || !height || height <= 0) return { value: 22.8, label: 'Peso Saudável', color: 'text-emerald-400' };
    const hMeters = height / 100;
    const val = Number((weight / (hMeters * hMeters)).toFixed(1));
    if (val < 18.5) return { value: val, label: 'Abaixo do Peso', color: 'text-sky-400' };
    if (val <= 24.9) return { value: val, label: 'Peso Ideal / Saudável', color: 'text-emerald-400' };
    if (val <= 29.9) return { value: val, label: 'Sobrepeso Leve', color: 'text-amber-400' };
    return { value: val, label: 'Obesidade', color: 'text-rose-400' };
  }, [user?.weight, user?.height]);

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
          actions.updateProfile(name, compressed);
        } else {
          setAvatarUrl(event.target?.result as string);
          actions.updateProfile(name, event.target?.result as string);
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

  const handleSaveKeys = async () => {
    setTestResult({ loading: true, message: 'Validando conexão com o Supabase...' });
    const res = await testSupabaseConnection(customUrl, customKey);
    if (res.success) {
      setCustomSupabaseConfig(customUrl, customKey);
      setTestResult({ loading: false, success: true, message: 'Chaves salvas e conexão verificada com sucesso!' });
    } else {
      setTestResult({ loading: false, success: false, message: res.message });
    }
  };

  const goalLabels: Record<string, string> = {
    hipertrofia: 'Hipertrofia Muscular',
    definicao: 'Definição & Queima',
    emagrecimento: 'Perda de Gordura',
    forca: 'Força Calistênica',
    resistencia: 'Resistência & Saúde',
    saude: 'Saúde & Condicionamento'
  };

  const levelLabels: Record<string, string> = {
    iniciante: 'Iniciante (Começando do zero)',
    intermediario: 'Intermediário (Treino regular)',
    avancado: 'Avançado (Calistenia pesada)'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-20">
      
      {/* Settings Header */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/30 dark:border-emerald-500/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md dark:shadow-xl text-center sm:text-left transition-colors">
        <div className="space-y-1.5 flex flex-col items-center sm:items-start">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex items-center space-x-3">
            <SettingsIcon className="w-8 h-8 text-lime-600 dark:text-lime-400" />
            <span>Configurações & Perfil</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
            Gerencie sua ficha de atleta, preferências de treino, descanso entre séries e conta.
          </p>
        </div>

        <BrandLogo size="lg" className="hidden sm:flex" />
      </div>

      {/* Perfil & Ficha do Atleta */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/30 dark:border-emerald-500/20 p-6 sm:p-8 space-y-6 shadow-md dark:shadow-xl text-center sm:text-left transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 flex flex-col items-center sm:items-start">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
              <User className="w-5 h-5 text-lime-600 dark:text-lime-400" />
              <span>Perfil do Atleta</span>
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Identificação e dados biométricos para personalização dos treinos.</p>
          </div>

          {onOpenProfileSetup && (
            <button
              onClick={onOpenProfileSetup}
              id="reopen-athlete-onboarding-btn"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-extrabold text-xs hover:opacity-90 transition-all flex items-center space-x-2 shadow-md shadow-lime-500/10"
            >
              <Sparkles className="w-4 h-4" />
              <span>Atualizar Ficha de Treino</span>
            </button>
          )}
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-800 dark:text-lime-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center space-x-2">
            <Check className="w-4 h-4 text-lime-600 dark:text-lime-400" />
            <span>Perfil atualizado com sucesso!</span>
          </div>
        )}

        {/* Athlete Overview Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800">
          <div className="space-y-1 flex flex-col items-center sm:items-start">
            <span className="text-[11px] text-zinc-500 flex items-center space-x-1 font-medium">
              <Scale className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
              <span>Peso Atual</span>
            </span>
            <div className="text-sm font-black text-zinc-900 dark:text-white">{user?.weight || 70} kg</div>
          </div>

          <div className="space-y-1 flex flex-col items-center sm:items-start">
            <span className="text-[11px] text-zinc-500 flex items-center space-x-1 font-medium">
              <Ruler className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Altura</span>
            </span>
            <div className="text-sm font-black text-zinc-900 dark:text-white">{user?.height || 175} cm</div>
          </div>

          <div className="space-y-1 flex flex-col items-center sm:items-start">
            <span className="text-[11px] text-zinc-500 flex items-center space-x-1 font-medium">
              <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>IMC Calculado</span>
            </span>
            <div className={`text-sm font-black ${bmiInfo.color}`}>{bmiInfo.value} • {bmiInfo.label}</div>
          </div>

          <div className="space-y-1 flex flex-col items-center sm:items-start">
            <span className="text-[11px] text-zinc-500 flex items-center space-x-1 font-medium">
              <Target className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Meta Principal</span>
            </span>
            <div className="text-xs font-black text-zinc-800 dark:text-zinc-200 truncate">
              {user?.fitness_goal ? goalLabels[user.fitness_goal] || user.fitness_goal : 'Hipertrofia'}
            </div>
          </div>
        </div>

        {/* Quick Edit Basic Fields */}
        <form onSubmit={handleSaveProfile} className="space-y-5 max-w-xl mx-auto sm:mx-0 text-left">
          {/* Avatar Upload */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block text-center sm:text-left">Foto de Perfil</label>
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
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

              <div className="space-y-1 flex flex-col items-center sm:items-start">
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
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 text-xs font-bold border border-zinc-300 dark:border-zinc-700 flex items-center space-x-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                  <span>Trocar Imagem</span>
                </button>
                <p className="text-[10px] text-zinc-500">Formatos aceitos: JPG, PNG ou WebP</p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nome do Atleta</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-lime-500 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">E-mail Cadastrado</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full bg-zinc-100 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-4 py-2.5 text-sm text-zinc-500 cursor-not-allowed font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-lime-400 text-black font-extrabold text-xs shadow-md shadow-lime-500/20 hover:bg-lime-300 transition-all"
          >
            Salvar Alterações
          </button>
        </form>
      </div>

      {/* Preferências de Treino & Áudio */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/30 dark:border-emerald-500/20 p-6 sm:p-8 space-y-6 shadow-md dark:shadow-xl text-center sm:text-left transition-colors">
        <div className="space-y-1 flex flex-col items-center sm:items-start">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-lime-600 dark:text-lime-400" />
            <span>Preferências de Treino & Áudio</span>
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Ajuste o cronômetro automático e feedback tátil.</p>
        </div>

        <div className="space-y-3.5 max-w-xl mx-auto sm:mx-0">
          {/* Default Rest Timer */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="text-left">
              <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Descanso Padrão entre Séries</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Iniciado ao marcar uma série como concluída.</div>
            </div>

            <select
              value={settings.descanso}
              onChange={e => actions.updateSettings({ descanso: Number(e.target.value) })}
              className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-bold text-lime-700 dark:text-lime-400 focus:outline-none cursor-pointer"
            >
              <option value={30}>30s</option>
              <option value={45}>45s</option>
              <option value={60}>60s (Padrão)</option>
              <option value={90}>90s</option>
              <option value={120}>120s</option>
            </select>
          </div>

          {/* Sound Toggle */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-left">
              <Volume2 className="w-5 h-5 text-lime-600 dark:text-lime-400" />
              <div>
                <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Efeitos Sonoros & Chimes</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Avisos sonoros no cronômetro e conquistas.</div>
              </div>
            </div>

            <button
              onClick={() => actions.updateSettings({ som: !settings.som })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${settings.som ? 'bg-lime-400' : 'bg-zinc-300 dark:bg-zinc-800'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white dark:bg-zinc-950 shadow transition-transform ${settings.som ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Vibration Toggle */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-left">
              <Vibrate className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <div>
                <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Vibração Hática (Mobile)</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Feedback tátil ao tocar e completar séries.</div>
              </div>
            </div>

            <button
              onClick={() => actions.updateSettings({ vibracao: !settings.vibracao })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${settings.vibracao ? 'bg-lime-400' : 'bg-zinc-300 dark:bg-zinc-800'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white dark:bg-zinc-950 shadow transition-transform ${settings.vibracao ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Sincronização em Nuvem (Discreet & Clean) */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/30 dark:border-emerald-500/20 p-6 sm:p-8 space-y-4 shadow-md dark:shadow-xl text-center sm:text-left transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Cloud className="w-6 h-6 text-lime-600 dark:text-lime-400" />
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Sincronização em Nuvem</h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                Status: {isSupabaseConfigured 
                  ? (isVercelEnvDetected ? '🟢 Sincronizado via Vercel' : '🟢 Sincronizado com Supabase Cloud') 
                  : '🟢 Armazenamento Local Seguro'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAdvancedSync(!showAdvancedSync)}
            className="text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-lime-400 underline transition-colors font-medium"
          >
            {showAdvancedSync ? 'Ocultar Configuração Avançada' : 'Configurações Avançadas de API'}
          </button>
        </div>

        {showAdvancedSync && (
          <div className="space-y-4 pt-3 border-t border-zinc-200 dark:border-zinc-800/80 animate-fade-in max-w-2xl mx-auto sm:mx-0 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Supabase URL</label>
                <input
                  type="text"
                  placeholder="https://xxx.supabase.co"
                  value={customUrl}
                  onChange={e => setCustomUrl(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Supabase Anon Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOi..."
                  value={customKey}
                  onChange={e => setCustomKey(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-lime-500"
                />
              </div>
            </div>

            {testResult && (
              <div className={`p-3 rounded-2xl text-xs font-bold flex items-center space-x-2 ${
                testResult.success 
                  ? 'bg-emerald-500/10 text-emerald-800 dark:text-lime-400 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30'
              }`}>
                {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{testResult.message}</span>
              </div>
            )}

            <button
              onClick={handleSaveKeys}
              disabled={testResult?.loading}
              className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs transition-all shadow-md shadow-lime-500/10 disabled:opacity-50"
            >
              {testResult?.loading ? 'Testando Conexão...' : 'Testar & Salvar'}
            </button>
          </div>
        )}
      </div>

      {/* Termos de Uso e Privacidade LGPD */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/30 dark:border-emerald-500/20 p-6 sm:p-8 space-y-4 shadow-md dark:shadow-xl text-center sm:text-left transition-colors">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <ShieldCheck className="w-6 h-6 text-lime-600 dark:text-lime-400" />
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Privacidade & Termos</h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Proteção de dados pessoais e diretrizes de treino com segurança física.</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-1">
          <button
            onClick={() => onOpenTerms?.('terms')}
            className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 text-xs font-bold flex items-center space-x-2 transition-colors"
          >
            <FileText className="w-4 h-4 text-lime-600 dark:text-lime-400" />
            <span>Termos de Uso</span>
          </button>

          <button
            onClick={() => onOpenTerms?.('privacy')}
            className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 text-xs font-bold flex items-center space-x-2 transition-colors"
          >
            <Lock className="w-4 h-4 text-lime-600 dark:text-lime-400" />
            <span>Política de Privacidade (LGPD)</span>
          </button>
        </div>
      </div>

      {/* Conta & Zona de Segurança */}
      <div className="rounded-3xl bg-rose-50 border border-rose-200 dark:bg-rose-950/15 dark:border-rose-500/20 p-6 sm:p-8 space-y-4 shadow-md dark:shadow-xl text-center sm:text-left transition-colors">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-rose-700 dark:text-rose-400">Conta & Gerenciamento</h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Encerre a sessão atual ou limpe seus dados do dispositivo.</p>
        </div>

        <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-1">
          <button
            onClick={() => actions.logout()}
            id="logout-btn"
            className="px-5 py-2.5 rounded-xl bg-white text-zinc-800 border border-zinc-300 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-800 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center space-x-2 transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            <span>Sair da Conta (Logout)</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Deseja realmente resetar todas as estatísticas e histórico de treinos?')) {
                actions.resetAllData();
              }
            }}
            id="reset-all-data-btn"
            className="px-5 py-2.5 rounded-xl bg-rose-500/15 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 text-xs font-bold hover:bg-rose-500/25 dark:hover:bg-rose-500/30 flex items-center space-x-2 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Resetar Dados de Treino</span>
          </button>
        </div>
      </div>

    </div>
  );
};
