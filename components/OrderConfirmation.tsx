import React from 'react';
import { type View } from '../types';

interface OrderConfirmationProps {
  navigateTo: (view: View) => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ navigateTo }) => {
  return (
    <div className="animate-fade-in-down max-w-2xl mx-auto py-32 px-4 text-center space-y-8">
      <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-black/10">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      
      <h2 className="text-5xl font-serif text-black uppercase tracking-tighter">Order Confirmed.</h2>
      
      <p className="text-sm font-light text-brand-dark-gray max-w-md mx-auto leading-relaxed tracking-wide">
        Thank you for your order! Your details have been received and our head tailor will review them shortly.
      </p>

      <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigateTo('dashboard')}
          className="px-8 py-4 bg-black text-white font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-gray-900 transition-all"
        >
          View My Orders
        </button>
        <button
          onClick={() => navigateTo('home')}
          className="px-8 py-4 bg-transparent border border-black text-black font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-black hover:text-white transition-all"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
