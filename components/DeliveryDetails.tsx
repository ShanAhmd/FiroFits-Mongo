import React from 'react';
import { type OrderData } from '../types';

interface DeliveryDetailsProps {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
}

const DeliveryDetails: React.FC<DeliveryDetailsProps> = ({ orderData, updateOrderData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateOrderData({
      deliveryDetails: {
        ...orderData.deliveryDetails,
        [name]: value,
      },
    });
  };

  return (
    <div className="animate-fade-in space-y-12">
      <div className="border-b border-black pb-6">
        <span className="text-[10px] uppercase tracking-[0.4em] text-brand-dark-gray font-bold block mb-2">Step 05</span>
        <h2 className="text-4xl font-serif text-black uppercase tracking-tighter">Delivery Details</h2>
        <p className="text-xs text-brand-dark-gray font-light mt-2 tracking-wide">
          Please provide your shipping address and contact information.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-black mb-1" htmlFor="name">
            Full Name
          </label>
          <input
            className="w-full bg-transparent border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-3 text-sm font-bold uppercase tracking-widest text-black rounded-none transition-colors placeholder-gray-300 font-sans"
            id="name"
            name="name"
            type="text"
            placeholder="e.g. John Doe"
            value={orderData.deliveryDetails.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-black mb-1" htmlFor="contact">
            Contact Number
          </label>
          <input
            className="w-full bg-transparent border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-3 text-sm font-bold uppercase tracking-widest text-black rounded-none transition-colors placeholder-gray-300 font-sans"
            id="contact"
            name="contact"
            type="tel"
            placeholder="e.g. 0771234567"
            value={orderData.deliveryDetails.contact}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-black mb-1" htmlFor="address">
            Shipping Address
          </label>
          <textarea
            className="w-full bg-transparent border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-3 text-sm font-bold uppercase tracking-widest text-black rounded-none transition-colors placeholder-gray-300 font-sans resize-none"
            id="address"
            name="address"
            rows={3}
            placeholder="House Name/Number, Street, City"
            value={orderData.deliveryDetails.address}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-black mb-1" htmlFor="deliveryDate">
            Required Delivery Date
          </label>
          <input
            className="w-full bg-transparent border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-3 text-sm font-bold tracking-widest text-black rounded-none transition-colors font-sans"
            id="deliveryDate"
            name="deliveryDate"
            type="date"
            value={orderData.deliveryDetails.deliveryDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;