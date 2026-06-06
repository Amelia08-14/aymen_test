import React, { useState, useCallback, useEffect } from 'react';

interface Props {
  images: string[];
  projectName: string;
}

export default function GalleryViewer({ images, projectName }: Props) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const switchTo = useCallback((idx: number) => {
    if (idx === current) return;
    setFading(true);
    setTimeout(() => { setCurrent(idx); setFading(false); }, 220);
  }, [current]);

  const prev = useCallback(() => switchTo((current - 1 + images.length) % images.length), [current, images.length, switchTo]);
  const next = useCallback(() => switchTo((current + 1) % images.length), [current, images.length, switchTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next]);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl border" style={{ background: '#052620', borderColor: '#F7C66A22' }}>
        <p className="text-white/40 text-sm">Aucune vue disponible pour ce projet</p>
      </div>
    );
  }

  return (
    <div className="flex h-full" style={{ fontFamily: 'system-ui, sans-serif', overflow: 'hidden', minHeight: '480px' }}>

      {/* LEFT: Thumbnail strip */}
      <div style={{
        width: 110, flexShrink: 0,
        background: '#052620',
        borderRight: '1px solid #F7C66A22',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 10px 10px', borderBottom: '1px solid #F7C66A11' }}>
          <p style={{ margin: 0, fontSize: 9, color: '#F7C66A99', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Vues
          </p>
          <p style={{ margin: '3px 0 0', fontSize: 11, fontWeight: 700, color: '#fff' }}>
            {projectName.replace('RÉSIDENCE ', '')}
          </p>
        </div>

        {/* Thumbnails */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => switchTo(i)}
              style={{
                position: 'relative', width: '100%', aspectRatio: '3/2', borderRadius: 8,
                overflow: 'hidden', border: `2px solid ${i === current ? '#F7C66A' : 'transparent'}`,
                cursor: 'pointer', padding: 0, background: '#031B17',
                opacity: i === current ? 1 : 0.55,
                transition: 'all 0.18s ease', flexShrink: 0,
              }}
            >
              <img src={img} alt={`Vue ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
                padding: '2px 4px 3px', fontSize: 8, color: '#fff', fontWeight: 600, textAlign: 'center',
              }}>
                Vue {i + 1}
              </div>
            </button>
          ))}
        </div>

        {/* Counter */}
        <div style={{ padding: '8px 10px 12px', borderTop: '1px solid #F7C66A11', textAlign: 'center' }}>
          <span style={{ fontSize: 10, color: '#F7C66A', fontWeight: 700 }}>{current + 1}</span>
          <span style={{ fontSize: 10, color: '#ffffff44' }}> / {images.length}</span>
        </div>
      </div>

      {/* RIGHT: Main photo */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#031B17' }}>

        {/* Main image */}
        <div style={{ position: 'absolute', inset: 0, opacity: fading ? 0 : 1, transition: 'opacity 0.22s ease' }}>
          <img
            src={images[current]}
            alt={`${projectName} — Vue ${current + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, transparent 40%, rgba(3,27,23,0.9) 100%)',
        }} />

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                width: 38, height: 38, borderRadius: '50%', zIndex: 10,
                background: 'rgba(3,27,23,0.7)', backdropFilter: 'blur(8px)',
                border: '1px solid #F7C66A44', color: '#F7C66A',
                fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >‹</button>
            <button
              onClick={next}
              style={{
                position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                width: 38, height: 38, borderRadius: '50%', zIndex: 10,
                background: 'rgba(3,27,23,0.7)', backdropFilter: 'blur(8px)',
                border: '1px solid #F7C66A44', color: '#F7C66A',
                fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >›</button>
          </>
        )}

        {/* Top controls */}
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, display: 'flex', gap: 8 }}>
          <button
            onClick={() => setFullscreen(true)}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(3,27,23,0.7)', backdropFilter: 'blur(8px)',
              border: '1px solid #F7C66A44', color: '#F7C66A',
              fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M21 16v3a2 2 0 01-2 2h-3M3 16v3a2 2 0 002 2h3"/>
            </svg>
          </button>
        </div>

        {/* Bottom info */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, padding: '0 28px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{
                margin: 0, color: '#F7C66A',
                fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 700,
                letterSpacing: '0.01em', textShadow: '0 2px 12px rgba(0,0,0,0.6)',
              }}>
                Vue {current + 1} / {images.length}
              </h2>
              <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>
                {projectName}
              </p>
            </div>
            {/* Dots */}
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => switchTo(i)}
                  style={{
                    width: i === current ? 20 : 6, height: 6, borderRadius: 4, padding: 0,
                    background: i === current ? '#F7C66A' : 'rgba(247,198,106,0.3)',
                    border: 'none', cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Label top-left */}
        <div style={{ position: 'absolute', top: 18, left: 20, zIndex: 10 }}>
          <div style={{
            background: 'rgba(3,27,23,0.6)', backdropFilter: 'blur(8px)',
            border: '1px solid #F7C66A33', borderRadius: 6,
            padding: '4px 12px', fontSize: 11, color: 'rgba(247,198,106,0.8)', letterSpacing: '0.05em',
          }}>
            Galerie · Résidence {projectName.replace('RÉSIDENCE ', '')}
          </div>
        </div>
      </div>

      {/* Fullscreen */}
      {fullscreen && (
        <div
          onClick={() => setFullscreen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <img
            src={images[current]}
            alt={`${projectName} — Vue ${current + 1}`}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
          {([['‹', prev, { left: 20 }], ['›', next, { right: 20 }]] as const).map(([icon, fn, pos]) => (
            <button
              key={icon}
              onClick={e => { e.stopPropagation(); (fn as () => void)(); }}
              style={{
                position: 'absolute', top: '50%', transform: 'translateY(-50%)', ...(pos as object),
                width: 50, height: 50, borderRadius: '50%',
                background: 'rgba(247,198,106,0.15)', border: '1px solid #F7C66A44',
                color: '#F7C66A', fontSize: 24, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >{icon}</button>
          ))}
          <button
            onClick={() => setFullscreen(false)}
            style={{
              position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(247,198,106,0.15)', border: '1px solid #F7C66A44',
              color: '#F7C66A', fontSize: 20, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>
      )}
    </div>
  );
}
