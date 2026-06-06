import React from 'react';
import { InteractiveProject, Apartment, TYPE_COLORS, AptType } from '../../types/interactive';

interface Props {
  project: InteractiveProject;
  floorIndex: number;
  activeFilter: string;
  selectedBlock: string | null;
  onSelectApartment: (apt: Apartment) => void;
}

const BLOCKS: { id: 'D' | 'C' | 'B' | 'A'; x: number; y: number; w: number; h: number }[] = [
  { id: 'D', x: 80,  y: 100, w: 210, h: 360 },
  { id: 'C', x: 320, y: 80,  w: 230, h: 400 },
  { id: 'B', x: 590, y: 80,  w: 240, h: 400 },
  { id: 'A', x: 870, y: 90,  w: 210, h: 380 },
];

export default function FloorPlanView({ project, floorIndex, activeFilter, selectedBlock, onSelectApartment }: Props) {
  const floorData = project.floors[floorIndex - 1];
  const apartments = floorData?.apartments || [];

  const W = 1200, H = 620;
  const parts: string[] = [];

  parts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="#021410"/>`);
  parts.push(`<rect x="0" y="530" width="${W}" height="90" fill="#031B17"/>`);
  parts.push(`<rect x="0" y="528" width="${W}" height="2" fill="#F7C66A" opacity="0.3"/>`);

  for (let x = 0; x < W; x += 80) {
    parts.push(`<rect x="${x + 4}" y="562" width="44" height="3" rx="2" fill="#F7C66A" opacity="0.08"/>`);
  }

  parts.push(`<rect x="0" y="0" width="60" height="${H}" fill="#021410"/>`);
  parts.push(`<rect x="${W - 60}" y="0" width="60" height="${H}" fill="#021410"/>`);

  const allX1 = Math.min(...BLOCKS.map(b => b.x)) - 10;
  const allX2 = Math.max(...BLOCKS.map(b => b.x + b.w)) + 10;
  const allY1 = Math.min(...BLOCKS.map(b => b.y)) - 10;
  parts.push(`<rect x="${allX1}" y="${allY1}" width="${allX2 - allX1}" height="${528 - allY1}" rx="4" fill="#0A2A24" opacity="0.8"/>`);

  BLOCKS.slice(0, -1).forEach((b, i) => {
    const nx = BLOCKS[i + 1];
    const sx = b.x + b.w + 2, sw = nx.x - b.x - b.w - 4;
    const sy = Math.min(b.y, nx.y), sh = Math.max(b.y + b.h, nx.y + nx.h) - sy;
    parts.push(`<rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" fill="#0D3328" opacity="0.9"/>`);
    const cx = sx + sw / 2, cy = sy + sh / 2;
    parts.push(`<text x="${cx}" y="${cy + 4}" text-anchor="middle" fill="#F7C66A" font-size="9" font-family="sans-serif" opacity="0.5">▲▼</text>`);
  });

  BLOCKS.forEach(b => {
    const apt = apartments.find(a => a.block === b.id);
    if (!apt) return;

    const col = TYPE_COLORS[apt.type as AptType] || '#888';
    const filt = activeFilter === 'ALL' || activeFilter === apt.type ||
      (activeFilter === 'F3' && ['F3', 'F3+'].includes(apt.type));
    const isSel = selectedBlock === b.id;
    const fillOp = !filt ? 0.04 : isSel ? 0.40 : 0.15;
    const strokeW = isSel ? 2.5 : filt ? 1.5 : 0.5;
    const strokeCol = isSel ? '#F7C66A' : filt ? col : '#2a4a44';

    parts.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="4" fill="${col}" fill-opacity="${fillOp}" stroke="${strokeCol}" stroke-width="${strokeW}"/>`);

    if (filt) {
      const nDivs = apt.type === 'F2' ? 1 : apt.type === 'F3' || apt.type === 'F3+' ? 2 : apt.type === 'F4' ? 3 : apt.type === 'PH' ? 4 : 3;
      for (let d = 1; d <= nDivs; d++) {
        const divY = b.y + (b.h / (nDivs + 1)) * d;
        parts.push(`<line x1="${b.x + 10}" y1="${divY}" x2="${b.x + b.w - 10}" y2="${divY}" stroke="${col}" stroke-width="0.7" opacity="0.35"/>`);
      }
      const divX = b.x + b.w * 0.75;
      parts.push(`<line x1="${divX}" y1="${b.y + 10}" x2="${divX}" y2="${b.y + b.h - 10}" stroke="${col}" stroke-width="0.7" opacity="0.25" stroke-dasharray="6,4"/>`);
    }

    const doorX = b.x + b.w / 2 - 12;
    const doorY = b.y + b.h - 2;
    parts.push(`<rect x="${doorX}" y="${doorY - 2}" width="24" height="4" rx="2" fill="${col}" opacity="${filt ? 0.5 : 0.15}"/>`);

    if (filt) {
      const nWin = Math.max(2, Math.floor(b.w / 60));
      for (let w = 0; w < nWin; w++) {
        const wx = b.x + 20 + w * ((b.w - 40) / (nWin - 1 || 1));
        parts.push(`<rect x="${wx - 10}" y="${b.y - 3}" width="20" height="6" rx="2" fill="${col}" opacity="0.45"/>`);
      }
    }

    const cx = b.x + b.w / 2;
    const cy = b.y + b.h / 2;
    if (filt) {
      parts.push(`<text x="${cx}" y="${cy - 18}" text-anchor="middle" fill="${col}" font-size="22" font-weight="bold" font-family="Georgia,serif" opacity="0.95">${apt.type}</text>`);
      parts.push(`<text x="${cx}" y="${cy + 6}" text-anchor="middle" fill="${col}" font-size="12" font-family="sans-serif" opacity="0.75">${apt.surface} m²${apt.terrace ? ` + ${apt.terrace} m² terrasse` : ''}</text>`);
    }
    parts.push(`<text x="${cx}" y="${b.y + b.h + 20}" text-anchor="middle" fill="#F7C66A" font-size="11" font-family="Georgia,serif" letter-spacing="2" opacity="0.7">BLOC ${b.id}</text>`);
  });

  // Compass (top-right)
  const cx2 = W - 44, cy2 = 44;
  parts.push(`<circle cx="${cx2}" cy="${cy2}" r="22" fill="rgba(3,27,23,0.9)" stroke="#F7C66A" stroke-width="1" opacity="0.6"/>`);
  parts.push(`<polygon points="${cx2},${cy2 - 19} ${cx2 - 5},${cy2 - 6} ${cx2 + 5},${cy2 - 6}" fill="#F7C66A"/>`);
  parts.push(`<text x="${cx2}" y="${cy2 - 22}" text-anchor="middle" fill="#F7C66A" font-size="11" font-family="serif" font-weight="bold">N</text>`);

  parts.push(`<text x="${W / 2}" y="572" text-anchor="middle" fill="#F7C66A" font-size="11" font-family="Georgia,serif" font-style="italic" opacity="0.5">${project.location}</text>`);
  parts.push(`<text x="80" y="50" fill="#F7C66A" font-size="13" font-family="Georgia,serif" font-weight="bold">Étage ${floorIndex} / ${project.totalFloors}</text>`);

  const visibleTypes = [...new Set(apartments
    .filter(a => activeFilter === 'ALL' || a.type === activeFilter || (activeFilter === 'F3' && ['F3','F3+'].includes(a.type)))
    .map(a => a.type)
  )].join(', ') || '—';
  parts.push(`<text x="80" y="70" fill="#ffffff" font-size="10" font-family="sans-serif" opacity="0.5">Typologies : ${visibleTypes}</text>`);

  const svgContent = parts.join('');

  return (
    <div className="w-full h-full relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" style={{ display: 'block' }}
        dangerouslySetInnerHTML={{ __html: svgContent }} />
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        {BLOCKS.map(b => {
          const apt = apartments.find(a => a.block === b.id);
          if (!apt) return null;
          const filt = activeFilter === 'ALL' || activeFilter === apt.type ||
            (activeFilter === 'F3' && ['F3', 'F3+'].includes(apt.type));
          if (!filt) return null;
          return (
            <rect key={b.id} x={b.x} y={b.y} width={b.w} height={b.h}
              fill="transparent" style={{ pointerEvents: 'all', cursor: 'pointer' }}
              onClick={() => onSelectApartment(apt)} />
          );
        })}
      </svg>
    </div>
  );
}
