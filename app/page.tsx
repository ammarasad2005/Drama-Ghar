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
import ExploreScreen from '@/components/screens/ExploreScreen';
import DramaDetailScreen from '@/components/screens/DramaDetailScreen';
import { ForgotPasswordScreen } from '@/components/screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '@/components/screens/ResetPasswordScreen';
import { AboutScreen } from '@/components/screens/AboutScreen';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [user, setUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState('All Channels');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // For Reset Password Flow
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState<string | null>(null);
  const [dramaSlug, setDramaSlug] = useState<string | null>(null);
  const [exploreParams, setExploreParams] = useState<any>(null);

  const navigateToSchedule = (channel?: string) => {
    setSelectedChannel(channel || 'All Channels');
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
      <LoginScreen 
        onLogin={checkAuth} 
        onForgotPassword={() => setCurrentScreen('forgot_password')} 
      />
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

  const handleNavigate = (screen: string, params?: any) => {
    if (params?.slug) {
      setDramaSlug(params.slug);
    }
    // Correctly handle navigation params for explore/schedule
    if (screen === 'explore' || screen === 'schedule') {
      setExploreParams(params);
      if (params?.channel) {
        setSelectedChannel(params.channel);
      }
    }
    setCurrentScreen(screen);
    setIsSidebarOpen(false);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen user={user} onNavigate={handleNavigate} onChannelClick={navigateToSchedule} />;
      case 'schedule':
        return <ScheduleScreen onNavigate={handleNavigate} initialChannel={selectedChannel} />;
      case 'watchlist':
        return <WatchlistScreen onNavigate={handleNavigate} />;
      case 'explore':
        return <ExploreScreen onNavigate={handleNavigate} initialParams={exploreParams} />;
      case 'drama':
        return <DramaDetailScreen slug={dramaSlug || ''} onNavigate={handleNavigate} user={user} />;
      case 'channels':
        return <ChannelsScreen onNavigate={handleNavigate} onChannelClick={navigateToSchedule} />;
      case 'continue':
        return <ContinueWatchingScreen onNavigate={handleNavigate} />;
      case 'reminders':
        return <RemindersScreen onNavigate={handleNavigate} />;
      case 'history':
        return <HistoryScreen onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsScreen user={user} onNavigate={handleNavigate} />;
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
    <div className="flex h-screen bg-[#F9FAFB] dark:bg-[#050505] overflow-hidden">
      <Sidebar 
        currentTab={currentScreen} 
        onTabChange={handleNavigate} 
        user={user} 
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col lg:ml-64 overflow-hidden relative">
        <Header 
          user={user} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout} 
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <div className="flex-1 overflow-hidden flex flex-col">
          {renderScreen()}
          
          <footer className="shrink-0 border-t border-gray-100 dark:border-neutral-900 bg-white dark:bg-[#0a0a0a] px-4 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-gray-400 gap-4 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-[10px]">
              <span>© 2026 DramaGhar. All rights reserved.</span>
              <div className="flex gap-4">
                <button onClick={() => setCurrentScreen('about')} className="hover:text-emerald-700 transition-colors">About</button>
                <button onClick={() => setCurrentScreen('about')} className="hover:text-emerald-700 transition-colors">Privacy</button>
                <button onClick={() => setCurrentScreen('about')} className="hover:text-emerald-700 transition-colors">Contact</button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3">
                <a href="#" className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-emerald-600 transition-colors"><Facebook size={14} /></a>
                <a href="#" className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-emerald-600 transition-colors"><Twitter size={14} /></a>
                <a href="#" className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-emerald-600 transition-colors"><Instagram size={14} /></a>
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                <span>Data sourced from</span>
                <a href="https://pakdrama.pk" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold hover:underline">pakdrama.pk</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
