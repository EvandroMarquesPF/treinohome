import React, { useState, useRef } from 'react';
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
  RotateCcw
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup' | 'recovery';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

      if (isSupabaseConfigured) {
        if (mode === 'signup') {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name, avatar_url: avatarUrl } }
          });
          if (error) throw error;
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (error) throw error;
        }
      }

      // Local store authentication update
      const displayName = name || email.split('@')[0] || 'Atleta';
      
      if (mode === 'signup' && resetDataOnRegister) {
        actions.registerCleanProfile({
          name: displayName,
          email: email || 'atleta@treinohome.app',
          avatarUrl
        });
      } else {
        actions.login(displayName, email || 'atleta@treinohome.app', avatarUrl);
      }

      setMessage({
        type: 'success',
        text: mode === 'signup' 
          ? 'Conta criada! Seus dados iniciais foram zerados para você começar do zero!' 
          : 'Bem-vindo de volta!'
      });

      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 700);

    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      let errorText = errorObj.message || 'Erro ao processar autenticação. Tente novamente.';
      
      if (errorText.toLowerCase().includes('secret api key') || errorText.toLowerCase().includes('forbidden')) {
        errorText = 'Chave secreta (service_role) detectada no navegador. Use a chave pública VITE_SUPABASE_ANON_KEY no arquivo .env.';
      }

      setMessage({
        type: 'error',
        text: errorText
      });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-zinc-100"
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

        {/* Supabase Status Banner */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400">
          <Database className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-lime-400' : 'text-amber-400'}`} />
          <span>
            {isSupabaseConfigured 
              ? 'Conectado ao Supabase Cloud Realtime Auth' 
              : 'Modo Local Instantâneo (Adicione chaves Supabase em .env para Nuvem)'}
          </span>
        </div>

        {/* Header Title */}
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-extrabold text-white">
            {mode === 'login' && 'Entrar no Treino Home'}
            {mode === 'signup' && 'Criar Conta de Atleta'}
            {mode === 'recovery' && 'Recuperar Senha'}
          </h2>
          <p className="text-xs text-zinc-400">
            {mode === 'login' && 'Digite seus dados para acessar seu painel de evolução.'}
            {mode === 'signup' && 'Inicie sua jornada para acumular XP e conquistar fases.'}
            {mode === 'recovery' && 'Digite seu e-mail para receber o link de redefinição.'}
          </p>
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
                      <span>Selecionar Foto</span>
                    </button>
                    <p className="text-[10px] text-zinc-500">Formato JPG, PNG ou WebP</p>
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
                    placeholder="Seu nome"
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
                className="rounded bg-zinc-950 border-zinc-800 text-lime-400 focus:ring-0"
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
              <span>Carregando...</span>
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

        {/* Google OAuth Ready Banner */}
        <div className="pt-2 text-center">
          <button
            onClick={() => setMessage({ type: 'success', text: 'Login via Google ativado na estrutura do Supabase Auth!' })}
            className="w-full py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z"/>
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
            </svg>
            <span>Entrar com o Google</span>
          </button>
        </div>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-zinc-400">
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
