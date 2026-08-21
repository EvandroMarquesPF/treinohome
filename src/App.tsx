import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { WorkoutScreen } from './components/WorkoutScreen';
import { GamificationPath } from './components/GamificationPath';
import { CalendarView } from './components/CalendarView';
import { AchievementsView } from './components/AchievementsView';
import { StatisticsView } from './components/StatisticsView';
import { SettingsView } from './components/SettingsView';
import { AuthModal } from './components/AuthModal';
import { ProfileSetupModal } from './components/ProfileSetupModal';
import { NotificationsModal } from './components/NotificationsModal';
import { SmartTimerModal } from './components/SmartTimerModal';
import { LevelUpModal } from './components/LevelUpModal';
import { PhaseCompleteModal } from './components/PhaseCompleteModal';
import { PWAPrompt } from './components/PWAPrompt';
import { TermsAndPrivacyModal } from './components/TermsAndPrivacyModal';
import { TermsPage } from './components/TermsPage';
import { PrivacyPage } from './components/PrivacyPage';
import { useAppStore } from './lib/store';

export default function App() {
  const [state] = useAppStore();
  const { isLoggedIn, settings } = state;

  // Detect initial route from URL path or hash
  const getInitialTab = (): string => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      const hash = window.location.hash.toLowerCase();
      if (path === '/termos' || path === '/termos-de-uso' || hash === '#termos' || hash === '#/termos') {
        return 'terms';
      }
      if (path === '/politicas' || path === '/politica' || path === '/privacidade' || path === '/politica-de-privacidade' || hash === '#politicas' || hash === '#privacidade' || hash === '#/politicas') {
        return 'privacy';
      }
    }
    return isLoggedIn ? 'dashboard' : 'landing';
  };

  const [currentTab, setCurrentTab] = useState<string>(getInitialTab);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' | 'recovery' }>({
    isOpen: false,
    mode: 'login'
  });
  
  const [termsModal, setTermsModal] = useState<{ isOpen: boolean; defaultTab: 'terms' | 'privacy' }>({
    isOpen: false,
    defaultTab: 'terms'
  });
  
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileSetupOpen, setProfileSetupOpen] = useState(false);

  // Sync browser URL history on popstate (Back/Forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      const hash = window.location.hash.toLowerCase();
      if (path === '/termos' || path === '/termos-de-uso' || hash === '#termos' || hash === '#/termos') {
        setCurrentTab('terms');
      } else if (path === '/politicas' || path === '/politica' || path === '/privacidade' || path === '/politica-de-privacidade' || hash === '#politicas' || hash === '#privacidade' || hash === '#/politicas') {
        setCurrentTab('privacy');
      } else if (isLoggedIn) {
        setCurrentTab('dashboard');
      } else {
        setCurrentTab('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && currentTab === 'landing') {
      setCurrentTab('dashboard');
      // Clean auth hash or code from URL if present
      if (typeof window !== 'undefined' && (window.location.hash.includes('access_token') || window.location.search.includes('code='))) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } else if (!isLoggedIn && currentTab !== 'landing' && currentTab !== 'terms' && currentTab !== 'privacy') {
      setCurrentTab('landing');
    }
  }, [isLoggedIn]);

  // Prompt onboarding / athlete assessment on first access if not completed
  useEffect(() => {
    if (isLoggedIn && state.user && state.user.onboarding_completed === false) {
      setProfileSetupOpen(true);
    }
  }, [isLoggedIn, state.user?.onboarding_completed]);

  // Handle theme application
  useEffect(() => {
    if (settings.tema === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [settings.tema]);

  const handleOpenAuth = (mode: 'login' | 'signup' | 'recovery') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleOpenTerms = () => {
    if (authModal.isOpen) {
      setTermsModal({ isOpen: true, defaultTab: 'terms' });
    } else {
      if (typeof window !== 'undefined' && window.location.pathname !== '/termos') {
        window.history.pushState({ tab: 'terms' }, '', '/termos');
      }
      setCurrentTab('terms');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenPrivacy = () => {
    if (authModal.isOpen) {
      setTermsModal({ isOpen: true, defaultTab: 'privacy' });
    } else {
      if (typeof window !== 'undefined' && window.location.pathname !== '/politicas') {
        window.history.pushState({ tab: 'privacy' }, '', '/politicas');
      }
      setCurrentTab('privacy');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectTab = (tab: string) => {
    if (typeof window !== 'undefined' && (window.location.pathname === '/termos' || window.location.pathname === '/politicas' || window.location.pathname === '/privacidade')) {
      window.history.pushState({}, '', '/');
    }
    setCurrentTab(tab);
  };

  const handleLegalBack = () => {
    if (typeof window !== 'undefined' && (window.location.pathname === '/termos' || window.location.pathname === '/politicas' || window.location.pathname === '/privacidade')) {
      window.history.pushState({}, '', '/');
    }
    setCurrentTab(isLoggedIn ? 'settings' : 'landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${settings.tema === 'light' ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-950 text-zinc-100'} font-sans antialiased selection:bg-lime-400 selection:text-black transition-colors`}>
      {/* Offline & PWA Banner */}
      <PWAPrompt />

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenAuth={handleOpenAuth}
        onOpenNotifications={() => setNotificationsOpen(true)}
      />

      {/* Main Screen Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 md:pb-12">
        {!isLoggedIn && currentTab === 'landing' && (
          <LandingPage 
            onOpenAuth={handleOpenAuth} 
            onOpenTerms={handleOpenTerms}
            onOpenPrivacy={handleOpenPrivacy}
          />
        )}

        {currentTab === 'terms' && (
          <TermsPage 
            onBack={handleLegalBack}
            onOpenPrivacy={handleOpenPrivacy}
          />
        )}

        {currentTab === 'privacy' && (
          <PrivacyPage 
            onBack={handleLegalBack}
            onOpenTerms={handleOpenTerms}
          />
        )}

        {isLoggedIn && currentTab === 'dashboard' && (
          <Dashboard onSelectTab={handleSelectTab} />
        )}

        {isLoggedIn && currentTab === 'workout' && (
          <WorkoutScreen onSelectTab={handleSelectTab} />
        )}

        {isLoggedIn && currentTab === 'evolution' && (
          <GamificationPath onSelectTab={handleSelectTab} />
        )}

        {isLoggedIn && currentTab === 'calendar' && (
          <CalendarView />
        )}

        {isLoggedIn && currentTab === 'achievements' && (
          <AchievementsView />
        )}

        {isLoggedIn && currentTab === 'statistics' && (
          <StatisticsView />
        )}

        {isLoggedIn && currentTab === 'settings' && (
          <SettingsView 
            onOpenProfileSetup={() => setProfileSetupOpen(true)} 
            onOpenTerms={handleOpenTerms}
            onOpenPrivacy={handleOpenPrivacy}
          />
        )}
      </main>

      {/* Overlays and Modals */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        onOpenTerms={(tab) => {
          if (tab === 'terms') handleOpenTerms();
          else handleOpenPrivacy();
        }}
      />

      <TermsAndPrivacyModal
        isOpen={termsModal.isOpen}
        defaultTab={termsModal.defaultTab}
        onClose={() => setTermsModal({ ...termsModal, isOpen: false })}
      />

      <ProfileSetupModal
        isOpen={profileSetupOpen}
        onClose={() => setProfileSetupOpen(false)}
      />

      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      <SmartTimerModal />
      <LevelUpModal />
      <PhaseCompleteModal />
    </div>
  );
}
