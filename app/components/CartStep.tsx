"use client";

import { CartItem, PRODUCTS, COLLAR_SIZES, LEASH_SIZES } from '@/types/collar';
import { motion } from 'framer-motion';
import { Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import CollarPreview from './CollarPreview';
import LeashPreview from './LeashPreview';

interface CartStepProps {
  items: CartItem[];
  onAddAnother: () => void;
}

function getPrice(priceStr: string): number {
  return parseInt(priceStr.replace(/\D/g, ''), 10);
}

function getSizeLabel(sizeValue: string, sizes: { value: string; label: string }[]) {
  return sizes.find((s) => s.value === sizeValue)?.label ?? '';
}

const CartStep = ({ items, onAddAnother }: CartStepProps) => {
  const total = items.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.type === item.productType);
    return sum + (product ? getPrice(product.price) : 0);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">Tu carrito</h2>
        <p className="text-muted-foreground mt-1">
          {items.length === 1 ? '1 producto configurado' : `${items.length} productos configurados`}
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const product = PRODUCTS.find((p) => p.type === item.productType);
          return (
            <div
              key={item.id}
              className="bg-card rounded-xl border border-border p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-foreground">{product?.label}</span>
                </div>
                <span className="text-primary font-bold">{product?.price}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(item.productType === 'collar' || item.productType === 'both') && item.collarDesign && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Collar · {getSizeLabel(item.collarDesign.collarSize, COLLAR_SIZES)} · {item.collarDesign.elements.length} piezas
                    </p>
                    <CollarPreview
                      collarColor={item.collarDesign.collarColor}
                      elements={item.collarDesign.elements}
                    />
                  </div>
                )}
                {(item.productType === 'leash' || item.productType === 'both') && item.leashDesign && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Correa · {getSizeLabel(item.leashDesign.leashSize, LEASH_SIZES)} · {item.leashDesign.elements.length} piezas
                    </p>
                    <LeashPreview
                      leashColor={item.leashDesign.leashColor}
                      elements={item.leashDesign.elements}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-xl px-4 py-2">
          <ShoppingBag className="w-4 h-4" />
          <span>
            Total estimado:{' '}
            <span className="font-bold text-foreground">
              ${total.toLocaleString('es-AR')} ARS
            </span>
          </span>
        </div>

        <Button
          variant="outline"
          onClick={onAddAnother}
          className="rounded-xl font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar otro producto
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Presiona <strong>Siguiente</strong> para continuar con tus datos y enviar el pedido.
        </p>
      </div>
    </motion.div>
  );
};

export default CartStep;
