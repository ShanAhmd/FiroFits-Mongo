import React from 'react';
import { type OrderData } from '../types';
import { SparklesIcon, InfoIcon } from './IconComponents';

interface ExtrasProps {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
}

const Extras: React.FC<ExtrasProps> = ({ orderData, updateOrderData }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-charcoal mb-2">Add Finishing Touches</h2>
      <p className="text-brand-dark-gray mb-8">Enhance your design with optional add-ons.</p>
      
      <div className="bg-white rounded-xl border border-brand-light-gray p-6">
          <label htmlFor="pearl-work" className="flex items-center cursor-pointer">
            <div className="relative flex items-center">
              <input
                id="pearl-work"
                name="pearl-work"
                type="checkbox"
                checked={orderData.hasPearlWork}
                onChange={e => updateOrderData({ hasPearlWork: e.target.checked })}
                className="appearance-none h-6 w-6 border-2 border-brand-light-gray rounded-md checked:bg-brand-teal checked:border-transparent focus:outline-none"
              />
              {orderData.hasPearlWork && (
                <svg className="absolute w-4 h-4 text-white left-1 top-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
            <div className="ml-4">
              <span className="font-semibold text-brand-charcoal flex items-center">
                <SparklesIcon className="h-5 w-5 text-yellow-500 mr-2" />
                Add Pearl Work
              </span>
              <p className="text-sm text-brand-dark-gray">Add a touch of elegance with beautiful pearl work.</p>
            </div>
          </label>
      </div>


      {orderData.hasPearlWork && (
        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 animate-fade-in">
          <div className="flex">
            <div className="flex-shrink-0">
               <InfoIcon className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                Pearl work will be quoted separately based on design complexity at approximately <span className="font-bold">Rs. 6.50 per pearl</span>. We will confirm the final price with you.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Extras;
