import React from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  onStepClick,
}) => {
  const { t } = useTranslation();

  const steps = [
    { number: 1, key: 'register.step1' },
    { number: 2, key: 'register.step2' },
    { number: 3, key: 'register.step3' },
    { number: 4, key: 'register.step4' },
    { number: 5, key: 'register.step5' },
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
        {steps.slice(0, totalSteps).map((step, idx) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isClickable = onStepClick && isCompleted;

          return (
            <React.Fragment key={step.number}>
              {/* Step Circle & Label */}
              <div
                className={`flex flex-col items-center relative group ${
                  isClickable ? 'cursor-pointer' : ''
                }`}
                onClick={() => isClickable && onStepClick(step.number)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-700 text-white shadow-md'
                      : isCurrent
                      ? 'bg-amber-500 text-stone-900 ring-4 ring-amber-100 dark:ring-amber-950/60 shadow-lg scale-105'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : step.number}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center hidden sm:block max-w-[90px] transition-colors ${
                    isCurrent
                      ? 'text-amber-600 dark:text-amber-400 font-bold'
                      : isCompleted
                      ? 'text-emerald-800 dark:text-emerald-300'
                      : 'text-stone-400 dark:text-stone-500'
                  }`}
                >
                  {t(step.key as any)}
                </span>
              </div>

              {/* Connecting Line */}
              {idx < totalSteps - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 sm:mx-4 rounded transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-600'
                      : 'bg-stone-200 dark:bg-stone-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Mobile Step Title */}
      <div className="sm:hidden text-center mt-3">
        <span className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
          {t('register.stepOf').replace('{step}', String(currentStep)).replace('{total}', String(totalSteps))}: {t(steps[currentStep - 1]?.key as any)}
        </span>
      </div>
    </div>
  );
};
