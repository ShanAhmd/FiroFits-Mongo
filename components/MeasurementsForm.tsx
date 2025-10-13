import React from 'react';
import { type OrderData, Unit, type Measurements } from '../types';

interface MeasurementsFormProps {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
  updateMeasurements: (measurements: Partial<Measurements>) => void;
}

const measurementFields: { key: keyof Measurements, label: string }[] = [
  { key: 'shoulder', label: 'Shoulder' },
  { key: 'chest', label: 'Chest (Round)' },
  { key: 'waist', label: 'Waist (Round)' },
  { key: 'hip', label: 'Hip (Round)' },
  { key: 'fullLength', label: 'Full Length' },
  { key: 'vestLength', label: 'Vest Length' },
  { key: 'sleeveLength', label: 'Sleeve Length' },
  { key: 'armhole', label: 'Armhole' },
  { key: 'collarSize', label: 'Collar Size' },
];

const MeasurementsForm: React.FC<MeasurementsFormProps> = ({ orderData, updateOrderData, updateMeasurements }) => {
  const handleUnitChange = (unit: Unit) => {
    updateOrderData({ unit });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (/^\d*\.?\d*$/.test(value)) {
        updateMeasurements({ [name as keyof Measurements]: value });
      }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-brand-charcoal">Enter Your Measurements</h2>
          <p className="text-brand-dark-gray">Provide your precise measurements for a perfect fit.</p>
        </div>
        <div className="flex items-center p-1 bg-brand-light-gray rounded-xl mt-4 sm:mt-0">
          <button
            onClick={() => handleUnitChange(Unit.INCHES)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors w-1/2 sm:w-auto ${orderData.unit === Unit.INCHES ? 'bg-white text-brand-teal shadow' : 'text-brand-dark-gray'}`}
          >
            Inches (in)
          </button>
          <button
            onClick={() => handleUnitChange(Unit.CENTIMETERS)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors w-1/2 sm:w-auto ${orderData.unit === Unit.CENTIMETERS ? 'bg-white text-brand-teal shadow' : 'text-brand-dark-gray'}`}
          >
            CM
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
        {measurementFields.map(field => (
          <div key={field.key as string}>
            <label htmlFor={field.key as string} className="block text-base font-semibold text-brand-charcoal">
              {field.label}
            </label>
            <div className="mt-2 relative rounded-xl shadow-sm">
                <input
                    type="text"
                    name={field.key as string}
                    id={field.key as string}
                    value={orderData.measurements[field.key]}
                    onChange={handleInputChange}
                    className="focus:ring-brand-teal focus:border-brand-teal block w-full pr-16 text-lg border-brand-light-gray rounded-xl px-4 py-3"
                    placeholder="0.0"
                    inputMode="decimal"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-brand-dark-gray text-base">{orderData.unit}</span>
                </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-brand-dark-gray mt-6">Not sure how to measure? Check out our <a href="#" className="text-brand-teal underline font-semibold">Size Guide</a>.</p>
    </div>
  );
};

export default MeasurementsForm;
