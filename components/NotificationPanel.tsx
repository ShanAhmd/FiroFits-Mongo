
import React from 'react';
import { InfoIcon } from './IconComponents';

interface NotificationPanelProps {
  message: string;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ message, onClose }) => {
  return (
    <div className="fixed top-5 right-5 z-50 animate-fade-in-down">
      <div className="max-w-sm bg-white border-l-4 border-brand-success rounded-lg shadow-lg p-4 flex items-start">
        <div className="flex-shrink-0">
          <InfoIcon className="h-6 w-6 text-brand-success" />
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-semibold text-brand-charcoal">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={onClose}
            className="inline-flex text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
