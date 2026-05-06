"use client";

import { useState, useRef } from 'react';
import { UserData } from '@/types/collar';
import { motion } from 'framer-motion';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

interface UserDataStepProps {
  data: UserData;
  onChange: (data: UserData) => void;
  onStoreValidated: (storeName: string | null) => void;
}

type ValidationState = 'idle' | 'loading' | 'valid' | 'invalid';

const UserDataStep = ({ data, onChange, onStoreValidated }: UserDataStepProps) => {
  const [validationState, setValidationState] = useState<ValidationState>('idle');
  const [resolvedStoreName, setResolvedStoreName] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleKeywordChange = (value: string) => {
    const normalized = value.toLowerCase().replace(/\s/g, '');
    onChange({ ...data, storeKeyword: normalized });

    // Reset validation when input changes
    setValidationState('idle');
    setResolvedStoreName(null);
    onStoreValidated(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!normalized) return;

    debounceRef.current = setTimeout(async () => {
      setValidationState('loading');
      try {
        const res = await fetch(`/api/stores/validate?keyword=${encodeURIComponent(normalized)}`);
        if (res.ok) {
          const store = await res.json();
          setValidationState('valid');
          setResolvedStoreName(store.name);
          onStoreValidated(store.name);
        } else {
          setValidationState('invalid');
          setResolvedStoreName(null);
          onStoreValidated(null);
        }
      } catch {
        setValidationState('invalid');
        setResolvedStoreName(null);
        onStoreValidated(null);
      }
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-md mx-auto"
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          Tus datos de contacto
        </h2>
        <p className="text-muted-foreground mt-1">
          Para enviarte la confirmación del diseño
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            placeholder="Tu nombre"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Ej: 11323456789"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="storeKeyword">Palabra clave de tu tienda</Label>
          <div className="relative">
            <Input
              id="storeKeyword"
              placeholder="Ej: centro2024"
              value={data.storeKeyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              className={
                validationState === 'valid'
                  ? 'border-green-500 pr-9'
                  : validationState === 'invalid'
                  ? 'border-red-500 pr-9'
                  : 'pr-9'
              }
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              {validationState === 'loading' && <Loader className="w-4 h-4 animate-spin" />}
              {validationState === 'valid' && <CheckCircle className="w-4 h-4 text-green-500" />}
              {validationState === 'invalid' && <XCircle className="w-4 h-4 text-red-500" />}
            </div>
          </div>
          {validationState === 'invalid' && (
            <p className="text-xs text-red-500">La palabra clave es incorrecta.</p>
          )}
          {validationState === 'valid' && resolvedStoreName && (
            <p className="text-xs text-green-600">Tienda: <span className="font-semibold">{resolvedStoreName}</span></p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserDataStep;
