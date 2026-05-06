"use client";

import { useState, useRef, useCallback } from 'react';
import {
  CollarElement,
  CollarDesign,
  LeashDesign,
  UserData,
  COLLAR_COLORS,
  COLLAR_SIZES,
  LEASH_SIZES,
  CollarSize,
  LeashSize,
  MAX_COLLAR_ELEMENTS,
  MIN_COLLAR_ELEMENTS,
  MAX_LEASH_ELEMENTS,
  MIN_LEASH_ELEMENTS,
  ProductType,
  CartItem,
  PRODUCTS,
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
import CartStep from './CartStep';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import Image from 'next/image';

const ELEMENT_COLOR_NAMES: Record<string, string> = {
  '#FAFAFA': 'Blanco',
  '#1B1B1B': 'Negro',
  '#FAC2DD': 'Rosa',
  '#FEF31B': 'Amarillo',
  '#F6732D': 'Naranja',
  '#93CDF5': 'Celeste',
  '#8CE186': 'Verde',
  '#E0374E': 'Rojo',
  '#0041B9': 'Azul',
  '#E1CBF1': 'Lila',
};

function buildOrderItems(items: CartItem[]) {
  const getPrice = (priceStr: string) => parseInt(priceStr.replace(/\D/g, ''), 10);

  return items.map((item) => {
    const product = PRODUCTS.find((p) => p.type === item.productType)!;

    const transformPart = (design: CollarDesign | LeashDesign, isCollar: boolean) => {
      const colorValue = isCollar
        ? (design as CollarDesign).collarColor
        : (design as LeashDesign).leashColor;
      const sizeValue = isCollar
        ? (design as CollarDesign).collarSize
        : (design as LeashDesign).leashSize;
      const colorName =
        COLLAR_COLORS.find((c) => c.value === colorValue)?.name ?? colorValue;
      const sizeLabel = isCollar
        ? (COLLAR_SIZES.find((s) => s.value === sizeValue)?.label ?? `Talla ${sizeValue}`)
        : (LEASH_SIZES.find((s) => s.value === sizeValue)?.label ?? `Talla ${sizeValue}`);

      return {
        size: sizeLabel,
        colorValue,
        colorName,
        elements: design.elements.map((el) => ({
          type: el.type,
          value: el.value,
          colorValue: el.color,
          colorName: ELEMENT_COLOR_NAMES[el.color] ?? el.color,
        })),
      };
    };

    return {
      productType: item.productType === 'leash' ? 'correa' : item.productType,
      productLabel: product.label,
      price: getPrice(product.price),
      collar: item.collarDesign ? transformPart(item.collarDesign, true) : undefined,
      correa: item.leashDesign ? transformPart(item.leashDesign, false) : undefined,
    };
  });
}

type StepKey = 'product' | 'collar-color' | 'collar-design' | 'leash-color' | 'leash-design' | 'cart' | 'user-data' | 'final';

const STEP_LABELS: Record<StepKey, string> = {
  'product': 'Producto',
  'collar-color': 'Color collar',
  'collar-design': 'Diseño collar',
  'leash-color': 'Color correa',
  'leash-design': 'Diseño correa',
  'cart': 'Carrito',
  'user-data': 'Datos',
  'final': 'Enviar',
};

const FLOWS: Record<ProductType, StepKey[]> = {
  collar: ['product', 'collar-color', 'collar-design', 'cart', 'user-data', 'final'],
  leash: ['product', 'leash-color', 'leash-design', 'cart', 'user-data', 'final'],
  both: ['product', 'collar-color', 'collar-design', 'leash-color', 'leash-design', 'cart', 'user-data', 'final'],
};

const INITIAL_COLLAR: CollarDesign = {
  collarColor: COLLAR_COLORS[0].value,
  collarSize: '1',
  elements: [],
};

const INITIAL_LEASH: LeashDesign = {
  leashColor: COLLAR_COLORS[0].value,
  leashSize: '1',
  elements: [],
};

const IndexPage = () => {
  const [step, setStep] = useState(1);
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [design, setDesign] = useState<CollarDesign>(INITIAL_COLLAR);
  const [leashDesign, setLeashDesign] = useState<LeashDesign>(INITIAL_LEASH);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [userData, setUserData] = useState<UserData>({ name: '', email: '', phone: '', storeKeyword: '' });
  const [resolvedStoreName, setResolvedStoreName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [collarSelectedId, setCollarSelectedId] = useState<string | null>(null);
  const [leashSelectedId, setLeashSelectedId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const currentFlow: StepKey[] = productType ? FLOWS[productType] : ['product'];
  const totalSteps = currentFlow.length;
  const currentStepKey: StepKey = currentFlow[step - 1] ?? 'product';
  const stepperSteps = currentFlow.map((key) => ({ label: STEP_LABELS[key] }));

  // Build the current item being configured
  const currentItem: CartItem = {
    id: 'current',
    productType: productType ?? 'collar',
    collarDesign: (productType === 'collar' || productType === 'both') ? design : undefined,
    leashDesign: (productType === 'leash' || productType === 'both') ? leashDesign : undefined,
  };

  // All items shown in cart / final step
  const allItems: CartItem[] = [...savedItems, currentItem];

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

  const handleAddAnotherProduct = useCallback(() => {
    // Save current item to cart
    const savedItem: CartItem = {
      id: crypto.randomUUID(),
      productType: productType!,
      collarDesign: (productType === 'collar' || productType === 'both') ? { ...design, elements: [...design.elements] } : undefined,
      leashDesign: (productType === 'leash' || productType === 'both') ? { ...leashDesign, elements: [...leashDesign.elements] } : undefined,
    };
    setSavedItems((prev) => [...prev, savedItem]);
    // Reset current item
    setProductType(null);
    setDesign(INITIAL_COLLAR);
    setLeashDesign(INITIAL_LEASH);
    setStep(1);
  }, [productType, design, leashDesign]);

  const canProceed = () => {
    if (currentStepKey === 'product') return productType !== null;
    if (currentStepKey === 'collar-design') return design.elements.length >= MIN_COLLAR_ELEMENTS;
    if (currentStepKey === 'leash-design') return leashDesign.elements.length >= MIN_LEASH_ELEMENTS;
    if (currentStepKey === 'user-data') return !!(userData.name && userData.email && userData.phone && userData.storeKeyword && resolvedStoreName);
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const nameParts = userData.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '-';

      const getPrice = (priceStr: string) => parseInt(priceStr.replace(/\D/g, ''), 10);
      const totalAmount = allItems.reduce((sum, item) => {
        const product = PRODUCTS.find((p) => p.type === item.productType);
        return sum + (product ? getPrice(product.price) : 0);
      }, 0);

      const orderItems = buildOrderItems(allItems);

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: userData.email,
          phone: userData.phone,
          storeKeyword: userData.storeKeyword,
          orderItems,
          totalAmount,
        }),
      });

      if (!res.ok) throw new Error('Error en la respuesta del servidor');

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
    <div className="min-h-screen bg-[#D20A0A] flex items-start justify-center py-2 px-0 sm:py-8 sm:px-4">
      <div className="w-full h-full max-w-6xl bg-white shadow-xl overflow-hidden sm:rounded-2xl">

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

        <main className="px-3 py-5 sm:px-4 sm:py-6">
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
                onSelectSize={(s: CollarSize) => {
                  setDesign((prev) => ({
                    ...prev,
                    collarSize: s,
                    elements: s === '2' ? prev.elements.filter((e) => e.value !== 'pez') : prev.elements,
                  }));
                  if (productType === 'both') {
                    setLeashDesign((prev) => ({ ...prev, leashSize: s as LeashSize }));
                  }
                }}
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
                size={design.collarSize}
                title="Personaliza tu collar"
                selectedElementId={collarSelectedId}
                onSelectElement={setCollarSelectedId}
              />
              <div className="lg:sticky lg:top-28 lg:self-start">
                <CollarPreview
                  collarColor={design.collarColor}
                  elements={design.elements}
                  onChangeColor={changeCollarColor}
                  onReorder={reorderCollarElements}
                  onRemoveElement={removeCollarElement}
                  selectedElementId={collarSelectedId}
                  onSelectElement={setCollarSelectedId}
                />
              </div>
            </div>
          )}

          {currentStepKey === 'leash-color' && (
            <div className="space-y-8">
              <LeashColorStep
                selectedColor={leashDesign.leashColor}
                onSelectColor={(c) => setLeashDesign((prev) => ({ ...prev, leashColor: c }))}
                {...(productType === 'leash' ? {
                  selectedSize: leashDesign.leashSize,
                  onSelectSize: (s: LeashSize) => setLeashDesign((prev) => ({
                    ...prev,
                    leashSize: s,
                    elements: s === '2' ? prev.elements.filter((e) => e.value !== 'pez') : prev.elements,
                  })),
                } : {})}
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
                size={leashDesign.leashSize}
                title="Personaliza tu correa"
                subtitle={`Agrega emojis (${leashDesign.elements.length}/${MAX_LEASH_ELEMENTS}, mínimo ${MIN_LEASH_ELEMENTS})`}
                selectedElementId={leashSelectedId}
                onSelectElement={setLeashSelectedId}
              />
              <div className="lg:sticky lg:top-28 lg:self-start">
                <LeashPreview leashColor={leashDesign.leashColor} elements={leashDesign.elements} />
              </div>
            </div>
          )}

          {currentStepKey === 'cart' && (
            <CartStep
              items={allItems}
              onAddAnother={handleAddAnotherProduct}
            />
          )}

          {currentStepKey === 'user-data' && (
            <UserDataStep data={userData} onChange={setUserData} onStoreValidated={setResolvedStoreName} />
          )}

          {currentStepKey === 'final' && (
            <FinalStep
              items={allItems}
              userData={userData}
              storeName={resolvedStoreName}
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
                  {currentStepKey === 'cart' ? 'Continuar al pago' : 'Siguiente'}
                  <ArrowRight className="w-4 h-4 ml-2" />
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