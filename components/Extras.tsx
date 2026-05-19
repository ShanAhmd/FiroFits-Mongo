import React from 'react';
import { type OrderData } from '../types';

interface ExtrasProps {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
}

const Extras: React.FC<ExtrasProps> = ({ orderData, updateOrderData }) => {
  return (
    <div className="animate-fade-in space-y-12">
      <div className="border-b border-black pb-6">
        <span className="text-[10px] uppercase tracking-[0.4em] text-brand-dark-gray font-bold block mb-2">Step 04</span>
        <h2 className="text-4xl font-serif text-black uppercase tracking-tighter">Options & Add-ons</h2>
        <p className="text-xs text-brand-dark-gray font-light mt-2 tracking-wide">
          Choose any extra details or custom work you'd like to add.
        </p>
      </div>

      <div className="space-y-6">
        <div 
          onClick={() => updateOrderData({ hasPearlWork: !orderData.hasPearlWork })}
          className={`cursor-pointer border p-8 flex items-center justify-between transition-all duration-300
            ${orderData.hasPearlWork ? 'bg-black border-black text-white' : 'bg-gray-50 border-black/20 text-black hover:border-black'}
          `}
        >
          <div>
            <h3 className="text-sm font-sans uppercase tracking-[0.2em] font-bold">Lace & Pearl Embellishments</h3>
            <p className={`text-[10px] mt-1 font-light tracking-widest ${orderData.hasPearlWork ? 'text-gray-400' : 'text-brand-dark-gray'}`}>
              Add hand-stitched pearl detailing or premium lace borders along the collars and cuffs.
            </p>
          </div>
          
          <div className={`w-6 h-6 border flex items-center justify-center transition-all ${orderData.hasPearlWork ? 'border-white bg-white' : 'border-black'}`}>
            {orderData.hasPearlWork && <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Extras;
