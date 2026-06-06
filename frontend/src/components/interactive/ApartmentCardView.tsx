import React from 'react';
import { Apartment, TYPE_COLORS, AptType } from '../../types/interactive';

interface Props {
  apartment: Apartment;
  onClose: () => void;
  onViewPlan: () => void;
}

export default function ApartmentCardView({ apartment: apt, onClose, onViewPlan }: Props) {
  const col = TYPE_COLORS[apt.type as AptType] || '#888';

  return (
    <div
      className="absolute right-3 top-3 w-60 rounded-2xl overflow-hidden border z-30"
      style={{
        background: '#052620',
        borderColor: '#F7C66A33',
        boxShadow: '0 20px 50px rgba(0,0,0,.8)',
        animation: 'slideInRight 0.2s ease',
      }}
    >
      <div className="h-1" style={{ background: `linear-gradient(90deg, #F7C66A, #F7C66A55)` }} />
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: col + '22', color: col, border: `1px solid ${col}44` }}
            >
              {apt.type}
            </span>
            <div className="text-white font-bold mt-2" style={{ fontFamily: 'Georgia, serif', fontSize: '15px' }}>
              Bloc {apt.block} — Niv. {apt.floor}
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none p-0.5 transition-colors">×</button>
        </div>

        {/* Surfaces */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {[
            { v: `${apt.surface} m²`, l: 'Habitable' },
            { v: apt.terrace > 0 ? `${apt.terrace} m²` : '—', l: 'Terrasse' },
            { v: `${apt.total} m²`, l: 'Utile' },
          ].map(({ v, l }) => (
            <div key={l} className="rounded-xl p-2 text-center border" style={{ background: '#031B17', borderColor: '#F7C66A22' }}>
              <div className="text-white font-bold text-xs" style={{ fontFamily: 'Georgia, serif' }}>{v}</div>
              <div className="mt-0.5" style={{ fontSize: '8px', color: '#F7C66A99' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: apt.status === 'disponible' ? '#2ecc71' : apt.status === 'reserve' ? '#f39c12' : '#e74c3c'
            }}
          />
          <span className="text-xs text-white/60 capitalize">
            {apt.status === 'disponible' ? 'Disponible' : apt.status === 'reserve' ? 'Réservé' : 'Vendu'}
          </span>
          <span className="ml-auto text-xs font-bold" style={{ color: '#F7C66A' }}>{apt.price}</span>
        </div>

        {/* Features */}
        {apt.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {apt.features.map(f => (
              <span key={f} className="text-white/50 px-2 py-0.5 rounded-md text-xs border" style={{ borderColor: '#F7C66A22', background: '#031B17' }}>{f}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onViewPlan}
            className="flex-1 py-2 rounded-xl text-xs font-medium border transition-all"
            style={{ borderColor: '#F7C66A33', color: '#F7C66A99' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#F7C66A'; (e.currentTarget as HTMLButtonElement).style.color = '#F7C66A'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#F7C66A33'; (e.currentTarget as HTMLButtonElement).style.color = '#F7C66A99'; }}
          >
            Voir le plan
          </button>
          <button
            className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
            style={{ background: 'linear-gradient(135deg, #F7C66A, #E8BF7A)', color: '#031B17' }}
          >
            Contacter
          </button>
        </div>
      </div>
    </div>
  );
}
