import React from 'react';
import { 
  Dumbbell, 
  Flame, 
  Trophy, 
  Zap, 
  User as UserIcon, 
  Moon, 
  Sun, 
  LogOut,
  Calendar,
  BarChart3,
  Award,
  Settings,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { useAppStore } from '../lib/store';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuth,
  onOpenNotifications,
}) => {
  const [state, actions] = useAppStore();
  const { user, isLoggedIn, progress, settings } = state;

  const currentLevel = progress.level;
  const currentXp = progress.xp;
  const xpForNextLevel = currentLevel * 500;
  const currentLevelBaseXp = (currentLevel - 1) * 500;
  const levelProgress = Math.min(
    100,
    Math.max(0, Math.round(((currentXp - currentLevelBaseXp) / 500) * 100))
  );

  const toggleTheme = () => {
    const nextTheme = settings.tema === 'dark' ? 'light' : 'dark';
    actions.updateSettings({ tema: nextTheme });
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 text-zinc-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => onSelectTab(isLoggedIn ? 'dashboard' : 'landing')}
            className="flex items-center space-x-3 cursor-pointer group"
            id="brand-logo-btn"
          >
            <div className="w-10 h-10 rounded-xl bg-lime-400 p-0.5 shadow-lg shadow-lime-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-zinc-950 stroke-[2.5] group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Treino Home
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-lime-400/10 text-lime-400 font-bold border border-lime-500/20">
                Pro
              </span>
            </div>
          </div>

          {/* Logged In Stats Bar */}
          {isLoggedIn ? (
            <div className="hidden md:flex items-center space-x-6">
              {/* Level & XP */}
              <div className="flex items-center space-x-3 bg-zinc-900/90 border border-zinc-800 rounded-full px-4 py-1.5">
                <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs">
                  <Trophy className="w-4 h-4 fill-amber-400/20" />
                  <span>Nível {currentLevel}</span>
                </div>
                <div className="w-24 bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-lime-400 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-400 font-semibold">{currentXp} XP</span>
              </div>

              {/* Streak */}
              <div className="flex items-center space-x-1.5 bg-lime-500/10 border border-lime-500/20 px-3 py-1.5 rounded-full text-lime-400 font-bold text-xs">
                <Flame className="w-4 h-4 text-lime-400 fill-lime-400/20 animate-pulse" />
                <span>{progress.sequencia_dias} dias</span>
              </div>

              {/* Navigation Links */}
              <nav className="flex items-center space-x-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'workout', label: 'Treinos', icon: Dumbbell },
                  { id: 'evolution', label: 'Evolução', icon: Zap },
                  { id: 'calendar', label: 'Calendário', icon: Calendar },
                  { id: 'achievements', label: 'Conquistas', icon: Award },
                  { id: 'settings', label: 'Ajustes', icon: Settings }
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      id={`nav-link-${item.id}`}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive 
                          ? 'bg-zinc-900 text-lime-400 border border-lime-500/30 font-bold' 
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 border-l border-zinc-800 pl-4">
                <button
                  onClick={onOpenNotifications}
                  id="notifications-btn"
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors relative"
                  title="Notificações diárias"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-lime-400 animate-ping" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-lime-400" />
                </button>

                <button
                  onClick={toggleTheme}
                  id="theme-toggle-btn"
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
                  title="Alternar tema"
                >
                  {settings.tema === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                </button>

                {/* Profile Pill */}
                <div 
                  onClick={() => onSelectTab('settings')}
                  className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full pl-1.5 pr-3 py-1 cursor-pointer transition-colors"
                  id="profile-pill-btn"
                >
                  {user?.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.name} 
                      className="w-6 h-6 rounded-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-lime-400 text-zinc-950 flex items-center justify-center font-bold text-xs">
                      {user?.name?.[0] || 'A'}
                    </div>
                  )}
                  <span className="text-xs font-medium text-zinc-200">{user?.name}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                id="theme-toggle-btn-landing"
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
              >
                {settings.tema === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              </button>

              <button
                onClick={() => onOpenAuth('login')}
                id="landing-login-btn"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
              >
                Entrar
              </button>

              <button
                onClick={() => onOpenAuth('signup')}
                id="landing-signup-btn"
                className="px-5 py-2 rounded-xl text-xs font-extrabold text-black bg-lime-400 hover:bg-lime-300 shadow-md shadow-lime-500/20 transition-all"
              >
                Criar Conta
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {isLoggedIn && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800 px-2 py-2">
          <div className="flex justify-around items-center">
            {[
              { id: 'dashboard', label: 'Início', icon: BarChart3 },
              { id: 'workout', label: 'Treino', icon: Dumbbell },
              { id: 'evolution', label: 'Evolução', icon: Zap },
              { id: 'calendar', label: 'Agenda', icon: Calendar },
              { id: 'achievements', label: 'Conquistas', icon: Award },
              { id: 'settings', label: 'Perfil', icon: Settings }
            ].map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  id={`mobile-tab-${item.id}`}
                  className={`flex flex-col items-center justify-center w-full py-1 rounded-xl text-[10px] font-semibold transition-all ${
                    isActive ? 'text-lime-400 bg-lime-400/10' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'scale-110 text-lime-400' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
