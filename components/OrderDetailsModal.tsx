import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { type Order, OrderStatus } from '../types';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => void;
  isAdmin?: boolean;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose, onUpdateStatus, isAdmin = false }) => {
  const [status, setStatus] = useState<OrderStatus>(order.status);

  const handleSave = () => {
    if (onUpdateStatus && status !== order.status) {
      onUpdateStatus(order.id, status);
    }
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white border-l border-slate-100 w-full max-w-xl h-full overflow-y-auto flex flex-col animate-fade-in custom-scrollbar font-sans">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white z-10">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Order Details
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {order.garmentType}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Order: <span className="font-mono text-slate-800">{order.id.slice(0, 8)}</span> | Customer: <span className="text-slate-800 font-semibold">{order.customerName}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1 bg-slate-50/50">
          
          {/* Status Control */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
             <h3 className="text-xs font-semibold text-slate-400">Order Status</h3>
             {isAdmin ? (
               <select
                 value={status}
                 onChange={(e) => setStatus(e.target.value as OrderStatus)}
                 className="w-full bg-white border border-slate-200 p-2.5 text-xs font-semibold rounded-lg text-slate-700 focus:border-emerald-500 focus:ring-emerald-500 cursor-pointer"
               >
                 {Object.values(OrderStatus).map((s) => (
                   <option key={s} value={s}>{s}</option>
                 ))}
               </select>
             ) : (
               <div className="bg-slate-900 text-white px-4 py-2 text-xs font-semibold rounded-lg inline-block">
                 {order.status}
               </div>
             )}
          </div>

          {/* Dimension Array */}
          {order.orderData.measurements && Object.keys(order.orderData.measurements).length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
               <h3 className="text-xs font-semibold text-slate-400">Measurements ({order.orderData.unit})</h3>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                 {Object.entries(order.orderData.measurements).map(([key, val]) => (
                   val ? (
                     <div key={key} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                       <p className="text-[10px] font-semibold text-slate-400">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                       <p className="text-xs font-bold text-slate-800 mt-0.5">{val}</p>
                     </div>
                   ) : null
                 ))}
               </div>
            </div>
          )}

          {/* Reference Assets */}
          {order.orderData.designFiles && order.orderData.designFiles.length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
               <h3 className="text-xs font-semibold text-slate-400">Design Uploads</h3>
               <div className="grid grid-cols-2 gap-3">
                 {order.orderData.designFiles.map((file, i) => (
                   <div key={i} className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center justify-between text-xs text-slate-700">
                     <span className="truncate max-w-[120px] font-mono text-[10px]">{file.name}</span>
                     <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">Asset</span>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* Special Instructions */}
          {order.orderData.specialInstructions && (
             <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
               <h3 className="text-xs font-semibold text-slate-400">Special Instructions</h3>
               <p className="text-xs text-slate-600 leading-relaxed p-4 bg-slate-50 rounded-lg border border-slate-100">
                 {order.orderData.specialInstructions}
               </p>
             </div>
          )}
          
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-all"
          >
            {isAdmin ? 'Save Changes' : 'Close Details'}
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg transition-all border border-slate-200/50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OrderDetailsModal;