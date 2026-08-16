import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Camera,
  Upload,
  RotateCcw,
  Settings,
  ChevronDown,
  ChevronUp,
  Link,
  ShieldCheck
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { 
  supabase, 
  isSupabaseConfigured, 
  isVercelEnvDetected,
  configSource,
  supabaseUrl,
  supabaseAnonKey,
  setCustomSupabaseConfig,
  testSupabaseConnection 
} from '../lib/supabase';
import { BrandLogo } from './BrandLogo';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup' | 'recovery';
  onClose: () => void;
  onOpenTerms?: (tab: 'terms' | 'privacy') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onOpenTerms
}) => {
  const [, actions] = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<'login' | 'signup' | 'recovery'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop');
  const [rememberMe, setRememberMe] = useState(true);
  const [resetDataOnRegister, setResetDataOnRegister] = useState(true);

  // Vercel / Custom Supabase config drawer
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [customUrl, setCustomUrl] = useState(supabaseUrl || '');
  const [customKey, setCustomKey] = useState(supabaseAnonKey || '');
  const [testStatus, setTestStatus] = useState<{ loading: boolean; message: string; success?: boolean } | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Por favor escolha uma imagem válida (JPG, PNG ou WebP).' });
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

  const handleSaveCustomKeys = async () => {
    setTestStatus({ loading: true, message: 'Testando conexão com Supabase...' });
    const result = await testSupabaseConnection(customUrl, customKey);
    
    if (result.success) {
      setCustomSupabaseConfig(customUrl, customKey);
      setTestStatus({ loading: false, success: true, message: 'Conexão validada e salva com sucesso!' });
      setTimeout(() => setShowConfigDrawer(false), 1200);
    } else {
      setTestStatus({ loading: false, success: false, message: result.message });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'recovery') {
        if (isSupabaseConfigured) {
          const redirectToUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectToUrl
          });
          if (error) throw error;
        }
        setMessage({
          type: 'success',
          text: 'Se a conta existir, enviamos um e-mail com instruções para redefinir a senha!'
        });
        setLoading(false);
        return;
      }

      let authUserId: string | undefined = undefined;

      if (isSupabaseConfigured) {
        if (mode === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name, avatar_url: avatarUrl } }
          });
          if (error) throw error;
          authUserId = data.user?.id;
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (error) throw error;
          authUserId = data.user?.id;
        }
      }

      // Local store authentication update
      const displayName = name || email.split('@')[0] || 'Atleta';
      
      if (mode === 'signup' && resetDataOnRegister) {
        actions.registerCleanProfile({
          name: displayName,
          email: email || 'atleta@treinohome.app',
          avatarUrl,
          id: authUserId
        });
      } else {
        actions.login(displayName, email || 'atleta@treinohome.app', avatarUrl, authUserId);
        if (authUserId) {
          await actions.loadFromSupabaseAsync(authUserId);
        }
      }

      setMessage({
        type: 'success',
        text: mode === 'signup' 
          ? 'Conta criada! Seus dados iniciais foram zerados para você começar do zero!' 
          : 'Bem-vindo de volta ao Treino Home!'
      });

      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 700);

    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      let errorText = errorObj.message || 'Erro ao processar autenticação. Tente novamente.';
      
      if (errorText.toLowerCase().includes('secret api key') || errorText.toLowerCase().includes('forbidden')) {
        errorText = 'Chave secreta detectada no navegador. Use a chave pública (anon key) do Supabase.';
      }

      setMessage({
        type: 'error',
        text: errorText
      });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-zinc-100 my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          id="close-auth-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center text-center space-y-2 pt-1">
          <BrandLogo size="lg" />
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {mode === 'login' && 'Entrar no Treino Home'}
            {mode === 'signup' && 'Criar Conta de Atleta'}
            {mode === 'recovery' && 'Recuperar Senha'}
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs">
            {mode === 'login' && 'Acesse seus treinos diários, histórico e evolução de XP.'}
            {mode === 'signup' && 'Comece sua jornada e conquiste novos níveis de calistenia.'}
            {mode === 'recovery' && 'Digite seu e-mail cadastrado para redefinir sua senha.'}
          </p>
        </div>

        {/* Vercel & Supabase Environment Detection Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-zinc-950 border border-zinc-800 text-[11px]">
            <div className="flex items-center space-x-2">
              <Database className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-lime-400' : 'text-amber-400'}`} />
              <span className="font-semibold text-zinc-300">
                {isSupabaseConfigured 
                  ? (isVercelEnvDetected ? '⚡ Supabase Conectado (Vercel Env)' : '⚡ Supabase Conectado')
                  : 'Modo Local Instantâneo (Offline)'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              className="text-[10px] text-lime-400 font-bold hover:underline flex items-center space-x-1"
              id="toggle-supabase-config-btn"
            >
              <span>{showConfigDrawer ? 'Ocultar' : 'Configurar'}</span>
              {showConfigDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Expandable Vercel / Custom Supabase Config */}
          {showConfigDrawer && (
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 animate-in fade-in duration-150">
              <div className="text-[11px] text-zinc-300 font-bold flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-lime-400" />
                <span>Variáveis de Ambiente / Vercel:</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Ao implantar na <strong>Vercel</strong>, as variáveis <code className="text-lime-300 font-mono bg-zinc-900 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> e <code className="text-lime-300 font-mono bg-zinc-900 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> são detectadas automaticamente. Você também pode inserir suas chaves abaixo para sincronização instantânea:
              </p>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block font-semibold mb-1">Supabase URL</label>
                  <input
                    type="text"
                    placeholder="https://seu-projeto.supabase.co"
                    value={customUrl}
                    onChange={e => setCustomUrl(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block font-semibold mb-1">Supabase Anon Key (Chave Pública)</label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOi..."
                    value={customKey}
                    onChange={e => setCustomKey(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-lime-400"
                  />
                </div>

                {testStatus && (
                  <div className={`p-2 rounded-lg text-[10px] font-semibold flex items-center space-x-1.5 ${
                    testStatus.success 
                      ? 'bg-lime-500/10 text-lime-400 border border-lime-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {testStatus.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    <span>{testStatus.message}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSaveCustomKeys}
                  disabled={testStatus?.loading}
                  className="w-full py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{testStatus?.loading ? 'Testando...' : 'Salvar e Conectar Chaves'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Form Alert */}
        {message && (
          <div className={`p-3.5 rounded-2xl text-xs flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-lime-500/10 text-lime-400 border border-lime-500/30' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-lime-400" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              {/* Photo Upload Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Foto do Perfil (Upload)</label>
                <div className="flex items-center space-x-3 p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <div className="relative group shrink-0">
                    <img 
                      src={avatarUrl} 
                      alt="Avatar Preview" 
                      className="w-12 h-12 rounded-xl object-cover border border-lime-400/60"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="w-4 h-4 text-lime-400" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-1">
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
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-bold border border-zinc-800 flex items-center space-x-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-lime-400" />
                      <span>Selecionar Imagem</span>
                    </button>
                    <p className="text-[10px] text-zinc-500">JPG, PNG ou WebP</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="Seu nome ou apelido"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-lime-400 transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-lime-400 transition-colors"
              />
            </div>
          </div>

          {mode !== 'recovery' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-zinc-300">Senha</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('recovery')}
                    className="text-xs text-lime-400 font-semibold hover:underline"
                  >
                    Esqueceu?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-lime-400 transition-colors"
                />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center space-x-2 text-xs text-zinc-400">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded bg-zinc-950 border-zinc-800 text-lime-400 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="cursor-pointer">Permanecer conectado</label>
            </div>
          )}

          {mode === 'signup' && (
            <div className="flex items-center space-x-2 text-xs text-zinc-300 p-3 rounded-xl bg-zinc-950 border border-lime-500/20">
              <input
                type="checkbox"
                id="resetDataOnRegister"
                checked={resetDataOnRegister}
                onChange={e => setResetDataOnRegister(e.target.checked)}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-800 text-lime-400 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="resetDataOnRegister" className="cursor-pointer font-semibold flex items-center space-x-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>Zerar dados para iniciar no Nível 1 (0 XP)</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            id="auth-submit-btn"
            className="w-full py-3.5 rounded-2xl bg-lime-400 text-black font-extrabold text-sm hover:bg-lime-300 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-lime-500/20 disabled:opacity-50"
          >
            {loading ? (
              <span>Processando...</span>
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Entrar'}
                  {mode === 'signup' && 'Criar Minha Conta'}
                  {mode === 'recovery' && 'Enviar E-mail de Recuperação'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Terms & Privacy acceptance notice */}
        <div className="text-[11px] text-zinc-500 text-center leading-relaxed">
          Ao continuar, você concorda com nossos{' '}
          <button
            type="button"
            onClick={() => onOpenTerms?.('terms')}
            className="text-zinc-300 underline hover:text-lime-400 transition-colors"
          >
            Termos de Uso
          </button>{' '}
          e{' '}
          <button
            type="button"
            onClick={() => onOpenTerms?.('privacy')}
            className="text-zinc-300 underline hover:text-lime-400 transition-colors"
          >
            Política de Privacidade
          </button>.
        </div>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-zinc-400 pt-1 border-t border-zinc-800">
          {mode === 'login' ? (
            <span>
              Ainda não tem conta?{' '}
              <button onClick={() => setMode('signup')} className="text-lime-400 font-bold hover:underline">
                Cadastre-se grátis
              </button>
            </span>
          ) : (
            <span>
              Já possui uma conta?{' '}
              <button onClick={() => setMode('login')} className="text-lime-400 font-bold hover:underline">
                Fazer Login
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
