"use client";

import { useEffect, useRef } from "react";

type Vec3 = [number, number, number];

interface RingConfig {
  radius: number;
  tube: number;
  baseColor: [number, number, number];
  highlightColor: [number, number, number];
  darkColor: [number, number, number];
  initRx: number;
  initRy: number;
  initRz: number;
  spinAxis: "x" | "y" | "z";
  spinSpeed: number;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  phase: number;
}

interface RingSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  z: number;
  w: number;
  color: string;
}

function rotateX(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c];
}

function rotateY(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
}

function rotateZ(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function mixRgb(
  c1: [number, number, number],
  c2: [number, number, number],
  t: number
): string {
  const clamped = Math.max(0, Math.min(1, t));
  const r = Math.round(lerp(c1[0], c2[0], clamped));
  const g = Math.round(lerp(c1[1], c2[1], clamped));
  const b = Math.round(lerp(c1[2], c2[2], clamped));
  return `rgb(${r},${g},${b})`;
}

// Deterministic particle seed so SSR/CSR initial state never produces layout jumps
function createParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    // Golden-angle / pseudo-hash distribution across a spherical shell & bounding volume
    const s1 = Math.sin(i * 12.9898 + 1.23) * 43758.5453;
    const s2 = Math.sin(i * 78.233 + 4.56) * 43758.5453;
    const s3 = Math.sin(i * 39.425 + 7.89) * 43758.5453;
    const u = s1 - Math.floor(s1);
    const v = s2 - Math.floor(s2);
    const w = s3 - Math.floor(s3);
    particles.push({
      x: (u - 0.5) * 7.4,
      y: (v - 0.5) * 7.4,
      z: (w - 0.5) * 6.8,
      size: 1.1 + (i % 3) * 0.45,
      phase: (i / count) * Math.PI * 2,
    });
  }
  return particles;
}

const RINGS: RingConfig[] = [
  {
    radius: 1.82,
    tube: 0.085,
    baseColor: [16, 185, 129], // #10b981
    highlightColor: [111, 251, 190], // #6ffbbe
    darkColor: [4, 78, 54],
    initRx: Math.PI / 3,
    initRy: 0,
    initRz: 0,
    spinAxis: "z",
    spinSpeed: 0.012,
  },
  {
    radius: 2.32,
    tube: 0.055,
    baseColor: [6, 182, 212], // #06b6d4
    highlightColor: [104, 252, 191], // #68fcbf
    darkColor: [8, 76, 97],
    initRx: 0.25,
    initRy: Math.PI / 4,
    initRz: 0,
    spinAxis: "x",
    spinSpeed: -0.015,
  },
  {
    radius: 2.82,
    tube: 0.044,
    baseColor: [52, 211, 153], // #34d399
    highlightColor: [167, 243, 208],
    darkColor: [6, 95, 70],
    initRx: -0.2,
    initRy: 0.15,
    initRz: Math.PI / 6,
    spinAxis: "y",
    spinSpeed: 0.009,
  },
];

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = container.clientWidth || 560;
    let height = container.clientHeight || 500;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = container.clientWidth || 560;
      height = container.clientHeight || 500;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const particles = createParticles(70);

    let mouseX = 0;
    let mouseY = 0;
    const handlePointerMove = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    let groupY = 0.2;
    let groupX = 0.12;
    const ringAngles = [0, 0, 0];
    const startTime = performance.now();
    let rafId = 0;

    const LIGHT_DIR: Vec3 = [0.62, 0.62, 0.48];
    const RING_STEPS = 96;

    const drawFrame = (now: number) => {
      const elapsedTime = (now - startTime) * 0.001;
      const dtScale = reducedMotion ? 0 : 1;

      const targetX = mouseX * 0.4;
      const targetY = mouseY * 0.4;

      if (!reducedMotion) {
        groupY += 0.008;
        groupX += 0.004;
        ringAngles[0] += RINGS[0].spinSpeed;
        ringAngles[1] += RINGS[1].spinSpeed;
        ringAngles[2] += RINGS[2].spinSpeed;
      }

      groupY += (targetX - groupY) * 0.05 * dtScale;
      groupX += (-targetY - groupX) * 0.05 * dtScale;

      ctx.clearRect(0, 0, width, height);

      const minDim = Math.min(width, height);
      const camZ = 8;
      // Scale focal length cleanly for both tall mobile frames and wide desktop panes
      const fovHalf = (22.5 * Math.PI) / 180;
      const baseScale = minDim / (2 * Math.tan(fovHalf));
      const focal = baseScale * 0.94;
      const cx = width / 2;
      const cy = height / 2;

      const project = (p: Vec3) => {
        const depth = Math.max(camZ - p[2], 1.2);
        const factor = focal / depth;
        return {
          sx: cx + p[0] * factor,
          sy: cy - p[1] * factor,
          factor,
          z: p[2],
        };
      };

      const transformCorePoint = (v: Vec3): Vec3 => {
        let p = rotateX(v, groupX);
        p = rotateY(p, groupY);
        return p;
      };

      // Build ring segments & split back (z < 0) vs front (z >= 0) relative to core orb center
      const backSegments: RingSegment[] = [];
      const frontSegments: RingSegment[] = [];

      RINGS.forEach((ring, rIdx) => {
        const extra = ringAngles[rIdx];
        const pts: { sx: number; sy: number; factor: number; z: number; world: Vec3 }[] =
          [];

        for (let i = 0; i <= RING_STEPS; i++) {
          const theta = (i / RING_STEPS) * Math.PI * 2;
          let p: Vec3 = [
            Math.cos(theta) * ring.radius,
            Math.sin(theta) * ring.radius,
            0,
          ];

          if (ring.spinAxis === "z") p = rotateZ(p, extra);
          if (ring.spinAxis === "x") p = rotateX(p, extra);
          if (ring.spinAxis === "y") p = rotateY(p, extra);

          p = rotateX(p, ring.initRx);
          p = rotateY(p, ring.initRy);
          p = rotateZ(p, ring.initRz);
          p = transformCorePoint(p);

          const proj = project(p);
          pts.push({ ...proj, world: p });
        }

        for (let i = 0; i < RING_STEPS; i++) {
          const a = pts[i];
          const b = pts[i + 1];
          const midZ = (a.z + b.z) * 0.5;
          const midF = (a.factor + b.factor) * 0.5;
          const mx = (a.world[0] + b.world[0]) * 0.5;
          const my = (a.world[1] + b.world[1]) * 0.5;
          const mz = midZ;
          const len = Math.hypot(mx, my, mz) || 1;
          const dot =
            (mx / len) * LIGHT_DIR[0] +
            (my / len) * LIGHT_DIR[1] +
            (mz / len) * LIGHT_DIR[2];
          const shade = dot * 0.5 + 0.5;

          const color =
            shade > 0.55
              ? mixRgb(ring.baseColor, ring.highlightColor, (shade - 0.55) / 0.45)
              : mixRgb(ring.darkColor, ring.baseColor, shade / 0.55);

          const seg: RingSegment = {
            x1: a.sx,
            y1: a.sy,
            x2: b.sx,
            y2: b.sy,
            z: midZ,
            w: Math.max(1.8, ring.tube * 2 * midF),
            color,
          };

          if (midZ < 0) backSegments.push(seg);
          else frontSegments.push(seg);
        }
      });

      backSegments.sort((a, b) => a.z - b.z);
      frontSegments.sort((a, b) => a.z - b.z);

      // Build and depth-sort particles
      const pRotAngle = elapsedTime * 0.03;
      const backParticles: { sx: number; sy: number; r: number; a: number; z: number }[] =
        [];
      const frontParticles: { sx: number; sy: number; r: number; a: number; z: number }[] =
        [];

      for (const pt of particles) {
        const rp = rotateY([pt.x, pt.y, pt.z], pRotAngle);
        const proj = project(rp);
        const twinkle = 0.45 + 0.35 * Math.sin(elapsedTime * 1.6 + pt.phase);
        const depthAlpha = Math.max(0.18, Math.min(0.85, (rp[2] + 3.5) / 7));
        const item = {
          sx: proj.sx,
          sy: proj.sy,
          r: Math.max(0.8, pt.size * (proj.factor / (focal / 8))),
          a: twinkle * depthAlpha,
          z: rp[2],
        };
        if (rp[2] < 0) backParticles.push(item);
        else frontParticles.push(item);
      }

      // 1. Draw background particles
      for (const p of backParticles) {
        ctx.fillStyle = `rgba(52, 211, 153, ${p.a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw back torus segments
      ctx.lineCap = "round";
      for (const seg of backSegments) {
        ctx.strokeStyle = seg.color;
        ctx.lineWidth = seg.w;
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.stroke();
      }

      // 3. Draw central glowing biomechanical orb (breathing pulse matching Stitch line 204)
      const pulse = 1 + Math.sin(elapsedTime * 1.5) * 0.03;
      const sphereWorldRadius = 1.1 * pulse;
      const orbRadiusPx = (sphereWorldRadius * focal) / camZ;

      // Ambient radial aura behind orb
      const auraGrad = ctx.createRadialGradient(
        cx,
        cy,
        orbRadiusPx * 0.4,
        cx,
        cy,
        orbRadiusPx * 2.1
      );
      auraGrad.addColorStop(0, "rgba(16, 185, 129, 0.38)");
      auraGrad.addColorStop(0.5, "rgba(6, 182, 212, 0.10)");
      auraGrad.addColorStop(1, "rgba(16, 185, 129, 0)");
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, orbRadiusPx * 2.1, 0, Math.PI * 2);
      ctx.fill();

      // Main 3D shaded orb
      const specX = cx + orbRadiusPx * 0.36;
      const specY = cy - orbRadiusPx * 0.36;
      const sphereGrad = ctx.createRadialGradient(
        specX,
        specY,
        orbRadiusPx * 0.06,
        cx,
        cy,
        orbRadiusPx * 1.05
      );
      sphereGrad.addColorStop(0, "#85f8c4");
      sphereGrad.addColorStop(0.28, "#10b981");
      sphereGrad.addColorStop(0.68, "#05472a");
      sphereGrad.addColorStop(1, "#032215");

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, orbRadiusPx, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();
      ctx.clip();

      // Secondary cyan directional rim light on bottom-left hemisphere
      const cyanRim = ctx.createRadialGradient(
        cx - orbRadiusPx * 0.72,
        cy + orbRadiusPx * 0.58,
        orbRadiusPx * 0.05,
        cx - orbRadiusPx * 0.4,
        cy + orbRadiusPx * 0.4,
        orbRadiusPx * 0.95
      );
      cyanRim.addColorStop(0, "rgba(6, 182, 212, 0.42)");
      cyanRim.addColorStop(1, "rgba(6, 182, 212, 0)");
      ctx.fillStyle = cyanRim;
      ctx.fillRect(cx - orbRadiusPx, cy - orbRadiusPx, orbRadiusPx * 2, orbRadiusPx * 2);

      // Subtle biomechanical latitude/longitude geodesic lines rotating with core
      ctx.strokeStyle = "rgba(111, 251, 190, 0.18)";
      ctx.lineWidth = 1;
      for (let m = 0; m < 3; m++) {
        const ang = (m / 3) * Math.PI;
        ctx.beginPath();
        let started = false;
        for (let s = 0; s <= 40; s++) {
          const lat = (s / 40) * Math.PI * 2;
          const v: Vec3 = [
            Math.cos(lat) * Math.cos(ang) * sphereWorldRadius * 0.99,
            Math.sin(lat) * sphereWorldRadius * 0.99,
            Math.cos(lat) * Math.sin(ang) * sphereWorldRadius * 0.99,
          ];
          const tv = transformCorePoint(v);
          if (tv[2] < -0.1) {
            started = false;
            continue;
          }
          const pr = project(tv);
          if (!started) {
            ctx.moveTo(pr.sx, pr.sy);
            started = true;
          } else {
            ctx.lineTo(pr.sx, pr.sy);
          }
        }
        ctx.stroke();
      }
      ctx.restore();

      // Subtle specular rim stroke around core orb
      ctx.strokeStyle = "rgba(78, 222, 163, 0.45)";
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.arc(cx, cy, orbRadiusPx, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Draw foreground torus segments (in front of orb)
      ctx.lineCap = "round";
      for (const seg of frontSegments) {
        ctx.strokeStyle = seg.color;
        ctx.lineWidth = seg.w;
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.stroke();
      }

      // 5. Draw foreground particles
      for (const p of frontParticles) {
        ctx.fillStyle = `rgba(111, 251, 190, ${p.a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reducedMotion) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    rafId = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full select-none">
      <canvas
        ref={canvasRef}
        aria-label="Interactive 3D biomechanics kinetic model"
        className="block h-full w-full"
      />
    </div>
  );
}
