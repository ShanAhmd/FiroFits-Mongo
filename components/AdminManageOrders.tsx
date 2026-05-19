import React, { useState, useEffect } from 'react';
import { type Order, OrderStatus, GarmentType, PaymentStatus } from '../types';
import { getAllOrders, updateOrderStatus } from '../services/supabaseClient';
import OrderDetailsModal from './OrderDetailsModal';

const getStatusStyles = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING_QUOTE:
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    case OrderStatus.FABRIC_SOURCING:
      return 'bg-purple-50 text-purple-700 border border-purple-200';
    case OrderStatus.STITCHING:
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    case OrderStatus.FINISHING:
      return 'bg-cyan-50 text-cyan-700 border border-cyan-200';
    case OrderStatus.READY_FOR_DELIVERY:
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case OrderStatus.SHIPPED:
      return 'bg-teal-50 text-teal-700 border border-teal-200';
    case OrderStatus.DELIVERED:
      return 'bg-slate-900 text-white border border-slate-900';
    case OrderStatus.CANCELLED:
      return 'bg-slate-100 text-slate-400 border border-slate-200 line-through';
    default:
      return 'bg-slate-50 text-slate-600 border border-slate-200';
  }
};

const AdminManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [quoteOrderId, setQuoteOrderId] = useState<string | null>(null);
  const [customQuote, setCustomQuote] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    const data = await getAllOrders();
    setOrders(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus, internalNotes?: string, newPaymentStatus?: PaymentStatus) => {
    // We would ideally have an updateOrderStatus function that accepts more fields.
    // Assuming updateOrderStatus in supabaseClient handles status, price, notes, and paymentStatus for this exercise:
    await updateOrderStatus(orderId, newStatus, undefined, internalNotes, newPaymentStatus);
    await fetchOrders();
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const openQuoteModal = (orderId: string) => {
    setQuoteOrderId(orderId);
    setCustomQuote('');
  };

  const submitCustomQuote = async () => {
    if (!quoteOrderId) return;
    const priceValue = parseFloat(customQuote);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert('Please enter a valid price.');
      return;
    }
    await updateOrderStatus(quoteOrderId, OrderStatus.FABRIC_SOURCING, priceValue);
    setQuoteOrderId(null);
    await fetchOrders();
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL');
  const [garmentFilter, setGarmentFilter] = useState<string>('ALL');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'ALL' || order.status === statusFilter;
      
    const matchesGarment = 
      garmentFilter === 'ALL' || order.garmentType === garmentFilter;

    let matchesDate = true;
    if (dateFilter !== 'ALL') {
      const orderDate = new Date(order.date);
      const today = new Date();
      if (dateFilter === 'TODAY') {
        matchesDate = orderDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'THIS_WEEK') {
        const diff = today.getTime() - orderDate.getTime();
        matchesDate = diff <= 7 * 24 * 60 * 60 * 1000 && diff >= 0;
      } else if (dateFilter === 'THIS_MONTH') {
        matchesDate = orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
      }
    }

    return matchesSearch && matchesStatus && matchesGarment && matchesDate;
  });

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Console Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 gap-4">
        <div>
          <h2 className="text-4xl font-serif text-slate-900 uppercase tracking-tight">Order Management</h2>
          <p className="text-sm font-light text-slate-600 mt-2">
            Track customer orders, configure bespoke pricing quotes, and update stitching states.
          </p>
        </div>
        <div className="flex gap-4">
          <span className="text-xs uppercase tracking-wider font-extrabold bg-slate-950 text-white px-4.5 py-2.5 rounded-lg border border-slate-950">
            Active: {orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED).length}
          </span>
          <span className="text-xs uppercase tracking-wider font-extrabold bg-slate-100 text-slate-700 px-4.5 py-2.5 rounded-lg border border-slate-200">
            Total: {orders.length}
          </span>
        </div>
      </div>

      {/* ERP FILTER & UTILITY CONSOLE */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col md:flex-row gap-6 justify-between items-center">
        
        {/* Search Bar */}
        <div className="w-full md:flex-1 relative">
          <input
            type="text"
            placeholder="Search by ID or Customer Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-slate-400 focus:ring-0 px-5 py-3 text-sm font-medium rounded-xl placeholder-slate-400 font-sans"
          />
        </div>

        {/* Filter Group */}
        <div className="w-full flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[150px] flex items-center gap-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-slate-400 focus:ring-0 py-2.5 px-3 text-xs font-bold rounded-xl cursor-pointer text-slate-700 font-sans"
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="THIS_WEEK">This Week</option>
              <option value="THIS_MONTH">This Month</option>
            </select>
          </div>
          <div className="flex-1 min-w-[150px] flex items-center gap-2">
            <select
              value={garmentFilter}
              onChange={(e) => setGarmentFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-slate-400 focus:ring-0 py-2.5 px-3 text-xs font-bold rounded-xl cursor-pointer text-slate-700 font-sans"
            >
              <option value="ALL">All Garments</option>
              {Object.values(GarmentType).map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[180px] flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-slate-400 focus:ring-0 py-2.5 px-3 text-xs font-bold rounded-xl cursor-pointer text-slate-700 font-sans"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(OrderStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {isLoading ? (
        <div className="text-sm font-bold text-slate-400 animate-pulse py-12 text-center uppercase tracking-widest">Loading order queue...</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white font-sans">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="py-4.5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Order ID</th>
                <th className="py-4.5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Customer Name</th>
                <th className="py-4.5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Garment</th>
                <th className="py-4.5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Price</th>
                <th className="py-4.5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Status</th>
                <th className="py-4.5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Payment</th>
                <th className="py-4.5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => {
                const styles = getStatusStyles(order.status);
                return (
                  <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm font-bold text-slate-950 font-mono">{order.id.slice(0, 8)}</td>
                    <td className="py-4 px-6 text-sm font-bold text-slate-900">{order.customerName}</td>
                    <td className="py-4 px-6 text-sm text-slate-600 font-semibold">
                      {order.garmentType} {order.orderData.customItems && order.orderData.customItems.length > 0 && `(${order.orderData.customItems.length} Pcs)`}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-slate-950 font-mono">
                      {order.price ? (
                        <span>Rs. {order.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                      ) : (
                        <button
                          onClick={() => openQuoteModal(order.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold uppercase tracking-wider transition-all rounded-lg"
                        >
                          Give Quote
                        </button>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`px-4 py-2 text-xs font-bold border-0 focus:ring-0 cursor-pointer rounded-lg uppercase tracking-wide ${styles}`}
                      >
                        {Object.values(OrderStatus).map((status) => (
                          <option key={status} value={status} className="bg-white text-black font-sans uppercase font-bold">
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.paymentStatus || PaymentStatus.UNPAID}
                        onChange={(e) => handleStatusChange(order.id, order.status, undefined, e.target.value as PaymentStatus)}
                        className={`px-3 py-1.5 text-[10px] font-bold border-0 focus:ring-0 cursor-pointer rounded-lg uppercase tracking-wide ${
                          order.paymentStatus === PaymentStatus.FULLY_PAID ? 'bg-green-100 text-green-700' :
                          order.paymentStatus === PaymentStatus.ADVANCE_PAID ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}
                      >
                        {Object.values(PaymentStatus).map((status) => (
                          <option key={status} value={status} className="bg-white text-black font-sans uppercase font-bold">
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-xs font-extrabold uppercase tracking-wider text-slate-600 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-all"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-xs uppercase tracking-widest text-center text-slate-400 font-extrabold bg-slate-50/10">
                    No matching order transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isDetailsOpen && selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setIsDetailsOpen(false)} 
          isAdmin={true} 
          onUpdateStatus={handleStatusChange} 
        />
      )}

      {quoteOrderId && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-white border border-black p-8 w-full max-w-sm">
            <h3 className="text-2xl font-serif text-black uppercase tracking-tighter mb-2">Set Price Quote</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark-gray mb-6">
              Enter the exact cost for this order.
            </p>
            <input
              type="number"
              placeholder="0.00"
              value={customQuote}
              onChange={(e) => setCustomQuote(e.target.value)}
              className="w-full bg-gray-50 border border-black px-4 py-4 focus:ring-0 focus:border-black text-xl font-bold font-sans text-center rounded-none"
            />
            <div className="mt-8 flex gap-4">
              <button
                onClick={submitCustomQuote}
                className="flex-1 py-4 bg-black text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gray-900 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setQuoteOrderId(null)}
                className="flex-1 py-4 border border-black text-black text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageOrders;
