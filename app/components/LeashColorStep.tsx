"use client";

import { COLLAR_COLORS } from '@/types/collar';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeashColorStepProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const LeashColorStep = ({ selectedColor, onSelectColor }: LeashColorStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          Elige el color de la correa
        </h2>
        <p className="text-muted-foreground mt-1">
          Selecciona el color para personalizar tu correa
        </p>
      </div>

      <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
        {COLLAR_COLORS.map((color) => (
          <button
            key={color.value}
            onClick={() => onSelectColor(color.value)}
            className="group flex flex-col items-center gap-1.5"
          >
            <div
              className={`w-12 h-12 rounded-full border-4 transition-all duration-200 flex items-center justify-center cursor-pointer hover:scale-110 ${
                selectedColor === color.value
                  ? 'border-primary shadow-soft scale-110'
                  : 'border-transparent shadow-card'
              }`}
              style={{ backgroundColor: color.value }}
            >
              {selectedColor === color.value && (
                <Check className="w-5 h-5 text-white drop-shadow-md" />
              )}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {color.name}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default LeashColorStep;
