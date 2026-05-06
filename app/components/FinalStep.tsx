"use client";

import { CartItem, UserData, PRODUCTS, COLLAR_SIZES, LEASH_SIZES } from '@/types/collar';
import { motion } from 'framer-motion';
import CollarPreview from './CollarPreview';
import LeashPreview from './LeashPreview';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface FinalStepProps {
  items: CartItem[];
  userData: UserData;
  storeName: string | null;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

function getPrice(priceStr: string): number {
  return parseInt(priceStr.replace(/\D/g, ''), 10);
}

function getSizeLabel(sizeValue: string, sizes: { value: string; label: string }[]) {
  return sizes.find((s) => s.value === sizeValue)?.label ?? '';
}

const FinalStep = ({
  items,
  userData,
  storeName,
  onSubmit,
  isSubmitting,
  isSubmitted,
  previewRef,
}: FinalStepProps) => {
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4 py-12"
      >
        <CheckCircle className="w-16 h-16 text-accent mx-auto" />
        <h2 className="text-3xl font-semibold text-foreground">
          ¡Diseño enviado!
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Hemos recibido tu diseño personalizado. Te contactaremos pronto.
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="rounded-xl font-semibold px-6 mt-2"
        >
          Crear otro diseño
        </Button>
      </motion.div>
    );
  }

  const total = items.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.type === item.productType);
    return sum + (product ? getPrice(product.price) : 0);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          Vista previa final
        </h2>
        <p className="text-muted-foreground mt-1">
          Revisa tu diseño antes de enviar
        </p>
      </div>

      <div ref={previewRef} className="space-y-4 max-w-3xl mx-auto">
        {items.map((item, index) => {
          const product = PRODUCTS.find((p) => p.type === item.productType);
          return (
            <div key={item.id} className="bg-card rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {index + 1}
                </span>
                <span className="font-semibold text-foreground">{product?.label}</span>
                <span className="ml-auto text-primary font-bold text-sm">{product?.price}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(item.productType === 'collar' || item.productType === 'both') && item.collarDesign && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground mb-1">
                      Collar · {getSizeLabel(item.collarDesign.collarSize, COLLAR_SIZES)}
                    </h3>
                    <CollarPreview
                      collarColor={item.collarDesign.collarColor}
                      elements={item.collarDesign.elements}
                    />
                  </div>
                )}
                {(item.productType === 'leash' || item.productType === 'both') && item.leashDesign && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground mb-1">
                      Correa · {getSizeLabel(item.leashDesign.leashSize, LEASH_SIZES)}
                    </h3>
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

      <div className="bg-card rounded-xl p-4 shadow-card space-y-2 max-w-sm mx-auto">
        <h3 className="font-semibold text-foreground border-b pb-2 mb-2">Resumen de tu pedido</h3>
        {items.map((item, index) => {
          const product = PRODUCTS.find((p) => p.type === item.productType);
          return (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">#{index + 1} {product?.label}</span>
              <span className="font-medium text-foreground">{product?.price}</span>
            </div>
          );
        })}
        <div className="flex justify-between items-center text-sm font-bold text-foreground border-t pt-2 mt-2">
          <span>Total</span>
          <span className="text-primary">${total.toLocaleString('es-AR')} ARS</span>
        </div>
      </div>

      <div className="bg-card rounded-xl p-4 shadow-card space-y-2 max-w-sm mx-auto">
        <h3 className="font-semibold text-foreground border-b pb-2 mb-2">Datos de contacto</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p><span className="font-medium text-foreground">Nombre:</span> {userData.name}</p>
          <p><span className="font-medium text-foreground">Email:</span> {userData.email}</p>
          <p><span className="font-medium text-foreground">Teléfono:</span> {userData.phone}</p>
          <p><span className="font-medium text-foreground">Tienda:</span> {storeName}</p>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-xl text-lg shadow-soft"
        >
          {isSubmitting ? (
            'Enviando...'
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Enviar diseño
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default FinalStep;
