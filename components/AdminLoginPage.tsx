import React, { useState } from 'react';
import { FiroFitsLogo } from './IconComponents';
import { type View, UserRole, type User } from '../types';

interface AdminLoginPageProps {
  onLogin: (email: string, password: string, role: UserRole) => Promise<User | null> | User | null;
  navigateTo: (view: View) => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin, navigateTo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Verify admin system access key (case-insensitive check)
    if (secretKey.trim().toUpperCase() !== 'ATELIER2026') {
      setError('Invalid Admin Security Key. Access denied.');
      setIsSubmitting(false);
      return;
    }

    try {
      const user = await onLogin(email, password, UserRole.ADMIN);
      if (!user) {
        setError('Invalid admin credentials. Please try again.');
      }
    } catch (err) {
      setError('Authentication server error.');
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
              Admin Portal
            </span>
            <h2 className="text-3xl font-serif text-black uppercase tracking-tighter">
              Admin Access.
            </h2>
            <p className="text-[10px] text-red-600 font-bold uppercase tracking-[0.2em] mt-2 animate-pulse">
              [ Secure Admin Login ]
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Admin Email */}
          <div className="space-y-2">
            <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-black" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-black focus:border-black focus:ring-0 px-0 py-3 text-xs font-bold uppercase tracking-widest text-black rounded-none transition-colors placeholder-gray-300 font-sans"
              id="email"
              type="email"
              placeholder="e.g. admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Admin Password */}
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

          {/* Admin Security Token */}
          <div className="space-y-2">
            <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-red-600" htmlFor="secretKey">
              Passcode Key
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-red-600 focus:border-red-600 focus:ring-0 px-0 py-3 text-xs font-bold uppercase tracking-widest text-red-600 rounded-none transition-colors placeholder-red-200 font-sans"
              id="secretKey"
              type="password"
              placeholder="e.g. ATELIER2026"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
            />
            <span className="block text-[8px] text-gray-400 uppercase tracking-widest mt-1">
              Required for admin system entry. (Hint: ATELIER2026)
            </span>
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
            {isSubmitting ? 'Verifying...' : 'Login As Admin'}
          </button>
          
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-black border-b border-transparent hover:border-black transition-colors"
            >
              Back to Storefront
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
