import React, { useState } from 'react';
import { type OrderData, type Measurements, Unit } from '../types';

interface MeasurementsFormProps {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
  updateMeasurements: (data: Partial<Measurements>) => void;
}

const MeasurementsForm: React.FC<MeasurementsFormProps> = ({ orderData, updateOrderData, updateMeasurements }) => {
  const [activeInfoBox, setActiveInfoBox] = useState<string | null>(null);

  const measurementFields = [
    { id: 'shoulder', label: 'Shoulder Width', placeholder: 'Measurement', desc: 'Tip of one shoulder to the other.' },
    { id: 'chest', label: 'Chest', placeholder: 'Measurement', desc: 'Fullest part of your chest or bust.' },
    { id: 'waist', label: 'Waist', placeholder: 'Measurement', desc: 'Narrowest part of your waist.' },
    { id: 'hip', label: 'Hips', placeholder: 'Measurement', desc: 'Fullest part of your hips.' },
    { id: 'fullLength', label: 'Full Length', placeholder: 'Measurement', desc: 'Nape of your neck down to the desired hem.' },
    { id: 'vestLength', label: 'Torso Length', placeholder: 'Measurement', desc: 'Nape of your neck down to your natural waist.' },
    { id: 'sleeveLength', label: 'Sleeve Length', placeholder: 'Measurement', desc: 'Tip of your shoulder down to your wrist.' },
    { id: 'armhole', label: 'Armhole', placeholder: 'Measurement', desc: 'Around your shoulder joint.' },
    { id: 'collarSize', label: 'Neck Size', placeholder: 'Measurement', desc: 'Around the base of your neck.' }
  ];

  return (
    <div className="animate-fade-in space-y-12">
      <div className="border-b border-black pb-6 flex justify-between items-end">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-brand-dark-gray font-bold block mb-2">Step 03</span>
          <h2 className="text-4xl font-serif text-black uppercase tracking-tighter">Your Measurements</h2>
          <p className="text-xs text-brand-dark-gray font-light mt-2 tracking-wide max-w-sm">
            Please provide your exact measurements to ensure a perfect fit.
          </p>
        </div>
        
        {/* Metric / Imperial Unit Toggle */}
        <div className="flex border border-black p-1 bg-gray-50 shrink-0">
          <button
            type="button"
            className={`px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${orderData.unit === Unit.INCHES ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
            onClick={() => updateOrderData({ unit: Unit.INCHES })}
          >
            Inches
          </button>
          <button
            type="button"
            className={`px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${orderData.unit === Unit.CENTIMETERS ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
            onClick={() => updateOrderData({ unit: Unit.CENTIMETERS })}
          >
            CM
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {measurementFields.map((field) => (
          <div key={field.id} className="relative group">
            <div className="flex justify-between items-center mb-4">
              <label htmlFor={field.id} className="text-[9px] uppercase tracking-[0.3em] font-bold text-black flex items-center gap-2">
                {field.label}
              </label>
              <button
                type="button"
                className="text-[10px] text-gray-400 hover:text-black font-bold uppercase tracking-widest transition-colors"
                onMouseEnter={() => setActiveInfoBox(field.id)}
                onMouseLeave={() => setActiveInfoBox(null)}
              >
                [ ? ]
              </button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                id={field.id}
                className="w-full bg-transparent border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-3 text-sm font-bold uppercase tracking-widest text-black rounded-none transition-colors placeholder-gray-300 font-sans"
                placeholder={field.placeholder}
                value={(orderData.measurements as any)[field.id] || ''}
                onChange={(e) => updateMeasurements({ [field.id]: e.target.value })}
              />
              <span className="absolute right-0 bottom-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {orderData.unit === Unit.INCHES ? 'IN' : 'CM'}
              </span>
            </div>

            {/* Hover tooltip */}
            <div className={`absolute z-10 bottom-full left-0 mb-2 w-full bg-black text-white p-3 border border-white/10 transition-all duration-300 pointer-events-none shadow-2xl ${activeInfoBox === field.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <span className="block text-[8px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-1">How to Measure</span>
              <p className="text-xs font-light tracking-wide">{field.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeasurementsForm;
