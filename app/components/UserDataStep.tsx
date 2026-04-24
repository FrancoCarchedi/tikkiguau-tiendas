"use client";

import { UserData } from '@/types/collar';
import { motion } from 'framer-motion';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface UserDataStepProps {
  data: UserData;
  onChange: (data: UserData) => void;
}

const UserDataStep = ({ data, onChange }: UserDataStepProps) => {
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
            placeholder="+34 600 000 000"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="storeName">Nombre de tienda</Label>
          <Input
            id="storeName"
            placeholder="Nombre de tu tienda"
            value={data.storeName}
            onChange={(e) => onChange({ ...data, storeName: e.target.value })}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default UserDataStep;
