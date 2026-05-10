'use client';
import React from 'react';
import { Info, Mail, Github, Heart, ShieldCheck, Globe } from 'lucide-react';

export function AboutScreen() {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 bg-[#F9FAFB] dark:bg-[#050505]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">About DramaGhar</h1>
        <p className="text-gray-500 text-sm">Everything you need to know about the platform.</p>
      </div>

      <div className="max-w-4xl space-y-8 pb-12">
        {/* Platform Mission */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-700 dark:text-emerald-500">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            DramaGhar was built with a single goal: to simplify how Pakistani drama lovers discover and track their favorite shows. 
            We aggregate live broadcast data from all major networks including ARY, Hum, Geo, Green, and Express, ensuring you never miss an episode. 
            With personalized scheduling and watch history, the platform evolves with your viewing habits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Security First</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your account is protected by custom JWT authentication and bcrypt password hashing. We prioritize your privacy and data integrity across every request.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Contact Us</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Have questions or feedback? We&apos;d love to hear from you.
            </p>
            <a href="mailto:support@dramaghar.pk" className="text-emerald-700 dark:text-emerald-500 text-sm font-bold hover:underline">
              support@dramaghar.pk
            </a>
          </div>
        </div>

        {/* Footer info in about */}
        <div className="text-center pt-8 opacity-50">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 fill-red-400 text-red-400" /> for the Drama Community.
          </p>
          <p className="text-[10px] mt-2 font-mono">v1.2.0-stable</p>
        </div>
      </div>
    </div>
  );
}
