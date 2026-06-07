import React, { useState, useEffect, useRef } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/games/memory')({ component: MemoryGame });

const PAIRS = [
  { emoji: '🦁', word: 'Lion' },
  { emoji: '🐘', word: 'Éléphant' },
  { emoji: '🍎', word: 'Pomme' },
  { emoji: '🍌', word: 'Banane' },
  { emoji: '⭐', word: 'Étoile' },
  { emoji: '🦋', word: 'Papillon' },
  { emoji: '🌙', word: 'Lune' },
  { emoji: '🐬', word: 'Dauphin' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Card = { id: number; pairId: number; emoji: string; word: string };

function MemoryGame() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'menu' | 'play' | 'win'>('menu');
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startGame(pairCount: number) {
    const pool = shuffle(PAIRS).slice(0, pairCount);
    const deck: Card[] = [];
    pool.forEach((p, pid) => {
      deck.push({ id: pid * 2, pairId: pid, ...p });
      deck.push({ id: pid * 2 + 1, pairId: pid, ...p });
    });
    setCards(shuffle(deck));
    setFlipped([]); setMatched([]); setMoves(0); setSeconds(0); setLock(false);
    setPhase('play');
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }

  function tapCard(id: number) {
    if (lock || matched.includes(id) || flipped.includes(id) || flipped.length >= 2) return;
    const next = [...flipped, id];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      setLock(true);
      const [a, b] = next;
      const ca = cards.find((c) => c.id === a)!;
      const cb = cards.find((c) => c.id === b)!;
      if (ca.pairId === cb.pairId) {
        const nm = [...matched, a, b];
        setTimeout(() => {
          setMatched(nm); setFlipped([]); setLock(false);
          if (nm.length === cards.length) {
            if (timerRef.current) clearInterval(timerRef.current);
            setPhase('win');
          }
        }, 500);
      } else {
        setTimeout(() => { setFlipped([]); setLock(false); }, 900);
      }
    }
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const stars = Math.max(3, 16 - Math.floor(moves / 2));

  if (phase === 'menu') {
    return (
      <div style={S.page}>
        <button onClick={() => navigate({ to: '/games' })} style={S.back}>← Retour</button>
        <div style={{ ...S.hero, background: 'linear-gradient(135deg,#FF6B35,#FFB347)' }}>
          <div style={S.heroIcon}>🧠</div>
          <div style={S.heroTitle}>Memory</div>
          <div style={S.heroSub}>Retourne 2 cartes et trouve les paires identiques !</div>
        </div>
        <div style={S.section}>
          <div style={S.label}>Choisis la difficulté :</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: '🟢 Facile', pairs: 4, note: '4 paires' },
              { label: '🟡 Moyen', pairs: 6, note: '6 paires' },
              { label: '🔴 Difficile', pairs: 8, note: '8 paires' },
            ].map((d) => (
              <button key={d.label} onClick={() => startGame(d.pairs)} style={S.diffBtn}>
                <div style={{ fontWeight: 800, fontSize: 13 }}>{d.label}</div>
                <div style={{ fontWeight: 500, fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{d.note}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'win') {
    return (
      <div style={{ ...S.page, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 80 }}>🎉</div>
        <div style={{ fontWeight: 900, fontSize: 32, color: '#FF6B35', margin: '12px 0 4px' }}>Bravo !</div>
        <div style={{ color: '#6B7280', fontSize: 15, marginBottom: 20 }}>Tu as trouvé toutes les paires !</div>
        <div style={S.winCard}>
          <div style={S.stat}><span style={S.statNum}>{moves}</span><span style={S.statLbl}>coups</span></div>
          <div style={S.stat}><span style={S.statNum}>{seconds}s</span><span style={S.statLbl}>temps</span></div>
          <div style={S.stat}><span style={{ ...S.statNum, color: '#FF6B35' }}>+{stars}⭐</span><span style={S.statLbl}>étoiles</span></div>
        </div>
        <button onClick={() => startGame(cards.length / 2)} style={S.btn}>🔄 Rejouer</button>
        <button onClick={() => navigate({ to: '/games' })} style={S.btnOutline}>Menu des jeux</button>
      </div>
    );
  }

  const cols = 4;
  return (
    <div style={S.page}>
      <div style={S.statsBar}>
        <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setPhase('menu'); }} style={S.backSm}>←</button>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#1A1A2E' }}>⚡ {moves} coups</span>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#9CA3AF' }}>⏱ {seconds}s</span>
        <span style={{ fontWeight: 700, fontSize: 13, color: '#FF6B35' }}>{matched.length / 2}/{cards.length / 2} paires</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8, padding: 16 }}>
        {cards.map((card) => {
          const faceUp = flipped.includes(card.id) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);
          return (
            <div key={card.id} onClick={() => tapCard(card.id)} style={{
              aspectRatio: '1', borderRadius: 14, cursor: faceUp ? 'default' : 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: faceUp ? isMatched ? '#E8F5E9' : 'white' : 'linear-gradient(135deg,#FF6B35,#FFB347)',
              border: isMatched ? '2px solid #4CAF50' : '2px solid #F3F4F6',
              boxShadow: '0 3px 10px rgba(0,0,0,.08)', transition: 'background 0.25s', userSelect: 'none',
            }}>
              {faceUp ? (
                <>
                  <span style={{ fontSize: 28 }}>{card.emoji}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: isMatched ? '#4CAF50' : '#9CA3AF', marginTop: 2 }}>{card.word}</span>
                </>
              ) : (
                <span style={{ fontWeight: 900, fontSize: 18, color: 'rgba(255,255,255,.5)' }}>?</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: { background: '#FFF9F0', minHeight: '100vh', maxWidth: 430, margin: '0 auto', fontFamily: 'Nunito, sans-serif', display: 'flex', flexDirection: 'column', paddingBottom: 20 },
  back: { background: 'none', border: 'none', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 16, color: '#FF6B35', padding: '16px 20px', cursor: 'pointer', textAlign: 'left' },
  backSm: { background: 'none', border: 'none', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 20, color: '#6B7280', cursor: 'pointer' },
  hero: { margin: '0 16px 16px', borderRadius: 24, padding: 28, textAlign: 'center', color: 'white' },
  heroIcon: { fontSize: 56 },
  heroTitle: { fontWeight: 900, fontSize: 26, marginTop: 8 },
  heroSub: { fontWeight: 500, fontSize: 14, opacity: 0.85, marginTop: 4 },
  section: { padding: '0 16px', marginTop: 8 },
  label: { fontWeight: 800, fontSize: 17, color: '#1A1A2E', marginBottom: 12 },
  diffBtn: { flex: 1, padding: '14px 8px', borderRadius: 16, border: '2px solid #E5E7EB', background: 'white', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', textAlign: 'center' },
  statsBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,.06)' },
  winCard: { background: '#FFF0E8', borderRadius: 20, padding: '18px 28px', marginBottom: 20, display: 'flex', gap: 24 },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { fontWeight: 900, fontSize: 28, color: '#1A1A2E' },
  statLbl: { fontWeight: 500, fontSize: 12, color: '#9CA3AF' },
  btn: { width: '100%', height: 52, background: '#FF6B35', borderRadius: 14, border: 'none', color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 16, cursor: 'pointer', marginBottom: 10 },
  btnOutline: { width: '100%', height: 48, background: 'white', borderRadius: 14, border: '1.5px solid #E5E7EB', color: '#6B7280', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
};