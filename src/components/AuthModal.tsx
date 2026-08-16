import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Camera,
  Upload,
  RotateCcw
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { 
  supabase, 
  isSupabaseConfigured,
  getOAuthRedirectUrl,
  translateSupabaseAuthError
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

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setMessage(null);

    try {
      if (isSupabaseConfigured) {
        const redirectToUrl = getOAuthRedirectUrl();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectToUrl,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
        });
        if (error) throw error;
      } else {
        setMessage({
          type: 'error',
          text: 'A conexão real com o Google requer as credenciais do Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) configuradas na Vercel ou nas Configurações.'
        });
        setGoogleLoading(false);
      }
    } catch (err: unknown) {
      const errorText = translateSupabaseAuthError(err);
      setMessage({
        type: 'error',
        text: errorText
      });
      setGoogleLoading(false);
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
      let emailConfirmationNeeded = false;

      if (isSupabaseConfigured) {
        if (mode === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { 
              data: { name: name || email.split('@')[0], avatar_url: avatarUrl },
              emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
            }
          });
          if (error) throw error;
          authUserId = data.user?.id;
          if (!data.session && data.user) {
            emailConfirmationNeeded = true;
          }
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

      if (emailConfirmationNeeded) {
        setMessage({
          type: 'success',
          text: 'Conta criada com sucesso! Enviamos um link de confirmação para o seu e-mail.'
        });
      } else {
        setMessage({
          type: 'success',
          text: mode === 'signup' 
            ? 'Conta criada! Seus dados iniciais foram zerados para você começar do zero!' 
            : 'Bem-vindo de volta ao Treino Home!'
        });
      }

      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 900);

    } catch (err: unknown) {
      const errorText = translateSupabaseAuthError(err);
      setMessage({
        type: 'error',
        text: errorText
      });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-zinc-900 dark:text-zinc-100 my-8 transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          id="close-auth-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center text-center space-y-2 pt-1">
          <BrandLogo size="lg" />
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            {mode === 'login' && 'Entrar no Treino Home'}
            {mode === 'signup' && 'Criar Conta de Atleta'}
            {mode === 'recovery' && 'Recuperar Senha'}
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-xs">
            {mode === 'login' && 'Acesse seus treinos diários, histórico e evolução de XP.'}
            {mode === 'signup' && 'Comece sua jornada e conquiste novos níveis de calistenia.'}
            {mode === 'recovery' && 'Digite seu e-mail cadastrado para redefinir sua senha.'}
          </p>
        </div>

        {/* Google OAuth Login Button */}
        {mode !== 'recovery' && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              id="google-auth-btn"
              className="w-full py-3 px-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-700/80 text-zinc-800 dark:text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-3 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-500 disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{googleLoading ? 'Conectando...' : mode === 'login' ? 'Entrar com o Google' : 'Cadastrar com o Google'}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-zinc-200 dark:border-zinc-800 w-full" />
              <span className="bg-white dark:bg-zinc-900 px-3 text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">
                ou continue com e-mail
              </span>
              <div className="border-t border-zinc-200 dark:border-zinc-800 w-full" />
            </div>
          </div>
        )}

        {/* Form Alert */}
        {message && (
          <div className={`p-3.5 rounded-2xl text-xs flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-lime-500/15 text-lime-800 dark:text-lime-400 border border-lime-500/30' 
              : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-lime-600 dark:text-lime-400" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              {/* Photo Upload Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Foto do Perfil (Upload)</label>
                <div className="flex items-center space-x-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <div className="relative group shrink-0">
                    <img 
                      src={avatarUrl} 
                      alt="Avatar Preview" 
                      className="w-12 h-12 rounded-xl object-cover border border-lime-500/60"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold border border-zinc-300 dark:border-zinc-800 flex items-center space-x-1.5 cursor-pointer shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                      <span>Selecionar Imagem</span>
                    </button>
                    <p className="text-[10px] text-zinc-500">JPG, PNG ou WebP</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="Seu nome ou apelido"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-lime-500 transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-lime-500 transition-colors"
              />
            </div>
          </div>

          {mode !== 'recovery' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Senha</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('recovery')}
                    className="text-xs text-lime-700 dark:text-lime-400 font-semibold hover:underline cursor-pointer"
                  >
                    Esqueceu?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-lime-500 transition-colors"
                />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center space-x-2 text-xs text-zinc-600 dark:text-zinc-400">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded bg-zinc-100 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-lime-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="cursor-pointer">Permanecer conectado</label>
            </div>
          )}

          {mode === 'signup' && (
            <div className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-lime-500/20">
              <input
                type="checkbox"
                id="resetDataOnRegister"
                checked={resetDataOnRegister}
                onChange={e => setResetDataOnRegister(e.target.checked)}
                className="w-4 h-4 rounded bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 text-lime-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="resetDataOnRegister" className="cursor-pointer font-semibold flex items-center space-x-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0" />
                <span>Zerar dados para iniciar no Nível 1 (0 XP)</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            id="auth-submit-btn"
            className="w-full py-3.5 rounded-2xl bg-lime-400 text-black font-extrabold text-sm hover:bg-lime-300 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-lime-500/20 disabled:opacity-50 cursor-pointer"
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
            className="text-zinc-700 dark:text-zinc-300 underline hover:text-lime-600 dark:hover:text-lime-400 transition-colors cursor-pointer"
          >
            Termos de Uso
          </button>{' '}
          e{' '}
          <button
            type="button"
            onClick={() => onOpenTerms?.('privacy')}
            className="text-zinc-700 dark:text-zinc-300 underline hover:text-lime-600 dark:hover:text-lime-400 transition-colors cursor-pointer"
          >
            Política de Privacidade
          </button>.
        </div>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-200 dark:border-zinc-800">
          {mode === 'login' ? (
            <span>
              Ainda não tem conta?{' '}
              <button onClick={() => setMode('signup')} className="text-lime-700 dark:text-lime-400 font-bold hover:underline cursor-pointer">
                Cadastre-se grátis
              </button>
            </span>
          ) : (
            <span>
              Já possui uma conta?{' '}
              <button onClick={() => setMode('login')} className="text-lime-700 dark:text-lime-400 font-bold hover:underline cursor-pointer">
                Fazer Login
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
