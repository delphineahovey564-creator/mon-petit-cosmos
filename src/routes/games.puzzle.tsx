import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/games/puzzle')({ component: PuzzleGame });

const THEMES = [
  { name: 'Savane 🌍', color: '#FFEAA7', grid: ['☀️','🌤️','⛅','🦒','🦁','🌳','🌿','🐘',''] },
  { name: 'Océan 🌊',  color: '#B5EAD7', grid: ['🌊','🐬','🌊','🐟','🦈','🐠','🪸','🐙',''] },
  { name: 'Forêt 🌲',  color: '#D4EDDA', grid: ['🌲','🌲','🌲','🦊','🌺','🐦','🍄','🌿',''] },
  { name: 'Espace 🚀', color: '#C7CEEA', grid: ['⭐','🌙','⭐','🪐','🚀','🌟','⭐','🌌',''] },
];

function neighbors(idx: number): number[] {
  const SIZE = 3;
  const r = Math.floor(idx / SIZE), c = idx % SIZE;
  const n: number[] = [];
  if (r > 0) n.push(idx - SIZE);
  if (r < SIZE - 1) n.push(idx + SIZE);
  if (c > 0) n.push(idx - 1);
  if (c < SIZE - 1) n.push(idx + 1);
  return n;
}

function shuffleBoard(solved: string[]): string[] {
  const g = [...solved];
  let empty = g.indexOf('');
  for (let i = 0; i < 200; i++) {
    const nb = neighbors(empty);
    const pick = nb[Math.floor(Math.random() * nb.length)];
    [g[empty], g[pick]] = [g[pick], g[empty]];
    empty = pick;
  }
  return g;
}

function isSolved(tiles: string[], theme: number): boolean {
  const sol = THEMES[theme].grid;
  for (let i = 0; i < 8; i++) if (tiles[i] !== sol[i]) return false;
  return tiles[8] === '';
}

function PuzzleGame() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'menu'|'play'|'win'>('menu');
  const [themeIdx, setThemeIdx] = useState(0);
  const [tiles, setTiles] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [preview, setPreview] = useState(false);

  function startGame() {
    setTiles(shuffleBoard([...THEMES[themeIdx].grid]));
    setMoves(0);
    setPhase('play');
  }

  function tap(idx: number) {
    if (tiles[idx] === '') return;
    const empty = tiles.indexOf('');
    if (!neighbors(empty).includes(idx)) return;
    const next = [...tiles];
    [next[empty], next[idx]] = [next[idx], next[empty]];
    setTiles(next);
    setMoves((m) => m + 1);
    if (isSolved(next, themeIdx)) setTimeout(() => setPhase('win'), 300);
  }

  const theme = THEMES[themeIdx];
  const stars = Math.max(5, 20 - Math.floor(moves / 3));

  if (phase === 'menu') return (
    <div style={PS.page}>
      <button onClick={() => navigate({ to: '/games' })} style={PS.back}>← Retour</button>
      <div style={{ ...PS.hero, background: 'linear-gradient(135deg,#A8B3D8,#C7CEEA)' }}>
        <div style={{ fontSize: 56 }}>🧩</div>
        <div style={{ fontWeight: 900, fontSize: 24, marginTop: 8, color: 'white' }}>Puzzle</div>
        <div style={{ fontWeight: 500, fontSize: 14, opacity: 0.85, marginTop: 4, color: 'white' }}>Glisse les pièces pour reconstituer l'image !</div>
      </div>
      <div style={{ padding: '0 16px' }}>
        <div style={{ fontWeight: 800, fontSize: 17, color: '#1A1A2E', marginBottom: 12 }}>Choisis un thème :</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {THEMES.map((t, i) => (
            <button key={i} onClick={() => setThemeIdx(i)} style={{ background: themeIdx === i ? t.color : 'white', border: `2px solid ${themeIdx === i ? '#FF6B35' : '#E5E7EB'}`, borderRadius: 16, padding: 12, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, marginBottom: 6 }}>
                {t.grid.map((e, j) => (
                  <div key={j} style={{ background: 'rgba(255,255,255,.6)', borderRadius: 4, padding: 2, fontSize: 14, textAlign: 'center' }}>{e || '·'}</div>
                ))}
              </div>
              <div style={{ fontWeight: 700, fontSize: 12, color: themeIdx === i ? '#FF6B35' : '#1A1A2E' }}>{t.name}</div>
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: '20px 16px 0' }}>
        <button onClick={startGame} style={{ ...PS.btn, background: '#6C6CC7', boxShadow: '0 6px 16px rgba(108,108,199,.3)' }}>Commencer ! 🚀</button>
      </div>
    </div>
  );

  if (phase === 'win') return (
    <div style={{ ...PS.page, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 80 }}>🧩</div>
      <div style={{ fontWeight: 900, fontSize: 30, color: '#6C6CC7', margin: '12px 0 4px' }}>Parfait !</div>
      <div style={{ color: '#6B7280', fontSize: 15, marginBottom: 20 }}>Terminé en {moves} déplacements !</div>
      <div style={{ background: '#F3F4F6', borderRadius: 20, padding: '20px 32px', marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 32, color: '#FF6B35' }}>+{stars}⭐</div>
        <div style={{ fontWeight: 500, fontSize: 13, color: '#9CA3AF' }}>étoiles gagnées</div>
      </div>
      <button onClick={startGame} style={{ ...PS.btn, background: '#6C6CC7', marginBottom: 10 }}>🔄 Rejouer</button>
      <button onClick={() => navigate({ to: '/games' })} style={PS.btnOut}>Menu des jeux</button>
    </div>
  );

  return (
    <div style={PS.page}>
      <div style={PS.topBar}>
        <button onClick={() => setPhase('menu')} style={PS.backSm}>←</button>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1A1A2E' }}>{moves} déplacements</div>
        <button
          onPointerDown={() => setPreview(true)}
          onPointerUp={() => setPreview(false)}
          onPointerLeave={() => setPreview(false)}
          style={{ background: '#F3F4F6', border: 'none', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 13, color: '#6B7280' }}
        >👁 Voir</button>
      </div>
      {preview && (
        <div onClick={() => setPreview(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'white' }}>Image à reconstituer</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, padding: 16, background: 'white', borderRadius: 16 }}>
            {theme.grid.map((e, i) => (
              <div key={i} style={{ width: 72, height: 72, background: theme.color, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>{e}</div>
            ))}
          </div>
        </div>
      )}
      <div style={{ padding: 16 }}>
        <div style={{ background: 'white', borderRadius: 20, padding: 10, boxShadow: '0 4px 20px rgba(0,0,0,.08)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
          {tiles.map((emoji, idx) => (
            <button key={idx} onClick={() => tap(idx)} style={{
              aspectRatio: '1', borderRadius: 12, border: 'none',
              background: emoji === '' ? '#F3F4F6' : theme.color,
              opacity: emoji === '' ? 0.3 : 1, fontSize: 38,
              cursor: emoji === '' ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: emoji ? '0 2px 8px rgba(0,0,0,.08)' : 'none',
              transition: 'background 0.15s', userSelect: 'none',
            }}>{emoji}</button>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 12, fontWeight: 600, fontSize: 13, color: '#9CA3AF' }}>Touche une pièce à côté de la case vide pour la glisser</div>
      </div>
    </div>
  );
}

const PS: Record<string, React.CSSProperties> = {
  page: { background: '#FFF9F0', minHeight: '100vh', maxWidth: 430, margin: '0 auto', fontFamily: 'Nunito, sans-serif', display: 'flex', flexDirection: 'column', paddingBottom: 20 },
  back: { background: 'none', border: 'none', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 16, color: '#6C6CC7', padding: '16px 20px', cursor: 'pointer', textAlign: 'left' },
  backSm: { background: 'none', border: 'none', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 20, color: '#6B7280', cursor: 'pointer' },
  topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,.05)' },
  hero: { margin: '0 16px 16px', borderRadius: 24, padding: 28, textAlign: 'center' },
  btn: { width: '100%', height: 52, borderRadius: 14, border: 'none', color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 16, cursor: 'pointer' },
  btnOut: { width: '100%', height: 48, background: 'white', borderRadius: 14, border: '1.5px solid #E5E7EB', color: '#6B7280', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
};