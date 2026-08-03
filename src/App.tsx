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
import { useAppStore } from './lib/store';

export default function App() {
  const [state] = useAppStore();
  const { isLoggedIn, settings } = state;

  const [currentTab, setCurrentTab] = useState<string>(isLoggedIn ? 'dashboard' : 'landing');
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' | 'recovery' }>({
    isOpen: false,
    mode: 'login'
  });
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileSetupOpen, setProfileSetupOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn && currentTab === 'landing') {
      setCurrentTab('dashboard');
    } else if (!isLoggedIn && currentTab !== 'landing') {
      setCurrentTab('landing');
    }
  }, [isLoggedIn]);

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

  return (
    <div className={`min-h-screen ${settings.tema === 'light' ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-950 text-zinc-100'} font-sans antialiased selection:bg-emerald-500 selection:text-zinc-950 transition-colors`}>
      {/* Offline & PWA Banner */}
      <PWAPrompt />

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAuth={handleOpenAuth}
        onOpenNotifications={() => setNotificationsOpen(true)}
      />

      {/* Main Screen Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {!isLoggedIn && currentTab === 'landing' && (
          <LandingPage onOpenAuth={handleOpenAuth} />
        )}

        {isLoggedIn && currentTab === 'dashboard' && (
          <Dashboard onSelectTab={setCurrentTab} />
        )}

        {isLoggedIn && currentTab === 'workout' && (
          <WorkoutScreen onSelectTab={setCurrentTab} />
        )}

        {isLoggedIn && currentTab === 'evolution' && (
          <GamificationPath onSelectTab={setCurrentTab} />
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
          <SettingsView onOpenProfileSetup={() => setProfileSetupOpen(true)} />
        )}
      </main>

      {/* Overlays and Modals */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
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
