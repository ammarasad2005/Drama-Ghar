'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordScreenProps {
  email: string;
  token: string;
  onSuccess: () => void;
}

export function ResetPasswordScreen({ email, token, onSuccess }: ResetPasswordScreenProps) {
  const [apiError, setApiError] = useState('');
  const [apiMessage, setApiMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    setIsLoading(true);
    setApiError('');
    setApiMessage('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password: data.password }),
      });
      const result = await res.json();
      
      if (res.ok) {
        setApiMessage(result.message);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setApiError(result.error || 'Failed to reset password');
      }
    } catch (err) {
      setApiError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex w-full relative bg-cover bg-center bg-no-repeat transition-opacity duration-500"
      style={{ backgroundImage: 'url("/login-bg.jpg")' }}
    >
      <div className="w-[50%] hidden lg:block"></div>

      <div className="flex-1 flex items-center justify-center p-8 z-10 lg:pr-24">
        <div className="w-full max-w-md bg-[#f0e6d0] rounded-2xl shadow-2xl overflow-hidden border p-8 pt-10" style={{ borderColor: 'rgba(160, 120, 50, 0.3)' }}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#2a1f0e' }}>Set New Password</h2>
            <p className="text-sm" style={{ color: '#6b5530' }}>
              Create a new password for {email}
            </p>
          </div>

          {apiError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
              {apiError}
            </div>
          )}
          {apiMessage && (
            <div className="mb-4 p-3 bg-emerald-100 border border-emerald-400 text-emerald-700 rounded text-sm text-center">
              {apiMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <input 
                {...form.register('password')}
                type="password" 
                placeholder="New Password" 
                className="w-full px-4 py-2.5 bg-[#faf4e8] border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm placeholder-[#b0966a] text-[#2a1f0e]"
                style={{ borderColor: 'rgba(160, 120, 50, 0.35)', '--tw-ring-color': '#1a4a30' } as React.CSSProperties}
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <input 
                {...form.register('confirmPassword')}
                type="password" 
                placeholder="Confirm New Password" 
                className="w-full px-4 py-2.5 bg-[#faf4e8] border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm placeholder-[#b0966a] text-[#2a1f0e]"
                style={{ borderColor: 'rgba(160, 120, 50, 0.35)', '--tw-ring-color': '#1a4a30' } as React.CSSProperties}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <button type="submit" disabled={isLoading} className="w-full font-medium py-2.5 rounded-lg mt-6 shadow-sm transition-opacity hover:opacity-90 flex justify-center items-center" style={{ backgroundColor: '#0f3d26', color: '#f0e6d0' }}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
            </button>
          </form>

          <p className="text-center mt-8 text-sm" style={{ color: '#6b5530' }}>
            <button onClick={(e) => { e.preventDefault(); onSuccess(); }} className="font-medium hover:underline" style={{ color: '#1a4a30' }}>
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
