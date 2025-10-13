// FIX: Replaced placeholder content with a full component implementation.
import React, { useState, useEffect } from 'react';
import { type Order, OrderStatus } from '../types';
import { getAllOrders, updateOrderStatus } from '../services/demoDatabase';
import OrderDetailsModal from './OrderDetailsModal';

const getStatusStyles = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.DELIVERED: return 'bg-green-100 text-green-800';
    case OrderStatus.STITCHING:
    case OrderStatus.FABRIC_SOURCING:
    case OrderStatus.FINISHING: return 'bg-blue-100 text-blue-800';
    case OrderStatus.PENDING_QUOTE:
    case OrderStatus.READY_FOR_DELIVERY: return 'bg-yellow-100 text-yellow-800';
    case OrderStatus.SHIPPED: return 'bg-indigo-100 text-indigo-800';
    case OrderStatus.CANCELLED: return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const AdminManageOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setOrders(getAllOrders());
    }, []);
    
    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
        updateOrderStatus(orderId, newStatus);
        setOrders(getAllOrders()); // Refresh the list
    };

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md">
            <h1 className="text-3xl font-bold text-brand-charcoal mb-6">Manage Orders</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.price ? `Rs. ${order.price.toFixed(2)}` : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                        className={`p-1.5 rounded-md text-xs font-semibold border-0 focus:ring-2 focus:ring-brand-teal ${getStatusStyles(order.status)}`}
                                    >
                                        {Object.values(OrderStatus).map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleViewDetails(order)} className="text-brand-teal hover:text-teal-700">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && selectedOrder && (
                <OrderDetailsModal order={selectedOrder} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

export default AdminManageOrders;
