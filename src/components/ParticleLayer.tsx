import React from 'react';

interface Burst25 {
  id: string;
  x: number;
  y: number;
  r: number;
  font: number;
  born: number;
  color: string;
}

interface MiniFirework {
  id: string;
  x: number;
  y: number;
  r: number;
  size: number;
  born: number;
  color: string;
}

interface ParticleLayerProps {
  bursts: Burst25[];
  miniFireworks: MiniFirework[];
  fadeStart: number;
  fadeDuration: number;
}

const ParticleLayer: React.FC<ParticleLayerProps> = ({ bursts, miniFireworks, fadeStart, fadeDuration }) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {bursts.map(b => {
        const life = performance.now() - b.born;
        const opacity = life < 120
          ? life / 120
          : life > fadeStart
            ? Math.max(0, 1 - (life - fadeStart) / fadeDuration)
            : 1;
        const norm = Math.min(1, life / 900);
        const easeOut = 1 - Math.pow(1 - norm, 3);
        let scale = 0.4 + easeOut * 0.8;
        if (life > fadeStart) scale *= 0.9;
        return (
          <div
            key={b.id}
            className="font-black select-none"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: `translate(${b.x}px, ${b.y}px) translate(-50%, -50%) rotate(${Math.round(b.r)}deg) scale(${scale.toFixed(3)})`,
              fontSize: b.font,
              opacity,
              color: b.color,
              textShadow: `0 0 4px ${b.color}55, 0 0 10px ${b.color}55, 0 2px 4px rgba(0,0,0,.25)`,
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.25))',
              willChange: 'transform, opacity'
            }}
          >
            25
          </div>
        );
      })}
      {miniFireworks.map(m => {
        const life = performance.now() - m.born;
        const opacity = life < 100
          ? life / 100
          : life > fadeStart
            ? Math.max(0, 1 - (life - fadeStart) / fadeDuration)
            : 1;
        const norm = Math.min(1, life / 600);
        const easeOut = 1 - Math.pow(1 - norm, 2);
        let scale = 0.3 + easeOut * 0.7;
        if (life > fadeStart) scale *= 0.8;
        return (
          <div
            key={m.id}
            className="font-bold select-none"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: `translate(${m.x}px, ${m.y}px) translate(-50%, -50%) rotate(${Math.round(m.r)}deg) scale(${scale.toFixed(3)})`,
              fontSize: m.size,
              opacity,
              color: m.color,
              textShadow: `0 0 2px ${m.color}77, 0 0 6px ${m.color}44`,
              filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))',
              willChange: 'transform, opacity'
            }}
          >
            ✦
          </div>
        );
      })}
    </div>
  );
};

export default ParticleLayer;
