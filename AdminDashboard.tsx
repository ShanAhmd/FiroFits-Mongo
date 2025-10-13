import React, { useState } from 'react';
// FIX: Adjusted import path for root directory
import { type User } from '../types';
// FIX: Adjusted import path for root directory
import { DashboardIcon, OrdersIcon, CustomersIcon, ProductsIcon } from './IconComponents';
// FIX: Adjusted import path for root directory
import AdminOverview from './AdminOverview';
// FIX: Adjusted import path for root directory
import AdminManageOrders from './AdminManageOrders';
// FIX: Adjusted import path for root directory
import AdminManageCustomers from './AdminManageCustomers';
// FIX: Adjusted import path for root directory
import AdminManageProducts from './AdminManageProducts';

type AdminView = 'overview' | 'orders' | 'customers' | 'products';

interface AdminDashboardProps {
    user: User;
}

const NavItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
            isActive 
            ? 'bg-brand-teal text-white shadow-md' 
            : 'text-brand-dark-gray hover:bg-brand-light-gray hover:text-brand-charcoal'
        }`}
    >
        <span className="mr-3">{icon}</span>
        {label}
    </button>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
    const [activeView, setActiveView] = useState<AdminView>('overview');
    
    const renderContent = () => {
        switch(activeView) {
            case 'overview': return <AdminOverview />;
            case 'orders': return <AdminManageOrders />;
            case 'customers': return <AdminManageCustomers />;
            case 'products': return <AdminManageProducts />;
            default: return <AdminOverview />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-md p-4">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-brand-charcoal">Admin Panel</h2>
                        <p className="text-xs text-brand-dark-gray">Welcome, {user.name}</p>
                    </div>
                    <nav className="space-y-2">
                        <NavItem 
                            label="Overview" 
                            icon={<DashboardIcon className="h-5 w-5"/>}
                            isActive={activeView === 'overview'}
                            onClick={() => setActiveView('overview')}
                        />
                         <NavItem 
                            label="Manage Orders" 
                            icon={<OrdersIcon className="h-5 w-5"/>}
                            isActive={activeView === 'orders'}
                            onClick={() => setActiveView('orders')}
                        />
                         <NavItem 
                            label="Manage Customers" 
                            icon={<CustomersIcon className="h-5 w-5"/>}
                            isActive={activeView === 'customers'}
                            onClick={() => setActiveView('customers')}
                        />
                         <NavItem 
                            label="Manage Products" 
                            icon={<ProductsIcon className="h-5 w-5"/>}
                            isActive={activeView === 'products'}
                            onClick={() => setActiveView('products')}
                        />
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                <div className="animate-fade-in">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
