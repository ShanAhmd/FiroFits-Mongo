import React from 'react';
import { type User, type View, UserRole } from '../types';
import { FiroFitsLogo, FacebookIcon, InstagramIcon, WhatsAppIcon } from './IconComponents';

interface FooterProps {
  user: User | null;
  navigateTo: (view: View) => void;
}

const FooterLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-500 hover:text-white transition-colors relative group">
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
  </button>
);

const Footer: React.FC<FooterProps> = ({ user, navigateTo }) => {
  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        {/* HUGE 2026 BRUTALIST BRANDING */}
        <div className="border-b border-white/20 pb-16 mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h2 className="text-6xl md:text-[8rem] font-serif leading-none tracking-tighter uppercase">
              FiroFits.
            </h2>
            <p className="text-sm font-sans font-light tracking-wide text-gray-400 max-w-sm mt-6">
              Precision engineering meets absolute minimalism. Experience ready-to-wear silhouettes and bespoke architectural garments.
            </p>
          </div>
          <div className="flex gap-4">
            <a href="https://wa.me/94771234567" target="_blank" rel="noopener noreferrer" className="p-4 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all">
              <WhatsAppIcon className="h-6 w-6" />
            </a>
            <a href="#" className="p-4 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all">
              <InstagramIcon className="h-6 w-6" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Main Navigation */}
          <div className="space-y-6">
            <h3 className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/50 mb-8">Quick Links</h3>
            <ul className="space-y-4">
              <li><FooterLink onClick={() => navigateTo('home')}>Home</FooterLink></li>
              <li><FooterLink onClick={() => navigateTo('products')}>Boutique Shop</FooterLink></li>
              <li><FooterLink onClick={() => navigateTo('about')}>About Us</FooterLink></li>
              {user && (
                <li><FooterLink onClick={() => navigateTo('dashboard')}>Dashboard</FooterLink></li>
              )}
              {user && user.role === UserRole.CUSTOMER && (
                <li><FooterLink onClick={() => navigateTo('order')}>Custom Tailoring</FooterLink></li>
              )}
            </ul>
          </div>

          {/* Legal / Policies */}
          <div className="space-y-6">
            <h3 className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/50 mb-8">Our Policies</h3>
            <ul className="space-y-4">
              <li><FooterLink onClick={() => {}}>Privacy Policy</FooterLink></li>
              <li><FooterLink onClick={() => {}}>Terms of Service</FooterLink></li>
              <li><FooterLink onClick={() => {}}>Return Policy</FooterLink></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-6">
            <h3 className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/50 mb-8">Contact Us</h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Contact our master tailors for custom dress orders, uniform queries, or wedding designs.
            </p>
            <p className="text-xs text-white font-bold tracking-widest mt-4">
              STUDIO@FIROFITS.COM
            </p>
          </div>
        </div>

        <div className="mt-24 flex flex-col md:flex-row items-center justify-between text-[9px] text-gray-600 font-bold uppercase tracking-[0.3em]">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p>&copy; {new Date().getFullYear()} FIROFITS ATELIER. ALL RIGHTS RESERVED.</p>
            <button
              onClick={() => navigateTo('admin-login')}
              className="text-gray-700 hover:text-white transition-colors"
            >
              [ Admin Login ]
            </button>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <FiroFitsLogo className="h-4 w-4" />
            <span>EST. COLOMBO</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;