import React, { useState } from 'react';
import { FiroFitsLogo } from './IconComponents';
import { type View, UserRole, type User } from '../types';

interface LoginPageProps {
  onLogin: (email: string, password: string, role: UserRole) => User | null;
  navigateTo: (view: View) => void;
  notification?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, navigateTo, notification }) => {
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = onLogin(email, password, role);
    if (!user) {
      setError('Invalid email, password, or role. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-cream">
      {/* Left Branding Panel */}
      <div className="w-full md:w-1/2 bg-brand-charcoal text-white flex flex-col items-center justify-center p-12 text-center">
        <FiroFitsLogo className="h-24 mx-auto mb-6" />
        <h1 className="text-4xl font-bold">Your Vision, Our Craft.</h1>
        <p className="text-lg text-gray-300 mt-2 max-w-xs">
          Custom tailoring that fits your style and your measurements perfectly.
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="text-center md:text-left mb-8">
            <h1 className="text-3xl font-bold text-brand-charcoal">Welcome Back</h1>
            <p className="text-brand-dark-gray mt-1">Please sign in to your account.</p>
          </div>
          
          {notification && (
            <div className="mb-4 p-3 rounded-xl bg-brand-success/10 border border-brand-success/30 text-brand-success text-sm text-center font-semibold">
              {notification}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center p-1 bg-brand-light-gray rounded-full w-full">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.CUSTOMER)}
                  className={`w-1/2 px-4 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ease-in-out ${role === UserRole.CUSTOMER ? 'bg-white text-brand-teal shadow-md' : 'text-gray-500'}`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole(UserRole.ADMIN)}
                  className={`w-1/2 px-4 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ease-in-out ${role === UserRole.ADMIN ? 'bg-white text-brand-teal shadow-md' : 'text-gray-500'}`}
                >
                  Admin
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-charcoal mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                className="appearance-none rounded-xl relative block w-full px-4 py-3 bg-white text-brand-charcoal placeholder-gray-400 border border-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent sm:text-sm"
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-brand-charcoal mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="appearance-none rounded-xl relative block w-full px-4 py-3 bg-white text-brand-charcoal placeholder-gray-400 border border-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent sm:text-sm"
                id="password"
                type="password"
                placeholder="******************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-brand-error text-center">{error}</p>}
            
            <button
              className="w-full bg-brand-teal text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline hover:opacity-90 transition-all shadow-lg shadow-brand-teal/30"
              type="submit"
            >
              Login
            </button>
            
            <p className="text-center text-sm text-brand-dark-gray">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigateTo('signup')}
                className="font-bold text-brand-teal hover:text-teal-600"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;