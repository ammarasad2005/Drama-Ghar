'use client';

import React, { useState } from 'react';
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');

  if (currentScreen === 'login') {
    return <LoginScreen onLogin={() => setCurrentScreen('home')} />;
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
      <Sidebar currentTab={currentScreen} onTabChange={setCurrentScreen} />
      
      <div className="flex-1 flex flex-col ml-64 overflow-hidden relative">
        <Header />
        {renderScreen()}
      </div>
    </div>
  );
}
