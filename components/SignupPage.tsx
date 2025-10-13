import React, { useState } from 'react';
import { FiroFitsLogo } from './IconComponents';
import { type View, UserRole } from '../types';

interface SignupPageProps {
  onSignup: (name: string, email: string, password: string, role: UserRole) => { success: boolean, error?: string };
  navigateTo: (view: View) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, navigateTo }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Only allow customer signups from this public form.
    const result = onSignup(name, email, password, UserRole.CUSTOMER);
    if (!result.success) {
      setError(result.error || 'An unknown error occurred.');
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
            <h1 className="text-3xl font-bold text-brand-charcoal">Create a Customer Account</h1>
            <p className="text-brand-dark-gray mt-1">Join FiroFits to start your journey.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-brand-charcoal mb-2" htmlFor="fullName">
                Full Name
              </label>
              <input
                className="appearance-none rounded-xl relative block w-full px-4 py-3 bg-white text-brand-charcoal placeholder-gray-400 border border-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent sm:text-sm"
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
              Create Account
            </button>
            
            <p className="text-center text-sm text-brand-dark-gray">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigateTo('login')}
                className="font-bold text-brand-teal hover:text-teal-600"
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;