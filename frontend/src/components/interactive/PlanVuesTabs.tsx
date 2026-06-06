import React, { useState, useCallback } from 'react';
import { InteractiveProject, Apartment, AptType, TYPE_COLORS } from '../../types/interactive';
import Building3DView, { Facing } from './Building3DView';
import FloorPlanView from './FloorPlanView';
import ApartmentCardView from './ApartmentCardView';
import PlanModalView from './PlanModalView';
import BalconyViewsSection from './BalconyViewsSection';

// ─── Types ────────────────────────────────────────────────────────────────────
type OuterTab = 'plan' | 'vues';
type PlanView = '3d' | 'plan';
type FilterVal = 'ALL' | AptType;

const FILTERS: { label: string; value: FilterVal; color: string }[] = [
  { label: 'ALL',    value: 'ALL', color: '#F7C66A' },
  { label: 'F2',     value: 'F2',  color: TYPE_COLORS.F2 },
  { label: 'F3/F3+', value: 'F3',  color: TYPE_COLORS.F3 },
  { label: 'F4',     value: 'F4',  color: TYPE_COLORS.F4 },
  { label: 'F5',     value: 'F5',  color: TYPE_COLORS.F5 },
  { label: 'PH',     value: 'PH',  color: TYPE_COLORS.PH },
];

const FACINGS: { label: string; value: Facing; short: string }[] = [
  { label: 'Nord',  value: 'N', short: 'N' },
  { label: 'Est',   value: 'E', short: 'E' },
  { label: 'Sud',   value: 'S', short: 'S' },
  { label: 'Ouest', value: 'O', short: 'O' },
];

// ─── Compass SVG (identique à carte_interactive) ──────────────────────────────
function Compass3D({ facing, onChange }: { facing: Facing; onChange: (f: Facing) => void }) {
  const dirs: { f: Facing; angle: number; label: string }[] = [
    { f: 'N', angle: 0,   label: 'N' },
    { f: 'E', angle: 90,  label: 'E' },
    { f: 'S', angle: 180, label: 'S' },
    { f: 'O', angle: 270, label: 'O' },
  ];
  const cx = 44, cy = 44, r = 32;
  return (
    <div style={{ background: 'rgba(3,27,23,0.8)', backdropFilter: 'blur(6px)', border: '1px solid #F7C66A33', borderRadius: '50%', padding: 4, boxShadow: '0 4px 20px rgba(0,0,0,.5)' }}>
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke="#F7C66A22" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={r - 2} fill="#031B17" stroke="#F7C66A11" strokeWidth="1" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
          const rad = a * Math.PI / 180;
          const x1 = cx + Math.sin(rad) * (r - 2);
          const y1 = cy - Math.cos(rad) * (r - 2);
          const x2 = cx + Math.sin(rad) * (r + 4);
          const y2 = cy - Math.cos(rad) * (r + 4);
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F7C66A33" strokeWidth="1" />;
        })}
        {dirs.map(({ f, angle, label }) => {
          const rad = angle * Math.PI / 180;
          const bx = cx + Math.sin(rad) * r;
          const by = cy - Math.cos(rad) * r;
          const isActive = facing === f;
          return (
            <g key={f} style={{ cursor: 'pointer' }} onClick={() => onChange(f)}>
              <circle cx={bx} cy={by} r="11"
                fill={isActive ? '#F7C66A' : '#052620'}
                stroke={isActive ? '#F7C66A' : '#F7C66A33'}
                strokeWidth="1.5" />
              <text x={bx} y={by + 4} textAnchor="middle"
                fill={isActive ? '#031B17' : '#F7C66A66'}
                fontSize="8" fontWeight="bold" fontFamily="sans-serif"
                style={{ userSelect: 'none', pointerEvents: 'none' }}>
                {label}
              </text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r="5" fill="#F7C66A" opacity="0.15" />
        <circle cx={cx} cy={cy} r="2.5" fill="#F7C66A" />
      </svg>
    </div>
  );
}

// ─── Fallback typologies (sans données interactives) ──────────────────────────
function TypologiesDisplay({ typologies }: { typologies: { type: string; area: string }[] }) {
  const sorted = [...typologies].sort((a, b) => {
    const n = (s: string) => { const m = s.match(/\d+/); return m ? parseInt(m[0]) : 0; };
    return n(a.area) - n(b.area);
  });
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-8">
      <p className="text-xs font-bold uppercase tracking-widest mb-8" style={{ color: '#F7C66A88' }}>
        Typologies disponibles
      </p>
      <div className="grid gap-4 w-full max-w-2xl" style={{
        gridTemplateColumns: sorted.length <= 2 ? '1fr' : sorted.length === 3 ? 'repeat(3,1fr)' : 'repeat(2,1fr)',
      }}>
        {sorted.map((t, i) => (
          <div key={i} className="rounded-2xl px-6 py-5 text-center border transition-all"
            style={{ borderColor: '#F7C66A44', background: '#031B17' }}>
            <span className="block text-3xl font-bold mb-2"
              style={{ fontFamily: 'Georgia,serif', color: '#F7C66A' }}>{t.type}</span>
            <span className="block text-sm" style={{ color: '#ffffff88' }}>
              {t.area && !String(t.area).toLowerCase().includes('consultable') ? t.area : 'Surface sur demande'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Plan interactif complet (3D → FloorPlan) ─────────────────────────────────
function InteractivePlanSection({ project }: { project: InteractiveProject }) {
  const [planView, setPlanView] = useState<PlanView>('3d');
  const [floor, setFloor]       = useState(project.totalFloors);
  const [filter, setFilter]     = useState<FilterVal>('ALL');
  const [selApt, setSelApt]     = useState<Apartment | null>(null);
  const [planApt, setPlanApt]   = useState<Apartment | null>(null);
  const [facing, setFacing]     = useState<Facing>('N');

  const availTotal = project.floors.reduce(
    (acc, f) => acc + f.apartments.filter(a => a.status === 'disponible').length, 0
  );

  const switchFloor = useCallback((n: number) => {
    setFloor(n);
    setSelApt(null);
    setPlanView('plan');
  }, []);

  const currentFloor = project.floors[floor - 1];
  const floorTypes = currentFloor
    ? [...new Set(currentFloor.apartments.map(a => a.type))].join(', ')
    : '';

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>

      {/* ── Toolbar (masqué en vue vues) ── */}
      <div className="flex-none flex items-center gap-2 px-4 py-2 border-b flex-wrap"
        style={{ background: '#052620', borderColor: '#F7C66A11' }}>

        {/* Filtres type */}
        <div className="flex gap-1.5">
          {FILTERS.map(({ label, value, color }) => {
            const isActive = filter === value;
            return (
              <button key={value} onClick={() => setFilter(value)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={isActive
                  ? { background: color, color: '#031B17', boxShadow: `0 0 8px ${color}66` }
                  : { background: '#031B17', color, border: `1px solid ${color}33` }
                }>
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* Orientation (3D seulement) */}
        {planView === '3d' && (
          <div className="flex items-center gap-1 rounded-lg overflow-hidden border"
            style={{ background: '#031B17', borderColor: '#F7C66A22' }}>
            {FACINGS.map(({ value, short }) => (
              <button key={value} onClick={() => setFacing(value)}
                className="px-2.5 py-1.5 text-xs font-bold transition-all"
                style={facing === value ? { background: '#F7C66A', color: '#031B17' } : { color: '#F7C66A55' }}>
                {short}
              </button>
            ))}
          </div>
        )}

        {/* Toggle 3D / Plan */}
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: '#F7C66A22' }}>
          {([['3d', '◈ 3D'], ['plan', '⊞ Plan']] as const).map(([v, label]) => (
            <button key={v} onClick={() => setPlanView(v)}
              className="px-3 py-1.5 text-xs font-medium transition-all"
              style={planView === v
                ? { background: '#F7C66A', color: '#031B17' }
                : { background: '#031B17', color: '#F7C66A55' }
              }>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar étages */}
        <div className="flex flex-col overflow-y-auto flex-shrink-0 border-r"
          style={{ width: 88, background: '#052620', borderColor: '#F7C66A11' }}>
          <button className="py-2 flex-shrink-0 text-sm transition-colors" style={{ color: '#F7C66A44' }}>▲</button>
          {Array.from({ length: project.totalFloors }, (_, i) => {
            const lvl = project.totalFloors - i;
            const isSel = lvl === floor;
            return (
              <button key={lvl} onClick={() => switchFloor(lvl)}
                className="flex items-center justify-center mx-1.5 my-0.5 px-2 py-2 rounded-xl flex-shrink-0 transition-all"
                style={isSel
                  ? { background: 'linear-gradient(135deg, #F7C66A, #E8BF7A)' }
                  : {}
                }>
                <span className="text-xs font-bold"
                  style={{ fontFamily: 'Georgia,serif', color: isSel ? '#031B17' : '#F7C66A55' }}>
                  Niv.{lvl}
                </span>
              </button>
            );
          })}
          <button className="py-2 flex-shrink-0 text-sm transition-colors" style={{ color: '#F7C66A44' }}>▼</button>
        </div>

        {/* Vue principale */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 relative overflow-hidden">

            {/* Label overlay */}
            <div className="absolute top-3 left-3 z-20 rounded-xl px-4 py-2 pointer-events-none"
              style={{ background: 'rgba(3,27,23,0.85)', backdropFilter: 'blur(8px)', border: '1px solid #F7C66A22' }}>
              {planView === '3d' ? (
                <>
                  <div className="font-bold" style={{ fontFamily: 'Georgia,serif', color: '#F7C66A', fontSize: 14 }}>
                    {project.name}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#ffffff55' }}>
                    {project.totalFloors} niveaux — {availTotal} appartements disponibles
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#ffffff44' }}>
                    Façade {FACINGS.find(f => f.value === facing)?.label}
                  </div>
                </>
              ) : (
                <>
                  <div className="font-bold" style={{ fontFamily: 'Georgia,serif', color: '#F7C66A', fontSize: 14 }}>
                    Étage {floor} / {project.totalFloors}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#ffffff55' }}>
                    Typologies : {floorTypes}
                  </div>
                </>
              )}
            </div>

            {/* Vue 3D avec boussole */}
            {planView === '3d' && (
              <>
                <Building3DView
                  project={project}
                  selectedFloor={floor}
                  activeFilter={filter}
                  onSelectFloor={switchFloor}
                  facing={facing}
                />
                <div className="absolute bottom-4 right-4 z-20">
                  <Compass3D facing={facing} onChange={setFacing} />
                </div>
              </>
            )}

            {/* Vue plan de niveau */}
            {planView === 'plan' && (
              <FloorPlanView
                project={project}
                floorIndex={floor}
                activeFilter={filter}
                selectedBlock={selApt?.block || null}
                onSelectApartment={(apt) => setSelApt(apt === selApt ? null : apt)}
              />
            )}

            {/* Popup appartement */}
            {planView === 'plan' && selApt && (
              <ApartmentCardView
                apartment={selApt}
                onClose={() => setSelApt(null)}
                onViewPlan={() => { setPlanApt(selApt); setSelApt(null); }}
              />
            )}
          </div>

          {/* Barre de miniatures */}
          <div className="flex-shrink-0 flex items-center justify-center gap-3 px-4 py-2.5 border-t"
            style={{ background: '#052620', borderColor: '#F7C66A11' }}>
            {[
              { label: 'Vue 3D',    icon: '🏢', active: planView === '3d',   onClick: () => setPlanView('3d') },
              { label: 'Plan masse', icon: '⊞', active: planView === 'plan', onClick: () => setPlanView('plan') },
            ].map(({ label, icon, active, onClick }) => (
              <button key={label} onClick={onClick} className="flex flex-col items-center gap-1 transition-all">
                <div className="w-12 h-9 rounded-lg flex items-center justify-center text-lg transition-all"
                  style={active
                    ? { background: '#031B17', border: '1.5px solid #F7C66A' }
                    : { background: '#031B17', border: '1px solid #F7C66A22' }
                  }>
                  {icon}
                </div>
                <span style={{ color: '#F7C66A55', fontSize: '8px' }}>{label}</span>
              </button>
            ))}
            <p className="italic ml-3 hidden md:block" style={{ color: '#ffffff22', fontSize: '9px' }}>
              Données à titre informatif, non contractuel
            </p>
          </div>
        </div>
      </div>

      {/* Modal plan appartement */}
      {planApt && <PlanModalView apartment={planApt} onClose={() => setPlanApt(null)} />}
    </div>
  );
}

// ─── Composant principal exporté ─────────────────────────────────────────────
interface Props {
  typologies: { type: string; area: string }[];
  galleryImages: string[];
  projectName: string;
  interactiveProject?: InteractiveProject;
}

export default function PlanVuesTabs({ typologies, projectName, interactiveProject }: Props) {
  const [tab, setTab] = useState<OuterTab>('plan');

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">

      {/* En-tête section */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#F7C66A' }}>
            Découvrir le projet
          </p>
          <h2 className="text-2xl font-bold uppercase tracking-wide text-white">
            Plan interactif & Vues
          </h2>
        </div>

        {/* Tabs extérieurs */}
        <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: '#F7C66A33', background: '#052620' }}>
          {([['plan', '⊞ Plan'], ['vues', '◈ Vues']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold transition-all"
              style={tab === id
                ? { background: '#F7C66A', color: '#031B17' }
                : { color: '#F7C66A77' }
              }>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Zone de contenu */}
      <div className="w-full rounded-3xl overflow-hidden border"
        style={{
          height: 580,
          background: '#052620',
          borderColor: '#F7C66A22',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        }}>

        {/* Tab Plan : 3D → FloorPlan */}
        {tab === 'plan' && (
          interactiveProject
            ? <InteractivePlanSection project={interactiveProject} />
            : <TypologiesDisplay typologies={typologies} />
        )}

        {/* Tab Vues : BalconyViews complet */}
        {tab === 'vues' && interactiveProject && (
          <BalconyViewsSection project={interactiveProject} />
        )}

        {tab === 'vues' && !interactiveProject && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm" style={{ color: '#ffffff33' }}>Vues disponibles prochainement</p>
          </div>
        )}
      </div>
    </section>
  );
}
