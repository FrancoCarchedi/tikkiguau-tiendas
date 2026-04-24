"use client";

import { ProductType, PRODUCTS } from '@/types/collar';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProductStepProps {
  selectedProduct: ProductType | null;
  onSelect: (product: ProductType) => void;
}

const ProductStep = ({ selectedProduct, onSelect }: ProductStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          ¿Qué querés personalizar?
        </h2>
        <p className="text-muted-foreground mt-1">
          Elegí el producto que querés diseñar
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {PRODUCTS.map((product) => {
          const isSelected = selectedProduct === product.type;
          return (
            <button
              key={product.type}
              onClick={() => onSelect(product.type)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-foreground block">{product.label}</span>
                  <span className="text-sm text-muted-foreground">{product.description}</span>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <span className={`text-lg font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {product.price}
                  </span>
                  {isSelected && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ProductStep;
