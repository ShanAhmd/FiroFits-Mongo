import React, { useState } from 'react';
import { type User } from '../types';
import AdminOverview from './AdminOverview';
import AdminManageOrders from './AdminManageOrders';
import AdminManageCustomers from './AdminManageCustomers';
import AdminManageProducts from './AdminManageProducts';

type AdminView = 'overview' | 'orders' | 'customers' | 'products';

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeView, setActiveView] = useState<AdminView>('overview');

  const renderContent = () => {
    switch (activeView) {
      case 'overview': return <AdminOverview />;
      case 'orders': return <AdminManageOrders />;
      case 'customers': return <AdminManageCustomers />;
      case 'products': return <AdminManageProducts />;
      default: return <AdminOverview />;
    }
  };

  const getSidebarItemClass = (view: AdminView) => {
    const baseClass = "w-[calc(100%-24px)] text-left py-2.5 px-4 text-xs tracking-normal font-medium transition-all flex items-center gap-3 rounded-lg my-1 mx-3 font-sans";
    return view === activeView 
      ? `${baseClass} bg-emerald-600 text-white shadow-lg shadow-emerald-950/20` 
      : `${baseClass} text-slate-400 hover:text-white hover:bg-slate-800/80`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans antialiased text-slate-900">
      
      {/* 🏢 MODERN SYSTEM SIDEBAR */}
      <aside className="w-full md:w-72 bg-slate-900 text-slate-100 flex flex-col flex-shrink-0 shadow-2xl z-10 font-sans">
        
        {/* Console Branding */}
        <div className="p-6 border-b border-slate-800 bg-slate-950 text-white">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-400">Tailoring Dashboard</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight mt-2 text-white font-sans font-sans">FiroFits Admin</h2>
          <p className="text-[9px] text-slate-400 font-medium mt-1">Manage your shop</p>
        </div>


        {/* Navigation Options */}
        <nav className="flex-1 py-6 space-y-1">
          <button 
            onClick={() => setActiveView('overview')}
            className={getSidebarItemClass('overview')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            <span>Overview</span>
          </button>
          
          <button 
            onClick={() => setActiveView('orders')}
            className={getSidebarItemClass('orders')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span>Orders</span>
          </button>
          
          <button 
            onClick={() => setActiveView('customers')}
            className={getSidebarItemClass('customers')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Customers</span>
          </button>
          
          <button 
            onClick={() => setActiveView('products')}
            className={getSidebarItemClass('products')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Products</span>
          </button>
        </nav>

        {/* User Identity Panel */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 font-sans">
          <div className="flex items-center gap-3">
            {user.profilePhotoUrl ? (
              <img src={user.profilePhotoUrl} alt="admin" className="h-8 w-8 object-cover rounded-full border border-slate-800" />
            ) : (
              <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                {user.name.charAt(0)}
              </div>
            )}
            <div>
              <span className="block text-xs font-semibold text-white">{user.name}</span>
              <span className="block text-[10px] text-slate-500 font-medium mt-0.5">Store Manager</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 💻 CONSOLE DESKTOP AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Control Utility Bar */}
        <header className="h-16 bg-white border-b border-slate-100 px-6 md:px-10 flex items-center justify-between shadow-sm z-0">
          <div className="flex items-center gap-4">
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400 flex items-center gap-1.5">
              Console status:
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="text-emerald-600">Online & Secure</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[9px] uppercase tracking-[0.25em] font-extrabold text-slate-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Inner Console Screen */}
        <div className="p-6 md:p-10 flex-1 overflow-y-auto">
          <div className="animate-fade-in bg-white rounded-2xl border border-slate-100 p-8 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.015)] min-h-[75vh]">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;