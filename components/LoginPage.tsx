import React, { useState } from 'react';
import { FiroFitsLogo } from './IconComponents';
import { type View, UserRole, type User } from '../types';

interface LoginPageProps {
  onLogin: (email: string, password: string, role: UserRole) => Promise<User | null> | User | null;
  navigateTo: (view: View) => void;
  notification?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, navigateTo, notification }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      // Force customer role for standard public login
      const user = await onLogin(email, password, UserRole.CUSTOMER);
      if (!user) {
        setError('Invalid email or password.');
      }
    } catch (err) {
      setError('Connection to security vault failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4 animate-fade-in">
      <div className="border border-black bg-white p-8 md:p-12 space-y-10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <FiroFitsLogo className="h-12 mx-auto text-black" />
          <div>
            <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-400 block mb-1">
              Welcome Back
            </span>
            <h2 className="text-3xl font-serif text-black uppercase tracking-tighter">
              Patron Sign In.
            </h2>
            <p className="text-[10px] text-brand-dark-gray uppercase tracking-[0.2em] mt-2">
              Access your personal measurements database.
            </p>
          </div>
        </div>

        {notification && (
          <div className="p-4 bg-gray-50 border border-black/20 text-black text-[10px] uppercase tracking-[0.2em] font-bold text-center">
            {notification}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-black" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-black focus:border-black focus:ring-0 px-0 py-3 text-xs font-bold uppercase tracking-widest text-black rounded-none transition-colors placeholder-gray-300 font-sans"
              id="email"
              type="email"
              placeholder="e.g. patron@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-black" htmlFor="password">
              Password
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-black focus:border-black focus:ring-0 px-0 py-3 text-xs font-bold uppercase tracking-widest text-black rounded-none transition-colors placeholder-gray-300 font-sans"
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-[10px] uppercase tracking-[0.2em] text-red-600 font-bold bg-red-50 p-4 border border-red-200 text-center">
              {error}
            </p>
          )}

          <button
            className="w-full py-5 bg-black hover:bg-gray-900 text-white font-bold uppercase text-[10px] tracking-[0.4em] transition-all disabled:bg-gray-300"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : 'Authorize Login'}
          </button>
          
          <div className="text-center pt-2 space-y-4">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
              New to the Atelier?{' '}
              <button
                type="button"
                onClick={() => navigateTo('signup')}
                className="text-black underline font-bold"
              >
                Create Account
              </button>
            </p>
            <div>
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-black border-b border-transparent hover:border-black transition-colors"
              >
                Abort / Back to Storefront
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;