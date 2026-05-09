import React from 'react';
import { MonitorPlay, ChevronRight } from 'lucide-react';

export function ChannelsScreen() {
  const channels = [
    { name: 'ARY Digital', color: 'blue', desc: 'Leading entertainment network', topShow: 'Kaisi Teri Khudgharzi' },
    { name: 'HUM TV', color: 'yellow', desc: 'Premium drama content', topShow: 'Mannat Murad' },
    { name: 'Geo TV', color: 'orange', desc: 'Pakistan\'s premier channel', topShow: 'Tere Bin' },
    { name: 'Green TV', color: 'green', desc: 'Fresh new narratives', topShow: 'Qarz e Jaan' },
    { name: 'Express TV', color: 'red', desc: 'Classic entertainment', topShow: 'Kaffara' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Live Channels</h1>
        <p className="text-gray-500 text-sm">Watch your favorite channels live.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-4 group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
                channel.color === 'blue' ? 'bg-emerald-100 text-emerald-700' :
                channel.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                channel.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                channel.color === 'green' ? 'bg-green-100 text-green-600' :
                'bg-red-100 text-red-600'
              }`}>
                <MonitorPlay className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{channel.name}</h3>
                <p className="text-sm text-gray-500">{channel.desc}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between border border-gray-100 mt-auto">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Top Show</span>
                <span className="text-sm font-semibold text-gray-900 mt-0.5 group-hover:text-emerald-700 transition-colors">{channel.topShow}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
