import React, { useState } from 'react';
import { type Order, OrderStatus } from '../types';
import { getAllOrders } from '../services/supabaseClient';

const STATUS_STEPS = [
  OrderStatus.PENDING_QUOTE,
  OrderStatus.FABRIC_SOURCING,
  OrderStatus.STITCHING,
  OrderStatus.FINISHING,
  OrderStatus.READY_FOR_DELIVERY,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
];

const STATUS_ICONS: Record<string, string> = {
  [OrderStatus.PENDING_QUOTE]: '📋',
  [OrderStatus.FABRIC_SOURCING]: '🧵',
  [OrderStatus.STITCHING]: '🪡',
  [OrderStatus.FINISHING]: '✨',
  [OrderStatus.READY_FOR_DELIVERY]: '📦',
  [OrderStatus.SHIPPED]: '🚚',
  [OrderStatus.DELIVERED]: '✅',
  [OrderStatus.CANCELLED]: '❌',
};

const STATUS_DESC: Record<string, string> = {
  [OrderStatus.PENDING_QUOTE]: 'Your order has been received and is awaiting a price quote from our team.',
  [OrderStatus.FABRIC_SOURCING]: 'We are sourcing the perfect fabric for your garment.',
  [OrderStatus.STITCHING]: 'Your garment is currently being stitched by our master tailors.',
  [OrderStatus.FINISHING]: 'Final pressing, quality checks, and finishing touches are being applied.',
  [OrderStatus.READY_FOR_DELIVERY]: 'Your order is packed and ready to be shipped.',
  [OrderStatus.SHIPPED]: 'Your order has been dispatched and is on the way to you.',
  [OrderStatus.DELIVERED]: 'Your order has been successfully delivered. Enjoy!',
  [OrderStatus.CANCELLED]: 'This order has been cancelled.',
};

const OrderTracking: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setIsLoading(true);
    setNotFound(false);
    setOrder(null);
    try {
      const allOrders = await getAllOrders();
      const found = allOrders.find(o => o.id.toLowerCase() === orderId.trim().toLowerCase());
      if (found) setOrder(found);
      else setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  const stepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;
  const isCancelled = order?.status === OrderStatus.CANCELLED;

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-24 pb-32 font-sans animate-fade-in">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3">FiroFits</p>
          <h1 className="text-5xl font-serif uppercase tracking-tight text-slate-900">Order Tracking</h1>
          <p className="text-slate-500 text-sm mt-3">Enter your Order ID to get a real-time status update.</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Order ID</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              placeholder="e.g. ORD-8921"
              className="flex-1 border border-slate-200 focus:border-slate-400 focus:ring-0 px-5 py-3.5 text-sm font-mono font-bold rounded-xl placeholder-slate-300 tracking-widest"
            />
            <button type="submit" disabled={isLoading}
              className="px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 shadow-md">
              {isLoading ? '...' : 'Track'}
            </button>
          </div>
        </form>

        {/* Not Found */}
        {notFound && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-8">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-red-700 font-bold text-sm">No order found with ID: <span className="font-mono">{orderId}</span></p>
            <p className="text-red-400 text-xs mt-1">Please double-check your Order ID from your confirmation email or receipt.</p>
          </div>
        )}

        {/* Order Found */}
        {order && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Order Header */}
            <div className="bg-slate-900 text-white px-8 py-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Order</p>
                  <p className="font-mono font-black text-2xl tracking-widest">{order.id}</p>
                  <p className="text-white/60 text-xs mt-2">Placed on {new Date(order.date).toLocaleDateString('en-LK', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Customer</p>
                  <p className="font-bold text-sm">{order.customerName}</p>
                  {order.price && <p className="text-white/60 text-sm font-mono mt-1">Rs. {order.price.toLocaleString()}</p>}
                </div>
              </div>
            </div>

            {/* Status Banner */}
            <div className={`px-8 py-4 flex items-center gap-3 ${isCancelled ? 'bg-red-50' : 'bg-emerald-50'}`}>
              <span className="text-2xl">{STATUS_ICONS[order.status] || '📦'}</span>
              <div>
                <p className={`font-black text-sm uppercase tracking-wider ${isCancelled ? 'text-red-700' : 'text-emerald-700'}`}>{order.status}</p>
                <p className="text-xs text-slate-500 mt-0.5">{STATUS_DESC[order.status] || ''}</p>
              </div>
            </div>

            {/* Progress Timeline */}
            {!isCancelled && (
              <div className="px-8 py-8">
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-6">Progress</p>
                <div className="space-y-0">
                  {STATUS_STEPS.map((step, idx) => {
                    const isDone = idx < stepIndex;
                    const isCurrent = idx === stepIndex;
                    const isPending = idx > stepIndex;
                    return (
                      <div key={step} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                            isDone ? 'bg-emerald-500 border-emerald-500 text-white' :
                            isCurrent ? 'bg-slate-900 border-slate-900 text-white ring-4 ring-slate-200' :
                            'bg-white border-slate-200 text-slate-300'
                          }`}>
                            {isDone ? '✓' : isCurrent ? STATUS_ICONS[step] : <span className="text-[10px]">{idx + 1}</span>}
                          </div>
                          {idx < STATUS_STEPS.length - 1 && (
                            <div className={`w-0.5 h-8 ${isDone ? 'bg-emerald-400' : 'bg-slate-200'}`}/>
                          )}
                        </div>
                        <div className="pb-6 flex-1">
                          <p className={`text-sm font-bold ${isCurrent ? 'text-slate-900' : isDone ? 'text-emerald-600' : 'text-slate-300'}`}>{step}</p>
                          {isCurrent && <p className="text-xs text-slate-500 mt-0.5">{STATUS_DESC[step]}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Payment info */}
            {order.paymentStatus && (
              <div className="px-8 py-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Payment Status</span>
                <span className="text-xs font-bold text-slate-700">{order.paymentStatus}</span>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-xs text-slate-400 mt-8">
          Need help? Contact us at <a href="mailto:support@firofits.com" className="underline hover:text-slate-700 transition-colors">support@firofits.com</a>
        </p>
      </div>
    </div>
  );
};

export default OrderTracking;
