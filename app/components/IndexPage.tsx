"use client";

import { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import {
  CollarElement,
  CollarDesign,
  LeashDesign,
  UserData,
  COLLAR_COLORS,
  CollarSize,
  MAX_COLLAR_ELEMENTS,
  MIN_COLLAR_ELEMENTS,
  MAX_LEASH_ELEMENTS,
  MIN_LEASH_ELEMENTS,
  ProductType,
} from '@/types/collar';
import Stepper from './Stepper';
import ProductStep from './ProductStep';
import CollarColorStep from './CollarColorStep';
import CollarPreview from './CollarPreview';
import LeashColorStep from './LeashColorStep';
import LeashPreview from './LeashPreview';
import ElementEditor from './ElementEditor';
import UserDataStep from './UserDataStep';
import FinalStep from './FinalStep';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import Image from 'next/image';

type StepKey = 'product' | 'collar-color' | 'collar-design' | 'leash-color' | 'leash-design' | 'user-data' | 'final';

const STEP_LABELS: Record<StepKey, string> = {
  'product': 'Producto',
  'collar-color': 'Color collar',
  'collar-design': 'Diseño collar',
  'leash-color': 'Color correa',
  'leash-design': 'Diseño correa',
  'user-data': 'Datos',
  'final': 'Enviar',
};

const FLOWS: Record<ProductType, StepKey[]> = {
  collar: ['product', 'collar-color', 'collar-design', 'user-data', 'final'],
  leash: ['product', 'leash-color', 'leash-design', 'user-data', 'final'],
  both: ['product', 'collar-color', 'collar-design', 'leash-color', 'leash-design', 'user-data', 'final'],
};

const IndexPage = () => {
  const [step, setStep] = useState(1);
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [design, setDesign] = useState<CollarDesign>({
    collarColor: COLLAR_COLORS[0].value,
    collarSize: '1',
    elements: [],
  });
  const [leashDesign, setLeashDesign] = useState<LeashDesign>({
    leashColor: COLLAR_COLORS[0].value,
    elements: [],
  });
  const [userData, setUserData] = useState<UserData>({ name: '', email: '', phone: '', storeName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const currentFlow: StepKey[] = productType ? FLOWS[productType] : ['product'];
  const totalSteps = currentFlow.length;
  const currentStepKey: StepKey = currentFlow[step - 1] ?? 'product';
  const stepperSteps = currentFlow.map((key) => ({ label: STEP_LABELS[key] }));

  const addCollarElement = useCallback(
    (el: Omit<CollarElement, 'id'>) => {
      setDesign((prev) => ({
        ...prev,
        elements: [...prev.elements, { ...el, id: crypto.randomUUID() }],
      }));
    },
    []
  );

  const removeCollarElement = useCallback((id: string) => {
    setDesign((prev) => ({
      ...prev,
      elements: prev.elements.filter((e) => e.id !== id),
    }));
  }, []);

  const changeCollarColor = useCallback((id: string, color: string) => {
    setDesign((prev) => ({
      ...prev,
      elements: prev.elements.map((e) => (e.id === id ? { ...e, color } : e)),
    }));
  }, []);

  const reorderCollarElements = useCallback((elements: CollarElement[]) => {
    setDesign((prev) => ({ ...prev, elements }));
  }, []);

  const clearCollarElements = useCallback(() => {
    setDesign((prev) => ({ ...prev, elements: [] }));
  }, []);

  const addLeashElement = useCallback(
    (el: Omit<CollarElement, 'id'>) => {
      setLeashDesign((prev) => ({
        ...prev,
        elements: [...prev.elements, { ...el, id: crypto.randomUUID() }],
      }));
    },
    []
  );

  const removeLeashElement = useCallback((id: string) => {
    setLeashDesign((prev) => ({
      ...prev,
      elements: prev.elements.filter((e) => e.id !== id),
    }));
  }, []);

  const changeLeashElementColor = useCallback((id: string, color: string) => {
    setLeashDesign((prev) => ({
      ...prev,
      elements: prev.elements.map((e) => (e.id === id ? { ...e, color } : e)),
    }));
  }, []);

  const reorderLeashElements = useCallback((elements: CollarElement[]) => {
    setLeashDesign((prev) => ({ ...prev, elements }));
  }, []);

  const clearLeashElements = useCallback(() => {
    setLeashDesign((prev) => ({ ...prev, elements: [] }));
  }, []);

  const canProceed = () => {
    if (currentStepKey === 'product') return productType !== null;
    if (currentStepKey === 'collar-design') return design.elements.length >= MIN_COLLAR_ELEMENTS;
    if (currentStepKey === 'leash-design') return leashDesign.elements.length >= MIN_LEASH_ELEMENTS;
    if (currentStepKey === 'user-data') return !!(userData.name && userData.email && userData.phone && userData.storeName);
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let imageDataUrl = '';
      if (previewRef.current) {
        imageDataUrl = await toPng(previewRef.current, { quality: 0.95, pixelRatio: 2 });
      }

      console.log('Design submitted:', {
        design,
        leashDesign,
        userData,
        imageDataUrl: imageDataUrl.substring(0, 100) + '...',
      });

      await new Promise((r) => setTimeout(r, 1500));

      setIsSubmitted(true);
      toast({
        title: '¡Enviado con éxito!',
        description: 'Tu diseño ha sido enviado correctamente.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo enviar el diseño. Intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#D20A0A] flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">

        <div className="flex items-center justify-center py-5 px-6 border-b border-gray-100">
          <Image
            src="/tikkiguau-logo.png"
            alt="TikkiGuau"
            width={200}
            height={56}
            style={{ height: '56px', width: 'auto' }}
            priority
            unoptimized
          />
        </div>

        <main className="px-4 py-6">
          <Stepper steps={stepperSteps} currentStep={step} />

          {currentStepKey === 'product' && (
            <ProductStep
              selectedProduct={productType}
              onSelect={setProductType}
            />
          )}

          {currentStepKey === 'collar-color' && (
            <div className="space-y-8">
              <CollarColorStep
                selectedColor={design.collarColor}
                selectedSize={design.collarSize}
                onSelectColor={(c) => setDesign((prev) => ({ ...prev, collarColor: c }))}
                onSelectSize={(s: CollarSize) => setDesign((prev) => ({ ...prev, collarSize: s }))}
              />
              <div className="max-w-lg mx-auto">
                <CollarPreview collarColor={design.collarColor} elements={[]} />
              </div>
            </div>
          )}

          {currentStepKey === 'collar-design' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ElementEditor
                elements={design.elements}
                onAddElement={addCollarElement}
                onRemoveElement={removeCollarElement}
                onChangeColor={changeCollarColor}
                onReorder={reorderCollarElements}
                onClear={clearCollarElements}
                maxElements={MAX_COLLAR_ELEMENTS}
                minElements={MIN_COLLAR_ELEMENTS}
                mode="collar"
                title="Personaliza tu collar"
              />
              <div className="lg:sticky lg:top-28 lg:self-start">
                <CollarPreview
                  collarColor={design.collarColor}
                  elements={design.elements}
                  onChangeColor={changeCollarColor}
                  onReorder={reorderCollarElements}
                  onRemoveElement={removeCollarElement}
                />
              </div>
            </div>
          )}

          {currentStepKey === 'leash-color' && (
            <div className="space-y-8">
              <LeashColorStep
                selectedColor={leashDesign.leashColor}
                onSelectColor={(c) => setLeashDesign((prev) => ({ ...prev, leashColor: c }))}
              />
              <div className="max-w-lg mx-auto">
                <LeashPreview leashColor={leashDesign.leashColor} elements={leashDesign.elements} />
              </div>
            </div>
          )}

          {currentStepKey === 'leash-design' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ElementEditor
                elements={leashDesign.elements}
                onAddElement={addLeashElement}
                onRemoveElement={removeLeashElement}
                onChangeColor={changeLeashElementColor}
                onReorder={reorderLeashElements}
                onClear={clearLeashElements}
                maxElements={MAX_LEASH_ELEMENTS}
                minElements={MIN_LEASH_ELEMENTS}
                mode="leash"
                title="Personaliza tu correa"
                subtitle={`Agrega emojis (${leashDesign.elements.length}/${MAX_LEASH_ELEMENTS}, mínimo ${MIN_LEASH_ELEMENTS})`}
              />
              <div className="lg:sticky lg:top-28 lg:self-start">
                <LeashPreview leashColor={leashDesign.leashColor} elements={leashDesign.elements} />
              </div>
            </div>
          )}

          {currentStepKey === 'user-data' && (
            <UserDataStep data={userData} onChange={setUserData} />
          )}

          {currentStepKey === 'final' && (
            <FinalStep
              collarColor={design.collarColor}
              elements={design.elements}
              leashDesign={leashDesign}
              userData={userData}
              productType={productType!}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isSubmitted={isSubmitted}
              previewRef={previewRef}
            />
          )}

          {!isSubmitted && (
            <div className="flex justify-between items-center mt-6 max-w-2xl mx-auto">
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                  className="rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Atrás
                </Button>
              ) : (
                <div />
              )}

              {step < totalSteps && (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                  className="bg-primary text-primary-foreground rounded-xl font-semibold px-6"
                >
                  Siguiente <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default IndexPage;
