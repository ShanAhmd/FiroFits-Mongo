import React from 'react';
import { type OrderData } from '../types';

interface DeliveryDetailsProps {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
}

const DeliveryDetails: React.FC<DeliveryDetailsProps> = ({ orderData, updateOrderData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateOrderData({
      deliveryDetails: {
        ...orderData.deliveryDetails,
        [name]: value,
      },
    });
  };

  const sriLankaDistricts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle",
    "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle",
    "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Moneragala",
    "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura",
    "Trincomalee", "Vavuniya"
  ];

  return (
    <div className="animate-fade-in space-y-12">
      <div className="border-b border-black pb-6">
        <span className="text-[10px] uppercase tracking-[0.4em] text-brand-dark-gray font-bold block mb-2">Step 05</span>
        <h2 className="text-4xl font-serif text-black uppercase tracking-tighter">Delivery & Billing</h2>
        <p className="text-xs text-brand-dark-gray font-light mt-2 tracking-wide">
          Please provide your shipping destination and contact specifications.
        </p>
      </div>

      <div className="space-y-12">
        {/* SECTION 1: Delivery Information */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-black border-b border-black/20 pb-2">
            1. Delivery Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[9px] uppercase tracking-[0.25em] font-bold text-brand-dark-gray mb-1" htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full bg-transparent border border-black/20 focus:border-black focus:ring-0 px-4 py-3 text-xs font-bold uppercase tracking-widest text-black rounded-none transition-colors placeholder-gray-300 font-sans"
                id="fullName"
                name="fullName"
                type="text"
                placeholder="e.g., Firosiya Begam"
                value={orderData.deliveryDetails.fullName || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[9px] uppercase tracking-[0.25em] font-bold text-brand-dark-gray mb-1" htmlFor="address">
                Delivery Address (Door No, Street Name & Area) <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full bg-transparent border border-black/20 focus:border-black focus:ring-0 px-4 py-3 text-xs font-bold uppercase tracking-widest text-black rounded-none transition-colors placeholder-gray-300 font-sans resize-none"
                id="address"
                name="address"
                rows={3}
                placeholder="e.g., No. 42, Temple Road, Jaffna"
                value={orderData.deliveryDetails.address || ''}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-[9px] uppercase tracking-[0.25em] font-bold text-brand-dark-gray mb-1" htmlFor="cityPostal">
                City & Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full bg-transparent border border-black/20 focus:border-black focus:ring-0 px-4 py-3 text-xs font-bold uppercase tracking-widest text-black rounded-none transition-colors placeholder-gray-300 font-sans"
                id="cityPostal"
                name="cityPostal"
                type="text"
                placeholder="e.g., Jaffna 40000"
                value={orderData.deliveryDetails.cityPostal || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase tracking-[0.25em] font-bold text-brand-dark-gray mb-1" htmlFor="district">
                District <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full bg-white border border-black/20 focus:border-black focus:ring-0 px-4 py-3 text-xs font-bold uppercase tracking-widest text-black rounded-none transition-colors font-sans"
                id="district"
                name="district"
                value={orderData.deliveryDetails.district || ''}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select District</option>
                {sriLankaDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: Contact Details */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-black border-b border-black/20 pb-2">
            2. Contact Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[9px] uppercase tracking-[0.25em] font-bold text-brand-dark-gray mb-1" htmlFor="mobile">
                Mobile Number (Courier Delivery) <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full bg-transparent border border-black/20 focus:border-black focus:ring-0 px-4 py-3 text-xs font-bold uppercase tracking-widest text-black rounded-none transition-colors placeholder-gray-300 font-sans"
                id="mobile"
                name="mobile"
                type="tel"
                placeholder="e.g., 0771234567"
                value={orderData.deliveryDetails.mobile || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase tracking-[0.25em] font-bold text-brand-dark-gray mb-1" htmlFor="altMobile">
                Alternative Number (Optional)
              </label>
              <input
                className="w-full bg-transparent border border-black/20 focus:border-black focus:ring-0 px-4 py-3 text-xs font-bold uppercase tracking-widest text-black rounded-none transition-colors placeholder-gray-300 font-sans"
                id="altMobile"
                name="altMobile"
                type="tel"
                placeholder="e.g., 0717654321"
                value={orderData.deliveryDetails.altMobile || ''}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[9px] uppercase tracking-[0.25em] font-bold text-brand-dark-gray mb-1" htmlFor="email">
                Email Address (For Bill & Tracking) <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full bg-transparent border border-black/20 focus:border-black focus:ring-0 px-4 py-3 text-xs font-bold uppercase tracking-widest text-black rounded-none transition-colors placeholder-gray-300 font-sans"
                id="email"
                name="email"
                type="email"
                placeholder="e.g., customer@example.com"
                value={orderData.deliveryDetails.email || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Order & Payment Details */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-black border-b border-black/20 pb-2">
            3. Order & Payment Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[9px] uppercase tracking-[0.25em] font-bold text-brand-dark-gray mb-3">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider text-black font-bold">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={orderData.deliveryDetails.paymentMethod === 'COD'}
                    onChange={handleChange}
                    className="h-4 w-4 border-black text-black focus:ring-black"
                  />
                  Cash on Delivery (COD)
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider text-black font-bold">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online Transfer"
                    checked={orderData.deliveryDetails.paymentMethod === 'Online Transfer'}
                    onChange={handleChange}
                    className="h-4 w-4 border-black text-black focus:ring-black"
                  />
                  Online Transfer
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[9px] uppercase tracking-[0.25em] font-bold text-brand-dark-gray mb-1" htmlFor="deliveryDate">
                Required Delivery Date <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full bg-transparent border border-black/20 focus:border-black focus:ring-0 px-4 py-3 text-xs font-bold tracking-widest text-black rounded-none transition-colors font-sans"
                id="deliveryDate"
                name="deliveryDate"
                type="date"
                value={orderData.deliveryDetails.deliveryDate || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;