import React from 'react';
import { type OrderData, GarmentType } from '../types';
import { UniformIcon, AbayaIcon, BlouseIcon, DressIcon, FrockIcon, OtherIcon } from './IconComponents';

interface ServiceSelectionProps {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
}

const services = [
  { type: GarmentType.SAREE_BLOUSE, icon: <BlouseIcon className="w-10 h-10" /> },
  { type: GarmentType.LADIES_DRESS, icon: <DressIcon className="w-10 h-10" /> },
  { type: GarmentType.FROCK, icon: <FrockIcon className="w-10 h-10" /> },
  { type: GarmentType.ABAYA, icon: <AbayaIcon className="w-10 h-10" /> },
  { type: GarmentType.SCHOOL_UNIFORM, icon: <UniformIcon className="w-10 h-10" /> },
  { type: GarmentType.OTHER, icon: <OtherIcon className="w-10 h-10" /> },
];

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ orderData, updateOrderData }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-charcoal mb-2">Choose Your Service</h2>
      <p className="text-brand-dark-gray mb-8">What can we create for you today?</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {services.map(service => (
          <button
            key={service.type}
            onClick={() => updateOrderData({ service: service.type })}
            className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl text-center transition-all duration-300 transform
              ${orderData.service === service.type 
                ? 'border-brand-teal bg-teal-50 shadow-lg scale-105' 
                : 'border-brand-light-gray bg-white hover:border-brand-teal hover:-translate-y-1 hover:shadow-md'}
            `}
          >
            <div className="text-brand-teal mb-3">{service.icon}</div>
            <span className="font-semibold text-brand-charcoal">{service.type}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
