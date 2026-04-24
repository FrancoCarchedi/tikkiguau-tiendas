"use client";

import { Check } from 'lucide-react';

const STEPS = [
  { label: 'Collar', number: 1 },
  { label: 'Diseño', number: 2 },
  { label: 'Correa', number: 3 },
  { label: 'Emojis', number: 4 },
  { label: 'Datos', number: 5 },
  { label: 'Enviar', number: 6 },
];

interface StepperProps {
  currentStep: number;
}

const Stepper = ({ currentStep }: StepperProps) => {
  return (
    <div className="flex items-center justify-center gap-1 mb-5">
      {STEPS.map((step, i) => {
        const isCompleted = currentStep > step.number;
        const isCurrent = currentStep === step.number;
        return (
          <div key={step.number} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : isCurrent
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isCurrent ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 h-0.5 mb-5 transition-colors ${
                  currentStep > step.number ? 'bg-accent' : 'bg-border'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
