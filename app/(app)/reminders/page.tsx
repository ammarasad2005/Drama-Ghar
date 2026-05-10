"use client";
import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RemindersScreen } from '@/components/screens/RemindersScreen';
import { useUser } from '@/context/UserContext';

function PageContent({ params }: { params?: any }) {
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

  return <RemindersScreen onNavigate={handleNavigate} user={user} initialParams={initialParams} {...params}  />;
}

export default function Page({ params }: { params?: any }) {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <PageContent params={params} />
    </Suspense>
  );
}
