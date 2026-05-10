const fs = require('fs');

const generatePage = (dir, componentName, importPath, extraProps = '') => {
  const content = `"use client";
import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ${componentName} } from '${importPath}';
import { useUser } from '@/context/UserContext';

function PageContent({ params }: { params?: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const handleNavigate = (screen: string, navParams?: any) => {
    const urlParams = new URLSearchParams();
    if (navParams) Object.keys(navParams).forEach(k => urlParams.set(k, navParams[k]));
    const path = screen === 'drama' && navParams?.slug ? \`/drama/\${navParams.slug}\` : \`/\${screen}\`;
    router.push(\`\${path}\${urlParams.toString() ? \`?\${urlParams.toString()}\` : ''}\`);
  };

  // Convert searchParams to an object
  const initialParams: any = {};
  searchParams.forEach((value, key) => {
    initialParams[key] = value;
  });

  return <${componentName} onNavigate={handleNavigate} user={user} initialParams={initialParams} {...params} ${extraProps} />;
}

export default function Page({ params }: { params?: any }) {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <PageContent params={params} />
    </Suspense>
  );
}
`;
  fs.writeFileSync(dir + '/page.tsx', content);
};

generatePage('app/(app)/home', 'HomeScreen', '@/components/screens/HomeScreen', 'onChannelClick={(c: string) => { window.location.href = `/schedule?channel=${c}`; }}');
generatePage('app/(app)/schedule', 'ScheduleScreen', '@/components/screens/ScheduleScreen', 'initialChannel={searchParams.get("channel") || "All Channels"}');
// ExploreScreen is default export, handle specially later
// DramaDetailScreen is default export
generatePage('app/(app)/channels', 'ChannelsScreen', '@/components/screens/ChannelsScreen', 'onChannelClick={(c: string) => { window.location.href = `/schedule?channel=${c}`; }}');
generatePage('app/(app)/watchlist', 'WatchlistScreen', '@/components/screens/WatchlistScreen');
generatePage('app/(app)/history', 'HistoryScreen', '@/components/screens/HistoryScreen');
generatePage('app/(app)/reminders', 'RemindersScreen', '@/components/screens/RemindersScreen');
generatePage('app/(app)/continue', 'ContinueWatchingScreen', '@/components/screens/ContinueWatchingScreen');
generatePage('app/(app)/settings', 'SettingsScreen', '@/components/screens/SettingsScreen');
generatePage('app/(app)/admin', 'AdminScreen', '@/components/screens/AdminScreen');

// ExploreScreen (default export)
const exploreContent = `"use client";
import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ExploreScreen from '@/components/screens/ExploreScreen';
import { useUser } from '@/context/UserContext';

function PageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const handleNavigate = (screen: string, navParams?: any) => {
    const urlParams = new URLSearchParams();
    if (navParams) Object.keys(navParams).forEach(k => urlParams.set(k, navParams[k]));
    const path = screen === 'drama' && navParams?.slug ? \`/drama/\${navParams.slug}\` : \`/\${screen}\`;
    router.push(\`\${path}\${urlParams.toString() ? \`?\${urlParams.toString()}\` : ''}\`);
  };

  // Convert searchParams to an object
  const initialParams: any = {};
  searchParams.forEach((value, key) => {
    initialParams[key] = value;
  });

  return <ExploreScreen onNavigate={handleNavigate} initialParams={initialParams} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
`;
fs.writeFileSync('app/(app)/explore/page.tsx', exploreContent);

// DramaDetailScreen (default export)
const dramaContent = `"use client";
import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import DramaDetailScreen from '@/components/screens/DramaDetailScreen';
import { useUser } from '@/context/UserContext';

function PageContent({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { user } = useUser();

  const handleNavigate = (screen: string, navParams?: any) => {
    const urlParams = new URLSearchParams();
    if (navParams) Object.keys(navParams).forEach(k => urlParams.set(k, navParams[k]));
    const path = screen === 'drama' && navParams?.slug ? \`/drama/\${navParams.slug}\` : \`/\${screen}\`;
    router.push(\`\${path}\${urlParams.toString() ? \`?\${urlParams.toString()}\` : ''}\`);
  };

  return <DramaDetailScreen onNavigate={handleNavigate} user={user} slug={params.slug} />;
}

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <PageContent params={params} />
    </Suspense>
  );
}
`;
fs.writeFileSync('app/(app)/drama/[slug]/page.tsx', dramaContent);
