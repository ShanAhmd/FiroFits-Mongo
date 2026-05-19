import React, { useState } from 'react';
import { type OrderData, type Measurements, Unit } from '../types';

interface MeasurementsFormProps {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
  updateMeasurements: (data: Partial<Measurements>) => void;
}

const MeasurementSVG = ({ area }: { area: string }) => {
  return (
    <svg viewBox="0 0 100 150" className="w-full h-24 mx-auto mb-3 text-gray-500 stroke-current" fill="none" strokeWidth="1.5">
      {/* Basic Mannequin Outline */}
      <path d="M40 20 C40 10, 60 10, 60 20 C60 25, 55 30, 55 35 L45 35 C45 30, 40 25, 40 20 Z" />
      <path d="M45 35 L25 40 C15 45, 15 60, 15 60 L22 100 L32 100 L32 140 L68 140 L68 100 L78 100 L85 60 C85 60, 85 45, 75 40 L55 35 Z" />
      
      {/* Dynamic Red Measurement Lines */}
      {area === 'shoulder' && <line x1="20" y1="42" x2="80" y2="42" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 2" />}
      {area === 'chest' && <line x1="16" y1="55" x2="84" y2="55" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 2" />}
      {area === 'waist' && <line x1="20" y1="75" x2="80" y2="75" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 2" />}
      {area === 'hip' && <line x1="16" y1="95" x2="84" y2="95" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 2" />}
      {area === 'fullLength' && <line x1="50" y1="35" x2="50" y2="135" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 2" />}
      {area === 'vestLength' && <line x1="50" y1="35" x2="50" y2="75" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 2" />}
      {area === 'sleeveLength' && <line x1="78" y1="42" x2="88" y2="90" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 2" />}
      {area === 'armhole' && <ellipse cx="78" cy="48" rx="6" ry="12" stroke="#ef4444" strokeWidth="2" strokeDasharray="2 2" />}
      {area === 'collarSize' && <path d="M42 33 Q50 38 58 33" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 1" />}
    </svg>
  );
};

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
            <div className={`absolute z-10 bottom-full left-0 mb-2 w-full bg-black text-white p-5 border border-white/10 transition-all duration-300 pointer-events-none shadow-2xl ${activeInfoBox === field.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <MeasurementSVG area={field.id} />
              <div className="text-center">
                <span className="block text-[9px] uppercase tracking-[0.3em] font-bold text-red-400 mb-1">{field.label}</span>
                <p className="text-xs font-light tracking-wide text-gray-300">{field.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeasurementsForm;
