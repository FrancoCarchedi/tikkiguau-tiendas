"use client";

import { CollarElement, UserData, LeashDesign } from '@/types/collar';
import { motion } from 'framer-motion';
import CollarPreview from './CollarPreview';
import LeashPreview from './LeashPreview';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface FinalStepProps {
  collarColor: string;
  elements: CollarElement[];
  leashDesign: LeashDesign;
  userData: UserData;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

const FinalStep = ({
  collarColor,
  elements,
  leashDesign,
  userData,
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

      <div ref={previewRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2 text-center">Collar</h3>
          <CollarPreview collarColor={collarColor} elements={elements} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2 text-center">Correa</h3>
          <LeashPreview leashColor={leashDesign.leashColor} elements={leashDesign.elements} />
        </div>
      </div>

      <div className="bg-card rounded-xl p-4 shadow-card space-y-2 max-w-sm mx-auto">
        <h3 className="font-semibold text-foreground border-b pb-2 mb-2">Resumen de tu pedido</h3>
        <div className="flex justify-between items-center text-sm font-medium text-foreground">
          <span>Combo TikkiGuau (Collar + Correa)</span>
          <span className="text-primary font-bold">$37.000</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Incluye hasta 16 piezas en total (6 en collar y 10 en correa).</p>
      </div>

      <div className="bg-card rounded-xl p-4 shadow-card space-y-2 max-w-sm mx-auto">
        <h3 className="font-semibold text-foreground border-b pb-2 mb-2">Datos de contacto</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p><span className="font-medium text-foreground">Nombre:</span> {userData.name}</p>
          <p><span className="font-medium text-foreground">Email:</span> {userData.email}</p>
          <p><span className="font-medium text-foreground">Teléfono:</span> {userData.phone}</p>
          <p><span className="font-medium text-foreground">Tienda:</span> {userData.storeName}</p>
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
