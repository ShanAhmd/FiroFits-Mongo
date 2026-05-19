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
  const revenueCollected = orders
    .filter(o => o.paymentStatus === 'Fully Paid' || o.paymentStatus === 'Advance Paid')
    .reduce((acc, order) => acc + (order.price || 0), 0);
  const revenuePending = orders
    .filter(o => !o.paymentStatus || o.paymentStatus === 'Unpaid')
    .reduce((acc, order) => acc + (order.price || 0), 0);
  const aov = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  const pendingOrders = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;

  if (isLoading) {
    return (
      <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-black animate-pulse">Loading Statistics...</div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in font-sans">
      
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-md border border-emerald-200 font-sans">
            SYSTEM STATUS: ACTIVE
          </span>
          <h2 className="text-4xl font-serif text-slate-900 mt-4 uppercase tracking-tight">Console Overview</h2>
          <p className="text-slate-600 text-sm font-light mt-2 tracking-wide">
            Real-time analytics, order flows, customer records, and shop logistics.
          </p>
        </div>
      </div>

      {/* STAT CARDS - HIGH DENSITY PREMIUM SYSTEM GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 font-sans">
        
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex flex-col justify-between h-40 hover:border-slate-400 hover:shadow-md transition-all duration-300 xl:col-span-2">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase tracking-wider font-extrabold text-slate-500">Total Earnings</span>
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">{<RevenueIcon className="h-5 w-5 text-slate-800" />}</div>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-mono font-bold text-slate-950">Rs. {totalRevenue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</p>
            <span className="block text-xs font-bold text-emerald-600 mt-1.5 flex items-center gap-1">▲ Lifetime <span className="font-light text-slate-400">gross volume</span></span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex flex-col justify-between h-40 hover:border-slate-400 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Collected</span>
          </div>
          <div>
            <p className="text-xl font-mono font-bold text-green-700">Rs. {revenueCollected.toLocaleString('en-LK')}</p>
            <span className="block text-[10px] font-bold text-slate-400 mt-1.5 uppercase">Banked Revenue</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex flex-col justify-between h-40 hover:border-slate-400 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Pending</span>
          </div>
          <div>
            <p className="text-xl font-mono font-bold text-amber-600">Rs. {revenuePending.toLocaleString('en-LK')}</p>
            <span className="block text-[10px] font-bold text-slate-400 mt-1.5 uppercase">Unpaid Balances</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex flex-col justify-between h-40 hover:border-slate-400 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">AOV</span>
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">{<OrdersIcon className="h-4 w-4 text-slate-800" />}</div>
          </div>
          <div>
            <p className="text-xl font-mono font-bold text-slate-950">Rs. {aov.toLocaleString('en-LK', { maximumFractionDigits: 0 })}</p>
            <span className="block text-[10px] font-bold text-slate-400 mt-1.5 uppercase">Average Order Value</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex flex-col justify-between h-40 hover:border-slate-400 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Operations</span>
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">{<BellIcon className="h-4 w-4 text-slate-800" />}</div>
          </div>
          <div>
            <p className="text-xl font-mono font-bold text-slate-950">{pendingOrders} Active</p>
            <span className="block text-[10px] font-bold text-slate-400 mt-1.5 uppercase">Orders In Progress</span>
          </div>
        </div>

      </div>

      {/* Revenue & Output Performance Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Sales & Stitching Output</h3>
            <p className="text-xs text-slate-500 font-light mt-1">Weekly flow of finished bespoke orders and product checkout transactions.</p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-slate-950 text-white px-3.5 py-1.5 rounded-lg">2026 Live metrics</span>
        </div>
        <div className="h-64 w-full relative flex items-end">
          {/* Simple Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-2 text-[10px] font-mono text-slate-400">
            <div className="border-b border-slate-100 w-full pb-1 text-right">Rs. 100,000</div>
            <div className="border-b border-slate-100 w-full pb-1 text-right">Rs. 75,000</div>
            <div className="border-b border-slate-100 w-full pb-1 text-right">Rs. 50,000</div>
            <div className="border-b border-slate-100 w-full pb-1 text-right">Rs. 25,000</div>
            <div className="w-full text-right">Rs. 0</div>
          </div>
          
          {/* Beautiful Smooth SVG Area & Line Chart */}
          <svg className="w-full h-48 z-10 overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area Path */}
            <path
              d="M 0 160 Q 116 110 233 130 T 466 70 T 700 40 L 700 200 L 0 200 Z"
              fill="url(#chartGradient)"
            />
            {/* Line Path */}
            <path
              d="M 0 160 Q 116 110 233 130 T 466 70 T 700 40"
              fill="none"
              stroke="#0f172a"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Dots */}
            <circle cx="233" cy="130" r="5" fill="#0f172a" stroke="white" strokeWidth="2" />
            <circle cx="466" cy="70" r="5" fill="#0f172a" stroke="white" strokeWidth="2" />
            <circle cx="700" cy="40" r="5" fill="#0f172a" stroke="white" strokeWidth="2" />
          </svg>
        </div>
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pt-2 px-10">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>

      {/* TWO COLUMN SYSTEM FEED & SHORTCUTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        
        {/* RECENT WORKLIST (2 columns wide) */}
        <div className="lg:col-span-2 border border-slate-200 rounded-xl p-8 bg-white shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
              Recent Tailoring Orders
            </h3>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Live Feed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="py-4 px-5 text-xs font-extrabold uppercase tracking-wider text-slate-500">Order ID</th>
                  <th className="py-4 px-5 text-xs font-extrabold uppercase tracking-wider text-slate-500">Customer</th>
                  <th className="py-4 px-5 text-xs font-extrabold uppercase tracking-wider text-slate-500">Garment Type</th>
                  <th className="py-4 px-5 text-xs font-extrabold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="py-4 px-5 text-xs font-extrabold uppercase tracking-wider text-slate-500 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5 text-sm font-bold text-slate-950 font-mono">{order.id.slice(0, 8)}</td>
                    <td className="py-4 px-5 text-sm font-bold text-slate-900">{order.customerName}</td>
                    <td className="py-4 px-5 text-sm text-slate-600 font-semibold">{order.garmentType}</td>
                    <td className="py-4 px-5">
                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border ${
                        order.status === 'Delivered'
                          ? 'bg-slate-950 text-white border-slate-950'
                          : 'bg-white text-slate-800 border-slate-300'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-sm font-mono font-bold text-right text-slate-500">{new Date(order.date).toLocaleDateString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-sm text-center text-slate-400 font-medium">
                      No active orders found in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* LOGISTICS CARD & QUICK PANEL */}
        <div className="border border-slate-200 rounded-xl p-8 bg-slate-50/30 flex flex-col justify-between shadow-sm">
          <div>
            <div className="border-b border-slate-200 pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                Console Guidelines
              </h3>
            </div>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <span className="h-2 w-2 rounded-full bg-slate-500 mt-2 flex-shrink-0"></span>
                <div>
                  <span className="block text-sm font-bold text-slate-900 uppercase tracking-wide">Tailoring Orders</span>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed font-light">Custom tailoring requests require providing a price quote before stitching can commence.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="h-2 w-2 rounded-full bg-slate-500 mt-2 flex-shrink-0"></span>
                <div>
                  <span className="block text-sm font-bold text-slate-900 uppercase tracking-wide">Order Status Updates</span>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed font-light">Always update progress status stages (from fabric sourcing through packaging) to notify clients automatically.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="pt-6 border-t border-slate-200 mt-8 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block font-mono">FiroFits Control Console © 2026</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminOverview;
