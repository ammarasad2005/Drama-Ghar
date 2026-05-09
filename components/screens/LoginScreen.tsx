import React from 'react';
import { EyeOff } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div 
      className="min-h-screen flex w-full relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/login-bg.jpg")' }} // The user must name their image login-bg.jpg and place it in the public folder
    >
      {/* Background text/logo is baked into the image from the user provided attachment, so we don't recreate the left side in HTML anymore */}
      
      {/* Spacer to push form to the right */}
      <div className="w-[50%] hidden lg:block"></div>

      {/* Right side form container */}
      <div className="flex-1 flex items-center justify-center p-8 z-10 lg:pr-24">
        <div className="w-full max-w-md bg-[#f0e6d0] rounded-2xl shadow-2xl overflow-hidden border p-8 pt-10" style={{ borderColor: 'rgba(160, 120, 50, 0.3)' }}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#2a1f0e' }}>Welcome to DramaGhar</h2>
            <p className="text-sm" style={{ color: '#6b5530' }}>Sign in to continue to your account</p>
          </div>

          <div className="flex border-b mb-8" style={{ borderColor: 'rgba(160, 120, 50, 0.3)' }}>
            <button className="flex-1 pb-3 border-b-2 font-medium" style={{ borderColor: '#1a4a30', color: '#1a4a30' }}>Login</button>
            <button className="flex-1 pb-3 font-medium opacity-60 hover:opacity-100 transition-opacity" style={{ color: '#9a8060' }}>Sign Up</button>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div>
              <div className="relative">
                <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#b0966a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input 
                  type="email" 
                  placeholder="Email or Phone Number" 
                  className="w-full pl-10 pr-4 py-2.5 bg-[#faf4e8] border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm placeholder-[#b0966a] text-[#2a1f0e]"
                  style={{ borderColor: 'rgba(160, 120, 50, 0.35)', '--tw-ring-color': '#1a4a30' } as React.CSSProperties}
                  defaultValue="ayesha@example.com"
                />
              </div>
            </div>
            
            <div>
              <div className="relative">
                <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#b0966a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full pl-10 pr-10 py-2.5 bg-[#faf4e8] border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm placeholder-[#b0966a] text-[#2a1f0e]"
                  style={{ borderColor: 'rgba(160, 120, 50, 0.35)', '--tw-ring-color': '#1a4a30' } as React.CSSProperties}
                  defaultValue="password123"
                />
                <EyeOff className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors" style={{ color: '#b0966a' }} />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <a href="#" className="text-xs hover:underline" style={{ color: '#1a4a30' }}>Forgot Password?</a>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded focus:ring-2" style={{ backgroundColor: '#faf4e8', borderColor: 'rgba(160, 120, 50, 0.35)', accentColor: '#1a4a30', '--tw-ring-color': '#1a4a30' } as React.CSSProperties} />
                <span className="text-xs" style={{ color: '#6b5530' }}>Remember me</span>
              </label>
            </div>

            <button type="submit" className="w-full font-medium py-2.5 rounded-lg mt-6 shadow-sm transition-opacity hover:opacity-90" style={{ backgroundColor: '#0f3d26', color: '#f0e6d0' }}>
              Log In
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px flex-1" style={{ backgroundColor: 'rgba(160, 120, 50, 0.3)' }}></div>
            <span className="text-xs uppercase tracking-widest" style={{ color: '#6b5530' }}>or</span>
            <div className="h-px flex-1" style={{ backgroundColor: 'rgba(160, 120, 50, 0.3)' }}></div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:bg-[#e8dcc0] bg-[#faf4e8]" style={{ borderColor: 'rgba(160, 120, 50, 0.3)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:bg-[#e8dcc0] bg-[#faf4e8] text-[#1877F2]" style={{ borderColor: 'rgba(160, 120, 50, 0.3)' }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
            <button className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:bg-[#e8dcc0] bg-[#faf4e8] text-black" style={{ borderColor: 'rgba(160, 120, 50, 0.3)' }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.8 1.93-.05 3.3.73 4.2 1.83-2.85 1.5-2.3 5.36.43 6.64-1.07 2.1-2.28 3.57-3.29 4.5zm-5.74-13.4c-.06-1.57.65-2.82 1.7-3.79 1.12-1.01 2.5-1.41 3.86-1.14-.15 1.6-.74 2.87-1.74 3.87-1 1-2.43 1.4-3.82 1.06z"/></svg>
            </button>
          </div>

          <p className="text-center mt-8 text-sm" style={{ color: '#6b5530' }}>
            New here? <a href="#" className="font-medium hover:underline" style={{ color: '#1a4a30' }}>Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
}
