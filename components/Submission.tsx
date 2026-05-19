import React, { useState } from 'react';
import { type OrderData, type User, type View, GarmentType } from '../types';
import { createOrder } from '../services/supabaseClient';

interface SubmissionProps {
  orderData: OrderData;
  user: User;
  navigateTo: (view: View) => void;
  prevStep: () => void;
}

const Submission: React.FC<SubmissionProps> = ({ orderData, user, navigateTo, prevStep }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      if (!orderData.customItems || orderData.customItems.length === 0) {
        throw new Error("Please configure at least one garment before submitting.");
      }

      await createOrder({
        userId: user.id,
        customerName: orderData.deliveryDetails.fullName || user.name,
        garmentType: orderData.customItems.length > 1 ? GarmentType.MULTIPLE : orderData.customItems[0].service,
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
        <div className="border-b border-black/15 pb-4">
          <h3 className="text-xs font-serif text-black font-bold uppercase tracking-wider">
            Custom Tailoring Items ({orderData.customItems ? orderData.customItems.length : 0})
          </h3>
        </div>

        {/* List of Custom Items */}
        {orderData.customItems && orderData.customItems.length > 0 ? (
          <div className="space-y-8">
            {orderData.customItems.map((item, idx) => (
              <div key={item.id} className="border-b border-black/10 pb-6 last:border-0 last:pb-0 space-y-4">
                <div className="flex justify-between items-center bg-black/[0.03] p-3">
                  <span className="text-xs font-bold text-black uppercase tracking-wider font-sans">
                    Dress #{idx + 1} — {item.service === GarmentType.OTHER 
                      ? `Other Design: ${item.customGarmentName || 'Not Specified'}` 
                      : item.service}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] bg-black text-white px-2 py-0.5 font-bold">
                    Custom Fit
                  </span>
                </div>

                {/* Reference Files & Instructions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <h4 className="text-[9px] font-sans text-brand-dark-gray font-bold uppercase tracking-widest mb-2 border-b border-black/5 pb-1">
                      Reference Designs
                    </h4>
                    {item.designFiles && item.designFiles.length > 0 ? (
                      <div className="space-y-1">
                        {item.designFiles.map((file, fIdx) => (
                          <p key={fIdx} className="text-xs font-medium text-black truncate">
                            ✓ {file.name} ({(file.size / 1024).toFixed(1)} KB)
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-light text-brand-dark-gray uppercase tracking-widest">No reference files</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-[9px] font-sans text-brand-dark-gray font-bold uppercase tracking-widest mb-2 border-b border-black/5 pb-1">
                      Special Instructions
                    </h4>
                    <p className="text-xs font-light text-black leading-relaxed whitespace-pre-line">
                      {item.specialInstructions || 'None'}
                    </p>
                  </div>
                </div>

                {/* Measurements */}
                <div className="pt-2">
                  <h4 className="text-[9px] font-sans text-brand-dark-gray font-bold uppercase tracking-widest mb-2 border-b border-black/5 pb-1">
                    Measurements ({item.unit})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-6">
                    {Object.entries(item.measurements).map(([key, val]) => (
                      val && (
                        <div key={key}>
                          <p className="text-[8px] uppercase tracking-[0.2em] text-brand-dark-gray font-light">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <p className="text-xs font-bold text-black uppercase">{val}</p>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                {/* Extras */}
                <div className="pt-2">
                  <h4 className="text-[9px] font-sans text-brand-dark-gray font-bold uppercase tracking-widest mb-1 border-b border-black/5 pb-1">
                    Add-ons & Pearl Work
                  </h4>
                  <p className="text-xs font-bold text-black uppercase tracking-wider">
                    Pearl Work Detailing: {item.hasPearlWork ? 'Included' : 'Not Included'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm font-bold text-red-500 uppercase tracking-widest">No garments added yet.</p>
        )}

        {/* Logistics & Contact Details */}
        <div className="space-y-6 pt-6 border-t border-black/20">
          <h3 className="text-[10px] font-sans text-black font-bold uppercase tracking-[0.3em] border-b border-black/20 pb-2">
            Logistics & Contact Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-[8px] uppercase tracking-[0.25em] text-brand-dark-gray font-bold">1. Delivery Information</p>
              <p className="text-xs font-bold text-black uppercase tracking-wider">{orderData.deliveryDetails.fullName}</p>
              <p className="text-xs font-light text-black uppercase leading-relaxed">{orderData.deliveryDetails.address}</p>
              <p className="text-xs font-medium text-black uppercase tracking-wide">City: {orderData.deliveryDetails.cityPostal}</p>
              <p className="text-xs font-bold text-black uppercase">District: {orderData.deliveryDetails.district}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-[8px] uppercase tracking-[0.25em] text-brand-dark-gray font-bold">2. Contact Details</p>
              <p className="text-xs font-bold text-black">Primary: {orderData.deliveryDetails.mobile}</p>
              {orderData.deliveryDetails.altMobile && (
                <p className="text-xs font-medium text-black">Secondary: {orderData.deliveryDetails.altMobile}</p>
              )}
              <p className="text-xs font-light text-black truncate">{orderData.deliveryDetails.email}</p>
            </div>

            <div className="space-y-1">
              <p className="text-[8px] uppercase tracking-[0.25em] text-brand-dark-gray font-bold">3. Order Details</p>
              <p className="text-xs font-bold text-black uppercase">Payment Method: {orderData.deliveryDetails.paymentMethod}</p>
              <p className="text-xs font-bold text-black uppercase tracking-wider">Required By: {orderData.deliveryDetails.deliveryDate}</p>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-[10px] uppercase tracking-[0.2em] text-red-600 font-bold bg-red-50 p-4 border border-red-200">{error}</p>}

      <div className="pt-8 flex gap-4">
        <button
          type="button"
          onClick={prevStep}
          disabled={isSubmitting}
          className="flex-1 py-5 bg-transparent border border-black text-black font-bold uppercase text-[10px] tracking-[0.4em] transition-all hover:bg-gray-100 disabled:opacity-30"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setShowConfirmModal(true)}
          disabled={isSubmitting}
          className="flex-[2] py-5 bg-black hover:bg-gray-900 text-white font-bold uppercase text-[10px] tracking-[0.4em] transition-all disabled:bg-gray-300"
        >
          {isSubmitting ? 'Submitting Order...' : 'Confirm Order'}
        </button>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-black max-w-md w-full p-8 space-y-6 shadow-2xl">
            <h3 className="text-2xl font-serif text-black uppercase tracking-tight">Confirm Submission</h3>
            <p className="text-xs text-brand-dark-gray leading-relaxed font-light uppercase tracking-wider">
              Are you sure you want to submit this custom order with the provided measurements and logistics details?
            </p>
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-4 border border-black/20 hover:border-black text-black text-[10px] uppercase tracking-[0.3em] font-bold transition-all bg-white"
              >
                No, Go Back
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  handleSubmit();
                }}
                className="flex-1 py-4 bg-black hover:bg-gray-900 text-white text-[10px] uppercase tracking-[0.3em] font-bold transition-all"
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submission;