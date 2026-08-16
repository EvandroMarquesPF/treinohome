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
import { BrandLogo } from './BrandLogo';

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
    <header className="sticky top-0 z-50 bg-white/95 text-zinc-900 border-b border-zinc-200/90 dark:bg-zinc-950/95 dark:border-zinc-800/90 dark:text-zinc-100 backdrop-blur-xl transition-colors shadow-sm dark:shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => onSelectTab(isLoggedIn ? 'dashboard' : 'landing')}
            className="flex items-center space-x-2.5 cursor-pointer group shrink-0"
            id="brand-logo-btn"
          >
            <BrandLogo size="md" className="group-hover:scale-105 transition-transform shrink-0" />
            <div className="flex flex-col">
              <span className="font-black text-base sm:text-xl tracking-tight text-zinc-900 dark:text-white flex items-center space-x-1">
                <span>Treino Home</span>
              </span>
            </div>
          </div>

          {/* Logged In Stats & Controls */}
          {isLoggedIn ? (
            <>
              {/* Desktop Nav and Stats */}
              <div className="hidden md:flex items-center space-x-5">
                {/* Level & XP */}
                <div className="flex items-center space-x-2.5 bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-full px-3.5 py-1.5 shadow-inner">
                  <div className="flex items-center space-x-1.5 text-amber-500 dark:text-amber-400 font-bold text-xs">
                    <Trophy className="w-4 h-4 fill-amber-400/20" />
                    <span>Nível {currentLevel}</span>
                  </div>
                  <div className="w-20 bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-lime-500 to-emerald-500 dark:from-lime-400 dark:to-emerald-400 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${levelProgress}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">{currentXp} XP</span>
                </div>

                {/* Streak */}
                <div className="flex items-center space-x-1.5 bg-lime-500/15 border border-lime-500/30 dark:bg-lime-500/10 dark:border-lime-500/20 px-3 py-1.5 rounded-full text-lime-700 dark:text-lime-400 font-bold text-xs">
                  <Flame className="w-4 h-4 text-lime-600 dark:text-lime-400 fill-lime-400/20 animate-pulse" />
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
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isActive 
                            ? 'bg-lime-400/20 text-lime-800 border border-lime-500/30 dark:bg-zinc-900 dark:text-lime-400 dark:border-lime-500/30 shadow-sm font-extrabold' 
                            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900/60'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 border-l border-zinc-200 dark:border-zinc-800 pl-3">
                  <button
                    onClick={onOpenNotifications}
                    id="notifications-btn"
                    className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-800 transition-colors relative group"
                    title="Notificações diárias"
                  >
                    <Bell className="w-4 h-4" />
                    <div className="absolute -bottom-0.5 left-1.5 right-1.5 h-0.5 bg-gradient-to-r from-lime-500 to-emerald-500 dark:from-lime-400 dark:to-emerald-400 rounded-full animate-pulse shadow-sm shadow-lime-400/40" />
                  </button>

                  <button
                    onClick={toggleTheme}
                    id="theme-toggle-btn"
                    className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-800 transition-colors"
                    title="Alternar tema"
                  >
                    {settings.tema === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                  </button>

                  {/* Profile Pill */}
                  <div 
                    onClick={() => onSelectTab('settings')}
                    className="flex items-center space-x-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200 rounded-full pl-1.5 pr-3 py-1 cursor-pointer transition-colors"
                    id="profile-pill-btn"
                  >
                    {user?.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.name} 
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-zinc-300 dark:ring-zinc-700" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-lime-400 text-zinc-950 flex items-center justify-center font-black text-xs">
                        {user?.name?.[0] || 'A'}
                      </div>
                    )}
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-24">{user?.name}</span>
                  </div>
                </div>
              </div>

              {/* Mobile Header Quick Actions */}
              <div className="flex md:hidden items-center space-x-1.5">
                <div className="flex items-center space-x-1 bg-lime-500/15 border border-lime-500/30 dark:bg-lime-500/10 dark:border-lime-500/20 px-2 py-1 rounded-full text-lime-700 dark:text-lime-400 font-extrabold text-[11px]">
                  <Flame className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 fill-lime-400/20 animate-pulse" />
                  <span>{progress.sequencia_dias}d</span>
                </div>

                <button
                  onClick={onOpenNotifications}
                  id="notifications-mobile-btn"
                  className="p-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 relative"
                  title="Notificações"
                >
                  <Bell className="w-4 h-4" />
                  <div className="absolute -bottom-0.5 left-1.5 right-1.5 h-0.5 bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full animate-pulse" />
                </button>

                <button
                  onClick={toggleTheme}
                  id="theme-mobile-toggle-btn"
                  className="p-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300"
                >
                  {settings.tema === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                </button>

                <div 
                  onClick={() => onSelectTab('settings')}
                  className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Perfil" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-[10px] font-black text-lime-600 dark:text-lime-400">{user?.name?.[0] || 'A'}</span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                id="theme-toggle-btn-landing"
                className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-800 transition-colors"
              >
                {settings.tema === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              </button>

              <button
                onClick={() => onOpenAuth('login')}
                id="landing-login-btn"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors"
              >
                Entrar
              </button>

              <button
                onClick={() => onOpenAuth('signup')}
                id="landing-signup-btn"
                className="px-4 py-1.5 rounded-xl text-xs font-extrabold text-black bg-lime-400 hover:bg-lime-300 shadow-md shadow-lime-500/20 transition-all"
              >
                Criar Conta
              </button>
            </div>
          )}
        </div>

        {/* Mobile Fixed Top Navigation Menu Bar */}
        {isLoggedIn && (
          <div className="md:hidden py-2 border-t border-zinc-200/80 dark:border-zinc-800/80 overflow-x-auto scrollbar-none">
            <div className="flex items-center justify-start sm:justify-center space-x-1.5 min-w-max px-1">
              {[
                { id: 'dashboard', label: 'Início', icon: BarChart3 },
                { id: 'workout', label: 'Treino', icon: Dumbbell },
                { id: 'evolution', label: 'Evolução', icon: Zap },
                { id: 'calendar', label: 'Agenda', icon: Calendar },
                { id: 'achievements', label: 'Conquistas', icon: Award },
                { id: 'settings', label: 'Ajustes', icon: Settings }
              ].map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    id={`mobile-top-tab-${item.id}`}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-lime-400 text-black shadow-sm font-black' 
                        : 'bg-zinc-100 text-zinc-700 border border-zinc-200 hover:text-zinc-900 dark:bg-zinc-900/90 dark:text-zinc-400 dark:border-zinc-800/80 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-zinc-500 dark:text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
