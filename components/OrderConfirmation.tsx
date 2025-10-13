import React from 'react';
import { type View } from '../types';
import { CheckCircleIcon } from './IconComponents';

interface OrderConfirmationProps {
  navigateTo: (view: View) => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ navigateTo }) => {
  return (
    <div className="p-8 md:p-12 text-center animate-fade-in">
      <CheckCircleIcon className="h-20 w-20 text-brand-success mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-brand-charcoal">Thank You!</h1>
      <p className="text-brand-dark-gray mt-2 text-lg">Your order request has been successfully submitted.</p>
      
      <div className="mt-10 text-left max-w-lg mx-auto bg-white p-8 rounded-xl border border-brand-light-gray shadow-sm">
          <h3 className="font-bold text-brand-charcoal mb-5 text-center text-lg">What's Next?</h3>
          <ul className="space-y-5">
              <li className="flex items-start">
                  <span className="bg-brand-teal text-white font-bold rounded-full h-8 w-8 flex items-center justify-center text-md mr-4 flex-shrink-0">1</span>
                  <p className="text-brand-dark-gray">
                      Our tailor will carefully review your design and measurements.
                  </p>
              </li>
              <li className="flex items-start">
                  <span className="bg-brand-teal text-white font-bold rounded-full h-8 w-8 flex items-center justify-center text-md mr-4 flex-shrink-0">2</span>
                  <p className="text-brand-dark-gray">
                      We will send a <span className="font-semibold text-brand-charcoal">final price quote</span> to you for approval.
                  </p>
              </li>
              <li className="flex items-start">
                  <span className="bg-brand-teal text-white font-bold rounded-full h-8 w-8 flex items-center justify-center text-md mr-4 flex-shrink-0">3</span>
                  <p className="text-brand-dark-gray">
                      Once approved, we'll start stitching! You can track the progress from your account.
                  </p>
              </li>
          </ul>
      </div>

       <button
        onClick={() => navigateTo('order')}
        className="mt-10 px-8 py-3 bg-brand-charcoal text-white rounded-xl font-semibold hover:bg-opacity-90 transition-colors shadow-lg"
       >
        Place Another Order
      </button>
    </div>
  );
};

export default OrderConfirmation;
