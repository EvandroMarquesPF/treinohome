import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Resolve environment variables from Vite, Vercel, Next.js or window objects
function resolveEnvKey(names: string[]): string {
  // 1. Check import.meta.env (Vite)
  try {
    for (const name of names) {
      const val = (import.meta.env as Record<string, string | undefined>)?.[name];
      if (val && typeof val === 'string' && val.trim() !== '') {
        return val.trim();
      }
    }
  } catch {
    // Ignore in non-Vite environments
  }

  // 2. Check process.env (Node / Vite define shims)
  try {
    if (typeof process !== 'undefined' && process.env) {
      for (const name of names) {
        const val = process.env[name];
        if (val && typeof val === 'string' && val.trim() !== '') {
          return val.trim();
        }
      }
    }
  } catch {
    // Ignore
  }

  // 3. Check window.__ENV__ or global window definitions (often used in Vercel/Docker runtime injection)
  try {
    if (typeof window !== 'undefined') {
      const winEnv = (window as unknown as { __ENV__?: Record<string, string>; _env_?: Record<string, string> }).__ENV__ ||
                     (window as unknown as { __ENV__?: Record<string, string>; _env_?: Record<string, string> })._env_;
      if (winEnv) {
        for (const name of names) {
          const val = winEnv[name];
          if (val && typeof val === 'string' && val.trim() !== '') {
            return val.trim();
          }
        }
      }
    }
  } catch {
    // Ignore
  }

  return '';
}

// Check for user-stored local credentials in localStorage
function getStoredCustomConfig(): { url: string; key: string } {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const url = window.localStorage.getItem('treino_home_custom_supabase_url') || '';
      const key = window.localStorage.getItem('treino_home_custom_supabase_anon_key') || '';
      return { url: url.trim(), key: key.trim() };
    }
  } catch {
    // Ignore
  }
  return { url: '', key: '' };
}

const storedConfig = getStoredCustomConfig();

// Detect Vercel / Vite env names
const detectedEnvUrl = resolveEnvKey([
  'VITE_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_URL',
  'VITE_PUBLIC_SUPABASE_URL',
  'REACT_APP_SUPABASE_URL',
  'PUBLIC_SUPABASE_URL'
]);

const detectedEnvAnonKey = resolveEnvKey([
  'VITE_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_ANON_KEY',
  'SUPABASE_KEY',
  'VITE_SUPABASE_KEY',
  'VITE_PUBLIC_SUPABASE_ANON_KEY',
  'REACT_APP_SUPABASE_ANON_KEY',
  'PUBLIC_SUPABASE_ANON_KEY'
]);

export const supabaseUrl = storedConfig.url || detectedEnvUrl || '';
export const supabaseAnonKey = storedConfig.key || detectedEnvAnonKey || '';

// Detect if key is a secret service_role key or invalid placeholder
const isSecretKey = typeof supabaseAnonKey === 'string' && (
  supabaseAnonKey.includes('service_role') || 
  supabaseAnonKey.startsWith('sbp_') ||
  supabaseAnonKey.includes('secret')
);

export const isVercelEnvDetected = Boolean(
  detectedEnvUrl &&
  detectedEnvAnonKey &&
  (detectedEnvUrl.includes('.supabase.co') || detectedEnvUrl.startsWith('https://'))
);

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-supabase-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key' &&
  supabaseAnonKey !== 'placeholder-key' &&
  (supabaseUrl.includes('supabase.co') || supabaseUrl.startsWith('https://')) &&
  !isSecretKey
);

export const configSource: 'env' | 'localStorage' | 'none' = storedConfig.url && storedConfig.key
  ? 'localStorage'
  : (isSupabaseConfigured ? 'env' : 'none');

export function createSupabaseInstance(url: string, key: string): SupabaseClient {
  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        return fetch(input, init);
      },
    },
  });
}

export let supabase: SupabaseClient = createSupabaseInstance(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key'
);

export function getOAuthRedirectUrl(): string {
  if (typeof window === 'undefined') return '';
  // Se estiver na Vercel ou produção, garanta a URL exata com origin
  const origin = window.location.origin;
  return origin.endsWith('/') ? origin : `${origin}/`;
}

export function translateSupabaseAuthError(err: unknown): string {
  if (!err) return 'Ocorreu um erro inesperado.';
  const errorObj = err as { message?: string; status?: number; error_description?: string };
  const raw = (errorObj.message || errorObj.error_description || String(err)).toLowerCase();

  if (raw.includes('invalid login credentials') || raw.includes('invalid_credentials')) {
    return 'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.';
  }
  if (raw.includes('email not confirmed')) {
    return 'Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada e clique no link de confirmação.';
  }
  if (raw.includes('user already registered') || raw.includes('already registered')) {
    return 'Este e-mail já está cadastrado. Tente entrar com sua senha ou faça a recuperação.';
  }
  if (raw.includes('password should be at least') || raw.includes('weak password')) {
    return 'A senha é muito curta. Use pelo menos 6 caracteres para sua segurança.';
  }
  if (raw.includes('rate limit') || raw.includes('too many requests')) {
    return 'Muitas tentativas em pouco tempo. Aguarde alguns instantes antes de tentar novamente.';
  }
  if (raw.includes('secret api key') || raw.includes('forbidden')) {
    return 'Chave secreta detectada. No frontend é necessário utilizar a chave pública (anon key) do Supabase.';
  }
  if (raw.includes('failed to fetch') || raw.includes('networkerror')) {
    return 'Não foi possível conectar ao servidor do Supabase. Verifique sua conexão com a internet.';
  }

  return errorObj.message || 'Erro ao processar autenticação. Tente novamente.';
}

export function setCustomSupabaseConfig(url: string, key: string): { success: boolean; message: string } {
  try {
    const cleanUrl = url.trim();
    const cleanKey = key.trim();

    if (!cleanUrl || !cleanKey) {
      window.localStorage.removeItem('treino_home_custom_supabase_url');
      window.localStorage.removeItem('treino_home_custom_supabase_anon_key');
      return { success: true, message: 'Configurações removidas. Usando padrões do ambiente.' };
    }

    if (!cleanUrl.startsWith('https://') || !cleanUrl.includes('.supabase.co')) {
      return { success: false, message: 'URL inválida. Deve iniciar com https:// e conter .supabase.co' };
    }

    window.localStorage.setItem('treino_home_custom_supabase_url', cleanUrl);
    window.localStorage.setItem('treino_home_custom_supabase_anon_key', cleanKey);

    supabase = createSupabaseInstance(cleanUrl, cleanKey);
    return { success: true, message: 'Chaves do Supabase salvas e conectadas com sucesso!' };
  } catch (e: unknown) {
    const err = e as Error;
    return { success: false, message: err?.message || 'Erro ao salvar credenciais.' };
  }
}

export async function testSupabaseConnection(url?: string, key?: string): Promise<{ success: boolean; message: string }> {
  try {
    const targetUrl = url || supabaseUrl;
    const targetKey = key || supabaseAnonKey;

    if (!targetUrl || !targetKey || !targetUrl.includes('supabase.co')) {
      return { success: false, message: 'Credenciais ausentes ou formato inválido.' };
    }

    const testClient = createSupabaseInstance(targetUrl, targetKey);
    const { error } = await testClient.auth.getSession();

    if (error) {
      return { success: false, message: `Erro ao autenticar: ${error.message}` };
    }

    return { success: true, message: 'Conexão com o Supabase estabelecida com sucesso!' };
  } catch (err: unknown) {
    const e = err as Error;
    return { success: false, message: `Falha na conexão: ${e?.message || 'Erro desconhecido'}` };
  }
}

export const SUPABASE_SQL_SCHEMA = `-- TREINO HOME - TABELAS E ROW LEVEL SECURITY (RLS)
-- Execute este script no SQL Editor do seu projeto Supabase

-- 1. Tabela profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  foto TEXT,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela workouts
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dia_semana TEXT NOT NULL,
  treino TEXT NOT NULL,
  concluido BOOLEAN DEFAULT FALSE,
  tempo_total INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela exercises
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  series INT DEFAULT 3,
  repeticoes TEXT NOT NULL,
  concluido BOOLEAN DEFAULT FALSE
);

-- 4. Tabela progress
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  xp INT DEFAULT 0,
  nivel INT DEFAULT 1,
  sequencia_dias INT DEFAULT 0,
  treinos_concluidos INT DEFAULT 0,
  series_concluidas INT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela achievements
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conquista TEXT NOT NULL,
  desbloqueado BOOLEAN DEFAULT FALSE,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela settings
CREATE TABLE IF NOT EXISTS public.settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  descanso INT DEFAULT 60,
  notificacoes BOOLEAN DEFAULT TRUE,
  horario_notificacao TEXT DEFAULT '08:00',
  som BOOLEAN DEFAULT TRUE,
  vibracao BOOLEAN DEFAULT TRUE,
  tema TEXT DEFAULT 'dark'
);

-- HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE ACESSO (O usuário só enxerga/modifica seus próprios dados)
CREATE POLICY "Acesso perfil proprio" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Acesso treinos proprios" ON public.workouts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Acesso exercicios proprios" ON public.exercises FOR ALL USING (
  workout_id IN (SELECT id FROM public.workouts WHERE user_id = auth.uid())
);
CREATE POLICY "Acesso progresso proprio" ON public.progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Acesso conquistas proprias" ON public.achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Acesso configuracoes proprias" ON public.settings FOR ALL USING (auth.uid() = user_id);
`;
