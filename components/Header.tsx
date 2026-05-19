import React, { useState, useEffect } from 'react';
import { type User, type View, UserRole } from '../types';
import { FiroFitsLogo, UserCircleIcon } from './IconComponents';

// @ts-ignore
import logo2 from '../uploads/logo 2.png';

interface HeaderProps {
  user: User | null;
  navigateTo: (view: View) => void;
  onLogout: () => void;
  cartItemsCount: number;
}

const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode; active?: boolean }> = ({
  onClick,
  children,
  active,
}) => (
  <button
    onClick={onClick}
    className="relative text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-brand-dark-gray hover:text-black transition-colors group"
  >
    {children}
    <span className="absolute -bottom-1.5 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
  </button>
);

const Header: React.FC<HeaderProps> = ({ user, navigateTo, onLogout, cartItemsCount }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full border-b ${scrolled ? 'bg-white/80 backdrop-blur-[24px] border-black/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.02)]' : 'bg-white/40 backdrop-blur-[12px] border-black/5 py-5'}`}>
      <div className="flex items-center justify-between w-full px-6 md:px-12 h-12">
        
        {/* LOGO */}
        <div className="flex-shrink-0">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 text-black group text-left"
          >
            <img src={logo2} alt="FIROFITS" className="h-24 md:h-30 w-auto object-contain" />
          </button>
        </div>

        {/* MAIN NAVIGATION (Hidden on mobile) */}
        <nav className="hidden md:flex items-center justify-center space-x-10 flex-grow">
          <NavLink onClick={() => navigateTo('home')}>Home</NavLink>
          <NavLink onClick={() => navigateTo('products')}>Shop</NavLink>
          <NavLink onClick={() => navigateTo('about')}>About Us</NavLink>
          {user && user.role === UserRole.CUSTOMER && (
            <NavLink onClick={() => navigateTo('order')}>Bespoke Tailoring</NavLink>
          )}
          {user && user.role === UserRole.ADMIN && (
            <NavLink onClick={() => navigateTo('admin-dashboard')}>Admin</NavLink>
          )}
        </nav>

        {/* RIGHT UTILITIES & AUTH */}
        <div className="flex items-center space-x-6 flex-shrink-0">
          {/* SHOPPING CART BUTTON */}
          <button
            onClick={() => navigateTo('cart')}
            className="relative p-2 text-black hover:opacity-75 transition-opacity flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 bg-black text-white text-[8px] font-bold h-4 w-4 flex items-center justify-center shadow-sm">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* AUTH / PROFILE */}
          {user ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateTo(user.role === UserRole.ADMIN ? 'admin-dashboard' : 'dashboard')}
                className="flex items-center text-[9px] uppercase tracking-[0.2em] font-bold text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
              >
                {user.profilePhotoUrl ? (
                  <img
                    src={user.profilePhotoUrl}
                    alt="profile"
                    className="h-4 w-4 object-cover mr-2"
                  />
                ) : (
                  <UserCircleIcon className="h-4 w-4 mr-1.5 text-black" />
                )}
                <span>Dashboard</span>
              </button>
              <button
                onClick={onLogout}
                className="px-5 py-2 bg-transparent border border-black text-black text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateTo('login')}
                className="px-5 py-2 bg-black text-white border border-black text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;