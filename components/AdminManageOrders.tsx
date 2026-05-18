import React, { useState, useEffect } from 'react';
import { type Order, OrderStatus } from '../types';
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

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Console Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Orders</h2>
          <p className="text-xs font-normal text-slate-500 mt-1 font-sans">
            Track customer orders, update delivery status, and send price quotes.
          </p>
        </div>
        <div className="flex gap-3">
          <span className="text-xs font-semibold bg-slate-900 text-white px-3 py-1.5 rounded-lg">
            Active: {orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED).length}
          </span>
          <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200/50">
            Total: {orders.length}
          </span>
        </div>
      </div>

      {/* ERP FILTER & UTILITY CONSOLE */}
      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search Bar */}
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="Search by ID or Customer Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 px-4 py-2 text-xs font-medium rounded-lg placeholder-slate-300 font-sans"
          />
        </div>

        {/* Status Dropdown Filter */}
        <div className="w-full md:w-64 flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400 font-sans">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3 text-xs font-semibold rounded-lg cursor-pointer text-slate-700 font-sans"
          >
            <option value="ALL">All Statuses</option>
            {Object.values(OrderStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

      </div>

      {isLoading ? (
        <div className="text-xs font-medium text-slate-400 animate-pulse py-8">Loading orders...</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm bg-white font-sans">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="py-4 px-5 text-xs font-semibold text-slate-400">Order ID</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400">Customer Name</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400">Garment</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400">Price</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400">Status</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filteredOrders.map((order) => {
                const styles = getStatusStyles(order.status);
                return (
                  <tr key={order.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="py-3.5 px-5 text-xs font-bold text-slate-900 font-mono">{order.id.slice(0, 8)}</td>
                    <td className="py-3.5 px-5 text-xs font-bold text-slate-900">{order.customerName}</td>
                    <td className="py-3.5 px-5 text-xs text-slate-500 font-medium">{order.garmentType}</td>
                    <td className="py-3.5 px-5 text-xs font-bold text-slate-900">
                      {order.price ? (
                        <span>Rs. {order.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                      ) : (
                        <button
                          onClick={() => openQuoteModal(order.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold tracking-wide transition-all rounded-lg"
                        >
                          Give Quote
                        </button>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`px-3 py-1.5 text-[10px] font-semibold border-0 focus:ring-0 cursor-pointer rounded-lg ${styles}`}
                      >
                        {Object.values(OrderStatus).map((status) => (
                          <option key={status} value={status} className="bg-white text-black">
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-[10px] uppercase tracking-widest text-center text-gray-400 font-extrabold bg-gray-50/30">
                    No matching order transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isDetailsOpen && selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setIsDetailsOpen(false)} isAdmin={true} />
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
