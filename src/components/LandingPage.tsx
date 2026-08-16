import React, { useState } from 'react';
import { 
  Dumbbell, 
  Flame, 
  Trophy, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  ChevronDown, 
  Smartphone,
  Award,
  Calendar,
  Layers
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenTerms?: (tab: 'terms' | 'privacy') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onOpenTerms }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const benefits = [
    {
      icon: Dumbbell,
      title: 'Sem Equipamentos',
      desc: 'Treine usando apenas o peso do seu próprio corpo (Calistenia) ou itens simples de casa.'
    },
    {
      icon: Zap,
      title: 'Rápido e Eficiente',
      desc: 'Sessões inteligentes de 15 a 30 minutos projetadas para máxima hipertrofia e queima de gordura.'
    },
    {
      icon: Trophy,
      title: 'Gamificação Estilo Duolingo',
      desc: 'Suba de nível, desbloqueie fases semanais, conquiste medalhas e ganhe XP a cada série.'
    },
    {
      icon: Flame,
      title: 'Controle de Sequência',
      desc: 'Mantenha sua chama acesa treinando diariamente e construa uma disciplina inabalável.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Acesse de qualquer dispositivo',
      desc: 'Sem burocracia. O app é 100% responsivo, instalável como PWA e funciona offline.'
    },
    {
      number: '02',
      title: 'Siga o Treino do Dia',
      desc: 'Cada dia da semana possui um treino otimizado (Peito, Costas, Pernas, Core e Descanso Ativo).'
    },
    {
      number: '03',
      title: 'Cronômetro Inteligente & XP',
      desc: 'O aplicativo ajusta automaticamente o descanso entre as séries e calcula seus pontos.'
    },
    {
      number: '04',
      title: 'Evolua no Mapa de Fases',
      desc: 'Desbloqueie conquistas, acompanhe estatísticas visuais e veja sua transformação física.'
    }
  ];

  const testimonials = [
    {
      name: 'Carlos Eduardo',
      role: 'Desenvolvedor Frontend',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      text: 'O Treino Home mudou minha rotina. Não tenho tempo de ir à academia, mas com o sistema de XP do app eu treino 20 minutos por dia e já perdi 6kg!',
      stars: 5
    },
    {
      name: 'Mariana Silva',
      role: 'Designer UX',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      text: 'A gamificação estilo Duolingo é viciante! Ver a chama da sequência aumentar todos os dias dá uma motivação absurda para não pular o treino.',
      stars: 5
    },
    {
      name: 'Rodrigo Mendes',
      role: 'Engenheiro de Software',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      text: 'O timer automático de descanso e as ilustrações dos exercícios facilitam demais. A sincronização em tempo real é perfeita.',
      stars: 5
    }
  ];

  const faqs = [
    {
      q: 'Preciso de halteres ou equipamentos de academia?',
      a: 'Não! Todos os treinos do programa foram estruturados com exercícios calistênicos usando o peso do corpo. Quando necessário, sugerimos adaptações simples com mochilas ou garrafas de água.'
    },
    {
      q: 'Como funciona o sistema de XP e Níveis?',
      a: 'Cada exercício concluído concede 10 XP, cada série finalizada rende 5 XP e um treino completo dá 100 XP. Manter 7 dias de sequência garante 500 XP bônus! Ao acumular pontos, você sobe de nível e desbloqueia medalhas.'
    },
    {
      q: 'O aplicativo sincroniza meus dados na nuvem?',
      a: 'Sim! Utilizamos o Supabase como banco de dados em tempo real. Seus treinos, histórico e conquistas ficam protegidos e sincronizados em qualquer navegador ou celular.'
    },
    {
      q: 'Posso usar o aplicativo sem internet?',
      a: 'Sim. O Treino Home é uma Progressive Web App (PWA). Você pode instalá-lo no celular e registrá-lo offline. Quando se reconectar, os dados serão sincronizados.'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-400/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-lime-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-400 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-lime-400" />
                <span>O Treinador Pessoal Inteligente para Casa</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                Treino Home
                <span className="block mt-2 text-lime-400">
                  Transforme disciplina em resultado.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Treine em casa. Acompanhe sua evolução. Ganhe XP, conquiste medalhas e mantenha sua sequência de dias sem sair do conforto da sua sala.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onOpenAuth('signup')}
                  id="hero-create-account-btn"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-lime-400 text-black font-extrabold text-base shadow-xl shadow-lime-500/25 hover:bg-lime-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 group"
                >
                  <span>Criar Conta Grátis</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onOpenAuth('login')}
                  id="hero-login-btn"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-bold text-base hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-center space-x-2"
                >
                  <span>Entrar no App</span>
                </button>
              </div>

              {/* Social Proof Stats */}
              <div className="pt-6 border-t border-zinc-900 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-zinc-400 text-xs font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-lime-400" />
                  <span>Calistenia & Peso Corporal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-lime-400" />
                  <span>Sincronizado Supabase</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-lime-400" />
                  <span>PWA 100% Instalável</span>
                </div>
              </div>
            </div>

            {/* Right Mockup Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-[3rem] p-4 bg-zinc-900 border border-zinc-800 shadow-2xl shadow-lime-500/10">
                <div className="rounded-[2.5rem] bg-zinc-950 p-6 space-y-5 border border-zinc-800/80 overflow-hidden">
                  
                  {/* Top Bar Mock */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-lime-400 text-black flex items-center justify-center font-bold text-xs">
                        E
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-100">Olá, Evandro 👋</div>
                        <div className="text-[10px] text-zinc-400">Nível 3 • 1420 XP</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 bg-lime-500/10 border border-lime-500/20 px-2.5 py-1 rounded-full text-lime-400 text-xs font-bold">
                      <Flame className="w-3.5 h-3.5 text-lime-400 fill-lime-400/20" />
                      <span>7 Dias</span>
                    </div>
                  </div>

                  {/* Gamification Node Card Mock */}
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-lime-500/30 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-lime-400 uppercase tracking-wider">Treino de Hoje</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-lime-500/20 text-lime-300 font-semibold">Segunda-feira</span>
                    </div>
                    <div className="font-extrabold text-lg text-white">Peito e Tríceps</div>
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>3 Exercícios • 10 Séries</span>
                      <span className="text-amber-400 font-bold">+100 XP</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-lime-400 h-full w-2/3 rounded-full" />
                    </div>
                  </div>

                  {/* Duolingo path preview mockup */}
                  <div className="flex justify-center items-center py-2 space-x-3">
                    <div className="w-10 h-10 rounded-full bg-lime-400 border-2 border-lime-300 text-black flex items-center justify-center font-bold text-lg shadow-md shadow-lime-500/20 animate-bounce">
                      🥉
                    </div>
                    <div className="text-xs font-bold text-zinc-300">Semana 1: O Despertar</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-zinc-900/50 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Por que escolher o <span className="text-lime-400">Treino Home</span>?
            </h2>
            <p className="text-zinc-400 text-base">
              Eliminamos a complexidade de academias e planilhas confusas. Tudo que você precisa está em um app gamificado e intuitivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-lime-500/40 transition-all hover:-translate-y-1 space-y-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-lime-500/10 text-lime-400 flex items-center justify-center border border-lime-500/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{b.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Como funciona o aplicativo
            </h2>
            <p className="text-zinc-400 text-base">
              Quatro passos simples para transformar sua saúde física sem sair de casa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <span className="text-4xl font-black text-lime-400/40 block">{step.number}</span>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-zinc-900/40 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              O que dizem os nossos atletas
            </h2>
            <p className="text-zinc-400 text-base">
              Pessoas reais transformando sua disciplina em resultados comprovados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex text-amber-400 space-x-1">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-300 italic leading-relaxed">"{t.text}"</p>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-zinc-800">
                  <img 
                    src={t.avatar} 
                    alt={t.name} 
                    className="w-10 h-10 rounded-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-sm font-bold text-white">{t.name}</div>
                    <div className="text-xs text-zinc-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Perguntas Frequentes
            </h2>
            <p className="text-zinc-400 text-base">
              Tudo o que você precisa saber sobre o Treino Home.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left font-bold text-white flex items-center justify-between text-base focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Bottom Bar */}
      <section className="py-16 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Pronto para começar seu primeiro treino?
          </h2>
          <p className="text-zinc-300 text-base max-w-xl mx-auto">
            Crie sua conta em menos de 1 minuto e inicie sua jornada de treino em casa com gamificação completa.
          </p>
          <button
            onClick={() => onOpenAuth('signup')}
            id="bottom-cta-signup-btn"
            className="px-8 py-4 rounded-2xl bg-lime-400 text-black font-extrabold text-base shadow-xl shadow-lime-500/30 hover:bg-lime-300 hover:scale-105 active:scale-95 transition-all inline-flex items-center space-x-2"
          >
            <span>Começar Agora Gratuitamente</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-zinc-950 border-t border-zinc-900 text-xs text-zinc-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <BrandLogo size="sm" />
            <span className="font-bold text-zinc-300">Treino Home Pro</span>
            <span>© {new Date().getFullYear()} - Todos os direitos reservados.</span>
          </div>
          <div className="flex space-x-6 text-zinc-400">
            <button 
              type="button"
              onClick={() => onOpenTerms?.('terms')}
              className="hover:text-lime-400 cursor-pointer transition-colors"
              id="footer-terms-link"
            >
              Termos de Uso
            </button>
            <button 
              type="button"
              onClick={() => onOpenTerms?.('privacy')}
              className="hover:text-lime-400 cursor-pointer transition-colors"
              id="footer-privacy-link"
            >
              Política de Privacidade
            </button>
            <span className="text-zinc-500">Supabase & Vercel Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
