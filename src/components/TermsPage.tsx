import React from 'react';
import { 
  FileText, 
  HeartPulse, 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  Scale,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface TermsPageProps {
  onBack?: () => void;
  onOpenPrivacy?: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({
  onBack,
  onOpenPrivacy
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Top Banner / Header */}
      <div className="rounded-3xl bg-gradient-to-br from-zinc-100 via-zinc-50 to-emerald-50/70 border border-zinc-200/80 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-950 dark:to-emerald-950/80 dark:border-emerald-500/30 p-6 sm:p-8 shadow-md dark:shadow-xl transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-lime-600 dark:text-lime-400 flex items-center justify-center border border-emerald-500/20 shadow-sm shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <BrandLogo size="sm" />
                <span className="text-xs font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400">Treino Home</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                Termos de Uso
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                Última atualização: Agosto de 2026 • Versão 2.4
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenPrivacy && (
              <button
                onClick={onOpenPrivacy}
                id="terms-goto-privacy-top-btn"
                className="px-3.5 py-2 rounded-xl bg-zinc-200/60 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                <span>Ver Privacidade</span>
              </button>
            )}
            {onBack && (
              <button
                onClick={onBack}
                id="terms-back-btn"
                className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs transition-all shadow-md shadow-lime-500/20 flex items-center space-x-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Medical Disclaimer Callout */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-4 text-amber-900 dark:text-amber-200 shadow-sm">
        <HeartPulse className="w-7 h-7 text-amber-600 dark:text-amber-400 shrink-0 mt-1" />
        <div className="space-y-1.5 text-sm leading-relaxed">
          <span className="font-extrabold text-amber-800 dark:text-amber-300 block text-base">
            Aviso de Responsabilidade Médica e Aptidão Física:
          </span>
          <p className="text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm">
            O <strong>Treino Home</strong> é um aplicativo destinado ao suporte, orientação e gamificação de exercícios físicos de calistenia e peso corporal. As informações contidas no aplicativo não substituem o aconselhamento, diagnóstico ou tratamento médico profissional. Antes de iniciar qualquer programa de exercícios físicos, consulte um médico ou profissional de educação física habilitado, especialmente se você apresentar histórico de lesões musculoesqueléticas ou problemas cardiovasculares.
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="rounded-3xl bg-gradient-to-br from-zinc-100 via-zinc-50 to-emerald-50/70 border border-zinc-200/80 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-950 dark:to-emerald-950/80 dark:border-emerald-500/30 p-6 sm:p-10 shadow-md dark:shadow-xl space-y-8 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed transition-colors">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-400/20 text-lime-700 dark:text-lime-300 font-black text-xs">
              01
            </span>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
              Aceitação dos Termos de Uso
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Ao acessar, instalar ou utilizar o aplicativo <strong>Treino Home</strong> (web ou versão PWA instalada), você concorda integralmente com estes Termos de Uso e com a nossa Política de Privacidade. Caso discorde de quaisquer termos aqui descritos, você não deve utilizar a plataforma.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-400/20 text-lime-700 dark:text-lime-300 font-black text-xs">
              02
            </span>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
              Serviços Oferecidos & Recursos da Plataforma
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            O Treino Home fornece rotinas semanais de treino calistênico (divididos em Peito & Tríceps, Costas & Bíceps, Pernas & Panturrilhas, Ombros & Trapézio, Core & Abdômen e Descanso Ativo), controle de descanso automatizado através de cronômetro inteligente, mapa de progressão gamificada e sincronização de dados.
          </p>
          <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-1.5 pl-2">
            <li><strong>Acesso Gratuito:</strong> Todos os treinos, fases e conquistas estão disponíveis para os atletas cadastrados.</li>
            <li><strong>Modo Offline (PWA):</strong> O aplicativo armazena temporariamente seu progresso localmente caso não haja conexão com a internet.</li>
            <li><strong>Sincronização em Nuvem:</strong> Os dados de treino são sincronizados com segurança no Supabase quando conectado.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-400/20 text-lime-700 dark:text-lime-300 font-black text-xs">
              03
            </span>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
              Cadastro, Senhas e Segurança
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Para acessar recursos de sincronização na nuvem e salvar seu histórico com segurança, o usuário deve criar uma conta utilizando um endereço de e-mail válido. Você é o único responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-400/20 text-lime-700 dark:text-lime-300 font-black text-xs">
              04
            </span>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
              Sistema de Gamificação, XP e Níveis
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Os pontos de experiência (XP), medalhas, fases da jornada e dias consecutivos de sequência (*streaks*) são mecânicas exclusivas de engajamento e incentivo físico:
          </p>
          <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-1.5 pl-2">
            <li>O XP não possui qualquer valor financeiro, comercial ou cambial.</li>
            <li>Não há transações financeiras envolvendo a pontuação do jogo.</li>
            <li>O usuário pode reiniciar sua pontuação a qualquer momento através da opção "Zerar Perfil" nas configurações.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-400/20 text-lime-700 dark:text-lime-300 font-black text-xs">
              05
            </span>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
              Propriedade Intelectual
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Todo o código-fonte, layout visual, ilustrações de exercícios, identidade visual, sons do cronômetro e elementos gráficos do <strong>Treino Home</strong> são de propriedade exclusiva de seus desenvolvedores e protegidos pelas leis de direitos autorais e propriedade intelectual vigentes.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-400/20 text-lime-700 dark:text-lime-300 font-black text-xs">
              06
            </span>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
              Autonomia do Usuário & Exclusão de Conta
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Respeitamos sua autonomia e controle sobre seus dados. Você possui o direito de:
          </p>
          <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-1.5 pl-2">
            <li>Exportar e visualizar todo o seu histórico de treino.</li>
            <li>Resetar todos os seus dados para o estado inicial (Nível 1, 0 XP).</li>
            <li>Excluir definitivamente sua conta e todos os dados associados na nuvem.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-400/20 text-lime-700 dark:text-lime-300 font-black text-xs">
              07
            </span>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
              Alterações nos Termos & Foro
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Podemos atualizar estes Termos periodicamente para refletir melhorias no serviço ou exigências legais. O uso continuado do aplicativo após tais modificações constitui sua concordância com os novos termos. Estes termos são regidos pelas leis da República Federativa do Brasil.
          </p>
        </section>

        {/* Footer Navigation within Page */}
        <div className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-500 text-center sm:text-left">
            Dúvidas sobre os Termos? Consulte nossa Política de Privacidade.
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-center">
            {onOpenPrivacy && (
              <button
                onClick={onOpenPrivacy}
                id="terms-bottom-privacy-btn"
                className="px-4 py-2.5 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <span>Política de Privacidade</span>
              </button>
            )}
            {onBack && (
              <button
                onClick={onBack}
                id="terms-bottom-back-btn"
                className="px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs transition-all shadow-md shadow-lime-500/20 cursor-pointer"
              >
                Voltar ao App
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
