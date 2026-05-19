import React, { useState, useEffect, useRef } from 'react';
import { type User, type Order, type Product, OrderStatus } from '../types';
import { getProducts, getAllOrders } from '../services/supabaseClient';
import AdminOverview from './AdminOverview';
import AdminManageOrders from './AdminManageOrders';
import AdminManageCustomers from './AdminManageCustomers';
import AdminManageProducts from './AdminManageProducts';
import AdminReports from './AdminReports';
import AdminManagePackages from './AdminManagePackages';
import AdminManageCoupons from './AdminManageCoupons';

type AdminView = 'overview' | 'orders' | 'customers' | 'products' | 'reports' | 'packages' | 'coupons';

interface AdminDashboardProps {
  user: User;
}

interface SystemAlert {
  type: 'order' | 'stock';
  id: string;
  title: string;
  message: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const fetchAlerts = async () => {
    try {
      const allOrders = await getAllOrders();
      const allProducts = await getProducts();
      
      const newAlerts: SystemAlert[] = [];

      // 1. Alert for orders needing quotes or action
      const quoteNeeded = allOrders.filter(o => o.status === OrderStatus.PENDING_QUOTE);
      quoteNeeded.forEach(o => {
        newAlerts.push({
          type: 'order',
          id: `order-quote-${o.id}`,
          title: 'Custom Quote Requested',
          message: `A pricing estimate is pending for customer "${o.customerName}" who requested custom tailoring details for a new ${o.garmentType}. Please review dimensions to submit a quote.`
        });
      });

      // 2. Alert for low stock items
      const lowStock = allProducts.filter(p => (p.stock ?? 0) <= 5);
      lowStock.forEach(p => {
        newAlerts.push({
          type: 'stock',
          id: `stock-${p.id}`,
          title: 'Low Stock Warning',
          message: `Catalog item "${p.name}" has dropped to ${p.stock} units. Restock soon to support customer order demands.`
        });
      });

      setAlerts(newAlerts);
    } catch (err) {
      console.error('Failed to compile dashboard alerts:', err);
    }
  };

  const handleBackupDB = () => {
    try {
      const db = {
        orders: JSON.parse(localStorage.getItem('firofits_orders') || '[]'),
        products: JSON.parse(localStorage.getItem('firofits_products') || '[]'),
        users: JSON.parse(localStorage.getItem('firofits_users') || '[]'),
        timestamp: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `firofits_system_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      alert("Failed to export database snapshot.");
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Poll for new database events every 20 seconds
    const interval = setInterval(fetchAlerts, 20000);
    return () => clearInterval(interval);
  }, []);

  // Close notifications modal when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case 'overview': return <AdminOverview />;
      case 'orders': return <AdminManageOrders />;
      case 'customers': return <AdminManageCustomers />;
      case 'products': return <AdminManageProducts />;
      case 'reports': return <AdminReports />;
      case 'packages': return <AdminManagePackages />;
      case 'coupons': return <AdminManageCoupons />;
      default: return <AdminOverview />;
    }
  };

  const getSidebarItemClass = (view: AdminView) => {
    const baseClass = "w-[calc(100%-24px)] text-left py-3 px-5 text-sm tracking-wide font-bold uppercase transition-all flex items-center gap-4 rounded-xl my-1.5 mx-3 font-sans";
    return view === activeView 
      ? `${baseClass} bg-slate-900 text-white shadow-xl shadow-black/30 border border-slate-800` 
      : `${baseClass} text-slate-400 hover:text-white hover:bg-slate-900/40`;
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col md:flex-row font-sans antialiased text-slate-900">
      
      {/* 🏢 MODERN SYSTEM SIDEBAR */}
      <aside className="w-full md:w-80 bg-slate-950 text-slate-100 flex flex-col flex-shrink-0 shadow-2xl z-10 font-sans border-r border-slate-800">
        
        {/* Console Branding */}
        <div className="p-8 border-b border-slate-800/85 bg-slate-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-emerald-400">Tailoring Console</span>
          </div>
          <h2 className="text-2xl font-serif tracking-tight mt-3 text-white uppercase font-bold">FiroFits Admin</h2>
          <p className="text-xs text-slate-400 font-light mt-1.5">Enterprise Shop Manager</p>
        </div>


        {/* Navigation Options */}
        <nav className="flex-1 py-8 space-y-1.5">
          <button 
            onClick={() => setActiveView('overview')}
            className={getSidebarItemClass('overview')}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            <span>Overview</span>
          </button>
          
          <button 
            onClick={() => setActiveView('orders')}
            className={getSidebarItemClass('orders')}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span>Orders</span>
          </button>
          
          <button 
            onClick={() => setActiveView('customers')}
            className={getSidebarItemClass('customers')}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Customers</span>
          </button>
          
          <button 
            onClick={() => setActiveView('products')}
            className={getSidebarItemClass('products')}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Products</span>
          </button>
          
          <button 
            onClick={() => setActiveView('reports')}
            className={getSidebarItemClass('reports')}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <span>Reports</span>
          </button>

          <div className="mx-3 my-2 border-t border-slate-800/50"/>
          <p className="px-6 text-[9px] uppercase tracking-[0.2em] text-slate-600 font-black mb-1">Commerce</p>

          <button 
            onClick={() => setActiveView('packages')}
            className={getSidebarItemClass('packages')}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
            <span>Packages</span>
          </button>

          <button 
            onClick={() => setActiveView('coupons')}
            className={getSidebarItemClass('coupons')}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span>Coupons</span>
          </button>
        </nav>

        {/* User Identity Panel */}
        <div className="p-6 border-t border-slate-800 bg-slate-950 font-sans">
          <div className="flex items-center gap-4">
            {user.profilePhotoUrl ? (
              <img src={user.profilePhotoUrl} alt="admin" className="h-10 w-10 object-cover rounded-full border-2 border-slate-800" />
            ) : (
              <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center text-white text-xs font-bold border border-slate-700">
                {user.name.charAt(0)}
              </div>
            )}
            <div>
              <span className="block text-sm font-bold text-white">{user.name}</span>
              <span className="block text-xs text-slate-500 font-medium mt-0.5">Store Manager</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 💻 CONSOLE DESKTOP AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Control Utility Bar */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 md:px-12 flex items-center justify-between shadow-sm z-0">
          <div className="flex items-center gap-4">
            <span className="text-[11px] uppercase tracking-[0.25em] font-extrabold text-slate-500 flex items-center gap-2">
              Console status:
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="text-emerald-600 font-bold">Online & Secure</span>
            </span>
          </div>
          <div className="flex items-center gap-6" ref={notificationRef}>
            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-950 transition-colors"
                aria-label="System Alerts"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                </svg>
                {alerts.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-3 w-3 rounded-full bg-red-600 border-2 border-white animate-pulse"></span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[150] p-5 space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">System Warnings</h4>
                    <span className="text-[10px] font-bold uppercase bg-amber-500 text-white px-2.5 py-0.5 rounded-full border border-amber-600 shadow-sm">{alerts.length} Active</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex gap-3 items-start p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100/50">
                        {alert.type === 'order' ? (
                          <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                          </div>
                        ) : (
                          <div className="p-1.5 bg-rose-50 text-rose-700 rounded-lg border border-rose-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                          </div>
                        )}
                        <div>
                          <span className="block text-xs font-bold text-slate-800">{alert.title}</span>
                          <p className="text-[10px] text-slate-500 font-light mt-0.5 leading-relaxed">{alert.message}</p>
                        </div>
                      </div>
                    ))}
                    {alerts.length === 0 && (
                      <div className="text-center py-6 text-xs text-slate-400 font-light uppercase tracking-wider">
                        All operations running smoothly. No alerts.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleBackupDB}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-[10px] font-bold uppercase tracking-widest transition-all rounded-md flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              Backup DB
            </button>
            <span className="text-[10px] uppercase tracking-[0.25em] font-black text-slate-500 hidden sm:inline-block">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Inner Console Screen */}
        <div className="p-8 md:p-12 flex-1 overflow-y-auto">
          <div className="animate-fade-in bg-white rounded-2xl border border-slate-200/80 p-10 md:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.02)] min-h-[80vh]">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;