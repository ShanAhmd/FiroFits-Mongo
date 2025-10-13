import React, { useState, useEffect } from 'react';
import { type Order, type User } from '../types';
import { getAllOrders, getAllCustomers } from '../services/demoDatabase';
import { RevenueIcon, OrdersIcon, CustomersIcon, BellIcon } from './IconComponents';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md flex items-center">
        <div className={`p-4 rounded-full mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-semibold text-brand-dark-gray">{title}</p>
            <p className="text-2xl font-bold text-brand-charcoal">{value}</p>
        </div>
    </div>
);


const AdminOverview: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<User[]>([]);

    useEffect(() => {
        setOrders(getAllOrders());
        setCustomers(getAllCustomers());
    }, []);

    const totalRevenue = orders.reduce((acc, order) => acc + (order.price || 0), 0);
    const pendingOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-brand-charcoal">Dashboard Overview</h1>
                <p className="text-brand-dark-gray mt-1">A quick look at your business statistics.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value={`Rs. ${totalRevenue.toLocaleString()}`} 
                    icon={<RevenueIcon className="h-6 w-6 text-green-700"/>}
                    color="bg-green-100"
                />
                <StatCard 
                    title="Total Orders" 
                    value={orders.length.toString()} 
                    icon={<OrdersIcon className="h-6 w-6 text-blue-700"/>}
                    color="bg-blue-100"
                />
                <StatCard 
                    title="Total Customers" 
                    value={customers.length.toString()} 
                    icon={<CustomersIcon className="h-6 w-6 text-purple-700"/>}
                    color="bg-purple-100"
                />
                 <StatCard 
                    title="Pending Orders" 
                    value={pendingOrders.toString()} 
                    icon={<BellIcon className="h-6 w-6 text-yellow-700"/>}
                    color="bg-yellow-100"
                />
            </div>

            <div className="mt-10 bg-white p-6 rounded-2xl shadow-md">
                 <h2 className="text-xl font-bold text-brand-charcoal mb-4">Recent Orders</h2>
                 {/* A simplified list. AdminManageOrders has the full table. */}
                 <div className="space-y-4">
                     {orders.slice(0, 5).map(order => (
                         <div key={order.id} className="p-4 border border-brand-light-gray rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-brand-charcoal">{order.id} - {order.customerName}</p>
                                <p className="text-sm text-brand-dark-gray">{order.garmentType}</p>
                            </div>
                            <p className={`text-sm font-bold ${order.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status}</p>
                         </div>
                     ))}
                 </div>
            </div>

        </div>
    );
};

export default AdminOverview;
