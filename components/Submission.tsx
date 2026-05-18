import React, { useState } from 'react';
import { type OrderData, type User, type View } from '../types';
import { createOrder } from '../services/supabaseClient';

interface SubmissionProps {
  orderData: OrderData;
  user: User;
  navigateTo: (view: View) => void;
}

const Submission: React.FC<SubmissionProps> = ({ orderData, user, navigateTo }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      if (!orderData.service) {
        throw new Error("Please select a style before submitting.");
      }

      await createOrder({
        userId: user.id,
        customerName: orderData.deliveryDetails.name || user.name,
        garmentType: orderData.service,
        items: [],
        orderData: orderData,
      });

      navigateTo('order-confirmation');
    } catch (err: any) {
      console.error('Order submission failed:', err);
      setError(err.message || 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-12">
      <div className="border-b border-black pb-6">
        <span className="text-[10px] uppercase tracking-[0.4em] text-brand-dark-gray font-bold block mb-2">Step 06</span>
        <h2 className="text-4xl font-serif text-black uppercase tracking-tighter">Review Your Order</h2>
        <p className="text-xs text-brand-dark-gray font-light mt-2 tracking-wide">
          Please review your details below and confirm your custom order.
        </p>
      </div>

      <div className="bg-gray-50 border border-black/20 p-8 space-y-8">
        <div>
          <h3 className="text-[10px] font-sans text-black font-bold uppercase tracking-[0.3em] border-b border-black/20 pb-2">
            Selected Style
          </h3>
          <p className="text-sm font-bold text-black uppercase mt-2">{orderData.service || 'NOT SELECTED'}</p>
        </div>

        <div>
          <h3 className="text-[10px] font-sans text-black font-bold uppercase tracking-[0.3em] border-b border-black/20 pb-2">
            Your Measurements ({orderData.unit})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8 mt-4">
            {Object.entries(orderData.measurements).map(([key, val]) => (
              val && (
                <div key={key}>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-brand-dark-gray font-bold">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-sm font-bold text-black uppercase">{val}</p>
                </div>
              )
            ))}
          </div>
        </div>

        <div>
           <h3 className="text-[10px] font-sans text-black font-bold uppercase tracking-[0.3em] border-b border-black/20 pb-2">
             Delivery Details
           </h3>
           <p className="text-xs font-bold text-black uppercase mt-2 tracking-widest">{orderData.deliveryDetails.name}</p>
           <p className="text-xs font-light text-black uppercase tracking-wide mt-1">{orderData.deliveryDetails.address}</p>
           <p className="text-xs font-bold text-black uppercase tracking-widest mt-1">PHONE: {orderData.deliveryDetails.contact}</p>
           <p className="text-xs font-light text-brand-dark-gray uppercase tracking-wide mt-1">REQUIRED BY: {orderData.deliveryDetails.deliveryDate}</p>
        </div>
      </div>

      {error && <p className="text-[10px] uppercase tracking-[0.2em] text-red-600 font-bold bg-red-50 p-4 border border-red-200">{error}</p>}

      <div className="pt-8">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-5 bg-black hover:bg-gray-900 text-white font-bold uppercase text-[10px] tracking-[0.4em] transition-all disabled:bg-gray-300"
        >
          {isSubmitting ? 'Submitting Order...' : 'Confirm Order'}
        </button>
      </div>
    </div>
  );
};

export default Submission;