'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { usePathname, useRouter } from 'next/navigation';
import { Facebook, Instagram, Twitter, Loader2 } from 'lucide-react';
import { UserProvider, useUser } from '@/context/UserContext';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Derive current tab from pathname
  const currentTab = pathname.split('/')[1] || 'home';

  const handleNavigate = (screen: string, params?: any) => {
    setIsSidebarOpen(false);
    const urlParams = new URLSearchParams();
    if (params) {
      Object.keys(params).forEach(k => urlParams.set(k, params[k]));
    }
    const path = screen === 'drama' && params?.slug ? `/drama/${params.slug}` : `/${screen}`;
    router.push(`${path}${urlParams.toString() ? `?${urlParams.toString()}` : ''}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F9FAFB] dark:bg-[#050505]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F9FAFB] dark:bg-[#050505] overflow-hidden">
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={handleNavigate} 
        user={user} 
        onLogout={logout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col lg:ml-64 overflow-hidden relative">
        <Header 
          user={user} 
          onNavigate={handleNavigate} 
          onLogout={logout} 
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <div className="flex-1 overflow-hidden flex flex-col">
          {children}
          
          <footer className="shrink-0 border-t border-gray-100 dark:border-neutral-900 bg-white dark:bg-[#0a0a0a] px-4 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-gray-400 gap-4 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-[10px]">
              <span>© 2026 DramaGhar. All rights reserved.</span>
              <div className="flex gap-4">
                <button onClick={() => router.push('/about')} className="hover:text-emerald-700 transition-colors">About</button>
                <button onClick={() => router.push('/about')} className="hover:text-emerald-700 transition-colors">Privacy</button>
                <button onClick={() => router.push('/about')} className="hover:text-emerald-700 transition-colors">Contact</button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3">
                <a href="#" className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-emerald-600 transition-colors"><Facebook size={14} /></a>
                <a href="#" className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-emerald-600 transition-colors"><Twitter size={14} /></a>
                <a href="#" className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-emerald-600 transition-colors"><Instagram size={14} /></a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayoutContent>{children}</AppLayoutContent>
  );
}
