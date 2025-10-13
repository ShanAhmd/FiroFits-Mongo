import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const steps = ["Service", "Design", "Measurements", "Extras", "Delivery", "Submit"];

  return (
    <div className="w-full">
      <div className="flex items-center">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 border-2
                    ${isCompleted ? 'bg-brand-teal border-brand-teal text-white' : ''}
                    ${isActive ? 'bg-white border-brand-teal scale-110' : ''}
                    ${!isCompleted && !isActive ? 'bg-brand-light-gray border-brand-light-gray' : ''}
                  `}
                >
                  {isCompleted ? '✔' : <span className={`${isActive ? 'text-brand-teal' : 'text-brand-dark-gray'}`}>{stepNumber}</span>}
                </div>
                <p className={`mt-2 text-xs font-semibold uppercase tracking-wider ${isActive ? 'text-brand-teal' : 'text-brand-dark-gray'}`}>
                  {label}
                </p>
              </div>
              {stepNumber < totalSteps && (
                <div className={`flex-1 h-1 mx-2 rounded-full transition-colors duration-500
                  ${isCompleted || isActive ? 'bg-brand-teal' : 'bg-brand-light-gray'}
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
