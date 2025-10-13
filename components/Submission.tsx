import React from 'react';
import { type OrderData, type User, type View } from '../types';
import { createOrder } from '../services/demoDatabase';

interface SubmissionProps {
  orderData: OrderData;
  user: User;
  navigateTo: (view: View) => void;
}

const SummaryItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-semibold text-brand-charcoal">{label}</dt>
        <dd className="mt-1 text-sm text-brand-dark-gray sm:mt-0 sm:col-span-2">{value || 'Not provided'}</dd>
    </div>
);

const Submission: React.FC<SubmissionProps> = ({ orderData, user, navigateTo }) => {

    const handleSubmitOrder = async () => {
        if (!user) {
            alert("You must be logged in to submit an order.");
            return;
        }
        if (!orderData.service) {
            alert("Please select a service type.");
            return;
        }

        await createOrder({
            userId: user.id,
            customerName: user.name,
            garmentType: orderData.service,
            orderData: orderData
        });
        
        navigateTo('order-confirmation');
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">Confirm Your Order</h2>
            <p className="text-brand-dark-gray mb-8">Please review the details below before submitting your request. A final quote will be sent to you for approval.</p>

            <div className="bg-white rounded-xl border border-brand-light-gray shadow-sm overflow-hidden">
                <div className="p-6">
                    <h3 className="text-lg font-bold text-brand-charcoal mb-4">Order Summary</h3>
                    <dl className="divide-y divide-gray-200">
                        <SummaryItem label="Service" value={orderData.service} />
                        <SummaryItem label="Design Files" value={`${orderData.designFiles.length} file(s) uploaded`} />
                        <SummaryItem label="Special Instructions" value={orderData.specialInstructions} />
                        <SummaryItem label="Pearl Work" value={orderData.hasPearlWork ? 'Yes' : 'No'} />
                        <SummaryItem label="Measurement Unit" value={orderData.unit === 'in' ? 'Inches' : 'Centimeters'} />
                        <SummaryItem label="Measurements" value={
                            <ul className="list-disc pl-5">
                                {Object.entries(orderData.measurements).map(([key, value]) => value ? <li key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value} {orderData.unit}</li> : null)}
                            </ul>
                        } />
                    </dl>
                </div>
                <div className="bg-gray-50 p-6">
                    <h3 className="text-lg font-bold text-brand-charcoal mb-4">Delivery Details</h3>
                     <dl className="divide-y divide-gray-200">
                        <SummaryItem label="Recipient Name" value={orderData.deliveryDetails.name} />
                        <SummaryItem label="Contact Number" value={orderData.deliveryDetails.contact} />
                        <SummaryItem label="Address" value={orderData.deliveryDetails.address} />
                        <SummaryItem label="Desired Date" value={orderData.deliveryDetails.deliveryDate} />
                    </dl>
                </div>
            </div>

            <div className="mt-8 text-center">
                 <button
                    onClick={handleSubmitOrder}
                    className="w-full md:w-auto px-10 py-4 bg-brand-success text-white rounded-xl font-bold text-lg hover:bg-opacity-90 transition-colors shadow-lg"
                >
                    Submit Order Request
                </button>
            </div>
        </div>
    );
};

export default Submission;