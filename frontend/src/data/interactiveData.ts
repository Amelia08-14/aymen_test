import { InteractiveProject, Apartment, AptStatus } from '../types/interactive';

const cycle: AptStatus[] = ['disponible', 'disponible', 'reserve', 'vendu', 'disponible', 'disponible', 'vendu', 'disponible'];
const st = (i: number): AptStatus => cycle[i % 8];

type B = 'A' | 'B' | 'C' | 'D';
type Def = { t: string; s: number; tr: number; rooms: number };

function buildFloors(total: number, plan: (n: number) => Record<B, Def>): InteractiveProject['floors'] {
  return Array.from({ length: total }, (_, i) => {
    const n = i + 1;
    const def = plan(n);
    return {
      level: n,
      apartments: (['D', 'C', 'B', 'A'] as B[]).map((block, bi) => {
        const d = def[block];
        return {
          id: `apt-${n}-${block}`,
          number: `${String(n).padStart(2, '0')}${block}`,
          block,
          floor: n,
          type: d.t as any,
          surface: d.s,
          terrace: d.tr,
          total: d.s + d.tr,
          status: st(n + bi),
          price: ({
            F2: '28 500 000 DA', F3: '36 000 000 DA', 'F3+': '42 000 000 DA',
            F4: '52 000 000 DA', F5: '66 000 000 DA', PH: 'Sur demande', Commerce: 'Sur demande',
          } as any)[d.t],
          rooms: Array(d.rooms).fill(0),
          features:
            d.t === 'PH'  ? ['Terrasse panoramique', 'Vue mer', 'Double hauteur', 'Domotique'] :
            d.t === 'F5'  ? ['Grande terrasse', '5 pièces', 'Double façade'] :
            d.tr > 0      ? ['Terrasse privative', 'Vue dégagée'] :
                            ['Séjour lumineux', 'Finitions premium'],
        } as unknown as Apartment;
      }),
    };
  });
}

// ─── Résidence Azurite — Kouba ────────────────────────────────────────────────
export const AZURITE_INTERACTIVE: InteractiveProject = {
  id: 'azurite',
  slug: 'azurite',
  name: 'Résidence Azurite',
  subtitle: 'Prestige au cœur de Kouba',
  location: 'Kouba, Alger',
  city: 'Kouba, Alger',
  status: 'en_cours',
  totalFloors: 12,
  totalApartments: 48,
  availableCount: 28,
  deliveryDate: '2026',
  description: "La résidence Azurite, située dans le quartier mythique de Kouba, offre un cadre de vie privilégié.",
  highlights: ['Vue panoramique', 'Kouba', 'Finitions haut standing', 'Parking souterrain'],
  lat: 36.726, lng: 3.087,
  floors: buildFloors(12, n => {
    if (n === 1)  return { D:{t:'Commerce',s:180,tr:0,rooms:0}, C:{t:'Commerce',s:155,tr:0,rooms:0}, B:{t:'Commerce',s:200,tr:0,rooms:0}, A:{t:'Commerce',s:140,tr:0,rooms:0} };
    if (n <= 3)   return { D:{t:'F4',s:122,tr:35,rooms:4}, C:{t:'F3',s:88,tr:0,rooms:3}, B:{t:'F5',s:148,tr:25,rooms:5}, A:{t:'F2',s:65,tr:0,rooms:2} };
    if (n <= 6)   return { D:{t:'F4',s:122,tr:0,rooms:4}, C:{t:'F3+',s:96,tr:0,rooms:3}, B:{t:'F5',s:148,tr:0,rooms:5}, A:{t:'F3',s:82,tr:0,rooms:3} };
    if (n <= 9)   return { D:{t:'F4',s:125,tr:0,rooms:4}, C:{t:'F4',s:110,tr:0,rooms:4}, B:{t:'F5',s:150,tr:18,rooms:5}, A:{t:'F3',s:88,tr:0,rooms:3} };
    if (n <= 11)  return { D:{t:'F5',s:138,tr:0,rooms:5}, C:{t:'F4',s:115,tr:0,rooms:4}, B:{t:'F5',s:152,tr:22,rooms:5}, A:{t:'F4',s:115,tr:0,rooms:4} };
    return               { D:{t:'PH', s:185,tr:60,rooms:6}, C:{t:'PH', s:210,tr:80,rooms:6}, B:{t:'PH', s:240,tr:95,rooms:6}, A:{t:'PH', s:170,tr:50,rooms:5} };
  }),
};

// ─── Résidence Cornaline — Hydra ──────────────────────────────────────────────
export const CORNALINE_INTERACTIVE: InteractiveProject = {
  id: 'cornaline',
  slug: 'cornaline',
  name: 'Résidence Cornaline',
  subtitle: "L'excellence à Hydra",
  location: 'Hydra, Alger',
  city: 'Hydra, Alger',
  status: 'livre',
  totalFloors: 10,
  totalApartments: 40,
  availableCount: 3,
  deliveryDate: '2025',
  description: "Résidence one building d'exception au cœur de la prestigieuse commune d'Hydra.",
  highlights: ['Hydra', 'One building', 'Vue dégagée'],
  lat: 36.743, lng: 3.036,
  floors: buildFloors(10, n => {
    if (n === 1)  return { D:{t:'Commerce',s:120,tr:0,rooms:0}, C:{t:'Commerce',s:140,tr:0,rooms:0}, B:{t:'F2',s:67,tr:0,rooms:2}, A:{t:'F2',s:71,tr:0,rooms:2} };
    if (n <= 3)   return { D:{t:'F3',s:82,tr:0,rooms:3}, C:{t:'F3',s:95,tr:0,rooms:3}, B:{t:'F4',s:154,tr:20,rooms:4}, A:{t:'F4',s:160,tr:0,rooms:4} };
    if (n <= 6)   return { D:{t:'F3',s:90,tr:0,rooms:3}, C:{t:'F4',s:100,tr:0,rooms:4}, B:{t:'F5',s:202,tr:30,rooms:5}, A:{t:'F4',s:164,tr:0,rooms:4} };
    if (n <= 8)   return { D:{t:'F4',s:95,tr:0,rooms:4}, C:{t:'F4',s:110,tr:0,rooms:4}, B:{t:'F5',s:210,tr:35,rooms:5}, A:{t:'F4',s:170,tr:0,rooms:4} };
    return               { D:{t:'PH',s:323,tr:80,rooms:6}, C:{t:'PH',s:386,tr:100,rooms:6}, B:{t:'PH',s:323,tr:90,rooms:6}, A:{t:'PH',s:386,tr:110,rooms:6} };
  }),
};

// ─── Résidence Agate — El Achour ─────────────────────────────────────────────
export const AGATE_INTERACTIVE: InteractiveProject = {
  id: 'agate',
  slug: 'agate',
  name: 'Résidence Agate',
  subtitle: 'Sérénité à El Achour',
  location: 'El Achour, Alger',
  city: 'El Achour, Alger',
  status: 'en_cours',
  totalFloors: 10,
  totalApartments: 67,
  availableCount: 15,
  deliveryDate: '2025',
  description: "Résidence contemporaine dans un quartier calme et verdoyant.",
  highlights: ['El Achour', '2 blocs', 'Finitions haut standing'],
  lat: 36.735, lng: 3.004,
  floors: buildFloors(10, n => {
    if (n === 1)  return { D:{t:'Commerce',s:90,tr:0,rooms:0}, C:{t:'F2',s:55,tr:0,rooms:2}, B:{t:'F2',s:62,tr:0,rooms:2}, A:{t:'Commerce',s:85,tr:0,rooms:0} };
    if (n <= 4)   return { D:{t:'F3',s:72,tr:0,rooms:3}, C:{t:'F3',s:85,tr:0,rooms:3}, B:{t:'F4',s:109,tr:15,rooms:4}, A:{t:'F4',s:125,tr:0,rooms:4} };
    if (n <= 7)   return { D:{t:'F4',s:110,tr:0,rooms:4}, C:{t:'F3',s:102,tr:0,rooms:3}, B:{t:'F4',s:115,tr:0,rooms:4}, A:{t:'F5',s:168,tr:20,rooms:5} };
    if (n <= 9)   return { D:{t:'F4',s:115,tr:0,rooms:4}, C:{t:'F4',s:110,tr:0,rooms:4}, B:{t:'F5',s:180,tr:25,rooms:5}, A:{t:'F5',s:213,tr:30,rooms:5} };
    return               { D:{t:'PH',s:185,tr:60,rooms:6}, C:{t:'PH',s:200,tr:70,rooms:6}, B:{t:'PH',s:215,tr:80,rooms:6}, A:{t:'PH',s:230,tr:85,rooms:6} };
  }),
};

// ─── Map: project slug → interactive data ────────────────────────────────────
export const INTERACTIVE_DATA: Record<string, InteractiveProject> = {
  'azurite':   AZURITE_INTERACTIVE,
  'cornaline': CORNALINE_INTERACTIVE,
  'agate':     AGATE_INTERACTIVE,
};
