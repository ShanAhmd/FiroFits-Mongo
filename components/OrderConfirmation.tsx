import React, { useEffect, useState } from 'react';
import { type View, type Order, User } from '../types';
import InvoiceTemplate from './InvoiceTemplate';

interface OrderConfirmationProps {
  navigateTo: (view: View) => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ navigateTo }) => {
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    // Fetch the most recent order from localStorage for the digital receipt
    try {
      const orders: Order[] = JSON.parse(localStorage.getItem('firofits_orders') || '[]');
      if (orders.length > 0) {
        // Sort by date/time to get the most recent, assuming the last one in the array is newest
        setLatestOrder(orders[orders.length - 1]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (showInvoice && latestOrder) {
    return <InvoiceTemplate order={latestOrder} onClose={() => setShowInvoice(false)} />;
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-16 px-4 space-y-12">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-4xl font-serif text-black uppercase tracking-tighter">Order Confirmed</h2>
        <p className="text-sm font-light text-brand-dark-gray max-w-md mx-auto leading-relaxed tracking-wide">
          Thank you for choosing FiroFits! Your bespoke tailoring request has been received securely.
        </p>
      </div>

      {latestOrder && (
        <div className="bg-white border border-gray-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Order Reference</p>
              <p className="text-xl font-mono font-black mt-1">{latestOrder.id}</p>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Status</p>
              <p className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full mt-1 inline-block uppercase tracking-wider">{latestOrder.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">Delivery Information</h4>
              <p className="font-bold text-gray-800">{latestOrder.orderData.deliveryDetails.fullName}</p>
              <p className="text-gray-600 mt-1">{latestOrder.orderData.deliveryDetails.address}</p>
              <p className="text-gray-600">{latestOrder.orderData.deliveryDetails.mobile}</p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">Order Summary</h4>
              <p className="font-bold text-gray-800">{latestOrder.garmentType}</p>
              <p className="text-gray-600 mt-1 uppercase text-xs">{latestOrder.orderData.deliveryDetails.paymentMethod}</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
             <button
               onClick={() => setShowInvoice(true)}
               className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-800 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
               View / Print Invoice
             </button>
             <div className="flex gap-4 w-full sm:w-auto">
               <button
                 onClick={() => navigateTo('dashboard')}
                 className="flex-1 sm:flex-none px-6 py-3 bg-black text-white font-bold uppercase tracking-widest text-[10px] hover:bg-gray-900 transition-colors text-center"
               >
                 Track Order
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
