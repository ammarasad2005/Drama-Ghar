"use client";

import { useRouter } from 'next/navigation';
import { LoginScreen } from '@/components/screens/LoginScreen';
import { useUser } from '@/context/UserContext';
import { Suspense, useEffect } from 'react';

function LoginPageContent() {
  const router = useRouter();
  const { user, checkAuth } = useUser();

  useEffect(() => {
    if (user) {
      router.push('/home');
    }
  }, [user, router]);

  const handleLogin = async () => {
    await checkAuth();
    router.push('/home');
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return <LoginScreen onLogin={handleLogin} onForgotPassword={handleForgotPassword} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0a1f18]">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
