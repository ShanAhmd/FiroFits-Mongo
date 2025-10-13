import React from 'react';
import { type User, type View, UserRole } from '../types';
import { FiroFitsLogo, FacebookIcon, InstagramIcon, WhatsAppIcon } from './IconComponents';

interface FooterProps {
  user: User | null;
  navigateTo: (view: View) => void;
}

const FooterLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} className="text-sm text-gray-400 hover:text-white transition-colors">
    {children}
  </button>
);

const Footer: React.FC<FooterProps> = ({ user, navigateTo }) => {
  return (
    <footer className="bg-brand-charcoal text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4 md:col-span-2">
            <FiroFitsLogo className="h-12 text-white" />
            <p className="text-sm text-gray-400 max-w-md">
              Your Vision, Our Craft. Custom tailoring delivered to your door. From school uniforms to elegant abayas, we bring your ideas to life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><FooterLink onClick={() => navigateTo('about')}>About Us</FooterLink></li>
              <li><FooterLink onClick={() => navigateTo('products')}>Products</FooterLink></li>
              {user && (
                 <li><FooterLink onClick={() => navigateTo('dashboard')}>My Orders</FooterLink></li>
              )}
              {(!user || user.role === UserRole.CUSTOMER) && (
                <li><FooterLink onClick={() => navigateTo('order')}>New Order</FooterLink></li>
              )}
            </ul>
          </div>

          {/* Contact/Socials */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Connect</h3>
             <div className="mt-4 flex space-x-4">
                <a href="#" aria-label="WhatsApp" className="text-gray-400 hover:text-white"><WhatsAppIcon className="h-6 w-6" /></a>
                <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white"><InstagramIcon className="h-6 w-6" /></a>
                <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white"><FacebookIcon className="h-6 w-6" /></a>
              </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} FiroFits.lk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;