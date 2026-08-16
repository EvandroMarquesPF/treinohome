import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Lock, 
  HeartPulse, 
  Database, 
  UserCheck, 
  HelpCircle,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface TermsAndPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'terms' | 'privacy';
}

export const TermsAndPrivacyModal: React.FC<TermsAndPrivacyModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'terms'
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/40 border border-zinc-200 dark:border-emerald-500/20 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/60 shrink-0">
          <div className="flex items-center space-x-3">
            <BrandLogo size="md" />
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                Termos & Políticas de Privacidade
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Treino Home • Atualizado em Agosto de 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            id="close-terms-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-100/60 dark:bg-zinc-900/50 flex space-x-2 shrink-0">
          <button
            onClick={() => setActiveTab('terms')}
            id="tab-terms-btn"
            className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'terms'
                ? 'border-lime-500 text-lime-700 dark:border-lime-400 dark:text-lime-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Termos de Uso</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            id="tab-privacy-btn"
            className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'privacy'
                ? 'border-lime-500 text-lime-700 dark:border-lime-400 dark:text-lime-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Política de Privacidade</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
          {activeTab === 'terms' ? (
            <div className="space-y-6">
              {/* Important Medical Disclaimer Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-start space-x-3 text-amber-900 dark:text-amber-200">
                <HeartPulse className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm space-y-1">
                  <span className="font-bold text-amber-800 dark:text-amber-300 block">Aviso Médico & Responsabilidade Física:</span>
                  <span>
                    O <strong>Treino Home</strong> disponibiliza rotinas de calistenia e exercícios com peso corporal com fins informativos e de condicionamento. Consulte um médico ou profissional de educação física antes de iniciar qualquer programa de exercícios, especialmente se possuir histórico de lesões ou condições cardíacas.
                  </span>
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <span className="text-lime-600 dark:text-lime-400">1.</span> Aceitação dos Termos
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
                  Ao criar uma conta ou utilizar o aplicativo web Treino Home, você declara ter lido, compreendido e concordado integralmente com estes Termos de Uso e com nossa Política de Privacidade. Caso não concorde, interrompa o uso do serviço.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <span className="text-lime-600 dark:text-lime-400">2.</span> Uso da Plataforma e Conta
                </h3>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm space-y-1">
                  <li>Você é responsável por manter a confidencialidade da sua senha e conta.</li>
                  <li>O serviço é destinado ao uso pessoal e não comercial.</li>
                  <li>Você pode optar por usar o modo local (offline) ou sincronizar dados na nuvem via Supabase.</li>
                  <li>O usuário tem autonomia para zerar seus dados (Nível 1, 0 XP) ou excluir seu cadastro a qualquer momento nas configurações.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <span className="text-lime-600 dark:text-lime-400">3.</span> Gamificação, Pontuação e Conquistas
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
                  Os pontos de experiência (XP), medalhas, sequências de dias (*streaks*) e níveis possuem caráter puramente motivacional e lúdico, sem valor financeiro ou conversibilidade monetária.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <span className="text-lime-600 dark:text-lime-400">4.</span> Propriedade Intelectual
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
                  Todo o design, interface, identidade visual, logotipos, ilustrações técnicas de exercícios e código-fonte do Treino Home são de titularidade de seus desenvolvedores, protegidos pela legislação de direitos autorais.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Privacy Summary Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-start space-x-3 text-emerald-900 dark:text-emerald-200">
                <Lock className="w-5 h-5 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm space-y-1">
                  <span className="font-bold text-emerald-800 dark:text-lime-300 block">Privacidade e Transparência (LGPD):</span>
                  <span>
                    Nós respeitamos sua privacidade. Seus dados de treino e perfil pertencem exclusivamente a você e <strong>nunca serão vendidos ou compartilhados com terceiros para fins de publicidade</strong>.
                  </span>
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  <span>1. Dados Coletados</span>
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
                  Coletamos apenas as informações essenciais para o funcionamento do seu treino:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm space-y-1">
                  <li><strong>Informações de Cadastro:</strong> Nome, endereço de e-mail e foto de perfil opcional.</li>
                  <li><strong>Estatísticas de Treino:</strong> Séries concluídas, repetições, tempo de treino, XP, nível e medalhas desbloqueadas.</li>
                  <li><strong>Preferências:</strong> Tempo de descanso entre séries, configurações de som, vibração e tema visual.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  <span>2. Como os Dados são Armazenados</span>
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
                  O Treino Home utiliza arquitetura segura com <strong>Supabase</strong> (PostgreSQL com criptografia em repouso e trânsito via HTTPS/TLS) e <strong>Row Level Security (RLS)</strong>, garantindo que apenas você possa acessar e editar seus próprios registros de treino. No modo offline, os dados residem estritamente no armazenamento local (LocalStorage) do seu dispositivo.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  <span>3. Seus Direitos e Controle Total</span>
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
                  Em conformidade com a LGPD (Lei Geral de Proteção de Dados):
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm space-y-1">
                  <li>Você pode exportar ou consultar todos os seus dados a qualquer momento.</li>
                  <li>Você pode alterar nome, foto e dados cadastrais no painel de perfil.</li>
                  <li>Você pode reiniciar seu histórico ("Zerar Perfil") ou solicitar a exclusão definitiva da conta.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  <span>4. Contato e Encarregado de Dados</span>
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
                  Para dúvidas sobre esta política ou solicitações sobre seus dados, entre em contato através das configurações do aplicativo ou pelo e-mail do desenvolvedor.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-950/80 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-zinc-500 hidden sm:block">
            Treino Home • Segurança e Privacidade Garantidas
          </div>
          <button
            onClick={onClose}
            id="accept-terms-close-btn"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:opacity-90 text-black font-extrabold text-xs transition-all shadow-md shadow-lime-500/20"
          >
            Entendido e Concordo
          </button>
        </div>
      </div>
    </div>
  );
};
