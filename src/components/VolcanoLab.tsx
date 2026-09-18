import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  HelpCircle,
  Thermometer,
  Gauge,
  Wind,
  Layers,
  ChevronRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { VolcanoParams } from '../types';
import { VOLCANO_FACTS } from '../data/scienceFacts';

interface VolcanoLabProps {
  onTakeQuiz: (topic: 'volcano') => void;
  onRecordExperiment: (type: 'volcano') => void;
}

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  darkness: number; // 0 (light) to 1 (ashy black)
}

interface LavaParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

export const VolcanoLab: React.FC<VolcanoLabProps> = ({ onTakeQuiz, onRecordExperiment }) => {
  const [params, setParams] = useState<VolcanoParams>({
    pressure: 25,
    temperature: 850,
    gasConcentration: 30,
    isErupting: false,
    status: 'dormant',
    timeStep: 0,
  });

  const [isRunning, setIsRunning] = useState(true);
  const [factIndex, setFactIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-record initial experiment engagement
  useEffect(() => {
    onRecordExperiment('volcano');
  }, []);

  // Compute live measurements
  const isEruptingEffective = params.isErupting || params.pressure > 65;
  const intensityScore = Math.min(
    100,
    Math.round((params.pressure * 0.45 + params.gasConcentration * 0.35 + (params.temperature / 1500) * 20))
  );

  const veiScale = intensityScore < 20 ? 0 : intensityScore < 40 ? 1 : intensityScore < 60 ? 2 : intensityScore < 80 ? 3 : intensityScore < 95 ? 4 : 5;
  const veiDescription =
    veiScale === 0
      ? 'Non-explosive (Hawaiian flow)'
      : veiScale === 1
      ? 'Gentle (Strombolian spatter)'
      : veiScale === 2
      ? 'Explosive (Vulcanian burst)'
      : veiScale === 3
      ? 'Severe (Sub-Plinian column)'
      : veiScale === 4
      ? 'Cataclysmic (Plinian eruption)'
      : 'Mega-colossal (Ultra-Plinian)';

  const lavaFlowSpeed = Math.round(
    (params.temperature / 1500) * (params.pressure / 20) * 4.2 * 10
  ) / 10;

  // Color calculation based on temperature
  const getLavaColors = (temp: number) => {
    if (temp < 600) {
      return { core: '#ef4444', outer: '#991b1b', glow: 'rgba(239, 68, 68, 0.4)' };
    } else if (temp < 1000) {
      return { core: '#f97316', outer: '#ea580c', glow: 'rgba(249, 115, 22, 0.6)' };
    } else if (temp < 1300) {
      return { core: '#fbbf24', outer: '#f59e0b', glow: 'rgba(251, 191, 36, 0.75)' };
    } else {
      return { core: '#ffffff', outer: '#fef08a', glow: 'rgba(254, 240, 138, 0.9)' };
    }
  };

  // Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = 460);

    const smokeParticles: SmokeParticle[] = [];
    const lavaParticles: LavaParticle[] = [];
    let lavaPulse = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 700;
      height = canvas.height = 460;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      if (!isRunning) {
        animId = requestAnimationFrame(render);
        return;
      }

      lavaPulse += 0.04;
      ctx.clearRect(0, 0, width, height);

      // Coordinates of volcano geometry
      const centerX = width / 2;
      const craterY = height * 0.42;
      const craterWidth = Math.max(50, width * 0.12);
      const baseWidth = Math.max(300, width * 0.75);
      const baseY = height * 0.85;

      const colors = getLavaColors(params.temperature);

      // 1. Draw Sky Background with Ash Haze
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      const ashDarkness = (params.gasConcentration / 100) * (isEruptingEffective ? 0.7 : 0.2);
      skyGrad.addColorStop(0, `rgb(${Math.floor(15 - ashDarkness * 10)}, ${Math.floor(20 - ashDarkness * 12)}, ${Math.floor(35 - ashDarkness * 20)})`);
      skyGrad.addColorStop(1, '#070b14');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Distant Volcanic Slopes / Mountains
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.moveTo(0, baseY);
      ctx.lineTo(width * 0.2, height * 0.55);
      ctx.lineTo(width * 0.4, baseY);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(width * 0.65, baseY);
      ctx.lineTo(width * 0.85, height * 0.58);
      ctx.lineTo(width, baseY);
      ctx.closePath();
      ctx.fill();

      // 3. Smoke & Ash generation based on pressure and gas
      const smokeRate = isEruptingEffective
        ? Math.floor(params.gasConcentration / 15) + 3
        : params.pressure > 35
        ? 1
        : Math.random() < 0.3
        ? 1
        : 0;

      for (let i = 0; i < smokeRate; i++) {
        const spread = (Math.random() - 0.5) * (craterWidth * 0.6);
        const plumePower = (params.gasConcentration / 100) * 3 + (params.pressure / 100) * 3 + 1;
        smokeParticles.push({
          x: centerX + spread,
          y: craterY - 5,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(Math.random() * plumePower + 1.2),
          size: Math.random() * 8 + 6,
          alpha: Math.random() * 0.4 + 0.3,
          darkness: Math.random() * 0.5 + (params.gasConcentration > 50 ? 0.4 : 0.1),
        });
      }

      // 4. Lava ejecta / volcanic bombs when erupting
      if (isEruptingEffective) {
        const bombCount = Math.floor(params.pressure / 20) + 1;
        for (let i = 0; i < bombCount; i++) {
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.9;
          const speed = (params.pressure / 100) * 9 + (params.gasConcentration / 100) * 4 + 3;
          lavaParticles.push({
            x: centerX + (Math.random() - 0.5) * (craterWidth * 0.5),
            y: craterY - 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 4 + 2,
            life: 0,
            maxLife: Math.random() * 40 + 35,
            color: Math.random() > 0.3 ? colors.core : colors.outer,
          });
        }
      }

      // 5. Update and Draw Smoke Particles
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const p = smokeParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.size += 0.35;
        p.alpha -= 0.004;

        if (p.alpha <= 0 || p.y < 0) {
          smokeParticles.splice(i, 1);
          continue;
        }

        const grayVal = Math.floor(180 * (1 - p.darkness));
        ctx.fillStyle = `rgba(${grayVal}, ${grayVal}, ${grayVal}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Draw Volcano Mountain Body (Stratovolcano Cone)
      const mountainGrad = ctx.createLinearGradient(0, craterY, 0, baseY);
      mountainGrad.addColorStop(0, '#27202b');
      mountainGrad.addColorStop(0.5, '#1e1a24');
      mountainGrad.addColorStop(1, '#131118');

      ctx.fillStyle = mountainGrad;
      ctx.beginPath();
      ctx.moveTo(centerX - craterWidth / 2, craterY);
      // Left slope with slight organic curve
      ctx.quadraticCurveTo(centerX - baseWidth * 0.35, height * 0.65, centerX - baseWidth / 2, baseY);
      // Ground base
      ctx.lineTo(centerX + baseWidth / 2, baseY);
      // Right slope
      ctx.quadraticCurveTo(centerX + baseWidth * 0.35, height * 0.65, centerX + craterWidth / 2, craterY);
      // Crater dip
      ctx.quadraticCurveTo(centerX, craterY + 12, centerX - craterWidth / 2, craterY);
      ctx.closePath();
      ctx.fill();

      // Rocky texture ridges
      ctx.strokeStyle = '#18141f';
      ctx.lineWidth = 1.5;
      for (let r = -2; r <= 2; r++) {
        if (r === 0) continue;
        ctx.beginPath();
        ctx.moveTo(centerX + r * 15, craterY + 8);
        ctx.lineTo(centerX + r * (baseWidth * 0.16), baseY);
        ctx.stroke();
      }

      // 7. Lava Flows cascading down slopes
      if (params.temperature > 500 && (params.pressure > 30 || isEruptingEffective)) {
        const flowAlpha = Math.min(1, (params.pressure / 100) * 1.2);

        // Left lava stream
        ctx.strokeStyle = colors.outer;
        ctx.lineWidth = Math.min(10, Math.max(3, (params.pressure / 100) * 9));
        ctx.beginPath();
        ctx.moveTo(centerX - craterWidth * 0.3, craterY + 5);
        ctx.quadraticCurveTo(
          centerX - craterWidth * 0.7 + Math.sin(lavaPulse) * 4,
          height * 0.62,
          centerX - baseWidth * 0.28,
          baseY
        );
        ctx.stroke();

        // Left lava inner incandescent core
        ctx.strokeStyle = colors.core;
        ctx.lineWidth = Math.max(1.5, ctx.lineWidth * 0.45);
        ctx.stroke();

        // Right lava stream
        ctx.strokeStyle = colors.outer;
        ctx.lineWidth = Math.min(8, Math.max(2, (params.pressure / 100) * 7.5));
        ctx.beginPath();
        ctx.moveTo(centerX + craterWidth * 0.25, craterY + 6);
        ctx.quadraticCurveTo(
          centerX + craterWidth * 0.6 - Math.sin(lavaPulse * 0.8) * 4,
          height * 0.66,
          centerX + baseWidth * 0.24,
          baseY
        );
        ctx.stroke();

        ctx.strokeStyle = colors.core;
        ctx.lineWidth = Math.max(1.5, ctx.lineWidth * 0.45);
        ctx.stroke();

        // Glowing crater pool
        ctx.fillStyle = colors.outer;
        ctx.beginPath();
        ctx.ellipse(centerX, craterY + 6, craterWidth * 0.4, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = colors.core;
        ctx.beginPath();
        ctx.ellipse(centerX, craterY + 6, craterWidth * 0.25, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // 8. Underground Cutaway: Magma Chamber & Conduit
      // Draw bedrock baseline
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, baseY, width, height - baseY);

      // Magma Chamber (underground bulb)
      const chamberX = centerX;
      const chamberY = height * 0.93;
      const chamberRadiusX = Math.min(85, width * 0.14) * (1 + (params.pressure / 250));
      const chamberRadiusY = 32 * (1 + (params.pressure / 300));

      // Magma glow
      const glowGrad = ctx.createRadialGradient(
        chamberX,
        chamberY,
        5,
        chamberX,
        chamberY,
        chamberRadiusX * 1.5
      );
      glowGrad.addColorStop(0, colors.glow);
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(chamberX, chamberY, chamberRadiusX * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Magma chamber fill
      ctx.fillStyle = colors.outer;
      ctx.beginPath();
      ctx.ellipse(chamberX, chamberY, chamberRadiusX, chamberRadiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = colors.core;
      ctx.beginPath();
      ctx.ellipse(chamberX, chamberY, chamberRadiusX * 0.65, chamberRadiusY * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Vertical Conduit / Vent
      const conduitWidth = Math.max(8, (params.pressure / 100) * 16 + 8);
      ctx.fillStyle = colors.outer;
      ctx.fillRect(centerX - conduitWidth / 2, craterY + 8, conduitWidth, chamberY - craterY - 15);

      ctx.fillStyle = colors.core;
      ctx.fillRect(centerX - conduitWidth / 4, craterY + 8, conduitWidth / 2, chamberY - craterY - 15);

      // 9. Update and Draw Lava Ejecta Particles (Bombs)
      for (let i = lavaParticles.length - 1; i >= 0; i--) {
        const lp = lavaParticles[i];
        lp.x += lp.vx;
        lp.y += lp.vy;
        lp.vy += 0.22; // Gravity pulling lava bombs down
        lp.life += 1;

        if (lp.life >= lp.maxLife || lp.y > baseY) {
          lavaParticles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = lp.color;
        ctx.shadowColor = lp.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(lp.x, lp.y, lp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 10. Underground Labeling
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('CRATER VENT', centerX - 35, craterY - 12);
      ctx.fillText('CENTRAL CONDUIT', centerX + conduitWidth + 8, (craterY + chamberY) / 2);
      ctx.fillText(`MAGMA RESERVOIR (${params.temperature}°C)`, centerX - 65, height - 10);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [params, isRunning, isEruptingEffective]);

  const handlePreset = (presetName: string) => {
    onRecordExperiment('volcano');
    if (presetName === 'calm') {
      setParams({
        pressure: 15,
        temperature: 700,
        gasConcentration: 15,
        isErupting: false,
        status: 'dormant',
        timeStep: 0,
      });
    } else if (presetName === 'strombolian') {
      setParams({
        pressure: 50,
        temperature: 950,
        gasConcentration: 45,
        isErupting: false,
        status: 'active',
        timeStep: 0,
      });
    } else if (presetName === 'plinian') {
      setParams({
        pressure: 85,
        temperature: 1200,
        gasConcentration: 80,
        isErupting: true,
        status: 'erupting',
        timeStep: 0,
      });
    } else if (presetName === 'super') {
      setParams({
        pressure: 100,
        temperature: 1450,
        gasConcentration: 100,
        isErupting: true,
        status: 'erupting',
        timeStep: 0,
      });
    }
  };

  const handleReset = () => {
    setParams({
      pressure: 25,
      temperature: 850,
      gasConcentration: 30,
      isErupting: false,
      status: 'dormant',
      timeStep: 0,
    });
  };

  const handleTriggerErupt = () => {
    onRecordExperiment('volcano');
    setParams((prev) => ({
      ...prev,
      isErupting: !prev.isErupting,
      pressure: prev.isErupting ? 30 : Math.max(75, prev.pressure),
      status: prev.isErupting ? 'dormant' : 'erupting',
    }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Station Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-500/20 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2.5 text-orange-400">
            <Flame className="h-6 w-6" />
            <span className="font-mono text-xs tracking-widest uppercase">LAB STATION 01</span>
          </div>
          <h1 className="font-['Chakra_Petch'] text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            VOLCANO DYNAMICS SIMULATION
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manipulate magma pressure, core temperature, and dissolved gas concentration to analyze eruption thresholds.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            id="volcano-play-pause-btn"
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500"
          >
            {isRunning ? <Pause className="h-4 w-4 text-amber-400" /> : <Play className="h-4 w-4 text-emerald-400" />}
            <span>{isRunning ? 'Pause' : 'Resume'}</span>
          </button>
          <button
            id="volcano-reset-btn"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500"
          >
            <RotateCcw className="h-4 w-4 text-cyan-400" />
            <span>Reset</span>
          </button>
          <button
            id="volcano-quiz-shortcut-btn"
            onClick={() => onTakeQuiz('volcano')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-orange-500/20 hover:brightness-110"
          >
            <span>TAKE VOLCANO QUIZ</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport & Controls Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left / Main: Visual Simulation Canvas & Live Telemetry (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Canvas Card */}
          <div className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-[#070b14] shadow-2xl shadow-orange-950/20">
            {/* Status Indicator Bar */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/85 px-3 py-1 text-xs font-mono text-slate-200 backdrop-blur-md">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isEruptingEffective
                      ? 'bg-red-500 animate-ping'
                      : params.pressure > 40
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                />
                <span className="font-bold uppercase tracking-wider">
                  STATUS: {isEruptingEffective ? 'ERUPTION IN PROGRESS' : params.pressure > 40 ? 'HIGH ACTIVITY' : 'CALM / DORMANT'}
                </span>
              </div>

              <div className="rounded-full border border-orange-500/40 bg-orange-950/70 px-3 py-1 font-mono text-xs font-bold text-orange-300 backdrop-blur-md">
                VEI {veiScale} ({intensityScore}%)
              </div>
            </div>

            {/* The 3D Volcano Simulation Canvas */}
            <canvas
              ref={canvasRef}
              className="w-full h-[460px] cursor-crosshair block"
              aria-label="Interactive Volcano Simulation Visualizer"
            />

            {/* Bottom Floating Info Over Canvas */}
            <div className="border-t border-slate-800 bg-slate-950/80 p-3 px-5 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="text-slate-500">CLASSIFICATION:</span>
                <span className="font-bold text-orange-400">{veiDescription}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="text-slate-500">LAVA VISCOSITY:</span>
                <span className="text-amber-400">
                  {params.temperature > 1200 ? 'Low (Fluid Basalt)' : params.temperature > 800 ? 'Medium (Andesite)' : 'High (Sticky Rhyolite)'}
                </span>
              </div>
            </div>
          </div>

          {/* Live Measurements Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                <Thermometer className="h-3.5 w-3.5 text-orange-400" />
                <span>TEMPERATURE</span>
              </div>
              <div className="mt-1.5 font-['Chakra_Petch'] text-2xl font-bold text-white">
                {params.temperature}<span className="text-xs text-orange-400">°C</span>
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                {params.temperature >= 1000 ? 'Superheated' : 'Sub-magmatic'}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                <Gauge className="h-3.5 w-3.5 text-red-400" />
                <span>PRESSURE</span>
              </div>
              <div className="mt-1.5 font-['Chakra_Petch'] text-2xl font-bold text-white">
                {params.pressure}<span className="text-xs text-red-400">/100</span>
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                {(params.pressure * 1.5).toFixed(1)} MPa internal
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                <Wind className="h-3.5 w-3.5 text-cyan-400" />
                <span>GAS LEVEL</span>
              </div>
              <div className="mt-1.5 font-['Chakra_Petch'] text-2xl font-bold text-white">
                {params.gasConcentration}<span className="text-xs text-cyan-400">%</span>
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                H₂O, CO₂, SO₂ mix
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                <span>INTENSITY</span>
              </div>
              <div className="mt-1.5 font-['Chakra_Petch'] text-2xl font-bold text-white">
                VEI {veiScale}
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                {intensityScore}% index
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                <Layers className="h-3.5 w-3.5 text-emerald-400" />
                <span>LAVA FLOW</span>
              </div>
              <div className="mt-1.5 font-['Chakra_Petch'] text-2xl font-bold text-white">
                {lavaFlowSpeed}<span className="text-xs text-emerald-400"> m/s</span>
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                {(lavaFlowSpeed * 3.6).toFixed(1)} km/h slope
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Sliders & Eruption Trigger (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl">
            <h3 className="font-['Chakra_Petch'] text-lg font-bold tracking-wide text-white uppercase flex items-center gap-2 mb-5">
              <Gauge className="h-5 w-5 text-orange-400" />
              SIMULATION CONTROLS
            </h3>

            {/* Presets */}
            <div className="mb-6">
              <span className="block font-mono text-xs text-slate-400 uppercase mb-2">Preset Scenarios:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handlePreset('calm')}
                  className="rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-300 hover:border-orange-500/50 hover:text-white transition-colors text-left"
                >
                  🟢 Calm Shield
                </button>
                <button
                  onClick={() => handlePreset('strombolian')}
                  className="rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-300 hover:border-orange-500/50 hover:text-white transition-colors text-left"
                >
                  🟡 Strombolian
                </button>
                <button
                  onClick={() => handlePreset('plinian')}
                  className="rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-300 hover:border-orange-500/50 hover:text-white transition-colors text-left"
                >
                  🟠 Plinian Column
                </button>
                <button
                  onClick={() => handlePreset('super')}
                  className="rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-300 hover:border-orange-500/50 hover:text-white transition-colors text-left"
                >
                  🔴 Supervolcano
                </button>
              </div>
            </div>

            {/* Slider 1: Magma Pressure */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-1.5 text-xs">
                <label htmlFor="pressure-slider" className="font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                  <Gauge className="h-3.5 w-3.5 text-red-400" />
                  Magma Pressure
                </label>
                <span className="font-mono font-bold text-red-400">{params.pressure} / 100</span>
              </div>
              <input
                id="pressure-slider"
                type="range"
                min="0"
                max="100"
                value={params.pressure}
                onChange={(e) => {
                  onRecordExperiment('volcano');
                  setParams((prev) => ({ ...prev, pressure: Number(e.target.value) }));
                }}
                className="w-full accent-red-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>0 (Calm)</span>
                <span>50 (Active)</span>
                <span>100 (Critical)</span>
              </div>
            </div>

            {/* Slider 2: Temperature */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-1.5 text-xs">
                <label htmlFor="temperature-slider" className="font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                  <Thermometer className="h-3.5 w-3.5 text-orange-400" />
                  Core Temperature
                </label>
                <span className="font-mono font-bold text-orange-400">{params.temperature}°C</span>
              </div>
              <input
                id="temperature-slider"
                type="range"
                min="0"
                max="1500"
                step="10"
                value={params.temperature}
                onChange={(e) => {
                  onRecordExperiment('volcano');
                  setParams((prev) => ({ ...prev, temperature: Number(e.target.value) }));
                }}
                className="w-full accent-orange-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>0°C (Solid)</span>
                <span>800°C (Melt)</span>
                <span>1500°C (Incandescent)</span>
              </div>
            </div>

            {/* Slider 3: Gas Concentration */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1.5 text-xs">
                <label htmlFor="gas-slider" className="font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                  <Wind className="h-3.5 w-3.5 text-cyan-400" />
                  Gas Concentration
                </label>
                <span className="font-mono font-bold text-cyan-400">{params.gasConcentration}%</span>
              </div>
              <input
                id="gas-slider"
                type="range"
                min="0"
                max="100"
                value={params.gasConcentration}
                onChange={(e) => {
                  onRecordExperiment('volcano');
                  setParams((prev) => ({ ...prev, gasConcentration: Number(e.target.value) }));
                }}
                className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>0% (Degassed)</span>
                <span>50% (Volatile)</span>
                <span>100% (Explosive)</span>
              </div>
            </div>

            {/* Eruption Trigger Button */}
            <button
              id="volcano-erupt-btn"
              onClick={handleTriggerErupt}
              className={`w-full py-4 rounded-2xl font-['Chakra_Petch'] font-extrabold text-base tracking-wider uppercase transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${
                isEruptingEffective
                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-red-500/30 animate-pulse'
                  : 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-slate-950 shadow-orange-500/25 hover:brightness-110'
              }`}
            >
              <Flame className="h-5 w-5 fill-current" />
              <span>{isEruptingEffective ? 'CALM THE ERUPTION' : 'TRIGGER ERUPTION'}</span>
            </button>
          </div>

          {/* Educational Explanation: What is Happening? */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <h4 className="font-['Chakra_Petch'] text-sm font-bold tracking-wider text-orange-400 uppercase flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4" />
              WHAT IS HAPPENING?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Volcanic eruptions occur when immense pressure from magma and dissolved gases forces molten rock
              upward from deep subterranean reservoirs through Earth’s crust.
            </p>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              When dissolved gases reach lower pressures near the surface, they expand exponentially—turning viscous
              magma into explosive froth, ash plumes, and pyroclastic ejecta!
            </p>

            {/* Did You Know? */}
            <div className="mt-4 rounded-2xl border border-orange-500/20 bg-orange-950/20 p-4">
              <div className="flex items-center justify-between text-xs font-mono text-orange-300 mb-1">
                <span className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  DID YOU KNOW?
                </span>
                <button
                  onClick={() => setFactIndex((factIndex + 1) % VOLCANO_FACTS.length)}
                  className="text-[10px] text-orange-400 underline hover:text-orange-200"
                >
                  Next Fact →
                </button>
              </div>
              <h5 className="font-semibold text-xs text-white mt-1">
                {VOLCANO_FACTS[factIndex].title}
              </h5>
              <p className="mt-1 text-xs text-slate-300 leading-normal">
                {VOLCANO_FACTS[factIndex].fact}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
