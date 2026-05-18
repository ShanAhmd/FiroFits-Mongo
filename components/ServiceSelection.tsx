import React from 'react';
import { type OrderData, GarmentType } from '../types';

interface ServiceSelectionProps {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
}

const services = [
  { id: GarmentType.SAREE_BLOUSE, name: 'Saree Blouse', desc: 'Custom tailored saree blouses with perfect fit.' },
  { id: GarmentType.ABAYA, name: 'Abaya', desc: 'Elegant, modest, and flowing abaya designs.' },
  { id: GarmentType.LADIES_DRESS, name: 'Ladies Dress', desc: 'Classic and modern ladies dresses.' },
  { id: GarmentType.SCHOOL_UNIFORM, name: 'Uniforms', desc: 'Professional and comfortable workwear.' },
  { id: GarmentType.OTHER, name: 'Other Design', desc: 'Have something else in mind? Let us know.' }
];

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ orderData, updateOrderData }) => {
  return (
    <div className="animate-fade-in space-y-12">
      <div className="border-b border-black pb-6">
        <span className="text-[10px] uppercase tracking-[0.4em] text-brand-dark-gray font-bold block mb-2">Step 01</span>
        <h2 className="text-4xl font-serif text-black uppercase tracking-tighter">Choose Your Style</h2>
        <p className="text-xs text-brand-dark-gray font-light mt-2 tracking-wide">
          Select the type of clothing you would like us to tailor for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => updateOrderData({ service: service.id as GarmentType })}
            className={`cursor-pointer border transition-all duration-300 p-8 flex flex-col space-y-4
              ${orderData.service === service.id 
                ? 'bg-black border-black text-white' 
                : 'bg-white border-black/20 text-black hover:border-black hover:bg-gray-50'
              }`}
          >
            <h3 className="text-xl font-serif uppercase tracking-wider font-bold">
              {service.name}
            </h3>
            <p className={`text-[10px] font-light uppercase tracking-widest ${orderData.service === service.id ? 'text-gray-300' : 'text-brand-dark-gray'}`}>
              {service.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
