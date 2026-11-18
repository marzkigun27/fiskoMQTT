import React, { useEffect, useRef, useState } from 'react';

const VIEW_W = 460;
const VIEW_H = 460;
const CX = 230;
const CY = 230;
const RX = 60;
const RY = 162;

// Orbit angles in degrees: 0 (vertical), -60 (top-left <-> bottom-right), +60 (top-right <-> bottom-left)
const ORBIT_CONFIGS = [
  {
    id: 'orbit-vert',
    angleDeg: 0,
    angleRad: 0,
    initialPhase: 0.42,
    speed: 0.92,
    trailRgb: '59, 130, 246', // royal blue
  },
  {
    id: 'orbit-neg60',
    angleDeg: -60,
    angleRad: (-60 * Math.PI) / 180,
    initialPhase: -1.22,
    speed: 1.08,
    trailRgb: '56, 189, 248', // sky cyan
  },
  {
    id: 'orbit-pos60',
    angleDeg: 60,
    angleRad: (60 * Math.PI) / 180,
    initialPhase: 1.72,
    speed: 0.98,
    trailRgb: '96, 165, 250', // electric blue
  },
];

function getOrbitPoint(angleRad, t, scale = 1) {
  const lx = RX * scale * Math.cos(t);
  const ly = RY * scale * Math.sin(t);
  const cosA = Math.cos(angleRad);
  const sinA = Math.sin(angleRad);
  return {
    x: CX + lx * cosA - ly * sinA,
    y: CY + lx * sinA + ly * cosA,
  };
}

function createQuantumCloudParticles(count = 230) {
  const particles = [];
  const bluePalette = [
    '59, 130, 246', // royal blue
    '56, 189, 248', // sky cyan
    '96, 165, 250', // light blue
    '129, 140, 248', // indigo blue
  ];

  for (let i = 0; i < count; i++) {
    const isNucleus = i < 54;
    const hue = bluePalette[i % bluePalette.length];

    if (isNucleus) {
      const r = Math.pow(Math.random(), 0.65) * 52;
      const theta = Math.random() * Math.PI * 2;
      particles.push({
        type: 'nucleus',
        baseR: r,
        theta,
        speed: (Math.random() - 0.5) * 1.4,
        x: CX + Math.cos(theta) * r,
        y: CY + Math.sin(theta) * r,
        vx: 0,
        vy: 0,
        size: 1 + Math.random() * 2,
        alpha: 0.16 + Math.random() * 0.44,
        hue,
        phase: Math.random() * Math.PI * 2,
      });
    } else {
      const orbitIdx = i % ORBIT_CONFIGS.length;
      const orbit = ORBIT_CONFIGS[orbitIdx];
      const t = Math.random() * Math.PI * 2;
      // Gaussian-like spread around the orbital path to form an authentic electron cloud
      const spreadScale = 1 + (Math.random() - 0.5) * 0.36;
      const jitterX = (Math.random() - 0.5) * 16;
      const jitterY = (Math.random() - 0.5) * 16;
      const pos = getOrbitPoint(orbit.angleRad, t, spreadScale);
      particles.push({
        type: 'orbital',
        orbitIdx,
        t,
        tSpeed: (0.28 + Math.random() * 0.45) * (Math.random() > 0.15 ? 1 : -1),
        spreadScale,
        jitterX,
        jitterY,
        x: pos.x + jitterX,
        y: pos.y + jitterY,
        vx: 0,
        vy: 0,
        size: 0.95 + Math.random() * 1.75,
        alpha: 0.15 + Math.random() * 0.42,
        hue,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }
  return particles;
}

export default function InteractiveAtomLogo() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const electronRefs = useRef([]);
  const pointerRef = useRef({ x: CX, y: CY, active: false });
  const isHoveredRef = useRef(false);
  const energyRef = useRef(0);
  const pulsesRef = useRef([]);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [energyLevel, setEnergyLevel] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = VIEW_W * dpr;
    canvas.height = VIEW_H * dpr;
    ctx.scale(dpr, dpr);

    const particles = createQuantumCloudParticles(230);
    const phases = ORBIT_CONFIGS.map((o) => o.initialPhase);
    const trails = ORBIT_CONFIGS.map(() => []);
    let lastTime = performance.now();
    let rafId;

    const animate = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      energyRef.current = Math.max(0, energyRef.current - dt * 0.68);
      const hovered = isHoveredRef.current;
      const speedMultiplier = (hovered ? 1.35 : 1) + energyRef.current * 2.6;

      ctx.clearRect(0, 0, VIEW_W, VIEW_H);

      // Soft ambient blue radial aura centered around atom
      const auraRadius = 195 + energyRef.current * 34;
      const auraGrad = ctx.createRadialGradient(CX, CY, 10, CX, CY, auraRadius);
      auraGrad.addColorStop(0, `rgba(59, 130, 246, ${0.18 + energyRef.current * 0.16})`);
      auraGrad.addColorStop(0.48, `rgba(37, 99, 235, ${0.11 + energyRef.current * 0.08})`);
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(CX, CY, auraRadius, 0, Math.PI * 2);
      ctx.fill();

      // Expanding quantum shockwave pulses on click
      for (let i = pulsesRef.current.length - 1; i >= 0; i--) {
        const pulse = pulsesRef.current[i];
        pulse.radius += dt * 210;
        pulse.alpha -= dt * 0.92;
        if (pulse.alpha <= 0 || pulse.radius > 220) {
          pulsesRef.current.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.strokeStyle = `rgba(96, 165, 250, ${pulse.alpha * 0.72})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(56, 189, 248, ${pulse.alpha * 0.48})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius * 0.72, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Update electron orbital positions + blue comet trails
      const electronPositions = ORBIT_CONFIGS.map((orbit, idx) => {
        phases[idx] += dt * orbit.speed * speedMultiplier;
        const pos = getOrbitPoint(orbit.angleRad, phases[idx], 1);

        const trail = trails[idx];
        trail.push({ x: pos.x, y: pos.y });
        if (trail.length > 18) trail.shift();

        for (let j = 1; j < trail.length; j++) {
          const ratio = j / trail.length;
          ctx.strokeStyle = `rgba(${orbit.trailRgb}, ${ratio * (0.34 + energyRef.current * 0.34)})`;
          ctx.lineWidth = ratio * 4.4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(trail[j - 1].x, trail[j - 1].y);
          ctx.lineTo(trail[j].x, trail[j].y);
          ctx.stroke();
        }

        const elNode = electronRefs.current[idx];
        if (elNode) {
          elNode.setAttribute('cx', pos.x.toFixed(2));
          elNode.setAttribute('cy', pos.y.toFixed(2));
        }

        return pos;
      });

      // Update & render quantum cloud particles
      const pointer = pointerRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.phase += dt * 3;
        let targetX;
        let targetY;

        if (p.type === 'nucleus') {
          p.theta += dt * p.speed * (1 + energyRef.current * 2);
          const breathe = 1 + Math.sin(p.phase) * 0.14 + energyRef.current * 0.45;
          targetX = CX + Math.cos(p.theta) * p.baseR * breathe;
          targetY = CY + Math.sin(p.theta) * p.baseR * breathe;
        } else {
          const orbit = ORBIT_CONFIGS[p.orbitIdx];
          p.t += dt * p.tSpeed * speedMultiplier;
          const dynamicSpread = p.spreadScale + energyRef.current * 0.14 * Math.sin(p.phase);
          const pos = getOrbitPoint(orbit.angleRad, p.t, dynamicSpread);
          targetX = pos.x + p.jitterX;
          targetY = pos.y + p.jitterY;
        }

        p.vx += (targetX - p.x) * 0.08;
        p.vy += (targetY - p.y) * 0.08;

        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 9500 && distSq > 4) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 98) * 1.5;
            p.vx += (dx / dist) * force * 0.55 - (dy / dist) * force * 0.9;
            p.vy += (dy / dist) * force * 0.55 + (dx / dist) * force * 0.9;
          }
        }

        p.vx *= 0.84;
        p.vy *= 0.84;
        p.x += p.vx;
        p.y += p.vy;

        const twinkle = 0.65 + 0.35 * Math.sin(p.phase * 1.3);
        const alpha = Math.min(0.95, p.alpha * twinkle * (1 + energyRef.current * 0.7));

        ctx.fillStyle = `rgba(${p.hue}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + energyRef.current * 0.25), 0, Math.PI * 2);
        ctx.fill();
      }

      // Quantum entanglement field lines between pointer and electrons
      if (pointer.active) {
        electronPositions.forEach((ep) => {
          const dx = pointer.x - ep.x;
          const dy = pointer.y - ep.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 190) {
            const lineAlpha = (1 - dist / 190) * 0.42;
            ctx.strokeStyle = `rgba(96, 165, 250, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 4]);
            ctx.beginPath();
            ctx.moveTo(ep.x, ep.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handlePointerMove = (clientX, clientY) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (clientX - rect.left) / rect.width;
    const ny = (clientY - rect.top) / rect.height;

    pointerRef.current = {
      x: nx * VIEW_W,
      y: ny * VIEW_H,
      active: true,
    };

    setTilt({
      rx: (0.5 - ny) * 14,
      ry: (nx - 0.5) * 16,
    });
  };

  const handlePointerLeave = () => {
    pointerRef.current.active = false;
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
  };

  const handleExcite = (clientX, clientY) => {
    const el = containerRef.current;
    let px = CX;
    let py = CY;
    if (el && typeof clientX === 'number' && typeof clientY === 'number') {
      const rect = el.getBoundingClientRect();
      px = ((clientX - rect.left) / rect.width) * VIEW_W;
      py = ((clientY - rect.top) / rect.height) * VIEW_H;
    }
    energyRef.current = 1;
    pulsesRef.current.push({ x: px, y: py, radius: 12, alpha: 0.95 });
    setEnergyLevel((prev) => (prev % 3) + 1);
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <div
        ref={containerRef}
        role="button"
        tabIndex={0}
        aria-label="Logo interaktif simulasi atom cloud biru - klik untuk mengaktifkan pulsa kuantum"
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseLeave={handlePointerLeave}
        onClick={(e) => handleExcite(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          setIsHovered(true);
          if (e.touches[0]) {
            handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
            handleExcite(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchMove={(e) => {
          if (e.touches[0]) {
            handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchEnd={handlePointerLeave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleExcite();
          }
        }}
        className="group relative aspect-square w-[330px] sm:w-[420px] md:w-[500px] cursor-pointer outline-none"
        style={{
          transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${isHovered ? 1.02 : 1})`,
          transition: isHovered ? 'transform 120ms ease-out' : 'transform 450ms ease-out',
        }}
      >
        {/* Minimal status pill positioned at top-center so center headline overlaps cleanly */}
        <div
          className={`pointer-events-none absolute top-2 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-blue-400/20 bg-blue-500/[0.07] px-3 py-1 text-[10px] sm:text-[11px] font-mono tracking-wider text-blue-200/85 backdrop-blur-md transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-65 translate-y-0.5'
          }`}
        >
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
          ATOM CLOUD · n={energyLevel} · Klik untuk eksitasi
        </div>

        {/* Canvas Quantum Probability Cloud Layer with soft radial edge mask */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.45) 78%, rgba(0,0,0,0) 98%)',
            maskImage:
              'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.45) 78%, rgba(0,0,0,0) 98%)',
          }}
        />

        {/* Symmetrical Blue Atom Orbits & Orbiting Hollow Electron Rings */}
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="relative z-10 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="atom-blue-orbit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <filter id="comics-atom-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Subtle glowing blue nucleus center core */}
          <circle
            cx={CX}
            cy={CY}
            r={isHovered ? 8.5 : 6.5}
            fill="#38BDF8"
            opacity="0.28"
            filter="url(#comics-atom-glow)"
          />

          {/* 3 Symmetrical Intersecting Elliptical Blue Atom Orbits */}
          <g filter="url(#comics-atom-glow)">
            {ORBIT_CONFIGS.map((orbit) => (
              <ellipse
                key={orbit.id}
                cx={CX}
                cy={CY}
                rx={RX}
                ry={RY}
                transform={`rotate(${orbit.angleDeg} ${CX} ${CY})`}
                fill="none"
                stroke="url(#atom-blue-orbit)"
                strokeWidth="4.6"
                strokeOpacity="0.88"
              />
            ))}

            {/* 3 Hollow-centered Electric Blue Electron Rings orbiting dynamically */}
            {ORBIT_CONFIGS.map((orbit, idx) => {
              const p = getOrbitPoint(orbit.angleRad, orbit.initialPhase, 1);
              return (
                <circle
                  key={`${orbit.id}-electron`}
                  ref={(node) => {
                    electronRefs.current[idx] = node;
                  }}
                  cx={p.x}
                  cy={p.y}
                  r="12"
                  fill="#050814"
                  stroke="#60A5FA"
                  strokeWidth="5.4"
                />
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
