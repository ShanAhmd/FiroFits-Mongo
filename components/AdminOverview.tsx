import React, { useState, useEffect } from 'react';
import { type Order, type User } from '../types';
import { getAllOrders, getAllCustomers } from '../services/supabaseClient';
import { RevenueIcon, OrdersIcon, CustomersIcon, BellIcon } from './IconComponents';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-white p-6 border border-black flex items-center">
    <div className="p-4 mr-4 bg-gray-50 border border-black/10">
      {icon}
    </div>
    <div>
      <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">{title}</p>
      <p className="text-2xl font-serif font-bold text-black mt-1">{value}</p>
    </div>
  </div>
);

const AdminOverview: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const fetchedOrders = await getAllOrders();
      const fetchedCustomers = await getAllCustomers();
      setOrders(fetchedOrders);
      setCustomers(fetchedCustomers);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const totalRevenue = orders.reduce((acc, order) => acc + (order.price || 0), 0);
  const pendingOrders = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;

  if (isLoading) {
    return (
      <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-black animate-pulse">Loading Statistics...</div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-5">
        <div>
          <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 font-sans">
            System Active
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-3 font-sans">Overview</h2>
          <p className="text-slate-500 text-xs font-normal mt-1 font-sans">
            Quick summary of your shop's sales, total orders, and active customers.
          </p>
        </div>
      </div>

      {/* STAT CARDS - HIGH DENSITY SYSTEM GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        
        <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 flex flex-col justify-between h-32 hover:shadow-sm transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Total Earnings</span>
            <div className="p-1 bg-white rounded border border-slate-100 shadow-sm">{<RevenueIcon className="h-4 w-4 text-slate-700" />}</div>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 font-sans">Rs. {totalRevenue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</p>
            <span className="block text-[10px] font-semibold text-emerald-600 mt-1">▲ +12% this month</span>
          </div>
        </div>

        <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 flex flex-col justify-between h-32 hover:shadow-sm transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Total Orders</span>
            <div className="p-1 bg-white rounded border border-slate-100 shadow-sm">{<OrdersIcon className="h-4 w-4 text-slate-700" />}</div>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 font-sans">{orders.length} orders</p>
            <span className="block text-[10px] font-normal text-slate-400 mt-1">Orders placed in your shop</span>
          </div>
        </div>

        <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 flex flex-col justify-between h-32 hover:shadow-sm transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Total Customers</span>
            <div className="p-1 bg-white rounded border border-slate-100 shadow-sm">{<CustomersIcon className="h-4 w-4 text-slate-700" />}</div>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 font-sans">{customers.length} customers</p>
            <span className="block text-[10px] font-normal text-emerald-600 mt-1">Registered customers</span>
          </div>
        </div>

        <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 flex flex-col justify-between h-32 hover:shadow-sm transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Pending Orders</span>
            <div className="p-1 bg-white rounded border border-slate-100 shadow-sm">{<BellIcon className="h-4 w-4 text-slate-700" />}</div>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 font-sans">{pendingOrders} active</p>
            <span className="block text-[10px] font-medium text-amber-600 mt-1">Need price quote or stitching</span>
          </div>
        </div>

      </div>

      {/* TWO COLUMN SYSTEM FEED & SHORTCUTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RECENT WORKLIST (2 columns wide) */}
        <div className="lg:col-span-2 border border-slate-100 rounded-xl p-6 bg-white shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
            <h3 className="text-sm font-semibold text-slate-700 font-sans">
              Recent Orders
            </h3>
            <span className="text-xs font-medium text-slate-400 font-sans">Real-time</span>
          </div>

          <div className="overflow-x-auto font-sans">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-400">Order ID</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-400">Customer</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-400">Garment</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-400">Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-400 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3 px-4 text-xs font-bold text-slate-900 font-mono">{order.id.slice(0, 8)}</td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-900">{order.customerName}</td>
                    <td className="py-3 px-4 text-xs text-slate-500 font-medium">{order.garmentType}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 text-[10px] font-semibold rounded border ${
                        order.status === 'Delivered'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-right text-slate-400 font-mono">{new Date(order.date).toLocaleDateString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-xs text-center text-slate-400 font-medium">
                      No active orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* LOGISTICS CARD & QUICK PANEL */}
        <div className="border border-slate-100 rounded-xl p-6 bg-slate-50/50 flex flex-col justify-between shadow-sm font-sans">
          <div>
            <div className="border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-sm font-semibold text-slate-700">
                Shop Guidelines
              </h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5"></span>
                <div>
                  <span className="block text-xs font-semibold text-slate-700">Tailoring Orders</span>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Tailoring orders need a price quote before you start stitching.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5"></span>
                <div>
                  <span className="block text-xs font-semibold text-slate-700">Order Progress</span>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Keep order status updated from cutting to shipping.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="pt-6 border-t border-slate-100 mt-6 text-center">
            <span className="text-[10px] font-semibold text-slate-400 block">FiroFits Manager © 2026</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminOverview;
