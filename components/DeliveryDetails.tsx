import React from 'react';
import { type OrderData, type DeliveryDetails } from '../types';

interface DeliveryDetailsProps {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
}

const DeliveryDetailsForm: React.FC<DeliveryDetailsProps> = ({ orderData, updateOrderData }) => {
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedDetails: DeliveryDetails = { ...orderData.deliveryDetails, [name]: value };
    updateOrderData({ deliveryDetails: updatedDetails });
  };
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-charcoal mb-2">Delivery Details</h2>
      <p className="text-brand-dark-gray mb-8">Where should we send your completed order?</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <label htmlFor="name" className="block text-base font-semibold text-brand-charcoal">Full Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={orderData.deliveryDetails.name}
            onChange={handleDetailsChange}
            className="mt-2 block w-full shadow-sm border-brand-light-gray rounded-xl focus:ring-brand-teal focus:border-brand-teal px-4 py-3 text-lg"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="contact" className="block text-base font-semibold text-brand-charcoal">Contact Number</label>
          <input
            type="text"
            name="contact"
            id="contact"
            value={orderData.deliveryDetails.contact}
            onChange={handleDetailsChange}
            className="mt-2 block w-full shadow-sm border-brand-light-gray rounded-xl focus:ring-brand-teal focus:border-brand-teal px-4 py-3 text-lg"
            placeholder="077 123 4567"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-base font-semibold text-brand-charcoal">Delivery Address</label>
          <textarea
            name="address"
            id="address"
            rows={3}
            value={orderData.deliveryDetails.address}
            onChange={handleDetailsChange}
            className="mt-2 block w-full shadow-sm border-brand-light-gray rounded-xl focus:ring-brand-teal focus:border-brand-teal px-4 py-3 text-lg"
            placeholder="123 Main Street, Colombo"
          ></textarea>
        </div>
        <div>
          <label htmlFor="deliveryDate" className="block text-base font-semibold text-brand-charcoal">Desired Delivery Date</label>
          <input
            type="date"
            name="deliveryDate"
            id="deliveryDate"
            value={orderData.deliveryDetails.deliveryDate}
            onChange={handleDetailsChange}
            className="mt-2 block w-full shadow-sm border-brand-light-gray rounded-xl focus:ring-brand-teal focus:border-brand-teal px-4 py-3 text-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetailsForm;