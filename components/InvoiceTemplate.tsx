import React from 'react';
import { type Order, Unit, PaymentStatus } from '../types';

interface InvoiceTemplateProps {
  order: Order;
  onClose: () => void;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-500 overflow-y-auto print:bg-white print:overflow-visible">
      {/* Non-printable Action Bar */}
      <div className="sticky top-0 bg-black text-white p-4 flex justify-between items-center print:hidden z-10 shadow-lg">
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold">Invoice Preview</h3>
        <div className="flex gap-4">
          <button onClick={onClose} className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest hover:text-gray-300">
            Close
          </button>
          <button onClick={handlePrint} className="px-6 py-2 bg-white text-black text-[10px] uppercase font-bold tracking-widest hover:bg-gray-200 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Print to PDF
          </button>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div className="max-w-[800px] mx-auto bg-white min-h-screen my-8 p-12 shadow-2xl print:shadow-none print:m-0 print:p-8 font-sans">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-4 border-black pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-black uppercase tracking-tighter">FIROFITS</h1>
            <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-500 mt-2">Bespoke Tailoring & E-Commerce</p>
            <div className="mt-4 text-xs font-medium text-gray-600 space-y-1">
              <p>123 Fashion Avenue, Colombo</p>
              <p>contact@firofits.com | +94 77 123 4567</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-black text-gray-200 uppercase tracking-widest">INVOICE</h2>
            <div className="mt-4 space-y-1">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Order Ref</p>
              <p className="text-sm font-black">{order.id}</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mt-2">Date</p>
              <p className="text-sm font-bold">{order.date}</p>
            </div>
          </div>
        </div>

        {/* Customer & Payment Info */}
        <div className="flex justify-between mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Billed To</p>
            <p className="text-sm font-black uppercase tracking-wider">{order.customerName}</p>
            <div className="text-xs font-medium text-gray-600 mt-1 space-y-1">
              <p>{order.orderData.deliveryDetails.address}</p>
              <p>{order.orderData.deliveryDetails.cityPostal}</p>
              <p>{order.orderData.deliveryDetails.mobile}</p>
              <p>{order.orderData.deliveryDetails.email}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Payment Status</p>
            <div className={`inline-block px-4 py-1 text-[10px] font-bold uppercase tracking-widest border-2 ${
              order.paymentStatus === PaymentStatus.FULLY_PAID ? 'border-green-500 text-green-600' :
              order.paymentStatus === PaymentStatus.ADVANCE_PAID ? 'border-amber-500 text-amber-600' :
              'border-red-500 text-red-600'
            }`}>
              {order.paymentStatus || 'UNPAID'}
            </div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mt-4 mb-1">Method</p>
            <p className="text-xs font-bold uppercase">{order.orderData.deliveryDetails.paymentMethod}</p>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full mb-12 text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-3 text-[10px] uppercase tracking-[0.2em] font-bold">Item Description</th>
              <th className="py-3 text-[10px] uppercase tracking-[0.2em] font-bold">Type</th>
              <th className="py-3 text-[10px] uppercase tracking-[0.2em] font-bold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-6">
                <p className="font-bold uppercase tracking-wider text-sm">{order.orderData.customGarmentName || order.garmentType}</p>
                {order.orderData.specialInstructions && (
                  <p className="text-xs text-gray-500 mt-2 max-w-sm italic">Note: {order.orderData.specialInstructions}</p>
                )}
                {order.orderData.hasPearlWork && (
                  <span className="inline-block mt-2 px-2 py-1 bg-black text-white text-[8px] uppercase tracking-widest font-bold">Includes Pearl Work</span>
                )}
              </td>
              <td className="py-6 text-xs font-bold text-gray-500 uppercase">Bespoke Custom</td>
              <td className="py-6 text-right font-black text-lg">
                {order.price ? `Rs. ${order.price.toLocaleString()}` : 'PENDING QUOTE'}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Custom Measurements Box (For tailoring packing slip) */}
        <div className="bg-gray-50 border border-gray-200 p-6 mb-12">
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-4 border-b border-gray-200 pb-2">Client Measurements ({order.orderData.unit})</p>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(order.orderData.measurements).map(([key, value]) => value && (
              <div key={key}>
                <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-gray-400 block">{key}</span>
                <span className="text-sm font-black">{value} {order.orderData.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals & Footer */}
        <div className="flex justify-end border-t-4 border-black pt-6 mb-16">
          <div className="w-64">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Subtotal</span>
              <span className="text-xs font-bold">{order.price ? `Rs. ${order.price.toLocaleString()}` : '-'}</span>
            </div>
            <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Shipping</span>
              <span className="text-xs font-bold">Standard</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-sm font-black uppercase tracking-widest">Total Due</span>
              <span className="text-2xl font-serif font-black">{order.price ? `Rs. ${order.price.toLocaleString()}` : 'TBD'}</span>
            </div>
          </div>
        </div>

        <div className="text-center text-[9px] uppercase tracking-widest font-bold text-gray-400">
          <p>Thank you for choosing FiroFits for your bespoke fashion.</p>
          <p className="mt-1">All custom tailoring sales are final.</p>
        </div>

      </div>
    </div>
  );
};

export default InvoiceTemplate;
