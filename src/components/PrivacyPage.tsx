import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  UserCheck, 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  EyeOff, 
  HardDrive, 
  KeyRound, 
  HelpCircle,
  Smartphone
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface PrivacyPageProps {
  onBack?: () => void;
  onOpenTerms?: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({
  onBack,
  onOpenTerms
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Top Banner / Header */}
      <div className="rounded-3xl bg-gradient-to-br from-zinc-100 via-zinc-50 to-emerald-50/70 border border-zinc-200/80 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-950 dark:to-emerald-950/80 dark:border-emerald-500/30 p-6 sm:p-8 shadow-md dark:shadow-xl transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-lime-600 dark:text-lime-400 flex items-center justify-center border border-emerald-500/20 shadow-sm shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <BrandLogo size="sm" />
                <span className="text-xs font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400">Treino Home</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                Política de Privacidade
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                Conformidade com a LGPD (Lei nº 13.709/2018) • Atualizado em Agosto de 2026
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenTerms && (
              <button
                onClick={onOpenTerms}
                id="privacy-goto-terms-top-btn"
                className="px-3.5 py-2 rounded-xl bg-zinc-200/60 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                <span>Ver Termos</span>
              </button>
            )}
            {onBack && (
              <button
                onClick={onBack}
                id="privacy-back-btn"
                className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs transition-all shadow-md shadow-lime-500/20 flex items-center space-x-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LGPD Transparency Summary Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-4 text-emerald-900 dark:text-emerald-200 shadow-sm">
        <Lock className="w-7 h-7 text-lime-600 dark:text-lime-400 shrink-0 mt-1" />
        <div className="space-y-1.5 text-sm leading-relaxed">
          <span className="font-extrabold text-emerald-800 dark:text-lime-300 block text-base">
            Compromisso de Privacidade & Não Comercialização de Dados:
          </span>
          <p className="text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm">
            Nós valorizamos a sua privacidade e autonomia. Seus dados de treino, preferências corporais e histórico pertencem unicamente a você. <strong>O Treino Home não vende, não aluga e não compartilha dados pessoais com corretores de dados, terceiros de publicidade ou anunciantes</strong>.
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="rounded-3xl bg-gradient-to-br from-zinc-100 via-zinc-50 to-emerald-50/70 border border-zinc-200/80 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-950 dark:to-emerald-950/80 dark:border-emerald-500/30 p-6 sm:p-10 shadow-md dark:shadow-xl space-y-8 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed transition-colors">
        
        {/* Section 1: Dados Coletados */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-400/20 text-lime-700 dark:text-lime-300 font-black text-xs">
              01
            </span>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-lime-600 dark:text-lime-400" />
              <span>Quais Dados Pessoais Nós Coletamos</span>
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Coletamos estritamente os dados necessários para o fornecimento do serviço de treino e cálculo de estatísticas:
          </p>
          <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-2">
            <li><strong>Identificação e Acesso:</strong> Nome (ou apelido de atleta), endereço de e-mail e foto de perfil opcional.</li>
            <li><strong>Métricas de Treino e Gamificação:</strong> Séries completadas, número de repetições, tempo total de exercício, XP acumulado, nível atual, dias consecutivos de sequência (*streaks*) e conquistas alcançadas.</li>
            <li><strong>Preferências do Usuário:</strong> Duração personalizada do cronômetro de descanso (ex: 60s, 90s, 120s), ativação de efeitos sonoros, vibração tátil e tema visual (claro ou escuro).</li>
          </ul>
        </section>

        {/* Section 2: Finalidade do Tratamento */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-400/20 text-lime-700 dark:text-lime-300 font-black text-xs">
              02
            </span>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-lime-600 dark:text-lime-400" />
              <span>Finalidade e Base Legal do Tratamento (LGPD)</span>
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            O tratamento de dados no Treino Home é realizado com base no <strong>Artigo 7º, Inciso V da LGPD</strong> (execução de contrato e fornecimento do serviço contratado pelo usuário), exclusivamente para:
          </p>
          <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-1.5 pl-2">
            <li>Autenticar o usuário e sincronizar seus treinos entre navegadores e dispositivos.</li>
            <li>Calcular a progressão do atleta nas fases e níveis semanais.</li>
            <li>Garantir a execução correta do cronômetro inteligente com alertas sonoros e visuais.</li>
          </ul>
        </section>

        {/* Section 3: Armazenamento e Segurança */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-400/20 text-lime-700 dark:text-lime-300 font-black text-xs">
              03
            </span>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-lime-600 dark:text-lime-400" />
              <span>Arquitetura de Segurança & Armazenamento Seguro</span>
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Adotamos padrões industriais de segurança da informação:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-zinc-200/50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <span>Supabase & Row Level Security (RLS)</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                As tabelas de banco de dados possuem políticas rígidas de segurança por linha (RLS), impedindo que qualquer outro usuário tenha acesso às suas séries ou informações privadas.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-200/50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <span>Criptografia em Trânsito (TLS/HTTPS)</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Todas as conexões e trocas de dados entre seu navegador e nossos servidores são protegidas por criptografia HTTPS/TLS de última geração.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Armazenamento Local & Modo Offline */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-400/20 text-lime-700 dark:text-lime-300 font-black text-xs">
              04
            </span>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-lime-600 dark:text-lime-400" />
              <span>Armazenamento Local (LocalStorage & Modo Offline)</span>
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Quando você utiliza o aplicativo em modo visitante ou sem conexão com a internet, os registros são armazenados estritamente na memória local (LocalStorage) do seu navegador. Esses dados não são transferidos para servidores externos até que você opte por conectar sua conta.
          </p>
        </section>

        {/* Section 5: Seus Direitos */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-400/20 text-lime-700 dark:text-lime-300 font-black text-xs">
              05
            </span>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-lime-600 dark:text-lime-400" />
              <span>Seus Direitos como Titular de Dados</span>
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Em total acordo com o Artigo 18 da LGPD, você possui direito a:
          </p>
          <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-1.5 pl-2">
            <li><strong>Acesso e Confirmação:</strong> Visualizar todos os treinos, séries e informações atreladas ao seu perfil.</li>
            <li><strong>Correção de Dados:</strong> Alterar seu nome, foto e preferências a qualquer momento no menu de Perfil.</li>
            <li><strong>Eliminação e Reset:</strong> Você pode reiniciar seu progresso ("Zerar Perfil") ou solicitar a exclusão irrevogável de todos os registros da nuvem.</li>
          </ul>
        </section>

        {/* Section 6: Contato */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-400/20 text-lime-700 dark:text-lime-300 font-black text-xs">
              06
            </span>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-lime-600 dark:text-lime-400" />
              <span>Canal de Privacidade & Encarregado de Dados (DPO)</span>
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Se você tiver dúvidas, sugestões ou desejar exercer qualquer um dos seus direitos de titularidade de dados previstos pela LGPD, utilize o painel de configurações do aplicativo ou entre em contato diretamente com a equipe do Treino Home.
          </p>
        </section>

        {/* Footer Navigation within Page */}
        <div className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-500 text-center sm:text-left">
            Treino Home • Segurança e Privacidade Rigorosamente Protegidas
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-center">
            {onOpenTerms && (
              <button
                onClick={onOpenTerms}
                id="privacy-bottom-terms-btn"
                className="px-4 py-2.5 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <span>Ver Termos de Uso</span>
              </button>
            )}
            {onBack && (
              <button
                onClick={onBack}
                id="privacy-bottom-back-btn"
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
