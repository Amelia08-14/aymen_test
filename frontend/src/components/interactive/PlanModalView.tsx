import React from 'react';
import { Apartment, TYPE_COLORS, ROOM_TABLES, AptType } from '../../types/interactive';

interface Props {
  apartment: Apartment;
  onClose: () => void;
}

export default function PlanModalView({ apartment: apt, onClose }: Props) {
  const col = TYPE_COLORS[apt.type as AptType] || '#888';
  const rows = ROOM_TABLES[apt.type as AptType] || ROOM_TABLES['F4'];

  const ROOM_RECTS: [number, number, number, number][] = [
    [20, 20, 235, 170], [265, 20, 175, 100], [265, 125, 90, 95],
    [365, 125, 75, 95], [265, 225, 175, 140], [20, 195, 235, 170],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(3,27,23,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-2xl overflow-hidden"
        style={{ background: '#052620', border: '1px solid #F7C66A33', boxShadow: '0 50px 100px rgba(0,0,0,.9)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#F7C66A22' }}>
          <div className="flex items-center gap-4">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: col + '22', color: col, border: `1px solid ${col}44` }}
            >
              {apt.type}
            </span>
            <div>
              <div className="text-white font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                Bloc {apt.block} — Niveau {apt.floor}
              </div>
              <div className="text-xs" style={{ color: '#F7C66A99' }}>
                Code : {apt.type}-{apt.block}1-{String(apt.floor).padStart(2, '0')} — {apt.total} m² utile
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors border"
            style={{ borderColor: '#F7C66A33' }}
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-5">
          {/* Floor plan SVG */}
          <div className="col-span-3 p-5">
            <svg viewBox="0 0 470 380" className="w-full">
              <rect x="0" y="0" width="470" height="380" fill="#031B17" rx="4" />
              <rect x="10" y="10" width="370" height="360" fill="none" stroke="#F7C66A33" strokeWidth="1.5" />
              {rows.slice(0, 6).map(({ label }, i) => {
                const [rx, ry, rw, rh] = ROOM_RECTS[i] || [0, 0, 0, 0];
                return (
                  <g key={label}>
                    <rect x={rx} y={ry} width={rw} height={rh} fill={col} fillOpacity={.08} stroke={col} strokeWidth="1" rx="3" />
                    <text x={rx + rw / 2} y={ry + rh / 2 + 4} textAnchor="middle" fill={col} fontSize={10} fontFamily="Georgia,serif">{label}</text>
                  </g>
                );
              })}
              {apt.terrace > 0 && (
                <g>
                  <rect x={395} y={10} width={65} height={220} fill={col} fillOpacity={.04} stroke={col} strokeWidth="1" strokeDasharray="6,4" rx="2" />
                  <text x={427} y={110} textAnchor="middle" fill={col} fontSize={10} fontFamily="Georgia,serif" opacity={.6}>Terr.</text>
                </g>
              )}
              <rect x={330} y={295} width={50} height={75} fill="#0A2A24" stroke="#F7C66A22" strokeWidth="1" />
              <text x={355} y={335} textAnchor="middle" fill="#F7C66A55" fontSize={8}>ESCL.</text>
              <g transform="translate(445, 355)">
                <circle r="14" fill="#031B17" stroke="#F7C66A44" strokeWidth="1" />
                <text textAnchor="middle" y="-3" fill="#F7C66A" fontSize={8} fontFamily="serif" fontWeight="bold">N</text>
                <polygon points="0,-11 -3,-4 3,-4" fill="#F7C66A" />
              </g>
            </svg>
            <p className="text-center text-xs mt-2 italic" style={{ color: '#ffffff33' }}>Plan illustratif — données à titre indicatif, non contractuel</p>
          </div>

          {/* Surface table */}
          <div className="col-span-2 p-5 flex flex-col border-l" style={{ borderColor: '#F7C66A22' }}>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-4" style={{ color: '#F7C66A' }}>Tableau surfacique</h3>
            <div className="flex-1 overflow-y-auto space-y-1.5">
              {rows.map(({ label, value }) => (
                <div key={label} className="flex justify-between text-xs py-1 border-b" style={{ borderColor: '#F7C66A11' }}>
                  <span className="text-white/50">{label}</span>
                  <span className="text-white/80 font-mono">{value}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 mt-3 space-y-1.5" style={{ borderColor: '#F7C66A33' }}>
              <div className="flex justify-between text-xs">
                <span className="text-white/70">Surface habitable</span>
                <span className="text-white font-bold">{apt.surface} m²</span>
              </div>
              {apt.terrace > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-white/70">Terrasse / Loggia</span>
                  <span className="text-white font-bold">{apt.terrace} m²</span>
                </div>
              )}
              <div className="flex justify-between text-sm pt-1.5 border-t" style={{ borderColor: '#F7C66A33' }}>
                <span className="font-bold" style={{ color: '#F7C66A' }}>Surface utile</span>
                <span className="font-bold" style={{ color: '#F7C66A' }}>{apt.total} m²</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="mt-4 w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #F7C66A, #E8BF7A)', color: '#031B17' }}
            >
              Demander ce bien →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
