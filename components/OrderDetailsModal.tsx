// FIX: Replaced placeholder content with a full modal implementation.
import React from 'react';
import { type Order } from '../types';
import { FileIcon, XIcon } from './IconComponents';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="py-2">
        <p className="text-sm font-semibold text-gray-500">{label}</p>
        <p className="text-base text-gray-900">{value || 'Not provided'}</p>
    </div>
);

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  // FIX: Property 'name' does not exist on type '{}' (and others).
  // Provide a typed fallback for delivery details to prevent errors when orderData is incomplete.
  const delivery = order.orderData?.deliveryDetails || { name: '', contact: '', address: '', deliveryDate: '' };
  const measurements = order.orderData?.measurements || {};
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-down">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-brand-charcoal">Order Details</h2>
              <p className="text-sm text-brand-dark-gray">{order.id}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                <XIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2 text-brand-charcoal">Customer & Order Info</h3>
              <DetailItem label="Customer" value={order.customerName} />
              <DetailItem label="Order Date" value={order.date} />
              <DetailItem label="Garment Type" value={order.garmentType} />
              <DetailItem label="Status" value={order.status} />
              <DetailItem label="Price" value={order.price ? `Rs. ${order.price.toFixed(2)}` : 'Pending Quote'} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-brand-charcoal">Delivery Details</h3>
              <DetailItem label="Recipient" value={delivery.name} />
              <DetailItem label="Contact" value={delivery.contact} />
              <DetailItem label="Address" value={delivery.address} />
              <DetailItem label="Desired Date" value={delivery.deliveryDate} />
            </div>
            <div className="md:col-span-2">
                 <h3 className="font-bold text-lg mb-2 text-brand-charcoal">Measurements ({order.orderData?.unit})</h3>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                    {Object.entries(measurements).map(([key, value]) => {
                        // FIX: Type 'unknown' is not assignable to type 'ReactNode'. 
                        // Add type guard to ensure value is a non-empty string and format key for readability.
                        if (typeof value === 'string' && value) {
                            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                            return <p key={key}><span className="font-semibold">{formattedKey}:</span> {value}</p>;
                        }
                        return null;
                    })}
                 </div>
            </div>
            <div className="md:col-span-2">
                <h3 className="font-bold text-lg mb-2 text-brand-charcoal">Special Instructions</h3>
                <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-md">{order.orderData?.specialInstructions || 'No instructions provided.'}</p>
            </div>
             <div className="md:col-span-2">
                <h3 className="font-bold text-lg mb-2 text-brand-charcoal">Uploaded Designs</h3>
                {order.designFileData && order.designFileData.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {order.designFileData.map((file, index) => (
                            <div key={index} className="relative group border border-brand-light-gray rounded-lg p-2 flex flex-col items-center text-center bg-white shadow-sm">
                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="block w-full h-24">
                                    {file.type.startsWith('image/') ? (
                                        <img src={file.url} alt={file.name} className="w-full h-full object-cover rounded-md" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
                                            <FileIcon className="h-10 w-10 text-brand-dark-gray" />
                                        </div>
                                    )}
                                </a>
                                <p className="text-xs text-brand-dark-gray mt-2 truncate w-full" title={file.name}>
                                    {file.name}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No design files were uploaded.</p>
                )}
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 text-right rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-brand-charcoal text-white rounded-xl font-semibold hover:opacity-90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;