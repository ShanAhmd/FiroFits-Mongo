import React from 'react';
import { type User, type View, UserRole } from '../types';
import { FiroFitsLogo, FacebookIcon, InstagramIcon, WhatsAppIcon } from './IconComponents';

// @ts-ignore
import logo1 from '../uploads/logo 1.png';

interface FooterProps {
  user: User | null;
  navigateTo: (view: View) => void;
}

const FooterLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-500 hover:text-white transition-colors relative group text-left">
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
  </button>
);

const Footer: React.FC<FooterProps> = ({ user, navigateTo }) => {
  return (
    <footer className="bg-black text-white pt-14 pb-8 border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10">
          {/* Logo & Description */}
          <div className="md:col-span-4 space-y-4">
            <img src={logo1} alt="FiroFits" className="h-40 w-auto object-contain -ml-12 md:-ml-10" />
            <p className="text-xs font-sans font-light tracking-wide text-gray-400 max-w-sm leading-relaxed">
              Precision engineering meets absolute minimalism. Experience ready-to-wear silhouettes and bespoke architectural garments.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/50">Quick Links</h3>
            <ul className="space-y-2.5 flex flex-col items-start">
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

          {/* Our Policies */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/50">Our Policies</h3>
            <ul className="space-y-2.5 flex flex-col items-start">
              <li><FooterLink onClick={() => {}}>Privacy Policy</FooterLink></li>
              <li><FooterLink onClick={() => {}}>Terms of Service</FooterLink></li>
              <li><FooterLink onClick={() => {}}>Return Policy</FooterLink></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="md:col-span-4 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/50">Contact Us</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Contact our master tailors for custom dress orders, uniform queries, or wedding designs.
              </p>
              <p className="text-xs text-white font-bold tracking-widest mt-3">
                STUDIO@FIROFITS.COM
              </p>
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-3 justify-end mt-2">
              <a href="#" aria-label="Facebook" className="p-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="https://wa.me/94771234567" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="p-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all">
                <WhatsAppIcon className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="p-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all">
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-[9px] text-gray-600 font-bold uppercase tracking-[0.3em]">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p>&copy; {new Date().getFullYear()} FIROFITS ATELIER. ALL RIGHTS RESERVED.</p>
            <button
              onClick={() => navigateTo('admin-login')}
              className="text-gray-700 hover:text-white transition-colors"
            >
              | Admin Login |
            </button>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span>— EST. COLOMBO</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;