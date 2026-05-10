"use client";
import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ContinueWatchingScreen } from '@/components/screens/ContinueWatchingScreen';
import { useUser } from '@/context/UserContext';

function PageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const handleNavigate = (screen: string, navParams?: any) => {
    const urlParams = new URLSearchParams();
    if (navParams) Object.keys(navParams).forEach(k => urlParams.set(k, navParams[k]));
    const path = screen === 'drama' && navParams?.slug ? `/drama/${navParams.slug}` : `/${screen}`;
    router.push(`${path}${urlParams.toString() ? `?${urlParams.toString()}` : ''}`);
  };

  // Convert searchParams to an object
  const initialParams: any = {};
  searchParams.forEach((value, key) => {
    initialParams[key] = value;
  });

  return <ContinueWatchingScreen onNavigate={handleNavigate}  />;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
