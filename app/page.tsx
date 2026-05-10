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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [user, setUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  // For Reset Password Flow
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState<string | null>(null);

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
        return <HomeScreen />;
      case 'schedule':
        return <ScheduleScreen />;
      case 'watchlist':
        return <WatchlistScreen />;
      case 'channels':
        return <ChannelsScreen />;
      case 'continue':
        return <ContinueWatchingScreen />;
      case 'reminders':
        return <RemindersScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'settings':
        return <SettingsScreen />;
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
        <Header />
        {renderScreen()}
      </div>
    </div>
  );
}
