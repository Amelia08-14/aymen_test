import React, { useState, useCallback } from 'react';
import { InteractiveProject } from '../../types/interactive';

type Dir = 'Nord' | 'Est' | 'Sud' | 'Ouest';
const DIRS: Dir[] = ['Nord', 'Est', 'Sud', 'Ouest'];

interface ViewLevel {
  floor: number;
  label: string;
  altitude: string;
  photos: Record<Dir, string>;
  caption: Record<Dir, string>;
}

// Picsum seeds garantissent la même image à chaque rechargement (seed = identifiant stable)
const p = (seed: string) => `https://picsum.photos/seed/${seed}/1400/800`;

const LEVELS: ViewLevel[] = [
  {
    floor: 12, label: 'Penthouse', altitude: '~38 m',
    photos: {
      Nord:  p('algiers-ph-n'),
      Est:   p('algiers-ph-e'),
      Sud:   p('algiers-ph-s'),
      Ouest: p('algiers-ph-o'),
    },
    caption: {
      Nord:  'Terrasse panoramique — horizon Méditerranée à perte de vue',
      Est:   "Terrasse est — vue sur les hauteurs et collines d'Alger",
      Sud:   'Terrasse sud — baie d\'Alger et port en contrebas',
      Ouest: 'Terrasse ouest — coucher de soleil sur la mer',
    },
  },
  {
    floor: 9, label: 'Niv. 9', altitude: '~29 m',
    photos: {
      Nord:  p('algiers-9-n'),
      Est:   p('algiers-9-e'),
      Sud:   p('algiers-9-s'),
      Ouest: p('algiers-9-o'),
    },
    caption: {
      Nord:  "Vue mer nord — panorama sur la baie d'Alger",
      Est:   'Vue est — toits de la ville et mer en arrière-plan',
      Sud:   "Vue sud — horizon dégagé, port d'Alger",
      Ouest: "Vue ouest — collines verdoyantes d'Alger",
    },
  },
  {
    floor: 7, label: 'Niv. 7', altitude: '~23 m',
    photos: {
      Nord:  p('algiers-7-n'),
      Est:   p('algiers-7-e'),
      Sud:   p('algiers-7-s'),
      Ouest: p('algiers-7-o'),
    },
    caption: {
      Nord:  'Vue nord — quartier résidentiel et architecture algéroise',
      Est:   'Vue est — toits et vue dégagée sur la mer',
      Sud:   'Vue sud — avenue principale et palmiers',
      Ouest: 'Vue ouest — architecture traditionnelle et verdure',
    },
  },
  {
    floor: 5, label: 'Niv. 5', altitude: '~16 m',
    photos: {
      Nord:  p('algiers-5-n'),
      Est:   p('algiers-5-e'),
      Sud:   p('algiers-5-s'),
      Ouest: p('algiers-5-o'),
    },
    caption: {
      Nord:  'Vue nord — toits et mer en arrière-plan',
      Est:   "Vue est — bâtiments et ciel d'Alger",
      Sud:   'Vue sud — quartier résidentiel verdoyant',
      Ouest: 'Vue ouest — perspective sur le boulevard',
    },
  },
  {
    floor: 3, label: 'Niv. 3', altitude: '~9 m',
    photos: {
      Nord:  p('algiers-3-n'),
      Est:   p('algiers-3-e'),
      Sud:   p('algiers-3-s'),
      Ouest: p('algiers-3-o'),
    },
    caption: {
      Nord:  "Vue sur l'avenue principale — palmiers et ambiance algéroise",
      Est:   'Vue est — rue latérale du projet',
      Sud:   'Vue sud — façade du projet et environnement immédiat',
      Ouest: "Vue ouest — accès principal de la résidence",
    },
  },
];

// ─── Building elevation SVG ───────────────────────────────────────────────────
function BuildingElevation({
  projectFloors,
  levels,
  selectedIdx,
  onSelect,
}: {
  projectFloors: number;
  levels: ViewLevel[];
  selectedIdx: number;
  onSelect: (i: number) => void;
}) {
  const W = 260, H = 520;
  const BX = 55, BW = 150;
  const BY = 30, BH = 420;

  const floorY = (fl: number) => BY + BH - (fl / projectFloors) * BH;
  const circles = levels.map((l, i) => ({ i, floor: l.floor, y: floorY(l.floor), label: l.label }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 280, height: 'auto' }}>
      <rect x="0" y="0" width={W} height={H} fill="#031B17" />
      <rect x="0" y={BY + BH} width={W} height={H - BY - BH} fill="#052620" />
      <rect x="0" y={BY + BH} width={W} height="3" fill="#0A3328" />
      <rect x={BX + 6} y={BY + 8} width={BW} height={BH} fill="#00000033" />
      <rect x={BX} y={BY} width={BW} height={BH} fill="#0A2A24" />

      {/* Floor bands */}
      {Array.from({ length: projectFloors + 1 }, (_, i) => {
        const y = BY + BH - (i / projectFloors) * BH;
        const isMain = i % 3 === 0;
        return (
          <line key={i} x1={BX} y1={y} x2={BX + BW} y2={y}
            stroke={isMain ? '#F7C66A44' : '#F7C66A11'} strokeWidth={isMain ? 0.8 : 0.4} />
        );
      })}

      {/* Window columns */}
      {[0.22, 0.5, 0.78].map((xr, ci) =>
        Array.from({ length: projectFloors }, (_, fi) => {
          const wy = BY + BH - ((fi + 0.5) / projectFloors) * BH - 6;
          const isPH = fi >= projectFloors - 2;
          return (
            <rect key={`${ci}-${fi}`}
              x={BX + xr * BW - 8} y={wy}
              width={16} height={10} rx={1}
              fill={isPH ? '#F7C66A' : '#F7C66A66'} opacity={0.55} />
          );
        })
      )}

      {/* Balcony slabs */}
      {Array.from({ length: projectFloors }, (_, fi) => {
        const y = BY + BH - ((fi + 1) / projectFloors) * BH;
        return <rect key={fi} x={BX - 4} y={y - 2} width={BW + 8} height={3} fill="#F7C66A" opacity={0.15} />;
      })}

      {/* PH roof */}
      <rect x={BX + 10} y={BY - 22} width={BW - 20} height={22} fill="#0D3328" />
      <rect x={BX + 10} y={BY - 22} width={BW - 20} height={3} fill="#F7C66A" opacity={0.4} />

      {/* Level circles — left side */}
      {circles.map(({ i, y, label }) => {
        const isActive = i === selectedIdx;
        return (
          <g key={i} onClick={() => onSelect(i)} style={{ cursor: 'pointer' }}>
            <line x1={BX - 2} y1={y} x2={BX - 22} y2={y}
              stroke={isActive ? '#F7C66A' : '#F7C66A44'} strokeWidth={isActive ? 1.5 : 0.8}
              strokeDasharray={isActive ? undefined : '3,2'} />
            <circle cx={BX - 32} cy={y} r={14}
              fill={isActive ? '#F7C66A' : '#052620'}
              stroke={isActive ? '#F7C66A' : '#F7C66A44'}
              strokeWidth={1.5} />
            <text x={BX - 32} y={y + 4} textAnchor="middle"
              fill={isActive ? '#031B17' : '#F7C66A88'} fontSize={9} fontWeight={isActive ? '700' : '500'}>
              {label === 'Penthouse' ? 'PH' : `${circles[i].floor}`}
            </text>
          </g>
        );
      })}

      {/* Level circles — right side */}
      {circles.map(({ i, y, label }) => {
        const isActive = i === selectedIdx;
        return (
          <g key={`r${i}`} onClick={() => onSelect(i)} style={{ cursor: 'pointer' }}>
            <line x1={BX + BW + 2} y1={y} x2={BX + BW + 22} y2={y}
              stroke={isActive ? '#F7C66A' : '#F7C66A44'} strokeWidth={isActive ? 1.5 : 0.8}
              strokeDasharray={isActive ? undefined : '3,2'} />
            <circle cx={BX + BW + 32} cy={y} r={14}
              fill={isActive ? '#F7C66A' : '#052620'}
              stroke={isActive ? '#F7C66A' : '#F7C66A44'}
              strokeWidth={1.5} />
            <text x={BX + BW + 32} y={y + 4} textAnchor="middle"
              fill={isActive ? '#031B17' : '#F7C66A88'} fontSize={9} fontWeight={isActive ? '700' : '500'}>
              {label === 'Penthouse' ? 'PH' : `${circles[i].floor}`}
            </text>
          </g>
        );
      })}

      {/* Selected floor highlight */}
      {(() => {
        const sel = circles[selectedIdx];
        if (!sel) return null;
        const bh = BH / projectFloors;
        return (
          <rect x={BX} y={sel.y - bh * 0.5} width={BW} height={bh}
            fill="#F7C66A" opacity={0.08} />
        );
      })()}

      <text x={W / 2} y={BY + BH + 18} textAnchor="middle" fill="#F7C66A44" fontSize={8} fontStyle="italic">
        Rez-de-chaussée
      </text>
    </svg>
  );
}

// ─── Main BalconyViews component ──────────────────────────────────────────────
export default function BalconyViewsSection({ project }: { project: InteractiveProject }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [dir, setDir] = useState<Dir>('Nord');
  const [fading, setFading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const switchLevel = useCallback((idx: number) => {
    if (idx === levelIdx) return;
    setFading(true);
    setTimeout(() => { setLevelIdx(idx); setFading(false); }, 240);
  }, [levelIdx]);

  const switchDir = useCallback((d: Dir) => {
    if (d === dir) return;
    setFading(true);
    setTimeout(() => { setDir(d); setFading(false); }, 240);
  }, [dir]);

  const level = LEVELS[levelIdx];
  const src = level.photos[dir];
  const caption = level.caption[dir];

  return (
    <div style={{ display: 'flex', height: '100%', background: '#031B17', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>

      {/* ── LEFT: Building elevation + controls ───────────────────────── */}
      <div style={{
        width: 320, flexShrink: 0,
        background: '#052620',
        borderRight: '1px solid #F7C66A22',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '18px 20px 12px', borderBottom: '1px solid #F7C66A11' }}>
          <p style={{ margin: 0, fontSize: 10, color: '#F7C66A88', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Vues depuis les balcons
          </p>
          <p style={{ margin: '3px 0 0', fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'Georgia, serif' }}>
            {project.name}
          </p>
        </div>

        {/* Direction tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #F7C66A22' }}>
          {DIRS.map(d => (
            <button key={d} onClick={() => switchDir(d)} style={{
              flex: 1, padding: '10px 4px', border: 'none',
              background: dir === d ? '#031B17' : '#052620',
              borderBottom: `2px solid ${dir === d ? '#F7C66A' : 'transparent'}`,
              color: dir === d ? '#F7C66A' : '#F7C66A55',
              fontSize: 10, fontWeight: dir === d ? 700 : 500,
              letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}>
              {d}
            </button>
          ))}
        </div>

        {/* Building elevation */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px 16px', overflowY: 'auto',
        }}>
          <BuildingElevation
            projectFloors={project.totalFloors}
            levels={LEVELS}
            selectedIdx={levelIdx}
            onSelect={switchLevel}
          />
        </div>

        {/* Level info */}
        <div style={{ padding: '12px 20px 16px', borderTop: '1px solid #F7C66A11', background: '#031B17' }}>
          <div style={{ fontSize: 10, color: '#F7C66A88', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Niveau sélectionné
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: 'Georgia, serif' }}>
            {level.label} · Vue {dir}
          </div>
          <div style={{ fontSize: 12, color: '#F7C66A88', marginTop: 2 }}>
            Altitude {level.altitude}
          </div>
          {/* Level dots */}
          <div style={{ display: 'flex', gap: 5, marginTop: 10 }}>
            {LEVELS.map((_, i) => (
              <button key={i} onClick={() => switchLevel(i)} style={{
                width: i === levelIdx ? 20 : 7, height: 7, borderRadius: 4,
                background: i === levelIdx ? '#F7C66A' : '#F7C66A33',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.2s ease',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Photo display ──────────────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#031B17' }}>

        {/* Photo */}
        <div style={{ position: 'absolute', inset: 0, opacity: fading ? 0 : 1, transition: 'opacity 0.24s ease' }}>
          <img
            src={src}
            alt={caption}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, transparent 45%, rgba(3,27,23,0.92) 100%)' }} />

        {/* Top controls */}
        <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8, zIndex: 10 }}>
          <button onClick={() => switchLevel((levelIdx - 1 + LEVELS.length) % LEVELS.length)}
            style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(3,27,23,0.7)', backdropFilter: 'blur(8px)', border: '1px solid #F7C66A44', color: '#F7C66A', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ‹
          </button>
          <button onClick={() => switchLevel((levelIdx + 1) % LEVELS.length)}
            style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(3,27,23,0.7)', backdropFilter: 'blur(8px)', border: '1px solid #F7C66A44', color: '#F7C66A', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ›
          </button>
          <button onClick={() => setFullscreen(true)}
            style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(3,27,23,0.7)', backdropFilter: 'blur(8px)', border: '1px solid #F7C66A44', color: '#F7C66A', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M21 16v3a2 2 0 01-2 2h-3M3 16v3a2 2 0 002 2h3"/>
            </svg>
          </button>
        </div>

        {/* Label top-left */}
        <div style={{ position: 'absolute', top: 18, left: 20, zIndex: 10 }}>
          <div style={{ background: 'rgba(3,27,23,0.65)', backdropFilter: 'blur(8px)', border: '1px solid #F7C66A33', borderRadius: 6, padding: '4px 12px', fontSize: 11, color: '#F7C66ABB', letterSpacing: '0.05em' }}>
            Vista {dir} · {level.label}
          </div>
        </div>

        {/* Bottom info */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, padding: '0 32px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: 0, color: '#F7C66A', fontFamily: 'Georgia,serif', fontSize: 28, fontWeight: 700, letterSpacing: '0.01em', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
                {level.label} — Vue {dir}
              </h2>
              <h3 style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.6)', fontFamily: 'Georgia,serif', fontSize: 15, fontWeight: 400 }}>
                Altitude {level.altitude} · {project.city}
              </h3>
              <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: 13, maxWidth: 480 }}>
                {caption}
              </p>
            </div>
            {/* Thumbnail strip */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end' }}>
              {LEVELS.map((l, i) => (
                <button key={i} onClick={() => switchLevel(i)} style={{
                  position: 'relative', width: 72, height: 46, borderRadius: 6, overflow: 'hidden',
                  border: `2px solid ${i === levelIdx ? '#F7C66A' : 'rgba(247,198,106,0.2)'}`,
                  cursor: 'pointer', padding: 0,
                  opacity: i === levelIdx ? 1 : 0.55,
                  transition: 'all 0.18s ease', flexShrink: 0,
                  background: '#031B17',
                }}>
                  <img src={l.photos[dir]} alt={l.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.75))', padding: '2px 4px 3px', fontSize: 8, color: '#F7C66A', fontWeight: 600, textAlign: 'center' }}>
                    {l.label === 'Penthouse' ? 'PH' : l.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Fullscreen ────────────────────────────────────────────────── */}
      {fullscreen && (
        <div onClick={() => setFullscreen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={src} alt={caption} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
          {(['‹', '›'] as const).map((icon, idx) => {
            const fn = idx === 0
              ? () => switchLevel((levelIdx - 1 + LEVELS.length) % LEVELS.length)
              : () => switchLevel((levelIdx + 1) % LEVELS.length);
            const pos = idx === 0 ? { left: 20 } : { right: 20 };
            return (
              <button key={icon} onClick={e => { e.stopPropagation(); fn(); }}
                style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', ...pos, width: 50, height: 50, borderRadius: '50%', background: 'rgba(247,198,106,0.15)', border: '1px solid #F7C66A44', color: '#F7C66A', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
              </button>
            );
          })}
          <button onClick={() => setFullscreen(false)}
            style={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: '50%', background: 'rgba(247,198,106,0.15)', border: '1px solid #F7C66A44', color: '#F7C66A', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
