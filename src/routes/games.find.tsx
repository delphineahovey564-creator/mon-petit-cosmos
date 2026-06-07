import React, { useState, useEffect, useRef } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/games/find')({ component: FindGame });

const ROUNDS = [
  { target: '🦁', name: 'lion', pool: ['🐘','🦒','🐸','🐧','🦊','🐨','🦋','🐬','🦓','🐆','🦏','🐃','🦬','🦌','🐊','🦙','🐑','🦝'] },
  { target: '🍎', name: 'pomme', pool: ['🍌','🥭','🍊','🍋','🍇','🍓','🍒','🍑','🥝','🍐','🫐','🍈','🥥','🍍','🍅','🥑','🍆','🥦'] },
  { target: '⭐', name: 'étoile', pool: ['🌙','☀️','⚡','🌈','❄️','🌸','💧','🔥','🌊','🍀','💎','🎯','🔮','🌺','🦄','🌟','💫','🌞'] },
  { target: '🐟', name: 'poisson', pool: ['🐬','🦈','🐳','🦑','🦞','🦀','🐙','🦐','🐠','🐡','🦭','🐚','🪸','🫧','🪼','🐊','🦎','🐢'] },
  { target: '🌳', name: 'arbre', pool: ['🌴','🌵','🌿','🍀','🌾','🍄','🌺','🌻','🌹','🌷','🪷','🍁','🍂','🍃','🪴','🌱','🌲','🎋'] },
  { target: '🎈', name: 'ballon', pool: ['🎉','🎂','🎁','🎠','🎡','🎢','🎪','🎭','🎨','🎯','🪀','🎻','🎸','🥁','🎺','🎷','🪗','🎵'] },
  { target: '✈️', name: 'avion', pool: ['🚗','🚂','🚢','🚁','🛸','🚀','🛺','🛵','🚌','🚐','🚑','🚒','🛻','🚜','🏎️','🚕','🚙','🛳'] },
  { target: '📚', name: 'livres', pool: ['✏️','📝','🖊️','📐','📏','🔬','🔭','🎒','🖍️','📌','📎','🗂️','📋','📁','🖇️','🗒️','📓','📔'] },
  { target: '🦋', name: 'papillon', pool: ['🐝','🐛','🐌','🐜','🪲','🪳','🦗','🦟','🪰','🕷️','🦂','🐞','🪱','🐾','🦎','🐍','🦖','🦕'] },
  { target: '🏆', name: 'trophée', pool: ['🥇','🥈','🥉','🎖️','🏅','🎗️','🏵️','🎫','🎟️','🃏','🎴','♟️','🎲','🎯','🪃','🎳','🎾','⚽'] },
];

function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildGrid(roundIdx: number): string[] {
  const r = ROUNDS[roundIdx];
  const pool = shuffle([...r.pool]).slice(0, 29);
  const pos = Math.floor(Math.random() * 30);
  const g = [...pool];
  g.splice(pos, 0, r.target);
  return g.slice(0, 30);
}

function FindGame() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'menu'|'play'|'win'>('menu');
  const [round, setRound] = useState(0);
  const [grid, setGrid] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [totalPts, setTotalPts] = useState(0);
  const [found, setFound] = useState(false);
  const [flashIdx, setFlashIdx] = useState<{idx:number,ok:boolean}|null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startRound(r: number) {
    setGrid(buildGrid(r));
    setElapsed(0); setFound(false); setFlashIdx(null);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  }

  function startGame() {
    setRound(0); setTotalPts(0); setPhase('play'); startRound(0);
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  function tap(idx: number, emoji: string) {
    if (found) return;
    const target = ROUNDS[round].target;
    if (emoji === target) {
      if (timerRef.current) clearInterval(timerRef.current);
      setFound(true);
      setFlashIdx({ idx, ok: true });
      const pts = Math.max(1, 10 - elapsed);
      setTotalPts((p) => p + pts);
      setTimeout(() => {
        const nextRound = round + 1;
        if (nextRound >= ROUNDS.length) {
          setPhase('win');
        } else {
          setRound(nextRound);
          startRound(nextRound);
        }
      }, 1000);
    } else {
      setFlashIdx({ idx, ok: false });
      setTimeout(() => setFlashIdx(null), 400);
    }
  }

  if (phase === 'menu') return (
    <div style={FS.page}>
      <button onClick={() => navigate({ to: '/games' })} style={FS.back}>← Retour</button>
      <div style={{ ...FS.hero, background: 'linear-gradient(135deg,#2EC4B6,#26A69A)' }}>
        <div style={{ fontSize: 56 }}>🔍</div>
        <div style={{ fontWeight: 900, fontSize: 24, marginTop: 8, color: 'white' }}>Cherche et Trouve</div>
        <div style={{ fontWeight: 500, fontSize: 14, opacity: 0.85, marginTop: 4, color: 'white' }}>Trouve l'objet caché parmi les 30 cases !</div>
        <div style={{ marginTop: 10, fontWeight: 700, fontSize: 13, color: '#FFE14D' }}>10 niveaux · Plus tu es rapide = plus de points !</div>
      </div>
      <div style={{ padding: '0 16px', marginTop: 8 }}>
        <div style={FS.howCard}>
          {[['👁️','Regarde bien la cible'],['🔍','Cherche-la dans la grille'],['⚡','Touche-la vite pour des points !']].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#6B7280' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '20px 16px 0' }}>
        <button onClick={startGame} style={{ ...FS.btn, background: '#2EC4B6', boxShadow: '0 6px 16px rgba(46,196,182,.3)' }}>Commencer ! 🚀</button>
      </div>
    </div>
  );

  if (phase === 'win') return (
    <div style={{ ...FS.page, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 80 }}>🏆</div>
      <div style={{ fontWeight: 900, fontSize: 30, color: '#2EC4B6', margin: '12px 0 4px' }}>Terminé !</div>
      <div style={{ color: '#6B7280', fontSize: 15, marginBottom: 20 }}>Tu as trouvé tous les objets !</div>
      <div style={{ background: '#F0FBF9', borderRadius: 20, padding: '20px 32px', marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 40, color: '#FF6B35' }}>{totalPts} pts</div>
        <div style={{ fontWeight: 500, fontSize: 13, color: '#9CA3AF' }}>sur 100 maximum</div>
        <div style={{ fontWeight: 900, fontSize: 24, color: '#FF6B35', marginTop: 6 }}>+{totalPts}⭐</div>
      </div>
      <button onClick={startGame} style={{ ...FS.btn, background: '#2EC4B6', marginBottom: 10 }}>🔄 Rejouer</button>
      <button onClick={() => navigate({ to: '/games' })} style={FS.btnOut}>Menu des jeux</button>
    </div>
  );

  const rd = ROUNDS[round];
  const timerColor = elapsed < 5 ? '#4CAF50' : elapsed < 10 ? '#FFB347' : '#FF5252';
  return (
    <div style={FS.page}>
      <div style={FS.topBar}>
        <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setPhase('menu'); }} style={FS.backSm}>←</button>
        <div style={{ background: '#2EC4B6', color: 'white', borderRadius: 999, padding: '4px 14px', fontWeight: 700, fontSize: 13 }}>Niveau {round + 1}/{ROUNDS.length}</div>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#FF6B35' }}>{totalPts} pts</div>
      </div>
      <div style={{ margin: '10px 16px', background: 'white', borderRadius: 20, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 16px rgba(0,0,0,.06)' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 12, color: '#9CA3AF' }}>Tu cherches :</div>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#1A1A2E', marginTop: 2 }}>Le/La {rd.name}</div>
        </div>
        <div style={{ fontSize: 56, lineHeight: 1 }}>{rd.target}</div>
        <div style={{ background: elapsed < 5 ? '#E8F5E9' : elapsed < 10 ? '#FFF3E0' : '#FFEBEE', color: timerColor, borderRadius: 999, padding: '6px 12px', fontWeight: 900, fontSize: 20, minWidth: 50, textAlign: 'center' }}>{elapsed}s</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6, padding: '0 10px' }}>
        {grid.map((emoji, idx) => {
          const flash = flashIdx?.idx === idx;
          const ok = flashIdx?.ok;
          return (
            <button key={idx} onClick={() => tap(idx, emoji)} style={{
              aspectRatio: '1', borderRadius: 12, border: 'none',
              background: flash ? (ok ? '#4CAF50' : '#FF5252') : 'white',
              fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,.07)',
              transform: flash && ok ? 'scale(1.25)' : 'scale(1)',
              transition: 'transform 0.15s, background 0.15s', userSelect: 'none',
            }}>{emoji}</button>
          );
        })}
      </div>
    </div>
  );
}

const FS: Record<string, React.CSSProperties> = {
  page: { background: '#FFF9F0', minHeight: '100vh', maxWidth: 430, margin: '0 auto', fontFamily: 'Nunito, sans-serif', display: 'flex', flexDirection: 'column', paddingBottom: 20 },
  back: { background: 'none', border: 'none', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 16, color: '#2EC4B6', padding: '16px 20px', cursor: 'pointer', textAlign: 'left' },
  backSm: { background: 'none', border: 'none', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 20, color: '#6B7280', cursor: 'pointer' },
  topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,.05)' },
  hero: { margin: '0 16px 16px', borderRadius: 24, padding: 28, textAlign: 'center' },
  howCard: { background: 'white', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(0,0,0,.06)' },
  btn: { width: '100%', height: 52, borderRadius: 14, border: 'none', color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 16, cursor: 'pointer' },
  btnOut: { width: '100%', height: 48, background: 'white', borderRadius: 14, border: '1.5px solid #E5E7EB', color: '#6B7280', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
};