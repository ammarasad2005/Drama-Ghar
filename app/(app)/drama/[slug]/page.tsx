"use client";
import React, { Suspense, use } from 'react';
import { useRouter } from 'next/navigation';
import DramaDetailScreen from '@/components/screens/DramaDetailScreen';
import { useUser } from '@/context/UserContext';

function PageContent({ slug }: { slug: string }) {
  const router = useRouter();
  const { user } = useUser();

  const handleNavigate = (screen: string, navParams?: any) => {
    const urlParams = new URLSearchParams();
    if (navParams) Object.keys(navParams).forEach(k => urlParams.set(k, navParams[k]));
    const path = screen === 'drama' && navParams?.slug ? `/drama/${navParams.slug}` : `/${screen}`;
    router.push(`${path}${urlParams.toString() ? `?${urlParams.toString()}` : ''}`);
  };

  return <DramaDetailScreen onNavigate={handleNavigate} user={user} slug={slug} />;
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <PageContent slug={resolvedParams.slug} />
    </Suspense>
  );
}
