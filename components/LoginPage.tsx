import React, { useState } from 'react';
import { AppState } from '../types';
import { signIn, signUp } from '../services/supabaseService';

interface LoginPageProps {
  onLogin: (email: string, userId: string) => void;
  onNavigate: (state: AppState) => void;
  error: string | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const resp = isSignUp ? await signUp(email, password) : await signIn(email, password);

      // The service returns an object with `user` when successful.
      const user = resp?.user ?? (resp as any)?.data?.user ?? null;

      if (user && (user.id || user.sub)) {
        // Supabase user id can be `id` or `sub` depending on response shape
        const userId = user.id ?? user.sub;
        onLogin(email, userId);
      } else if (isSignUp) {
        // Sign-up may require email confirmation and not return a user immediately
        setAuthError('Sign up successful — please check your email to confirm your account before signing in.');
      } else {
        throw new Error('Failed to get user info');
      }
    } catch (err: any) {
      setAuthError(err.message || (isSignUp ? 'Sign up failed' : 'Sign in failed'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h1 className="text-3xl font-bold tracking-wider text-white">SkillSync</h1>
            </div>
            <p className="text-indigo-300 mt-2">Sign in to start your journey.</p>
        </div>
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700 animate-fade-in">
          {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-6 text-center">{error}</p>}
          {authError && <p className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-6 text-center">{authError}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-800 transition-colors"
              >
                {isLoading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-sm text-gray-400">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setAuthError(null);
                setPassword('');
              }}
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              {isSignUp ? 'Sign In' : 'Create Account'}
            </button>
          </p>
          
          <p className="mt-6 text-center text-sm text-gray-400">
            Or{' '}
            <button type="button" onClick={() => onNavigate(AppState.HOME)} className="font-medium text-indigo-400 hover:text-indigo-300">
              return to the Home Page
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
