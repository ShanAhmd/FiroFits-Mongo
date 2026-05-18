import React from 'react';
import { InfoIcon } from './IconComponents';

interface NotificationPanelProps {
  message: string;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[300] animate-slide-up">
      <div className="bg-black border border-white/20 p-4 flex items-center shadow-2xl min-w-[300px] max-w-sm">
        <div className="flex-shrink-0 mr-4">
          <InfoIcon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">System Protocol</p>
          <p className="text-xs font-light text-gray-300 tracking-wide mt-1">{message}</p>
        </div>
        <div className="flex-shrink-0 ml-4 border-l border-white/20 pl-4">
          <button
            onClick={onClose}
            className="text-white hover:text-gray-400 transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
