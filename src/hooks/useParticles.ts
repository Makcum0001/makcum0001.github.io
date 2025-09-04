import { useState, useCallback, useRef } from 'react';
import { nanoid } from '../utils/nanoid';

const PARTICLE_FADE_START = 2300;
const PARTICLE_FADE_DURATION = 600;
const PARTICLE_MAX_LIFE = PARTICLE_FADE_START + PARTICLE_FADE_DURATION;
const MAX_PARTICLES = 800;

interface Burst25 {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  vr: number;
  font: number;
  born: number;
  color: string;
}

interface MiniFirework {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  vr: number;
  size: number;
  born: number;
  color: string;
}

export function useParticles() {
  const [bursts, setBursts] = useState<Burst25[]>([]);
  const [miniFireworks, setMiniFireworks] = useState<MiniFirework[]>([]);
  const burstsRef = useRef<Burst25[]>([]);
  const miniFireworksRef = useRef<MiniFirework[]>([]);
  const rafRef = useRef<number | null>(null);

  const startLoop = useCallback(() => {
    let last = performance.now();
    const drag = 0.05;
    const maxLife = PARTICLE_MAX_LIFE;
    const step = () => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      let changed = false;

      burstsRef.current = burstsRef.current.filter(b => {
        const life = now - b.born;
        if (life > maxLife) return false;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.vx *= 1 - drag * dt;
        b.r += b.vr * dt;
        changed = true;
        return b.y <= window.scrollY + window.innerHeight + 120;
      });

      miniFireworksRef.current = miniFireworksRef.current.filter(m => {
        const life = now - m.born;
        if (life > maxLife) return false;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.vx *= 1 - drag * 0.5 * dt;
        m.r += m.vr * dt;
        changed = true;
        return m.y <= window.scrollY + window.innerHeight + 120;
      });

      if (changed) {
        setBursts([...burstsRef.current]);
        setMiniFireworks([...miniFireworksRef.current]);
      }
      if (burstsRef.current.length || miniFireworksRef.current.length) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  const spawn25 = useCallback(() => {
    const count = 60;
    const now = performance.now();
    const palette = ['rgb(255,0,43)','rgb(228,0,43)','rgba(255,0,43,0.75)','rgba(228,0,43,0.65)'];
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const batch: Burst25[] = Array.from({ length: count }, () => ({
      id: nanoid(),
      x: Math.random() * vw,
      y: window.scrollY + Math.random() * vh,
      vx: (Math.random() * 2 - 1) * 25,
      vy: 50 + Math.random() * 120,
      r: Math.random() * 360,
      vr: (Math.random() * 2 - 1) * 60,
      font: 24 + Math.random() * 60,
      born: now,
      color: palette[Math.floor(Math.random() * palette.length)],
    }));

    const miniCount = count * 3;
    const miniStars: MiniFirework[] = Array.from({ length: miniCount }, () => ({
      id: nanoid(),
      x: Math.random() * vw,
      y: window.scrollY + Math.random() * vh,
      vx: (Math.random() * 2 - 1) * 60,
      vy: 30 + Math.random() * 80,
      r: Math.random() * 360,
      vr: (Math.random() * 2 - 1) * 180,
      size: 8 + Math.random() * 16,
      born: now,
      color: palette[Math.floor(Math.random() * palette.length)],
    }));

    burstsRef.current = [...burstsRef.current, ...batch].slice(-MAX_PARTICLES);
    miniFireworksRef.current = [...miniFireworksRef.current, ...miniStars].slice(-MAX_PARTICLES * 2);

    setBursts(burstsRef.current);
    setMiniFireworks(miniFireworksRef.current);
    if (rafRef.current == null) startLoop();
  }, [startLoop]);

  return { bursts, miniFireworks, spawn25, PARTICLE_FADE_START, PARTICLE_FADE_DURATION };
}
