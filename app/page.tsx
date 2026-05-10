'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { LoginScreen } from '@/components/screens/LoginScreen';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { ScheduleScreen } from '@/components/screens/ScheduleScreen';
import { WatchlistScreen } from '@/components/screens/WatchlistScreen';
import { ChannelsScreen } from '@/components/screens/ChannelsScreen';
import { ContinueWatchingScreen } from '@/components/screens/ContinueWatchingScreen';
import { RemindersScreen } from '@/components/screens/RemindersScreen';
import { HistoryScreen } from '@/components/screens/HistoryScreen';
import { SettingsScreen } from '@/components/screens/SettingsScreen';
import { AdminScreen } from '@/components/screens/AdminScreen';
import { ForgotPasswordScreen } from '@/components/screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '@/components/screens/ResetPasswordScreen';
import { AboutScreen } from '@/components/screens/AboutScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [user, setUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState('All Channels');
  
  // For Reset Password Flow
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState<string | null>(null);

  const navigateToSchedule = (channel: string) => {
    setSelectedChannel(channel);
    setCurrentScreen('schedule');
  };

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setCurrentScreen('home');
      } else {
        setUser(null);
        setCurrentScreen('login');
      }
    } catch (err) {
      setUser(null);
      setCurrentScreen('login');
    } finally {
      setIsAuthChecking(false);
    }
  };

  useEffect(() => {
    // Check URL parameters for password reset
    const params = new URLSearchParams(window.location.search);
    const token = params.get('resetToken');
    const email = params.get('email');
    
    if (token && email) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResetToken(token);
      setResetEmail(email);
      setCurrentScreen('reset_password');
      setIsAuthChecking(false);
      return;
    }

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setCurrentScreen('login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (isAuthChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (currentScreen === 'login') {
    return (
      <LoginScreen 
        onLogin={checkAuth} 
        onForgotPassword={() => setCurrentScreen('forgot_password')} 
      />
    );
  }

  if (currentScreen === 'forgot_password') {
    return <ForgotPasswordScreen onBackToLogin={() => setCurrentScreen('login')} />;
  }

  if (currentScreen === 'reset_password' && resetToken && resetEmail) {
    return (
      <ResetPasswordScreen 
        email={resetEmail} 
        token={resetToken} 
        onSuccess={() => {
          // Clear URL params
          window.history.replaceState({}, document.title, window.location.pathname);
          setCurrentScreen('login');
        }} 
      />
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen user={user} onNavigate={setCurrentScreen} onChannelClick={navigateToSchedule} />;
      case 'schedule':
        return <ScheduleScreen onNavigate={setCurrentScreen} initialChannel={selectedChannel} />;
      case 'watchlist':
        return <WatchlistScreen onNavigate={setCurrentScreen} />;
      case 'channels':
        return <ChannelsScreen onNavigate={setCurrentScreen} onChannelClick={navigateToSchedule} />;
      case 'continue':
        return <ContinueWatchingScreen onNavigate={setCurrentScreen} />;
      case 'reminders':
        return <RemindersScreen onNavigate={setCurrentScreen} />;
      case 'history':
        return <HistoryScreen onNavigate={setCurrentScreen} />;
      case 'settings':
        return <SettingsScreen user={user} onNavigate={setCurrentScreen} />;
      case 'about':
        return <AboutScreen />;
      case 'admin':
        return user?.role === 'admin' ? <AdminScreen /> : (
          <div className="flex-1 flex items-center justify-center text-red-500">Access Denied</div>
        );
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Current Screen: {currentScreen} (Not Implemented)
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      <Sidebar 
        currentTab={currentScreen} 
        onTabChange={setCurrentScreen} 
        user={user} 
        onLogout={handleLogout} 
      />
      
      <div className="flex-1 flex flex-col ml-64 overflow-hidden relative">
        <Header user={user} onNavigate={setCurrentScreen} onLogout={handleLogout} />
        <div className="flex-1 overflow-hidden flex flex-col">
          {renderScreen()}
          
          <footer className="shrink-0 border-t border-gray-100 bg-white dark:bg-[#0a0a0a] px-8 py-4 flex items-center justify-between text-[10px] text-gray-400">
            <div className="flex items-center gap-4">
              <span>© 2026 DramaGhar</span>
              <button onClick={() => setCurrentScreen('about')} className="hover:text-emerald-700 transition-colors">About</button>
              <button onClick={() => setCurrentScreen('about')} className="hover:text-emerald-700 transition-colors">Privacy</button>
              <button onClick={() => setCurrentScreen('about')} className="hover:text-emerald-700 transition-colors">Contact</button>
            </div>
            <div className="flex items-center gap-1">
              <span>Data sourced from</span>
              <a href="https://pakdrama.pk" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold hover:underline">pakdrama.pk</a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
