import React from 'react';
import { InteractiveProject, TYPE_COLORS, AptType } from '../../types/interactive';

export type Facing = 'N' | 'E' | 'S' | 'O';

interface Props {
  project: InteractiveProject;
  selectedFloor: number;
  activeFilter: string;
  onSelectFloor: (n: number) => void;
  facing?: Facing;
}

const GY = 605, CH = 38, FH = 26, DX = 54, DY = -32;
const BLKX: Record<string, [number, number]> = { D: [172, 328], C: [335, 458], B: [465, 622], A: [629, 812] };
const BLKFL: Record<string, number> = { D: 14, C: 18, B: 18, A: 15 };

const floorTopY = (fl: number) => GY - CH - fl * FH;

function buildSVG(project: InteractiveProject, selectedFloor: number, activeFilter: string): string {
  let h = '';

  h += `<defs>
    <linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#04060e"/>
      <stop offset="55%" stop-color="#0b1428"/>
      <stop offset="100%" stop-color="#182a4a"/>
    </linearGradient>
    <linearGradient id="bgrd" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#161412"/>
      <stop offset="100%" stop-color="#0a0806"/>
    </linearGradient>
    <radialGradient id="bglw" cx="50%" cy="0%" r="80%">
      <stop offset="0%" stop-color="#c89030" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#c89030" stop-opacity="0"/>
    </radialGradient>
    <filter id="bblr2" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2.5"/>
    </filter>
    <filter id="bblr5" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="5"/>
    </filter>
  </defs>`;

  h += `<rect x="0" y="0" width="1260" height="680" fill="url(#bsky)"/>`;

  [13,37,71,97,113,151,173,197,211,233,251,277,293,311,337,353,373,397,419,431,457,479,499,521,541,557,571,593,613,631,647,661,677,691,709,727,743,761,773,787].forEach((s, i) => {
    const sx = 20 + (s * 41 + i * 39) % 1220;
    const sy = 8 + (s * 17 + i * 31) % 290;
    const r = 0.4 + (i % 4) * 0.3;
    h += `<circle cx="${sx}" cy="${sy}" r="${r}" fill="white" opacity="${(0.3 + (i % 5) * 0.12).toFixed(2)}"/>`;
  });

  h += `<circle cx="1105" cy="72" r="26" fill="#ede5cc" opacity="0.85"/>`;
  h += `<circle cx="1098" cy="65" r="21" fill="#0b1428" opacity="0.9"/>`;
  h += `<rect x="0" y="370" width="1260" height="235" fill="#0a1824" opacity="0.35"/>`;
  h += `<ellipse cx="630" cy="605" rx="500" ry="60" fill="url(#bglw)"/>`;

  [[55,290,65,115],[155,280,42,125],[240,305,48,100],[910,275,75,130],[1020,285,55,120],[1140,298,50,107]].forEach(([bx,by,bw,bh]) => {
    h += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#06090f" opacity="0.85"/>`;
    for (let r = 0; r < Math.floor(bh/14); r++) for (let c = 0; c < Math.floor(bw/16); c++) {
      const lit = (bx + r*7 + c*11) % 6 !== 0;
      if (lit) h += `<rect x="${bx+4+c*16}" y="${by+4+r*14}" width="9" height="7" fill="#b07820" opacity="0.35"/>`;
    }
  });

  h += `<polygon points="0,605 1260,605 1260,680 0,680" fill="url(#bgrd)"/>`;
  h += `<polygon points="130,605 1130,605 1260,650 0,650" fill="#0e0c0a" opacity="0.6"/>`;
  h += `<polygon points="812,${GY} ${812 + DX},${GY + DY} ${812 + DX},${GY + DY + 80} 812,${GY + 80}" fill="#0c0a08"/>`;
  h += `<ellipse cx="530" cy="${GY + 8}" rx="380" ry="14" fill="#c89030" opacity="0.08"/>`;

  const blocks: [string, [number, number]][] = [['A', BLKX.A], ['B', BLKX.B], ['C', BLKX.C], ['D', BLKX.D]];

  blocks.forEach(([bid, [x1, x2]]) => {
    const bfl = BLKFL[bid];
    const topY = floorTopY(bfl);
    const botY = GY;
    const bw = x2 - x1;
    const commY = GY - CH;
    const rx2 = x2 + DX;

    h += `<polygon points="${x2},${topY} ${rx2},${topY + DY} ${rx2},${botY + DY} ${x2},${botY}" fill="#0a0e14"/>`;
    for (let f = 0; f < bfl; f++) {
      const fy = GY - CH - (f + 1) * FH;
      const lit = (f + bid.charCodeAt(0)) % 3 !== 0;
      if (lit) h += `<rect x="${x2 + 3}" y="${fy + DY + 5}" width="${DX - 6}" height="${FH - 10}" fill="#c89030" opacity="0.55"/>`;
    }

    h += `<rect x="${x1}" y="${topY}" width="${bw}" height="${botY - topY}" fill="#181c28"/>`;
    const nPanels = Math.max(4, Math.floor(bw / 48));
    for (let p = 0; p <= nPanels; p++) {
      const px = x1 + p * (bw / nPanels);
      h += `<rect x="${px - 1}" y="${topY}" width="2.5" height="${botY - topY}" fill="#0e1220" opacity="0.9"/>`;
    }

    for (let f = 0; f < bfl; f++) {
      const fl = f + 1;
      const fy = GY - CH - fl * FH;
      const isPH = f >= bfl - 2;
      const isSel = fl === selectedFloor;
      const floorData = project.floors[f];
      const apt = floorData?.apartments.find(a => a.block === bid);
      const col = apt ? (TYPE_COLORS[apt.type as AptType] || '#888') : '#888';
      const filt = !apt || activeFilter === 'ALL' || activeFilter === apt.type ||
        (activeFilter === 'F3' && ['F3', 'F3+'].includes(apt.type));

      if (filt && apt) {
        h += `<rect x="${x1 + 2}" y="${fy}" width="${bw - 4}" height="${FH - 2}" fill="${col}" opacity="${isSel ? 0.14 : 0.04}"/>`;
      }

      h += `<rect x="${x1 - 6}" y="${fy + FH - 4}" width="${bw + 12}" height="4" fill="${isPH ? '#9a7820' : '#1e2438'}"/>`;
      h += `<rect x="${x1 - 7}" y="${fy + FH - 5}" width="${bw + 14}" height="2" fill="${isPH ? '#c8a040' : '#2a3450'}" opacity="0.7"/>`;
      h += `<rect x="${x1 - 6}" y="${fy + FH - 18}" width="${bw + 12}" height="13" fill="#2a4860" opacity="0.22"/>`;

      const nW = Math.max(2, Math.round((bw - 16) / 44));
      const wPitch = (bw - 16) / nW;
      const wW = wPitch - 5;
      for (let w = 0; w < nW; w++) {
        const wx = x1 + 8 + w * wPitch;
        const litRoll = (f * 7 + w * 11 + bid.charCodeAt(0) * 3) % 100;
        const litChance = apt?.status === 'vendu' ? 42 : isPH ? 88 : 78;
        const lit = filt && litRoll < litChance;
        if (lit) h += `<rect x="${wx - 3}" y="${fy + 5}" width="${wW + 6}" height="${FH - 12}" fill="#d09030" opacity="0.28" rx="1" filter="url(#bblr2)"/>`;
        const winFill = lit ? (isPH ? '#f0d468' : '#e8c050') : '#080c14';
        h += `<rect x="${wx}" y="${fy + 6}" width="${wW}" height="${FH - 14}" fill="${winFill}" opacity="${!filt ? 0.18 : lit ? 0.92 : 0.55}" rx="1"/>`;
        if (lit) h += `<line x1="${wx + 1}" y1="${fy + 7}" x2="${wx + 1}" y2="${fy + FH - 9}" stroke="white" stroke-width="0.7" opacity="0.22"/>`;
        if (filt && (f + w * 3 + bid.charCodeAt(0)) % 4 === 0) {
          const py = fy + FH - 10;
          h += `<ellipse cx="${wx + wW / 2}" cy="${py}" rx="5" ry="4" fill="#1e4a12" opacity="0.9"/>`;
          h += `<ellipse cx="${wx + wW / 2 + 2}" cy="${py - 2}" rx="3" ry="2.5" fill="#2a6018" opacity="0.75"/>`;
        }
      }

      if (isSel) {
        h += `<rect x="${x1 + 2}" y="${fy + 1}" width="${bw - 4}" height="${FH - 5}" fill="none" stroke="#F7C66A" stroke-width="2" opacity="0.9"/>`;
        h += `<rect x="${x1 + 3}" y="${fy + 2}" width="${bw - 6}" height="${FH - 7}" fill="#F7C66A" opacity="0.04"/>`;
      }
    }

    h += `<rect x="${x1}" y="${commY}" width="${bw}" height="${CH}" fill="#0f131e"/>`;
    const nG = Math.max(2, Math.round((bw - 14) / 80));
    const gW = (bw - 14) / nG - 4;
    for (let p = 0; p < nG; p++) {
      const gx = x1 + 7 + p * (gW + 4);
      h += `<rect x="${gx}" y="${commY + 4}" width="${gW}" height="${CH - 8}" rx="2" fill="#3a6888" fill-opacity="0.6" stroke="#2a5070" stroke-width="0.8"/>`;
      h += `<rect x="${gx}" y="${commY + 4}" width="${gW}" height="5" fill="#4a7898" fill-opacity="0.5"/>`;
      h += `<rect x="${gx + 2}" y="${commY + 4}" width="${gW - 4}" height="${CH - 12}" fill="#c89030" opacity="0.12" filter="url(#bblr5)"/>`;
    }
    h += `<rect x="${x1}" y="${commY}" width="${bw}" height="5" fill="#1a2030"/>`;
    h += `<rect x="${x1}" y="${topY}" width="5" height="${botY - topY}" fill="#0e1220"/>`;
    h += `<rect x="${x2 - 5}" y="${topY}" width="5" height="${botY - topY}" fill="#0e1220"/>`;
    h += `<rect x="${x1}" y="${topY - 10}" width="${bw}" height="10" fill="#141820"/>`;
    h += `<rect x="${x1}" y="${topY - 18}" width="${bw}" height="9" fill="#1a2030"/>`;
    h += `<polygon points="${x1},${topY - 18} ${x1 + DX},${topY - 18 + DY} ${x2 + DX},${topY - 18 + DY} ${x2},${topY - 18}" fill="#12161e"/>`;
    h += `<rect x="${x1 + 4}" y="${topY - 18}" width="${bw - 8}" height="2" fill="#c8a050" opacity="0.7"/>`;
    h += `<rect x="${x1 + 4}" y="${topY - 18}" width="${bw - 8}" height="2" fill="#e0c070" opacity="0.3" filter="url(#bblr5)"/>`;

    if (bid === 'C' || bid === 'B') {
      const phH = 36, phY = topY - 18 - phH;
      h += `<rect x="${x1 + 10}" y="${phY}" width="${bw - 20}" height="${phH}" fill="#121824"/>`;
      const nPW = 7;
      for (let pw = 0; pw < nPW; pw++) {
        const pwx = x1 + 10 + pw * ((bw - 20) / nPW);
        const plit = pw % 2 === 0;
        h += `<rect x="${pwx + 2}" y="${phY + 4}" width="${(bw - 20) / nPW - 3}" height="${phH - 8}" fill="${plit ? '#e0c050' : '#060a10'}" opacity="${plit ? 0.75 : 0.7}"/>`;
        if (plit) h += `<rect x="${pwx + 2}" y="${phY + 4}" width="${(bw - 20) / nPW - 3}" height="${phH - 8}" fill="#e8c860" opacity="0.3" filter="url(#bblr2)"/>`;
      }
      h += `<polygon points="${x1 + 10},${phY} ${x1 + 10 + DX},${phY + DY} ${x2 - 10 + DX},${phY + DY} ${x2 - 10},${phY}" fill="#0e1420"/>`;
      h += `<text x="${(x1 + x2) / 2}" y="${phY + phH / 2 + 5}" text-anchor="middle" fill="#F7C66A" font-size="12" font-family="Georgia,serif" font-weight="bold" opacity="0.9">PH</text>`;
    }

    const nH = Math.floor(bw / 95);
    for (let hi = 0; hi < nH; hi++) {
      const hx = x1 + 18 + hi * 95;
      h += `<rect x="${hx}" y="${topY - 33}" width="35" height="17" rx="2" fill="#0e1220" stroke="#1a2030" stroke-width="0.8"/>`;
      h += `<circle cx="${hx + 11}" cy="${topY - 24}" r="5" fill="#0a0e18" stroke="#1a2838" stroke-width="0.8"/>`;
    }

    h += `<text x="${(x1 + x2) / 2}" y="${GY + 22}" text-anchor="middle" fill="#F7C66A" font-size="11" font-family="Georgia,serif" letter-spacing="2" opacity="0.8">BLOC ${bid}</text>`;
  });

  [[328, 335], [458, 465], [622, 629]].forEach(([a, b]) => {
    const stH = BLKFL['C'] * FH + CH;
    h += `<rect x="${a}" y="${GY - stH}" width="${b - a}" height="${stH}" fill="#0c1018" opacity="0.95"/>`;
  });

  const signX = (BLKX.C[0] + BLKX.B[1]) / 2;
  const signY = floorTopY(BLKFL['C']) - 52;
  h += `<rect x="${signX - 100}" y="${signY - 6}" width="200" height="30" fill="#08090e" rx="4" opacity="0.7"/>`;
  h += `<text x="${signX}" y="${signY + 14}" text-anchor="middle" fill="#F7C66A" font-size="12" font-family="Georgia,serif" font-weight="bold" letter-spacing="3">${project.name.toUpperCase()}</text>`;

  [148, 355, 480, 650, 828, 998, 1108].forEach((tx, i) => {
    h += `<rect x="${tx - 3}" y="${GY - 38}" width="6" height="32" rx="1" fill="#120e08"/>`;
    h += `<ellipse cx="${tx}" cy="${GY - 50}" rx="14" ry="17" fill="${i % 2 ? '#152a0c' : '#0e2008'}"/>`;
    h += `<ellipse cx="${tx - 4}" cy="${GY - 56}" rx="8" ry="10" fill="${i % 2 ? '#1e3a12' : '#142e0c'}"/>`;
  });

  [215, 510, 815, 1055].forEach(lx => {
    h += `<rect x="${lx - 1}" y="${GY - 48}" width="2" height="42" fill="#1a1810"/>`;
    h += `<ellipse cx="${lx}" cy="${GY - 48}" rx="9" ry="3.5" fill="#c09028" opacity="0.8"/>`;
    h += `<ellipse cx="${lx}" cy="${GY - 44}" rx="16" ry="16" fill="#c08818" opacity="0.1" filter="url(#bblr5)"/>`;
  });

  [[310, 622, 'c0392b'], [470, 633, 'c9a065'], [680, 624, '2980b9'], [880, 618, 'c0392b']].forEach(([cx, cy, col]) => {
    h += `<rect x="${+cx - 18}" y="${+cy - 8}" width="36" height="16" rx="3" fill="#${col}" opacity="0.75"/>`;
    h += `<rect x="${+cx - 10}" y="${+cy - 12}" width="20" height="7" rx="2" fill="#${col}" opacity="0.6"/>`;
    h += `<circle cx="${+cx - 12}" cy="${+cy + 8}" r="3.5" fill="#050505" stroke="#1a1a1a" stroke-width="1"/>`;
    h += `<circle cx="${+cx + 12}" cy="${+cy + 8}" r="3.5" fill="#050505" stroke="#1a1a1a" stroke-width="1"/>`;
    h += `<ellipse cx="${+cx + 17}" cy="${+cy - 2}" rx="5" ry="3" fill="#ffe8a0" opacity="0.65"/>`;
    h += `<ellipse cx="${+cx + 17}" cy="${+cy - 2}" rx="10" ry="9" fill="#ffe090" opacity="0.12" filter="url(#bblr2)"/>`;
  });

  if (selectedFloor > 0) {
    const fy = floorTopY(selectedFloor) + FH / 2;
    h += `<line x1="145" y1="${fy}" x2="165" y2="${fy}" stroke="#F7C66A" stroke-width="2"/>`;
    h += `<polygon points="165,${fy} 158,${fy - 5} 158,${fy + 5}" fill="#F7C66A"/>`;
    h += `<text x="140" y="${fy + 4}" text-anchor="end" fill="#F7C66A" font-size="9" font-family="sans-serif" font-weight="bold">Niv.${selectedFloor}</text>`;
  }

  for (let n = 1; n <= project.totalFloors; n += 3) {
    const fy = floorTopY(n) + FH / 2;
    h += `<text x="128" y="${fy + 3}" text-anchor="end" fill="#aaa" font-size="8" font-family="sans-serif">${n}</text>`;
    h += `<line x1="130" y1="${fy}" x2="140" y2="${fy}" stroke="#ccc" stroke-width=".5"/>`;
  }
  h += `<line x1="140" y1="${floorTopY(project.totalFloors)}" x2="140" y2="${GY}" stroke="#ddd" stroke-width=".5"/>`;

  h += `<text x="630" y="668" text-anchor="middle" fill="#888" font-size="12" font-family="Georgia,serif" font-style="italic">${project.location}</text>`;
  h += `<text x="95" y="430" text-anchor="middle" fill="#888" font-size="10" font-family="Georgia,serif" font-style="italic" transform="rotate(-88,95,430)">Avenue d'Arcole</text>`;
  h += `<text x="630" y="26" text-anchor="middle" fill="#F7C66A" font-size="10" font-family="Georgia,serif" opacity=".5">Cliquez sur un étage pour voir le plan de niveau</text>`;

  return h;
}

const FACING_TRANSFORM: Record<string, string> = {
  N: 'perspective(1400px) rotateY(0deg)',
  E: 'perspective(1400px) rotateY(-38deg)',
  S: 'perspective(1400px) rotateY(0deg) scaleX(-1)',
  O: 'perspective(1400px) rotateY(38deg)',
};

// Invisible click overlay on each floor band
function FloorClickOverlay({ project, onSelectFloor }: { project: InteractiveProject; onSelectFloor: (n: number) => void }) {
  const W = 1260, H = 680;
  const x1 = 172, x2 = 812;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    >
      {Array.from({ length: project.totalFloors }, (_, i) => {
        const fl = i + 1;
        const fy = floorTopY(fl);
        return (
          <rect
            key={fl}
            x={x1}
            y={fy}
            width={x2 - x1}
            height={FH}
            fill="transparent"
            style={{ pointerEvents: 'all', cursor: 'pointer' }}
            onClick={() => onSelectFloor(fl)}
          />
        );
      })}
    </svg>
  );
}

export default function Building3DView({ project, selectedFloor, activeFilter, onSelectFloor, facing = 'N' }: Props) {
  const transform = FACING_TRANSFORM[facing] ?? FACING_TRANSFORM.N;
  return (
    <div className="w-full h-full relative" style={{ perspective: '1400px' }}>
      <div className="w-full h-full" style={{ transform, transformOrigin: 'center center', transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)' }}>
        <svg
          viewBox="0 0 1260 680"
          className="w-full h-full"
          style={{ display: 'block' }}
          dangerouslySetInnerHTML={{ __html: buildSVG(project, selectedFloor, activeFilter) }}
        />
        <FloorClickOverlay project={project} onSelectFloor={onSelectFloor} />
      </div>
    </div>
  );
}
