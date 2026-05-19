import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const steps = ["Garment Type", "Design Details", "Measurements", "Add-ons", "Delivery Info", "Agreement", "Submit Order"];

  return (
    <div className="w-full">
      <div className="flex items-center">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2
                    ${isCompleted ? 'bg-black border-black text-white' : ''}
                    ${isActive ? 'bg-white border-black text-black scale-110 shadow-lg' : ''}
                    ${!isCompleted && !isActive ? 'bg-transparent border-gray-300 text-gray-400' : ''}
                  `}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <p className={`mt-3 text-[9px] uppercase tracking-[0.25em] font-bold text-center ${isActive || isCompleted ? 'text-black' : 'text-gray-400'}`}>
                  {label}
                </p>
              </div>
              {stepNumber < totalSteps && (
                <div className={`flex-[2] h-[1px] transition-colors duration-500
                  ${isCompleted ? 'bg-black' : 'bg-gray-200'}
                `}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
