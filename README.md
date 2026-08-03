# 🏋️‍♂️ Treino Home Pro - Treinador Pessoal Inteligente

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_Database-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Treino Home** é um aplicativo web progressivo (PWA) e plataforma de calistenia/treino em casa totalmente gamificada, projetado para transformar disciplina em resultados reais sem a necessidade de equipamentos caros de academia.

---

## 🌟 Principais Funcionalidades

- ⚡ **Treinos Semanais de Calistenia & Peso Corporal:** Planos estruturados por dias da semana (Segunda a Sexta), com contagem de séries, repetições e descrições técnicas de execução.
- 🎮 **Sistema Completo de Gamificação:** Ganhe XP a cada treino e série concluída, suba de nível, mantenha sua sequência de dias ativas (*Streak*) e desbloqueie conquistas exclusivas.
- 👤 **Cadastro de Perfil & Upload de Foto:** Personalize seu avatar enviando foto do seu dispositivo (com compressão automática de imagem) ou escolha entre avatares pré-definidos.
- 🔄 **Zerar Dados (Começar do Zero):** Opção para reiniciar as estatísticas do perfil para o **Nível 1 com 0 XP**, permitindo um recomeço limpo a qualquer momento.
- ⏱️ **Cronômetro Inteligente de Descanso:** Temporizador integrado de descanso entre séries com alertas sonoros sintetizados e vibração.
- ☁️ **Integração Supabase Realtime:** Sincronização em tempo real de autenticação de usuários, perfil, progresso e configurações.
- 📲 **PWA 100% Instalável:** Funciona offline e pode ser instalado na tela inicial de qualquer smartphone Android/iOS ou computador.
- 🎨 **Design Moderno Luxury Dark:** Interface elegante em tom escuro com acentos em verde limão elétrico (`lime-400`), desenvolvida para máxima legibilidade e conforto visual.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18 + TypeScript + Vite
- **Estilização:** Tailwind CSS (com tema escuro customizado e acentos em lime)
- **Ícones:** Lucide React Icons
- **Animações & Efeitos:** Canvas Confetti, CSS Micro-interactions, Web Audio API Synthesizer
- **Backend & Autenticação:** Supabase (Auth & PostgreSQL Row Level Security)
- **Persistência Local:** LocalStorage State Manager com fallback reativo e sincronização assíncrona.

---

## 📂 Estrutura do Projeto

```bash
treino-home/
├── public/                # Ativos estáticos e ícones do PWA
├── src/
│   ├── components/        # Componentes visuais modulares
│   │   ├── AuthModal.tsx         # Modal de Login, Cadastro e Recuperação de Senha
│   │   ├── ProfileSetupModal.tsx # Modal de Cadastro do Perfil, Upload de Foto e Zerar Dados
│   │   ├── DashboardView.tsx     # Painel principal de progresso, XP e níveis
│   │   ├── WorkoutScreen.tsx     # Tela de execução de treinos e séries
│   │   ├── SettingsView.tsx      # Configurações do perfil, áudio e Supabase
│   │   ├── LandingPage.tsx       # Landing page institucional responsiva
│   │   ├── Navbar.tsx            # Barra de navegação responsiva superior e inferior
│   │   └── ...
│   ├── data/              # Dados estáticos dos treinos e conquistas
│   ├── lib/
│   │   ├── store.ts              # Gerenciador de estado global reativo
│   │   ├── supabase.ts           # Cliente Supabase e scripts DDL/RLS
│   │   └── audio.ts              # Sintetizador de áudio Web Audio API
│   ├── types.ts           # Interfaces e tipos globais TypeScript
│   ├── App.tsx            # Componente raiz da aplicação
│   └── main.tsx           # Ponto de entrada da aplicação
├── .env.example           # Exemplo de variáveis de ambiente
├── package.json           # Dependências e scripts de execução
├── vite.config.ts         # Configurações do Vite
└── README.md              # Documentação oficial do projeto
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** (versão 18.x ou superior)
- **npm** ou **yarn** / **pnpm**

### Passo a Passo

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/seu-usuario/treino-home.git
   cd treino-home
   ```

2. **Instalar as Dependências:**
   ```bash
   npm install
   ```

3. **Configurar as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-publica
   ```
   > ⚠️ **Atenção:** Nunca utilize a chave `service_role` no frontend! Use apenas a chave pública `VITE_SUPABASE_ANON_KEY`.

4. **Iniciar o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acessar no Navegador:**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🗄️ Esquema do Banco de Dados (Supabase / PostgreSQL)

Se você deseja conectar o app a um projeto Supabase, execute a query SQL abaixo no **SQL Editor** do seu painel Supabase:

```sql
-- Criar tabela de Perfis de Usuários
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  email TEXT,
  foto TEXT,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de Progresso do Atleta
CREATE TABLE IF NOT EXISTS public.progress (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0,
  nivel INTEGER DEFAULT 1,
  sequencia_dias INTEGER DEFAULT 0,
  treinos_concluidos INTEGER DEFAULT 0,
  series_concluidas INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso
CREATE POLICY "Permitir leitura pública dos perfis" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Permitir usuário atualizar próprio perfil" ON public.profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Permitir leitura de progresso do próprio usuário" ON public.progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Permitir salvar progresso do próprio usuário" ON public.progress FOR ALL USING (auth.uid() = user_id);
```

---

## 🛡️ Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p center="text-center">
  Desenvolvido com 💚 para transformar sua rotina de treinos em casa.
</p>
