import React, { useState, useEffect, useMemo } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/games/quiz')({ component: QuizGame });

const BANK = [
  { cat:'🔤', q:'Quelle lettre vient après D ?', opts:['C','E','F','B'], ans:1 },
  { cat:'🔤', q:"Quel animal commence par L ?", opts:['Éléphant','Bateau','Lion','Girafe'], ans:2 },
  { cat:'🔤', q:"Combien de lettres dans l'alphabet ?", opts:['24','25','26','28'], ans:2 },
  { cat:'🔤', q:"Quelle est la 1ère lettre de l'alphabet ?", opts:['Z','M','A','E'], ans:2 },
  { cat:'🔤', q:'Quel mot commence par E ?', opts:['Lion','Girafe','Éléphant','Zèbre'], ans:2 },
  { cat:'🔢', q:'Combien font 3 + 4 ?', opts:['6','7','8','5'], ans:1 },
  { cat:'🔢', q:'Combien font 10 - 3 ?', opts:['6','8','7','9'], ans:2 },
  { cat:'🔢', q:'Quel chiffre vient après 9 ?', opts:['11','10','12','8'], ans:1 },
  { cat:'🔢', q:'Combien de pattes a un lion ?', opts:['2','6','4','8'], ans:2 },
  { cat:'🔢', q:'Combien font 2 × 5 ?', opts:['8','10','7','12'], ans:1 },
  { cat:'🍎', q:'Quel fruit est 🥭 ?', opts:['Banane','Mangue','Orange','Citron'], ans:1 },
  { cat:'🍎', q:'Quel fruit est jaune et long ?', opts:['Pomme','Raisin','Banane','Pêche'], ans:2 },
  { cat:'🍎', q:'De quelle couleur est une 🍊 ?', opts:['Rouge','Vert','Orange','Jaune'], ans:2 },
  { cat:'🦁', q:'Quel animal est le roi de la savane ?', opts:['Éléphant','Girafe','Lion','Zèbre'], ans:2 },
  { cat:'🦁', q:'Quel animal a le plus long cou ?', opts:['Éléphant','Girafe','Hippo','Rhino'], ans:1 },
];

function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const TOTAL = 10;
const TIME = 10;

function QuizGame() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'menu'|'play'|'win'>('menu');
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => shuffle(BANK).slice(0, TOTAL), [seed]);
  const [qIdx, setQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME);
  const [selected, setSelected] = useState<number|null>(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);

  useEffect(() => {
    if (phase !== 'play') return;
    if (selected !== null) return;
    if (timeLeft <= 0) { answer(-1); return; }
    const t = setTimeout(() => setTimeLeft((tl) => tl - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase, selected]);

  useEffect(() => {
    if (phase === 'play') { setTimeLeft(TIME); setSelected(null); }
  }, [qIdx, phase]);

  function startGame() {
    setSeed((s) => s + 1);
    setQIdx(0); setScore(0); setResults([]); setSelected(null); setTimeLeft(TIME);
    setPhase('play');
  }

  function answer(optIdx: number) {
    if (selected !== null) return;
    setSelected(optIdx);
    const ok = optIdx === questions[qIdx].ans;
    if (ok) setScore((s) => s + 2);
    setResults((r) => [...r, ok]);
    setTimeout(() => {
      if (qIdx >= TOTAL - 1) setPhase('win');
      else setQIdx((i) => i + 1);
    }, 1400);
  }

  const timerColor = timeLeft > 6 ? '#4CAF50' : timeLeft > 3 ? '#FFB347' : '#FF5252';
  const circumference = 2 * Math.PI * 38;

  if (phase === 'menu') return (
    <div style={QS.page}>
      <button onClick={() => navigate({ to: '/games' })} style={QS.back}>← Retour</button>
      <div style={{ ...QS.hero, background: 'linear-gradient(135deg,#FFB347,#FFDAC1)' }}>
        <div style={{ fontSize: 56 }}>⏱️</div>
        <div style={{ fontWeight: 900, fontSize: 24, marginTop: 8, color: 'white' }}>Chrono Quiz</div>
        <div style={{ fontWeight: 500, fontSize: 14, opacity: 0.9, marginTop: 4, color: 'white' }}>{TOTAL} questions · {TIME} secondes chacune !</div>
      </div>
      <div style={{ padding: '0 16px' }}>
        <div style={QS.howCard}>
          {[['⏰',`${TIME} secondes par question`],['✅','2 points par bonne réponse'],['🏆',`${TOTAL} questions au total`]].map(([i,t]) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{i}</span>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#6B7280' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '20px 16px 0' }}>
        <button onClick={startGame} style={{ ...QS.btn, background: '#FFB347', boxShadow: '0 6px 16px rgba(255,179,71,.3)' }}>Commencer ! 🚀</button>
      </div>
    </div>
  );

  if (phase === 'win') {
    const pct = Math.round((score / (TOTAL * 2)) * 100);
    const label = pct >= 80 ? '🎯 GÉNIAL !' : pct >= 60 ? '🏆 EXCELLENT !' : pct >= 40 ? '⭐ BIEN JOUÉ !' : '💪 CONTINUE !';
    return (
      <div style={{ ...QS.page, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 80 }}>🏆</div>
        <div style={{ fontWeight: 900, fontSize: 28, color: '#FFB347', margin: '12px 0 4px' }}>{label}</div>
        <div style={{ color: '#6B7280', fontSize: 15, marginBottom: 20 }}>{results.filter(Boolean).length}/{TOTAL} bonnes réponses</div>
        <div style={{ background: '#FFF3E0', borderRadius: 20, padding: '20px 32px', marginBottom: 20, textAlign: 'center' }}>
          <div style={{ fontWeight: 900, fontSize: 40, color: '#FF6B35' }}>{score} pts</div>
          <div style={{ fontWeight: 900, fontSize: 24, color: '#FF6B35', marginTop: 4 }}>+{score * 2}⭐</div>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 10, flexWrap: 'wrap' }}>
            {results.map((ok, i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: ok ? '#4CAF50' : '#FF5252' }} />
            ))}
          </div>
        </div>
        <button onClick={startGame} style={{ ...QS.btn, background: '#FFB347', marginBottom: 10 }}>🔄 Rejouer</button>
        <button onClick={() => navigate({ to: '/games' })} style={QS.btnOut}>Menu des jeux</button>
      </div>
    );
  }

  const q = questions[qIdx];
  return (
    <div style={QS.page}>
      <div style={QS.topBar}>
        <button onClick={() => navigate({ to: '/games' })} style={QS.backSm}>←</button>
        <div style={{ background: '#FFF0E8', borderRadius: 999, padding: '4px 14px', fontWeight: 700, fontSize: 13, color: '#FF6B35' }}>{qIdx + 1}/{TOTAL}</div>
        <div style={{ fontWeight: 800, fontSize: 14, color: '#FF6B35' }}>{score} pts</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r="38" fill="none" stroke="#F3F4F6" strokeWidth="7" />
          <circle cx="44" cy="44" r="38" fill="none" stroke={timerColor} strokeWidth="7"
            strokeDasharray={circumference} strokeDashoffset={circumference * (1 - timeLeft / TIME)}
            strokeLinecap="round" transform="rotate(-90 44 44)"
            style={{ transition: 'stroke-dashoffset 0.8s linear, stroke 0.3s' }} />
          <text x="44" y="51" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="26" fill={timerColor}>{timeLeft}</text>
        </svg>
      </div>
      <div style={{ margin: '10px 16px', background: 'white', borderRadius: 24, padding: 20, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,.08)' }}>
        <div style={{ background: '#F3F4F6', display: 'inline-block', borderRadius: 999, padding: '3px 12px', fontWeight: 700, fontSize: 12, color: '#6B7280', marginBottom: 10 }}>{q.cat}</div>
        <div style={{ fontWeight: 800, fontSize: 18, color: '#1A1A2E', lineHeight: 1.4 }}>{q.q}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 16px' }}>
        {q.opts.map((opt, i) => {
          const isSel = selected === i;
          const isCorrect = i === q.ans;
          const bg = selected !== null
            ? isCorrect ? '#4CAF50' : isSel ? '#FF5252' : 'white'
            : 'white';
          const color = selected !== null && (isCorrect || isSel) ? 'white' : '#1A1A2E';
          return (
            <button key={i} onClick={() => answer(i)} disabled={selected !== null} style={{
              height: 58, borderRadius: 14,
              border: `1.5px solid ${selected !== null ? (isCorrect ? '#4CAF50' : isSel ? '#FF5252' : '#E5E7EB') : '#E5E7EB'}`,
              background: bg, color, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px',
              cursor: selected !== null ? 'default' : 'pointer', fontFamily: 'Nunito, sans-serif',
              transition: 'background 0.2s, border-color 0.2s', userSelect: 'none',
            }}>
              <span style={{ fontWeight: 800, fontSize: 13, color: selected !== null && (isCorrect || isSel) ? 'rgba(255,255,255,.7)' : '#9CA3AF', minWidth: 18 }}>{['A','B','C','D'][i]}.</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{opt}</span>
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i < results.length ? (results[i] ? '#4CAF50' : '#FF5252') : i === qIdx ? '#FFB347' : '#E5E7EB' }} />
        ))}
      </div>
    </div>
  );
}

const QS: Record<string, React.CSSProperties> = {
  page: { background: '#FFF9F0', minHeight: '100vh', maxWidth: 430, margin: '0 auto', fontFamily: 'Nunito, sans-serif', display: 'flex', flexDirection: 'column', paddingBottom: 20 },
  back: { background: 'none', border: 'none', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 16, color: '#FFB347', padding: '16px 20px', cursor: 'pointer', textAlign: 'left' },
  backSm: { background: 'none', border: 'none', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 20, color: '#6B7280', cursor: 'pointer' },
  topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,.05)' },
  hero: { margin: '0 16px 16px', borderRadius: 24, padding: 28, textAlign: 'center' },
  howCard: { background: 'white', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(0,0,0,.06)' },
  btn: { width: '100%', height: 52, borderRadius: 14, border: 'none', color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 16, cursor: 'pointer' },
  btnOut: { width: '100%', height: 48, background: 'white', borderRadius: 14, border: '1.5px solid #E5E7EB', color: '#6B7280', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
};