import React from 'react';
import { type User, type View, UserRole } from '../types';
import { FiroFitsLogo, UserCircleIcon } from './IconComponents';

interface HeaderProps {
  user: User | null;
  navigateTo: (view: View) => void;
  onLogout: () => void;
}

const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} className="text-sm font-semibold text-brand-dark-gray hover:text-brand-teal transition-colors">
    {children}
  </button>
);

const Header: React.FC<HeaderProps> = ({ user, navigateTo, onLogout }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button onClick={() => navigateTo(user ? 'order' : 'login')} className="flex-shrink-0 text-brand-charcoal">
              <FiroFitsLogo className="h-10 w-auto" />
            </button>
          </div>
          {user && (
            <nav className="hidden md:flex items-center space-x-8">
              {user.role === UserRole.CUSTOMER && <NavLink onClick={() => navigateTo('order')}>New Order</NavLink>}
              <NavLink onClick={() => navigateTo('products')}>Products</NavLink>
              <NavLink onClick={() => navigateTo('about')}>About Us</NavLink>
            </nav>
          )}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => navigateTo(user.role === UserRole.ADMIN ? 'admin-dashboard' : 'dashboard')}
                  className="flex items-center text-sm font-semibold text-brand-charcoal hover:text-brand-teal transition-colors"
                >
                  {user.profilePhotoUrl ? (
                    <img src={user.profilePhotoUrl} alt="profile" className="h-8 w-8 rounded-full mr-2" />
                  ) : (
                    <UserCircleIcon className="h-7 w-7 mr-2 text-brand-dark-gray" />
                  )}
                  My Dashboard
                </button>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-brand-charcoal text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigateTo('login')}
                  className="px-4 py-2 bg-brand-teal text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-colors"
                >
                  Login
                </button>
                 <button
                  onClick={() => navigateTo('signup')}
                  className="px-4 py-2 bg-transparent text-brand-charcoal rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;