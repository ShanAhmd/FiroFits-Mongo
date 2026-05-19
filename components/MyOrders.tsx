import React, { useState, useEffect } from 'react';
import { type Order, type View, OrderStatus, GarmentType } from '../types';
import { getCustomerOrders } from '../services/supabaseClient';
import OrderDetailsModal from './OrderDetailsModal';

interface MyOrdersProps {
  userId: string;
  navigateTo: (view: View) => void;
}

const statusSteps = [
  { status: OrderStatus.PENDING_QUOTE, label: 'Pending Quote', step: 1 },
  { status: OrderStatus.FABRIC_SOURCING, label: 'Fabric Sourcing', step: 2 },
  { status: OrderStatus.STITCHING, label: 'Stitching', step: 3 },
  { status: OrderStatus.FINISHING, label: 'Finishing', step: 4 },
  { status: OrderStatus.READY_FOR_DELIVERY, label: 'Ready for Delivery', step: 5 },
  { status: OrderStatus.SHIPPED, label: 'Shipped', step: 6 },
  { status: OrderStatus.DELIVERED, label: 'Delivered', step: 7 }
];

const MyOrders: React.FC<MyOrdersProps> = ({ userId, navigateTo }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getCustomerOrders(userId);
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  const getCurrentStepIndex = (status: OrderStatus) => {
    return statusSteps.findIndex((s) => s.status === status);
  };

  if (loading) {
    return <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-black animate-pulse">Loading Orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-24 border border-black bg-gray-50">
        <h3 className="text-2xl font-serif uppercase text-black tracking-tighter">No Orders Yet</h3>
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-dark-gray mt-4 mb-8">
          You haven't placed any orders with us.
        </p>
        <button
          onClick={() => navigateTo('order')}
          className="px-8 py-4 bg-black text-white hover:bg-gray-900 font-bold text-[10px] uppercase tracking-[0.3em] transition-all"
        >
          Start a Custom Order
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-8">
        {orders.map((order) => {
          const currentIndex = getCurrentStepIndex(order.status);
          const isBespoke = order.garmentType !== GarmentType.READY_TO_WEAR;

          return (
            <div key={order.id} className="border border-black bg-white group">
              <div className="p-8 border-b border-black/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-black border border-black px-2 py-1 bg-white">
                      Order: {order.id.slice(0, 8)}
                    </span>
                    {isBespoke && (
                      <span className="text-[8px] uppercase tracking-widest font-bold text-white bg-black px-2 py-1">
                        Custom Tailored
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-serif text-black uppercase tracking-wider mt-4">
                    {order.garmentType} {order.orderData.customItems && order.orderData.customItems.length > 0 && `(${order.orderData.customItems.length} Garments)`}
                  </h3>
                  <p className="text-[10px] text-brand-dark-gray uppercase tracking-widest font-bold mt-1">
                    Ordered on: {new Date(order.createdAt || order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm font-serif font-bold text-black">
                    Rs. {order.price ? order.price.toLocaleString('en-LK', { minimumFractionDigits: 2 }) : 'Pending Quote'}
                  </p>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="mt-3 text-[9px] uppercase tracking-[0.2em] font-bold text-brand-dark-gray hover:text-black border-b border-transparent hover:border-black transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* TIMESTAMPTED STATUS PIPELINE */}
              <div className="p-8 overflow-x-auto custom-scrollbar">
                <div className="min-w-[600px] relative">
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    {statusSteps.map((step, index) => {
                      const isCompleted = index <= currentIndex;
                      const isActive = index === currentIndex;
                      return (
                        <div key={step.status} className="flex flex-col items-center flex-1">
                          <div className={`w-3 h-3 rounded-none rotate-45 transition-all duration-500 border border-black ${
                            isCompleted ? 'bg-black' : 'bg-white'
                          } ${isActive ? 'scale-150 bg-black shadow-xl' : ''}`}></div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Connecting Line */}
                  <div className="absolute top-1.5 left-0 w-full h-[1px] bg-black/10 z-0">
                    <div 
                      className="h-full bg-black transition-all duration-1000 ease-out"
                      style={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
                    ></div>
                  </div>

                  {/* Labels and Timestamps */}
                  <div className="flex justify-between mt-6">
                    {statusSteps.map((step, index) => {
                      const isCompleted = index <= currentIndex;
                      const baseDate = new Date(order.date);
                      baseDate.setDate(baseDate.getDate() + (index * 3)); // Mock 3-day progression per step
                      const timestamp = baseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      
                      return (
                        <div key={step.status} className="flex-1 text-center px-1">
                          <span className={`block text-[8px] uppercase tracking-[0.1em] font-bold transition-colors ${
                            isCompleted ? 'text-black' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </span>
                          {isCompleted && (
                            <span className="block text-[8px] font-mono text-gray-500 mt-1">
                              {timestamp}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={() => {}} 
          isAdmin={false}
        />
      )}
    </div>
  );
};

export default MyOrders;
