import React, { useState } from 'react';
import { type User, type View } from '../types';
import MyOrders from './MyOrders';
import MyProfile from './MyProfile';

interface DashboardProps {
  user: User;
  navigateTo: (view: View) => void;
  onUpdateUser: (updatedData: Partial<User>) => Promise<void>;
  notification: string | null;
  setNotification: (msg: string | null) => void;
}

type DashboardTab = 'orders' | 'profile';

const Dashboard: React.FC<DashboardProps> = ({ user, navigateTo, onUpdateUser, notification, setNotification }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('orders');

  return (
    <div className="animate-fade-in space-y-16 pb-32 pt-20 max-w-[1400px] mx-auto px-4 md:px-8">
      
      {/* 2026 BRUTALIST HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-black pb-8 gap-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-dark-gray block mb-4">My Account</span>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tighter uppercase leading-none">Dashboard.</h1>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-dark-gray mt-4 max-w-sm">
            Manage your orders, profile details, and shipping address.
          </p>
        </div>
        <div className="text-left md:text-right">
           <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-black">Name: {user.name}</p>
           <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-dark-gray mt-1">Status: {user.role}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Brutalist Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 border border-black p-6 bg-gray-50 h-fit">
          <nav className="flex flex-col space-y-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`text-left text-[10px] uppercase tracking-[0.3em] font-bold transition-all py-2 border-b ${
                activeTab === 'orders' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black hover:border-black/20'
              }`}
            >
              My Orders
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`text-left text-[10px] uppercase tracking-[0.3em] font-bold transition-all py-2 border-b ${
                activeTab === 'profile' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black hover:border-black/20'
              }`}
            >
              My Profile
            </button>
            <button
              onClick={() => navigateTo('products')}
              className="text-left text-[10px] uppercase tracking-[0.3em] font-bold transition-all py-2 border-b border-transparent text-gray-400 hover:text-black hover:border-black/20 mt-8"
            >
              Shop Collection
            </button>
            <button
              onClick={() => navigateTo('order')}
              className="text-left text-[10px] uppercase tracking-[0.3em] font-bold transition-all py-2 border-b border-transparent text-gray-400 hover:text-black hover:border-black/20"
            >
              Custom Tailoring
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {activeTab === 'orders' && <MyOrders userId={user.id} navigateTo={navigateTo} />}
          {activeTab === 'profile' && <MyProfile user={user} onUpdateUser={onUpdateUser} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;