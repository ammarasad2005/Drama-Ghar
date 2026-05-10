'use client';

import React, { useState, useEffect } from 'react';
import { EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useIsMobile } from '@/hooks/use-mobile';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

interface LoginScreenProps {
  onLogin: () => void;
  onForgotPassword: () => void;
}

export function LoginScreen({ onLogin, onForgotPassword }: LoginScreenProps) {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  useEffect(() => {
    // Determine which background to load
    const bgSrc = window.innerWidth < 768 ? '/login-mobile.jpg' : '/login-bg.jpg';
    const img = new Image();
    img.src = bgSrc;
    img.onload = () => {
      setBgLoaded(true);
    };
  }, []);

  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    setApiError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      
      if (res.ok) {
        onLogin();
      } else {
        setApiError(result.error || 'Failed to login');
      }
    } catch (err) {
      setApiError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormValues) => {
    setIsLoading(true);
    setApiError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password, name: data.name }),
      });
      const result = await res.json();
      
      if (res.ok) {
        onLogin();
      } else {
        setApiError(result.error || 'Failed to register');
      }
    } catch (err) {
      setApiError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setApiError('');
    try {
      const res = await fetch('/api/auth/guest', { method: 'POST' });
      if (res.ok) {
        onLogin();
      } else {
        setApiError('Failed to continue as guest');
      }
    } catch (err) {
      setApiError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const bgImage = isMobile ? 'url("/login-mobile.jpg")' : 'url("/login-bg.jpg")';

  if (!bgLoaded) {
    return (
      <div className="min-h-screen flex w-full relative bg-[#0a1f18] animate-pulse">
        {!isMobile && <div className="w-[50%] hidden lg:block"></div>}
        <div className="flex-1 flex items-center justify-center p-4 z-10 lg:pr-24">
          <div className="w-full max-w-md bg-[#f0e6d0]/20 rounded-2xl shadow-2xl h-[500px] lg:h-[550px] border p-6 lg:p-8 pt-8 lg:pt-10" style={{ borderColor: 'rgba(160, 120, 50, 0.3)' }}>
            <div className="flex flex-col items-center mb-6 lg:mb-8">
              <div className="w-40 lg:w-48 h-6 lg:h-8 bg-[#f0e6d0]/20 rounded-lg mb-3 lg:mb-4"></div>
              <div className="w-56 lg:w-64 h-3 lg:h-4 bg-[#f0e6d0]/10 rounded-lg"></div>
            </div>

            <div className="flex border-b mb-6 lg:mb-8" style={{ borderColor: 'rgba(160, 120, 50, 0.2)' }}>
              <div className="flex-1 pb-3 flex justify-center">
                <div className="w-16 h-4 bg-[#f0e6d0]/20 rounded"></div>
              </div>
              <div className="flex-1 pb-3 flex justify-center">
                <div className="w-16 h-4 bg-[#f0e6d0]/10 rounded"></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="w-full h-11 bg-[#f0e6d0]/10 rounded-lg border" style={{ borderColor: 'rgba(160, 120, 50, 0.2)' }}></div>
              <div className="w-full h-11 bg-[#f0e6d0]/10 rounded-lg border" style={{ borderColor: 'rgba(160, 120, 50, 0.2)' }}></div>
              <div className="w-24 h-3 bg-[#f0e6d0]/10 rounded mt-4"></div>
              <div className="w-full h-11 bg-[#f0e6d0]/20 rounded-lg mt-8"></div>
            </div>

            <div className="flex justify-center mt-8">
              <div className="w-40 h-4 bg-[#f0e6d0]/10 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex w-full relative bg-cover bg-center bg-no-repeat transition-opacity duration-500"
      style={{ backgroundImage: bgImage }}
    >
      {!isMobile && <div className="w-[50%] hidden lg:block"></div>}

      <div className="flex-1 flex items-center justify-center p-4 z-10 lg:pr-24">
        <div className="w-full max-w-md bg-[#f0e6d0]/70 lg:bg-[#f0e6d0] backdrop-blur-xl lg:backdrop-blur-none rounded-2xl shadow-2xl overflow-hidden border p-6 lg:p-8 pt-8 lg:pt-10" style={{ borderColor: 'rgba(160, 120, 50, 0.3)' }}>
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-bold mb-1 lg:mb-2" style={{ color: '#2a1f0e' }}>Welcome to DramaGhar</h2>
            <p className="text-xs lg:text-sm" style={{ color: '#6b5530' }}>
              {isLogin ? 'Sign in to continue' : 'Create an account to track dramas'}
            </p>
          </div>

          <div className="flex border-b mb-6 lg:mb-8" style={{ borderColor: 'rgba(160, 120, 50, 0.3)' }}>
            <button 
              onClick={() => { setIsLogin(true); setApiError(''); }}
              className={`flex-1 pb-3 font-medium transition-opacity ${isLogin ? 'border-b-2' : 'opacity-60 hover:opacity-100'}`} 
              style={isLogin ? { borderColor: '#1a4a30', color: '#1a4a30' } : { color: '#9a8060' }}
            >
              Login
            </button>
            <button 
              onClick={() => { setIsLogin(false); setApiError(''); }}
              className={`flex-1 pb-3 font-medium transition-opacity ${!isLogin ? 'border-b-2' : 'opacity-60 hover:opacity-100'}`} 
              style={!isLogin ? { borderColor: '#1a4a30', color: '#1a4a30' } : { color: '#9a8060' }}
            >
              Sign Up
            </button>
          </div>

          {apiError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
              {apiError}
            </div>
          )}

          {isLogin ? (
            <form className="space-y-4" onSubmit={loginForm.handleSubmit(handleLogin)}>
              <div>
                <input 
                  {...loginForm.register('email')}
                  type="email" 
                  placeholder="Email" 
                  className="w-full px-4 py-2.5 bg-[#faf4e8] border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm placeholder-[#b0966a] text-[#2a1f0e]"
                  style={{ borderColor: 'rgba(160, 120, 50, 0.35)', '--tw-ring-color': '#1a4a30' } as React.CSSProperties}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              
              <div>
                <input 
                  {...loginForm.register('password')}
                  type="password" 
                  placeholder="Password" 
                  className="w-full px-4 py-2.5 bg-[#faf4e8] border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm placeholder-[#b0966a] text-[#2a1f0e]"
                  style={{ borderColor: 'rgba(160, 120, 50, 0.35)', '--tw-ring-color': '#1a4a30' } as React.CSSProperties}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...loginForm.register('rememberMe')}
                    className="w-4 h-4 rounded border-gray-300 text-[#0f3d26] focus:ring-[#0f3d26] bg-[#faf4e8]"
                  />
                  <span className="text-xs" style={{ color: '#1a4a30' }}>Remember me</span>
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); onForgotPassword(); }} className="text-xs hover:underline" style={{ color: '#1a4a30' }}>Forgot Password?</a>
              </div>

              <button type="submit" disabled={isLoading} className="w-full font-medium py-2.5 rounded-lg mt-6 shadow-sm transition-opacity hover:opacity-90 flex justify-center items-center" style={{ backgroundColor: '#0f3d26', color: '#f0e6d0' }}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={signupForm.handleSubmit(handleSignup)}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <input 
                    {...signupForm.register('name')}
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full px-4 py-2.5 bg-[#faf4e8] border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm placeholder-[#b0966a] text-[#2a1f0e]"
                    style={{ borderColor: 'rgba(160, 120, 50, 0.35)', '--tw-ring-color': '#1a4a30' } as React.CSSProperties}
                  />
                  {signupForm.formState.errors.name && (
                    <p className="text-red-500 text-xs mt-1">{signupForm.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <input 
                    {...signupForm.register('email')}
                    type="email" 
                    placeholder="Email" 
                    className="w-full px-4 py-2.5 bg-[#faf4e8] border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm placeholder-[#b0966a] text-[#2a1f0e]"
                    style={{ borderColor: 'rgba(160, 120, 50, 0.35)', '--tw-ring-color': '#1a4a30' } as React.CSSProperties}
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">{signupForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <input 
                    {...signupForm.register('password')}
                    type="password" 
                    placeholder="Password" 
                    className="w-full px-4 py-2.5 bg-[#faf4e8] border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm placeholder-[#b0966a] text-[#2a1f0e]"
                    style={{ borderColor: 'rgba(160, 120, 50, 0.35)', '--tw-ring-color': '#1a4a30' } as React.CSSProperties}
                  />
                  {signupForm.formState.errors.password && (
                    <p className="text-red-500 text-xs mt-1">{signupForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div>
                  <input 
                    {...signupForm.register('confirmPassword')}
                    type="password" 
                    placeholder="Confirm Password" 
                    className="w-full px-4 py-2.5 bg-[#faf4e8] border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm placeholder-[#b0966a] text-[#2a1f0e]"
                    style={{ borderColor: 'rgba(160, 120, 50, 0.35)', '--tw-ring-color': '#1a4a30' } as React.CSSProperties}
                  />
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{signupForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full font-medium py-2.5 rounded-lg mt-6 shadow-sm transition-opacity hover:opacity-90 flex justify-center items-center" style={{ backgroundColor: '#0f3d26', color: '#f0e6d0' }}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
              </button>
            </form>
          )}

          <p className="text-center mt-8 text-sm" style={{ color: '#6b5530' }}>
            {isLogin ? "New here? " : "Already have an account? "}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setApiError(''); }} className="font-medium hover:underline" style={{ color: '#1a4a30' }}>
              {isLogin ? "Create an account" : "Sign In"}
            </a>
          </p>

          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="flex items-center w-full">
              <div className="flex-1 border-t border-gray-300 dark:border-neutral-700"></div>
              <span className="px-3 text-xs text-gray-500 uppercase tracking-widest">Or</span>
              <div className="flex-1 border-t border-gray-300 dark:border-neutral-700"></div>
            </div>
            <button 
              onClick={(e) => { e.preventDefault(); handleGuestLogin(); }}
              disabled={isLoading}
              className="w-full font-medium py-2.5 rounded-lg border-2 border-[#1a4a30] text-[#1a4a30] hover:bg-[#1a4a30] hover:text-[#f0e6d0] transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
