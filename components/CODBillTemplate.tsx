import React from 'react';
import { type Order } from '../types';

interface CODBillTemplateProps {
  order: Order;
}

const CODBillTemplate: React.FC<CODBillTemplateProps> = ({ order }) => {
  const items = order.items || [];
  const total = order.price || items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const delivery = order.orderData?.deliveryDetails;

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #cod-bill-print, #cod-bill-print * { visibility: visible !important; }
          #cod-bill-print { position: fixed; top: 0; left: 0; width: 80mm; padding: 8px; font-family: monospace; font-size: 11px; }
        }
      `}</style>

      <div id="cod-bill-print" className="font-mono text-xs text-slate-900 max-w-xs border border-slate-300 rounded-lg p-5 bg-white">
        {/* Header */}
        <div className="text-center border-b border-dashed border-slate-300 pb-3 mb-3">
          <p className="font-black text-base tracking-widest uppercase">FiroFits</p>
          <p className="text-[10px] text-slate-500">Bespoke Tailoring & Boutique</p>
          <div className="mt-2 bg-slate-900 text-white text-center py-1.5 px-3 rounded font-black uppercase tracking-widest text-xs">
            💵 CASH ON DELIVERY
          </div>
        </div>

        {/* Order ID Barcode-style */}
        <div className="text-center mb-3 py-2 border border-dashed border-slate-200 rounded">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Order ID</p>
          <p className="font-black text-lg tracking-widest">{order.id}</p>
          {/* Visual barcode approximation using monospace */}
          <p className="text-[6px] leading-none mt-1 text-slate-800 tracking-[0.3em] font-black select-none overflow-hidden">
            {'|'.repeat(8)} {order.id.replace(/[^A-Z0-9]/g, '').split('').join(' ')} {'|'.repeat(8)}
          </p>
          <p className="text-[8px] text-slate-400 mt-1">{new Date(order.date).toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
        </div>

        {/* Delivery Address */}
        {delivery && (
          <div className="mb-3 pb-3 border-b border-dashed border-slate-200">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Ship To:</p>
            <p className="font-bold">{delivery.fullName || order.customerName}</p>
            {delivery.address && <p className="text-[10px]">{delivery.address}</p>}
            {delivery.cityPostal && <p className="text-[10px]">{delivery.cityPostal}</p>}
            {delivery.district && <p className="text-[10px]">{delivery.district}</p>}
            {delivery.mobile && <p className="text-[10px]">📞 {delivery.mobile}</p>}
          </div>
        )}

        {/* Items */}
        {items.length > 0 && (
          <div className="mb-3 pb-3 border-b border-dashed border-slate-200">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Items:</p>
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-[10px] py-0.5">
                <span className="truncate max-w-[55%]">{item.productName} ×{item.quantity}</span>
                <span className="font-bold">Rs.{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center bg-slate-900 text-white px-3 py-2 rounded font-black">
          <span className="text-xs uppercase tracking-widest">AMOUNT DUE</span>
          <span className="text-sm font-mono">Rs. {total.toLocaleString()}</span>
        </div>

        <p className="text-center text-[9px] text-slate-400 mt-3">Please collect exact amount at delivery. Thank you!</p>
        <p className="text-center text-[9px] text-slate-400">www.firofits.com</p>
      </div>
    </>
  );
};

export const printCODBill = () => window.print();

export default CODBillTemplate;
