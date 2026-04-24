export type CollarSize = '1' | '2';

export const COLLAR_SIZES: { label: string; value: CollarSize; description: string; details: string }[] = [
  { label: 'Talla 1', value: '1', description: 'XS | 1,5 cm de ancho | 25 cm - 40 cm de largo', details: 'Apta para Shih Tzu, Chihuahua, Yorkshire Terrier, Pomerania, Caniche Toy, cachorros y gatitos.' },
  { label: 'Talla 2', value: '2', description: 'M | 3 cm de ancho | 55 cm - 70 cm de largo', details: 'Apta para Pit Bull, American Bully, Golden Retriever, Cocker Spaniel.' },
];

export interface CollarElement {
  id: string;
  type: 'letter' | 'emoji';
  value: string;
  color: string;
}

export interface LeashDesign {
  leashColor: string;
  elements: CollarElement[];
}

export interface CollarDesign {
  collarColor: string;
  collarSize: CollarSize;
  elements: CollarElement[];
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  storeName: string;
}

export type ProductType = 'collar' | 'leash' | 'both';

export const PRODUCTS: { type: ProductType; label: string; price: string; description: string }[] = [
  { type: 'collar', label: 'Collar', price: '$20.000 ARS', description: 'Incluye collar y 6 piezas en total.' },
  { type: 'leash', label: 'Correa', price: '$20.000 ARS', description: 'Incluye correa y 10 piezas en total.' },
  { type: 'both', label: 'Combo', price: '$37.000 ARS', description: 'Incluye correa y collar. 16 piezas en total.' },
];

export const COLLAR_COLORS = [
  { name: 'Rojo', value: '#C70F11' },
  { name: 'Celeste', value: '#2590B4' },
  { name: 'Verde manzana', value: '#84A308' },
  { name: 'Naranja', value: '#D93C1B' },
  { name: 'Negro', value: '#111111' },
  { name: 'Rosado', value: '#C7295C' },
  { name: 'Violeta', value: '#4B2A61' },
  { name: 'Azul', value: '#1C5394' },
  { name: 'Verde oscuro', value: '#2A6A5C' },
] as const;

export const CUSTOM_EMOJIS = [
  { key: 'patitas', label: 'Patitas' },
  { key: 'corazon', label: 'Corazón' },
  { key: 'estrella', label: 'Estrella' },
  { key: 'calavera', label: 'Calavera' },
  { key: 'energia', label: 'Energía' },
  { key: 'flor', label: 'Flor' },
  { key: 'luna', label: 'Luna' },
  { key: 'pez', label: 'Pez' },
] as const;

export type EmojiKey = typeof CUSTOM_EMOJIS[number]['key'];

export const ELEMENT_COLORS = [
  '#FAFAFA', '#1B1B1B', '#FAC2DD', '#FEF31B',
  '#F6732D', '#93CDF5', '#8CE186', '#E0374E',
  '#0041B9', '#E1CBF1'
] as const;

export const MAX_COLLAR_ELEMENTS = 6;
export const MIN_COLLAR_ELEMENTS = 3;
export const MAX_LEASH_ELEMENTS = 10;
export const MIN_LEASH_ELEMENTS = 3;
