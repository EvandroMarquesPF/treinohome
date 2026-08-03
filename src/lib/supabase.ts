import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect if key is a secret service_role key or invalid placeholder
const isSecretKey = typeof supabaseAnonKey === 'string' && (
  supabaseAnonKey.includes('service_role') || 
  supabaseAnonKey.startsWith('sbp_') ||
  supabaseAnonKey.includes('secret')
);

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-supabase-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key' &&
  supabaseAnonKey !== 'placeholder-key' &&
  !isSecretKey
);

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key'
);

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
