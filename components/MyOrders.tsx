import React, { useState, useEffect } from 'react';
import { OrderStatus, type Order } from '../types';
import { getAllOrders } from '../services/demoDatabase';
import OrderDetailsModal from './OrderDetailsModal';

const getStatusStyles = (status: OrderStatus): { bg: string, text: string, bgBar: string } => {
  switch (status) {
    case OrderStatus.DELIVERED:
      return { bg: 'bg-green-100', text: 'text-green-800', bgBar: 'bg-green-400' };
    case OrderStatus.STITCHING:
    case OrderStatus.FABRIC_SOURCING:
    case OrderStatus.FINISHING:
      return { bg: 'bg-blue-100', text: 'text-blue-800', bgBar: 'bg-blue-400' };
    case OrderStatus.PENDING_QUOTE:
    case OrderStatus.READY_FOR_DELIVERY:
       return { bg: 'bg-yellow-100', text: 'text-yellow-800', bgBar: 'bg-yellow-400' };
    case OrderStatus.SHIPPED:
        return { bg: 'bg-indigo-100', text: 'text-indigo-800', bgBar: 'bg-indigo-400' };
    case OrderStatus.CANCELLED:
      return { bg: 'bg-red-100', text: 'text-red-800', bgBar: 'bg-red-400' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800', bgBar: 'bg-gray-400' };
  }
};

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // In a real app, you would filter orders by the current user's ID.
    // For this demo, we'll show all orders to demonstrate the data flow.
    setOrders(getAllOrders());
  }, []);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  return (
    <div>
        <h1 className="text-3xl font-bold text-brand-charcoal mb-8">My Orders</h1>
        <div className="space-y-4">
            {orders.length > 0 ? orders.map(order => {
                const statusStyles = getStatusStyles(order.status);
                return (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-4 relative overflow-hidden transition-shadow hover:shadow-md">
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusStyles.bgBar}`}></div>
                        <div className="flex-grow pl-4">
                            <p className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block mb-2 ${statusStyles.bg} ${statusStyles.text}`}>{order.status}</p>
                            <p className="font-bold text-brand-charcoal text-md">{order.id} - {order.garmentType}</p>
                            <p className="text-sm text-brand-dark-gray">Ordered on: {order.date}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="font-bold text-lg text-brand-charcoal">
                                {order.price ? `Rs. ${order.price.toFixed(2)}` : 'Pending Quote'}
                            </p>
                            <button 
                                onClick={() => handleViewDetails(order)} 
                                className="text-sm font-semibold text-brand-teal hover:underline"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                );
            }) : (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <p className="text-brand-dark-gray">You haven't placed any orders yet.</p>
                </div>
            )}
        </div>
        {selectedOrder && (
            <OrderDetailsModal 
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />
        )}
    </div>
  );
};

export default MyOrders;
