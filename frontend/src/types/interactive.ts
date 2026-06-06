export type AptType = 'F2' | 'F3' | 'F3+' | 'F4' | 'F5' | 'PH' | 'Commerce';
export type AptStatus = 'disponible' | 'vendu' | 'reserve';

export interface Apartment {
  id: string;
  number: string;
  block: 'A' | 'B' | 'C' | 'D';
  floor: number;
  type: AptType;
  surface: number;
  terrace: number;
  total: number;
  status: AptStatus;
  price: string;
  rooms: number[];
  features: string[];
}

export interface Floor {
  level: number;
  apartments: Apartment[];
}

export interface InteractiveProject {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  location: string;
  city: string;
  status: 'en_cours' | 'livre' | 'a_venir';
  totalFloors: number;
  totalApartments: number;
  availableCount: number;
  deliveryDate: string;
  description: string;
  highlights: string[];
  floors: Floor[];
  lat?: number;
  lng?: number;
}

export const TYPE_COLORS: Record<AptType, string> = {
  F2: '#2980b9', F3: '#27ae60', 'F3+': '#1e8449',
  F4: '#e67e22', F5: '#e74c3c', PH: '#8e44ad', Commerce: '#7f8c8d',
};

export const STATUS_COLORS: Record<AptStatus, string> = {
  disponible: '#2ecc71', vendu: '#e74c3c', reserve: '#f39c12',
};

export const STATUS_LABELS: Record<AptStatus, string> = {
  disponible: 'Disponible', vendu: 'Vendu', reserve: 'Réservé',
};

export const TYPE_PRICES: Record<AptType, string> = {
  F2: '28 500 000 DA', F3: '36 000 000 DA', 'F3+': '42 000 000 DA',
  F4: '52 000 000 DA', F5: '66 000 000 DA', PH: 'Sur demande', Commerce: 'Sur demande',
};

export const ROOM_TABLES: Record<AptType, { label: string; value: string }[]> = {
  Commerce: [{ label: 'Local commercial', value: 'Surface variable' }],
  F2: [
    { label: 'Séjour / Cuisine', value: '28.50 m²' }, { label: 'Chambre', value: '14.20 m²' },
    { label: 'SDB', value: '4.80 m²' }, { label: 'WC', value: '2.10 m²' },
    { label: 'Couloir', value: '8.40 m²' }, { label: 'Dégagement', value: '3.00 m²' },
  ],
  F3: [
    { label: 'Salon', value: '26.00 m²' }, { label: 'Cuisine', value: '12.50 m²' },
    { label: 'Chambre 1', value: '14.50 m²' }, { label: 'Chambre 2', value: '13.20 m²' },
    { label: 'SDB', value: '5.20 m²' }, { label: 'WC', value: '2.00 m²' }, { label: 'Couloir', value: '7.60 m²' },
  ],
  'F3+': [
    { label: 'Grand Salon', value: '28.00 m²' }, { label: 'Cuisine', value: '14.00 m²' },
    { label: 'Ch. Parentale', value: '16.00 m²' }, { label: 'SDB C.P.', value: '4.50 m²' },
    { label: 'Chambre', value: '13.50 m²' }, { label: 'SDB 2', value: '4.20 m²' },
    { label: 'WC', value: '2.00 m²' }, { label: 'Couloir', value: '9.80 m²' },
  ],
  F4: [
    { label: 'Salon / Séjour', value: '28.00 m²' }, { label: 'Cuisine', value: '14.00 m²' },
    { label: 'Ch. Parentale', value: '17.00 m²' }, { label: 'SDB C.P.', value: '4.50 m²' },
    { label: 'Dressing C.P.', value: '6.00 m²' }, { label: 'Chambre 1', value: '14.00 m²' },
    { label: 'Chambre 2', value: '13.00 m²' }, { label: 'SDB + Buanderie', value: '5.50 m²' },
    { label: 'WC', value: '2.00 m²' }, { label: 'Couloir / Circ.', value: '9.00 m²' },
  ],
  F5: [
    { label: 'Salon / Séjour', value: '32.00 m²' }, { label: 'Cuisine', value: '16.00 m²' },
    { label: 'Ch. Parentale', value: '18.00 m²' }, { label: 'SDB C.P.', value: '5.00 m²' },
    { label: 'Dressing', value: '7.00 m²' }, { label: 'Chambre 1', value: '15.00 m²' },
    { label: 'Chambre 2', value: '14.50 m²' }, { label: 'Chambre 3', value: '13.00 m²' },
    { label: 'SDB + Bund.', value: '5.50 m²' }, { label: 'WC', value: '2.00 m²' },
    { label: 'Couloir / Circ.', value: '12.00 m²' },
  ],
  PH: [
    { label: 'Grand Salon', value: '45.00 m²' }, { label: 'Cuisine ouverte', value: '22.00 m²' },
    { label: 'Bureau', value: '18.00 m²' }, { label: 'Suite Parentale', value: '28.00 m²' },
    { label: 'SDB Suite', value: '8.00 m²' }, { label: 'Dressing', value: '12.00 m²' },
    { label: 'Suite 2', value: '22.00 m²' }, { label: 'SDB 2', value: '6.00 m²' },
    { label: 'Couloir', value: '18.00 m²' },
  ],
};
