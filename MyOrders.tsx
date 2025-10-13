import React, { useState, useEffect } from 'react';
// FIX: Adjusted import path for root directory
import { OrderStatus, type Order } from '../types';
// FIX: Adjusted import path for root directory
import { getAllOrders } from '../services/demoDatabase';

const getStatusStyles = (status: OrderStatus): { bg: string, text: string, border: string } => {
  switch (status) {
    case OrderStatus.DELIVERED:
      return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
    case OrderStatus.STITCHING:
    case OrderStatus.FABRIC_SOURCING:
    case OrderStatus.FINISHING:
      return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' };
    case OrderStatus.PENDING_QUOTE:
    case OrderStatus.READY_FOR_DELIVERY:
       return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' };
    case OrderStatus.SHIPPED:
        return { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' };
    case OrderStatus.CANCELLED:
      return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
  }
};

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // In a real app, you would filter orders by the current user's ID.
    // For this demo, we'll show all orders to demonstrate the data flow.
    setOrders(getAllOrders());
  }, []);

  return (
    <div>
        <div className="space-y-6">
            {orders.length > 0 ? orders.map(order => {
                const statusStyles = getStatusStyles(order.status);
                return (
                    <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                        <div className={`p-4 border-l-8 ${statusStyles.border}`}>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                <div className="mb-4 sm:mb-0">
                                    <p className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${statusStyles.bg} ${statusStyles.text}`}>{order.status}</p>
                                    <p className="font-bold text-brand-charcoal text-lg mt-2">{order.id} - {order.garmentType}</p>
                                    <p className="text-sm text-brand-dark-gray">Ordered on: {order.date}</p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <p className="font-bold text-xl text-brand-charcoal">
                                        {order.price ? `Rs. ${order.price.toFixed(2)}` : 'Pending Quote'}
                                    </p>
                                    <button className="text-sm font-semibold text-brand-teal mt-1 hover:underline">View Details</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }) : (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <p className="text-brand-dark-gray">You haven't placed any orders yet.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default MyOrders;
