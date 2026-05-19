import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { type Order, OrderStatus } from '../types';
import InvoiceTemplate from './InvoiceTemplate';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus, internalNotes?: string) => void;
  isAdmin?: boolean;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose, onUpdateStatus, isAdmin = false }) => {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [showInvoice, setShowInvoice] = useState(false);
  const [internalNotes, setInternalNotes] = useState(order.internalNotes || '');

  const handleSave = () => {
    if (onUpdateStatus) {
      if (status !== order.status || internalNotes !== (order.internalNotes || '')) {
        onUpdateStatus(order.id, status, internalNotes);
      }
    }
    onClose();
  };

  const hasMultipleItems = order.orderData.customItems && order.orderData.customItems.length > 0;

  if (showInvoice) {
    return <InvoiceTemplate order={order} onClose={() => setShowInvoice(false)} />;
  }

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
              {hasMultipleItems ? 'Multiple Bespoke Garments' : order.garmentType}
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

          {/* Admin Internal Notes (Only visible if Admin) */}
          {isAdmin && (
            <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Private Internal Notes
              </h3>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="E.g., Customer called to change fabric to silk, quoted extra Rs. 2,000..."
                className="w-full bg-white border border-amber-200 p-3 text-xs font-medium rounded-lg text-amber-900 focus:border-amber-500 focus:ring-amber-500 min-h-[80px]"
              />
              <p className="text-[9px] font-bold text-amber-700">These notes are strictly confidential and will not be visible to the customer.</p>
            </div>
          )}

          {/* Multiple items layout */}
          {hasMultipleItems ? (
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Garments in this Order ({order.orderData.customItems.length})
              </h3>
              
              {order.orderData.customItems.map((item: any, idx: number) => (
                <div key={item.id || idx} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-xs font-bold text-slate-800 uppercase">
                      #{idx + 1}: {item.service === 'Other' ? `Other: ${item.customGarmentName || 'Not Specified'}` : item.service}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded">
                      Stitch Details
                    </span>
                  </div>

                  {/* Measurements */}
                  {item.measurements && Object.keys(item.measurements).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                        Measurements ({item.unit || 'in'})
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(item.measurements).map(([key, val]) => (
                          val ? (
                            <div key={key} className="bg-slate-50 p-2 rounded border border-slate-100/50">
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                              <p className="text-[10px] font-bold text-slate-800 mt-0.5">{val as string}</p>
                            </div>
                          ) : null
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add-ons */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Pearl Work:</span>
                    <span className="text-xs font-bold text-slate-700">
                      {item.hasPearlWork ? 'Yes (Pearl Work detailing requested)' : 'No'}
                    </span>
                  </div>

                  {/* Reference Files */}
                  {item.designFileData && item.designFileData.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Uploaded designs:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {item.designFileData.map((file: any, fIdx: number) => (
                          <a
                            key={fIdx}
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg p-2 flex items-center justify-between text-xs text-emerald-600 transition-colors"
                          >
                            <span className="truncate max-w-[120px] font-mono text-[9px] text-slate-700">{file.name}</span>
                            <span className="text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">View</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special Instructions */}
                  {item.specialInstructions && (
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Special Instructions:</h4>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {item.specialInstructions}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Single item layout
            <div className="space-y-6">
              {/* Measurements */}
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
              {order.designFileData && order.designFileData.length > 0 && (
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
                   <h3 className="text-xs font-semibold text-slate-400">Design Uploads</h3>
                   <div className="grid grid-cols-2 gap-3">
                     {order.designFileData.map((file, i) => (
                       <a
                         key={i}
                         href={file.url}
                         target="_blank"
                         rel="noreferrer"
                         className="bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-lg p-3 flex items-center justify-between text-xs text-emerald-600 transition-colors"
                       >
                         <span className="truncate max-w-[120px] font-mono text-[10px] text-slate-700">{file.name}</span>
                         <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold uppercase">View</span>
                       </a>
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
          )}

          {/* Delivery & Fulfillment Details */}
          {order.orderData.deliveryDetails && (
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery & Fulfillment Details</h3>
                <span className="text-[10px] font-extrabold uppercase bg-slate-900 text-white px-2.5 py-1 rounded-md">
                  {order.orderData.deliveryDetails.paymentMethod || 'Online Transfer'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recipient Name</span>
                  <span className="font-bold text-slate-800">{order.orderData.deliveryDetails.fullName || order.customerName || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery Date Target</span>
                  <span className="font-bold text-slate-800">{order.orderData.deliveryDetails.deliveryDate || 'Flexible'}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery Address</span>
                  <span className="font-medium text-slate-700 block mt-0.5">
                    {order.orderData.deliveryDetails.address}
                  </span>
                  <span className="font-medium text-slate-700 block mt-0.5">
                    {order.orderData.deliveryDetails.cityPostal && `${order.orderData.deliveryDetails.cityPostal}, `}
                    {order.orderData.deliveryDetails.district && `${order.orderData.deliveryDetails.district} District`}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Number</span>
                  <span className="font-bold text-slate-800 font-mono">{order.orderData.deliveryDetails.mobile || (order.orderData.deliveryDetails as any).contact || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alt Contact Number</span>
                  <span className="font-bold text-slate-800 font-mono">{order.orderData.deliveryDetails.altMobile || 'None Provided'}</span>
                </div>
                {order.orderData.deliveryDetails.email && (
                  <div className="col-span-2">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                    <span className="font-semibold text-slate-800 font-mono">{order.orderData.deliveryDetails.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowInvoice(true)}
            className="flex-1 py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold uppercase tracking-widest text-[10px] rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Print Invoice
          </button>
          <div className="flex gap-3 flex-1">
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg transition-all"
            >
              {isAdmin ? 'Save Changes' : 'Close Details'}
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-6 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold uppercase tracking-widest text-[10px] rounded-lg transition-all border border-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OrderDetailsModal;