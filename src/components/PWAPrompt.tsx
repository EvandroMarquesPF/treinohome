import React, { useState, useEffect } from 'react';
import { Smartphone, Download, CheckCircle2, WifiOff } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const PWAPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Offline Alert Bar */}
      {isOffline && (
        <div className="bg-amber-500 text-zinc-950 font-bold text-xs py-1.5 px-4 text-center flex items-center justify-center space-x-2">
          <WifiOff className="w-4 h-4" />
          <span>Você está no Modo Offline. Seus treinos serão salvos localmente e sincronizados.</span>
        </div>
      )}

      {/* PWA Install Banner */}
      {showBanner && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 left-4 sm:left-auto sm:max-w-sm z-50 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-lime-500/40 text-zinc-900 dark:text-zinc-100 shadow-2xl space-y-3 animate-fade-in transition-colors">
          <div className="flex items-center space-x-3">
            <BrandLogo size="md" />
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-white">Instalar o Treino Home</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">Instale o app na tela inicial para acesso rápido e offline!</div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowBanner(false)}
              className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-950 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              Depois
            </button>
            <button
              onClick={handleInstall}
              className="px-4 py-1.5 rounded-xl bg-lime-400 text-black text-xs font-extrabold flex items-center space-x-1 hover:bg-lime-300 transition-colors shadow-md shadow-lime-500/20 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar PWA</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
