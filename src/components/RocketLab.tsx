import React, { useState, useEffect, useRef } from 'react';
import {
  Rocket,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Gauge,
  Weight,
  Flame,
  Globe2,
  Wind,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Zap,
} from 'lucide-react';
import { RocketParams } from '../types';
import { ROCKET_EXPERIMENTS } from '../data/scienceFacts';

interface RocketLabProps {
  onTakeQuiz: (topic: 'rocket') => void;
  onRecordExperiment: (type: 'rocket') => void;
}

export const RocketLab: React.FC<RocketLabProps> = ({ onTakeQuiz, onRecordExperiment }) => {
  // Configurable parameters & real-time telemetry
  const [thrust, setThrust] = useState(2800); // kN
  const [initialFuel, setInitialFuel] = useState(25000); // kg
  const [dryMass, setDryMass] = useState(8000); // kg
  const [gravity, setGravity] = useState(9.81); // m/s² (Earth)
  const [airResistance, setAirResistance] = useState(0.25); // Cd coefficient

  // Live telemetry state
  const [isSimulating, setIsSimulating] = useState(false);
  const [altitude, setAltitude] = useState(0); // meters
  const [velocity, setVelocity] = useState(0); // m/s
  const [acceleration, setAcceleration] = useState(0); // m/s²
  const [fuelRemaining, setFuelRemaining] = useState(25000); // kg
  const [flightTime, setFlightTime] = useState(0); // seconds
  const [status, setStatus] = useState<'ready' | 'launching' | 'coasting' | 'apogee' | 'landed' | 'crashed'>('ready');
  const [maxAltitude, setMaxAltitude] = useState(0);

  // Trajectory history for the graph
  const [flightData, setFlightData] = useState<Array<{ time: number; altitude: number; velocity: number }>>([
    { time: 0, altitude: 0, velocity: 0 },
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Keep ref of state values for the 60fps requestAnimationFrame loop
  const stateRef = useRef({
    altitude: 0,
    velocity: 0,
    acceleration: 0,
    fuelRemaining: 25000,
    initialFuel: 25000,
    flightTime: 0,
    isSimulating: false,
    thrust: 2800,
    dryMass: 8000,
    gravity: 9.81,
    airResistance: 0.25,
    maxAltitude: 0,
    status: 'ready' as 'ready' | 'launching' | 'coasting' | 'apogee' | 'landed' | 'crashed',
  });

  // Sync ref with React state changes
  useEffect(() => {
    stateRef.current.thrust = thrust;
    stateRef.current.dryMass = dryMass;
    stateRef.current.gravity = gravity;
    stateRef.current.airResistance = airResistance;
  }, [thrust, dryMass, gravity, airResistance]);

  // Handle Initial mount
  useEffect(() => {
    onRecordExperiment('rocket');
  }, []);

  // Launch rocket handler
  const handleLaunch = () => {
    onRecordExperiment('rocket');
    if (status === 'landed' || status === 'crashed' || fuelRemaining <= 0) {
      handleReset();
    }
    setIsSimulating(true);
    setStatus('launching');
    stateRef.current.isSimulating = true;
    stateRef.current.status = 'launching';
  };

  const handlePause = () => {
    setIsSimulating(false);
    stateRef.current.isSimulating = false;
  };

  const handleReset = () => {
    setIsSimulating(false);
    setAltitude(0);
    setVelocity(0);
    setAcceleration(0);
    setFuelRemaining(initialFuel);
    setFlightTime(0);
    setStatus('ready');
    setMaxAltitude(0);
    setFlightData([{ time: 0, altitude: 0, velocity: 0 }]);

    stateRef.current = {
      ...stateRef.current,
      altitude: 0,
      velocity: 0,
      acceleration: 0,
      fuelRemaining: initialFuel,
      initialFuel,
      flightTime: 0,
      isSimulating: false,
      maxAltitude: 0,
      status: 'ready',
    };
  };

  const applyPreset = (preset: typeof ROCKET_EXPERIMENTS[0]['preset']) => {
    handleReset();
    setThrust(preset.thrust);
    setInitialFuel(preset.fuel);
    setFuelRemaining(preset.fuel);
    setDryMass(preset.dryMass);
    setGravity(preset.gravity);
    setAirResistance(preset.airResistance);
    stateRef.current.initialFuel = preset.fuel;
    stateRef.current.fuelRemaining = preset.fuel;
  };

  // Smoke and flame particle arrays for visual animation
  const smokeParticles = useRef<Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number }>>([]);

  // Main Physics Simulation & Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = 460);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 700;
      height = canvas.height = 460;
    };
    window.addEventListener('resize', handleResize);

    let lastTime = performance.now();
    let graphSampleTimer = 0;

    const loop = (now: number) => {
      const dtMs = Math.min(now - lastTime, 100);
      lastTime = now;
      const dt = dtMs / 1000;

      const s = stateRef.current;

      if (s.isSimulating) {
        // Physics Calculations:
        const currentMass = s.dryMass + Math.max(0, s.fuelRemaining);
        const hasFuel = s.fuelRemaining > 0;

        // Thrust in Newtons:
        const thrustForce = hasFuel ? s.thrust * 1000 : 0;

        // Fuel burn rate: proportional to thrust (~200 kg/s at 2000 kN)
        if (hasFuel) {
          const burnRate = (s.thrust / 2000) * 180 * dt;
          s.fuelRemaining = Math.max(0, s.fuelRemaining - burnRate);
          if (s.fuelRemaining === 0 && s.status === 'launching') {
            s.status = 'coasting';
          }
        }

        // Gravity force:
        const gravForce = currentMass * s.gravity;

        // Air density decreases exponentially with altitude (Scale height = 8500m)
        const density = Math.max(0, 1.225 * Math.exp(-s.altitude / 8500));
        // Aerodynamic Drag: Fd = 0.5 * rho * v^2 * Cd * Area (Area approx 7 m^2)
        const dragForce = 0.5 * density * (s.velocity * s.velocity) * s.airResistance * 7 * Math.sign(s.velocity);

        // Net upward force:
        const netForce = thrustForce - gravForce - dragForce;
        const currentAccel = netForce / currentMass;

        // Numerical integration (Euler-Cromer)
        s.velocity += currentAccel * dt;
        s.altitude = Math.max(0, s.altitude + s.velocity * dt);
        s.acceleration = currentAccel;
        s.flightTime += dt;

        if (s.altitude > s.maxAltitude) {
          s.maxAltitude = s.altitude;
        }

        // Apogee detection: velocity switches from positive to negative
        if (s.velocity <= 0 && s.status === 'coasting') {
          s.status = 'apogee';
        }

        // Ground touch down
        if (s.altitude <= 0 && s.flightTime > 0.5) {
          s.altitude = 0;
          s.isSimulating = false;
          if (s.velocity < -12) {
            s.status = 'crashed';
          } else {
            s.status = 'landed';
          }
          s.velocity = 0;
          s.acceleration = 0;
        }

        // Sync to React state for UI dashboards periodically
        graphSampleTimer += dt;
        if (graphSampleTimer >= 0.15) {
          graphSampleTimer = 0;
          setAltitude(s.altitude);
          setVelocity(s.velocity);
          setAcceleration(s.acceleration);
          setFuelRemaining(s.fuelRemaining);
          setFlightTime(s.flightTime);
          setStatus(s.status);
          setMaxAltitude(s.maxAltitude);

          setFlightData((prev) => {
            const next = [...prev, { time: Math.round(s.flightTime * 10) / 10, altitude: Math.round(s.altitude), velocity: Math.round(s.velocity) }];
            return next.slice(-60); // keep last 60 points for smooth charting
          });
        }
      }

      // RENDER VISUAL SIMULATION CANVAS
      ctx.clearRect(0, 0, width, height);

      // 1. Sky / Space gradient transition based on altitude
      // 0 - 15 km: Troposphere blue
      // 15 - 50 km: Stratosphere dark navy
      // 50 - 100+ km: Thermosphere / Space black with stars
      const altKm = s.altitude / 1000;
      const spaceProgress = Math.min(1, altKm / 80);

      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (spaceProgress < 0.3) {
        skyGrad.addColorStop(0, '#0c2340');
        skyGrad.addColorStop(1, '#1e3a8a');
      } else if (spaceProgress < 0.7) {
        skyGrad.addColorStop(0, '#030712');
        skyGrad.addColorStop(0.7, '#0f172a');
        skyGrad.addColorStop(1, '#1e293b');
      } else {
        skyGrad.addColorStop(0, '#020408');
        skyGrad.addColorStop(1, '#050b14');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Stars in high atmosphere & space
      if (spaceProgress > 0.25) {
        const starAlpha = Math.min(1, (spaceProgress - 0.25) * 1.5);
        ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha * 0.8})`;
        for (let i = 0; i < 40; i++) {
          const sx = (Math.sin(i * 99) * 0.5 + 0.5) * width;
          const sy = (Math.cos(i * 37) * 0.5 + 0.5) * height * 0.8;
          ctx.fillRect(sx, sy, 1.5, 1.5);
        }
      }

      // Earth's curved limb horizon visible when climbing into space
      if (altKm > 20) {
        const earthY = height * 0.88 + Math.min(100, altKm * 0.4);
        const earthGrad = ctx.createRadialGradient(width / 2, earthY + 600, 500, width / 2, earthY + 600, 700);
        earthGrad.addColorStop(0, '#0284c7');
        earthGrad.addColorStop(0.8, '#0369a1');
        earthGrad.addColorStop(1, '#070b14');

        ctx.fillStyle = earthGrad;
        ctx.beginPath();
        ctx.arc(width / 2, earthY + 600, 680, 0, Math.PI * 2);
        ctx.fill();

        // Atmospheric glow rim
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(width / 2, earthY + 600, 681, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Launch Pad & Ground (only visible at lower altitudes)
      const padY = height * 0.82;
      const groundOffset = Math.min(height + 100, (s.altitude / 80));

      if (groundOffset < height) {
        const currentGroundY = padY + groundOffset;

        // Ground terrain
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, currentGroundY, width, height - currentGroundY + 100);

        // Concrete launch pad base
        const padCenterX = width / 2;
        ctx.fillStyle = '#334155';
        ctx.fillRect(padCenterX - 80, currentGroundY - 8, 160, 16);

        // Launch Umbilical Gantry Tower
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.strokeRect(padCenterX - 65, currentGroundY - 140, 26, 132);

        // Truss diagonal bracing
        ctx.beginPath();
        for (let y = currentGroundY - 140; y < currentGroundY; y += 22) {
          ctx.moveTo(padCenterX - 65, y);
          ctx.lineTo(padCenterX - 39, y + 22);
          ctx.moveTo(padCenterX - 39, y);
          ctx.lineTo(padCenterX - 65, y + 22);
        }
        ctx.stroke();

        // Retractable swing arm
        if (s.status === 'ready') {
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(padCenterX - 39, currentGroundY - 95);
          ctx.lineTo(padCenterX - 14, currentGroundY - 95);
          ctx.stroke();
        }
      }

      // Calculate rocket screen position:
      // Rocket sits at launch pad initially, climbs upward, then stays centered while background scrolls
      let rocketY: number;
      const rocketX = width / 2;

      if (s.altitude < 1200) {
        rocketY = padY - 70 - (s.altitude / 1200) * (padY * 0.45);
      } else {
        rocketY = height * 0.45;
      }

      const isThrusting = s.isSimulating && s.fuelRemaining > 0;

      // Spawn Exhaust smoke and flame particles
      if (isThrusting) {
        const exhaustPower = s.thrust / 1500;
        for (let i = 0; i < 4; i++) {
          smokeParticles.current.push({
            x: rocketX + (Math.random() - 0.5) * 8,
            y: rocketY + 45,
            vx: (Math.random() - 0.5) * 3,
            vy: Math.random() * 5 + 4 * exhaustPower,
            size: Math.random() * 6 + 4,
            alpha: 0.8,
          });
        }
      }

      // Draw and update exhaust particles
      for (let i = smokeParticles.current.length - 1; i >= 0; i--) {
        const p = smokeParticles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.size += 0.4;
        p.alpha -= 0.02;

        if (p.alpha <= 0 || p.y > height + 50) {
          smokeParticles.current.splice(i, 1);
          continue;
        }

        // Fiery transition: white/yellow -> orange -> smoke gray
        if (p.alpha > 0.5) {
          ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`;
        } else if (p.alpha > 0.25) {
          ctx.fillStyle = `rgba(239, 68, 68, ${p.alpha})`;
        } else {
          ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha * 0.8})`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Rocket Exhaust Flame (Animated cone with mach diamonds)
      if (isThrusting) {
        const flameHeight = 35 + Math.random() * 18 + (s.thrust / 2000) * 15;
        const flameGrad = ctx.createLinearGradient(rocketX, rocketY + 38, rocketX, rocketY + 38 + flameHeight);
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.2, '#38bdf8');
        flameGrad.addColorStop(0.5, '#f59e0b');
        flameGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(rocketX - 7, rocketY + 38);
        ctx.quadraticCurveTo(rocketX, rocketY + 38 + flameHeight * 1.1, rocketX + 7, rocketY + 38);
        ctx.closePath();
        ctx.fill();

        // Inner Mach Diamond Core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(rocketX, rocketY + 46, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw the Rocket Vehicle
      ctx.save();
      ctx.translate(rocketX, rocketY);

      // Rocket Body (Aerodynamic cylinder)
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-8, -25, 16, 60);

      // Nose cone
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(0, -42);
      ctx.lineTo(-8, -25);
      ctx.lineTo(8, -25);
      ctx.closePath();
      ctx.fill();

      // Body accent stripes
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-8, -10, 16, 4);
      ctx.fillRect(-8, 8, 16, 4);

      // USA / Science Lab Flag & Logo symbol
      ctx.fillStyle = '#0369a1';
      ctx.font = '700 6px sans-serif';
      ctx.fillText('LAB-1', -7, 2);

      // Aerodynamic Stabilizer Fins
      ctx.fillStyle = '#0284c7';
      // Left fin
      ctx.beginPath();
      ctx.moveTo(-8, 20);
      ctx.lineTo(-18, 36);
      ctx.lineTo(-8, 34);
      ctx.closePath();
      ctx.fill();

      // Right fin
      ctx.beginPath();
      ctx.moveTo(8, 20);
      ctx.lineTo(18, 36);
      ctx.lineTo(8, 34);
      ctx.closePath();
      ctx.fill();

      // Rocket engine nozzle
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(-6, 35);
      ctx.lineTo(-8, 40);
      ctx.lineTo(8, 40);
      ctx.lineTo(6, 35);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Altitude scale tape on the right side of the canvas
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillRect(width - 85, 15, 75, height - 30);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.strokeRect(width - 85, 15, 75, height - 30);

      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('ALT SCALE', width - 80, 30);

      const altMarks = [0, 10, 50, 100, 200, 400]; // km
      altMarks.forEach((m) => {
        const markY = height - 30 - (m / 400) * (height - 80);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.beginPath();
        ctx.moveTo(width - 85, markY);
        ctx.lineTo(width - 65, markY);
        ctx.stroke();
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`${m}km`, width - 60, markY + 3);
      });

      // Indicator chevron for current altitude
      const curMarkY = Math.max(45, height - 30 - (altKm / 400) * (height - 80));
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(width - 92, curMarkY);
      ctx.lineTo(width - 86, curMarkY - 5);
      ctx.lineTo(width - 86, curMarkY + 5);
      ctx.closePath();
      ctx.fill();

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fuelPercentage = Math.round((fuelRemaining / initialFuel) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Station Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-500/20 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2.5 text-blue-400">
            <Rocket className="h-6 w-6" />
            <span className="font-mono text-xs tracking-widest uppercase">LAB STATION 02</span>
          </div>
          <h1 className="font-['Chakra_Petch'] text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            ROCKET PROPULSION & TRAJECTORY LAB
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Discover how thrust, fuel mass, gravity, and aerodynamic drag determine orbital launch dynamics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isSimulating ? (
            <button
              id="rocket-pause-btn"
              onClick={handlePause}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500"
            >
              <Pause className="h-4 w-4 text-amber-400" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              id="rocket-launch-btn"
              onClick={handleLaunch}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-blue-500/20 hover:brightness-110"
            >
              <Play className="h-4 w-4 fill-slate-950" />
              <span>LAUNCH</span>
            </button>
          )}

          <button
            id="rocket-reset-btn"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500"
          >
            <RotateCcw className="h-4 w-4 text-cyan-400" />
            <span>Reset</span>
          </button>

          <button
            id="rocket-quiz-shortcut-btn"
            onClick={() => onTakeQuiz('rocket')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:brightness-110"
          >
            <span>TAKE ROCKET QUIZ</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Viewport & Sliders Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Canvas & Telemetry Dashboard (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Canvas Viewport */}
          <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-[#070b14] shadow-2xl shadow-blue-950/20">
            {/* Mission Status Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/85 px-3 py-1 text-xs font-mono text-slate-200 backdrop-blur-md">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  status === 'launching'
                    ? 'bg-emerald-400 animate-ping'
                    : status === 'coasting'
                    ? 'bg-blue-400'
                    : status === 'apogee'
                    ? 'bg-purple-400'
                    : status === 'crashed'
                    ? 'bg-red-500'
                    : 'bg-slate-400'
                }`}
              />
              <span className="font-bold uppercase tracking-wider">
                FLIGHT STATUS: {status.toUpperCase()}
              </span>
            </div>

            <canvas
              ref={canvasRef}
              className="w-full h-[460px] block"
              aria-label="Interactive Rocket Launch Flight Simulation"
            />

            {/* Bottom Floating Telemetry */}
            <div className="border-t border-slate-800 bg-slate-950/80 p-3 px-5 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-slate-500">MISSION CLOCK:</span>
                <span className="font-bold text-cyan-400">T+ {flightTime.toFixed(1)}s</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-slate-500">MAX APOGEE:</span>
                <span className="font-bold text-amber-400">{(maxAltitude / 1000).toFixed(2)} km</span>
              </div>
            </div>
          </div>

          {/* Live Telemetry Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
                <span>ALTITUDE</span>
              </div>
              <div className="mt-1.5 font-['Chakra_Petch'] text-2xl font-bold text-white">
                {(altitude / 1000).toFixed(2)}<span className="text-xs text-cyan-400"> km</span>
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                {Math.round(altitude)} meters
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                <Zap className="h-3.5 w-3.5 text-blue-400" />
                <span>VELOCITY</span>
              </div>
              <div className="mt-1.5 font-['Chakra_Petch'] text-2xl font-bold text-white">
                {Math.round(velocity)}<span className="text-xs text-blue-400"> m/s</span>
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                {Math.round(velocity * 3.6)} km/h
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                <Activity className="h-3.5 w-3.5 text-emerald-400" />
                <span>ACCELERATION</span>
              </div>
              <div className="mt-1.5 font-['Chakra_Petch'] text-2xl font-bold text-white">
                {acceleration.toFixed(1)}<span className="text-xs text-emerald-400"> m/s²</span>
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                {(acceleration / 9.81).toFixed(1)} Gs felt
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                <Flame className="h-3.5 w-3.5 text-orange-400" />
                <span>FUEL REMAINING</span>
              </div>
              <div className="mt-1.5 font-['Chakra_Petch'] text-2xl font-bold text-white">
                {fuelPercentage}<span className="text-xs text-orange-400">%</span>
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                {Math.round(fuelRemaining)} kg
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                <Gauge className="h-3.5 w-3.5 text-purple-400" />
                <span>THRUST</span>
              </div>
              <div className="mt-1.5 font-['Chakra_Petch'] text-2xl font-bold text-white">
                {fuelRemaining > 0 && isSimulating ? thrust : 0}<span className="text-xs text-purple-400"> kN</span>
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                {fuelRemaining > 0 ? 'Engines nominal' : 'MECO (Cut-off)'}
              </div>
            </div>
          </div>

          {/* Simple Graph: Altitude vs Time */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-['Chakra_Petch'] text-sm font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                LIVE TRAJECTORY GRAPH: ALTITUDE VS. TIME
              </h4>
              <span className="font-mono text-xs text-slate-400">
                Current: {(altitude / 1000).toFixed(2)} km @ {flightTime.toFixed(1)}s
              </span>
            </div>

            <div className="relative h-44 w-full rounded-2xl border border-slate-800/80 bg-slate-950/60 p-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 140" preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                <line x1="0" y1="35" x2="500" y2="35" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="0" y1="70" x2="500" y2="70" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="0" y1="105" x2="500" y2="105" stroke="#1e293b" strokeDasharray="3 3" />

                {/* Trajectory Polyline */}
                {flightData.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    points={flightData
                      .map((d, i) => {
                        const x = (i / Math.max(1, flightData.length - 1)) * 500;
                        const maxH = Math.max(1000, maxAltitude * 1.15);
                        const y = 135 - (d.altitude / maxH) * 125;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                )}

                {/* Current Dot */}
                {flightData.length > 0 && (
                  <circle
                    cx="500"
                    cy={135 - (altitude / Math.max(1000, maxAltitude * 1.15)) * 125}
                    r="4.5"
                    fill="#38bdf8"
                    className="animate-pulse"
                  />
                )}
              </svg>

              {/* Graph Axis labels */}
              <div className="absolute top-2 left-3 text-[10px] font-mono text-slate-500">
                Altitude (km) ↑
              </div>
              <div className="absolute bottom-1 right-3 text-[10px] font-mono text-slate-500">
                Time (s) →
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controls, What Happens If & Physics Info (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl">
            <h3 className="font-['Chakra_Petch'] text-lg font-bold tracking-wide text-white uppercase flex items-center gap-2 mb-5">
              <Gauge className="h-5 w-5 text-blue-400" />
              FLIGHT PARAMETERS
            </h3>

            {/* Slider 1: Thrust */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1 text-xs">
                <label htmlFor="thrust-slider" className="font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-orange-400" />
                  Engine Thrust
                </label>
                <span className="font-mono font-bold text-orange-400">{thrust} kN</span>
              </div>
              <input
                id="thrust-slider"
                type="range"
                min="500"
                max="5000"
                step="50"
                value={thrust}
                onChange={(e) => {
                  onRecordExperiment('rocket');
                  setThrust(Number(e.target.value));
                }}
                className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Fuel Amount */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1 text-xs">
                <label htmlFor="fuel-slider" className="font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-cyan-400" />
                  Fuel Propellant
                </label>
                <span className="font-mono font-bold text-cyan-400">{initialFuel} kg</span>
              </div>
              <input
                id="fuel-slider"
                type="range"
                min="5000"
                max="50000"
                step="500"
                value={initialFuel}
                onChange={(e) => {
                  onRecordExperiment('rocket');
                  const val = Number(e.target.value);
                  setInitialFuel(val);
                  setFuelRemaining(val);
                  stateRef.current.initialFuel = val;
                  stateRef.current.fuelRemaining = val;
                }}
                className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 3: Rocket Mass */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1 text-xs">
                <label htmlFor="mass-slider" className="font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                  <Weight className="h-3.5 w-3.5 text-slate-300" />
                  Dry Rocket Mass
                </label>
                <span className="font-mono font-bold text-slate-200">{dryMass} kg</span>
              </div>
              <input
                id="mass-slider"
                type="range"
                min="2000"
                max="20000"
                step="250"
                value={dryMass}
                onChange={(e) => {
                  onRecordExperiment('rocket');
                  setDryMass(Number(e.target.value));
                }}
                className="w-full accent-slate-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 4: Planetary Gravity */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1 text-xs">
                <label htmlFor="gravity-slider" className="font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                  <Globe2 className="h-3.5 w-3.5 text-emerald-400" />
                  Planetary Gravity
                </label>
                <span className="font-mono font-bold text-emerald-400">{gravity} m/s²</span>
              </div>
              <input
                id="gravity-slider"
                type="range"
                min="1.62"
                max="25"
                step="0.1"
                value={gravity}
                onChange={(e) => {
                  onRecordExperiment('rocket');
                  setGravity(Number(e.target.value));
                }}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <button onClick={() => setGravity(1.62)} className="hover:text-emerald-300">Moon (1.6)</button>
                <button onClick={() => setGravity(3.72)} className="hover:text-emerald-300">Mars (3.7)</button>
                <button onClick={() => setGravity(9.81)} className="hover:text-emerald-300">Earth (9.8)</button>
                <button onClick={() => setGravity(24.79)} className="hover:text-emerald-300">Jupiter (24.8)</button>
              </div>
            </div>

            {/* Slider 5: Air Resistance */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1 text-xs">
                <label htmlFor="air-slider" className="font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                  <Wind className="h-3.5 w-3.5 text-purple-400" />
                  Air Resistance (Cd)
                </label>
                <span className="font-mono font-bold text-purple-400">{airResistance}</span>
              </div>
              <input
                id="air-slider"
                type="range"
                min="0.0"
                max="0.8"
                step="0.05"
                value={airResistance}
                onChange={(e) => {
                  onRecordExperiment('rocket');
                  setAirResistance(Number(e.target.value));
                }}
                className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Big Launch Trigger */}
            <button
              id="rocket-big-launch-btn"
              onClick={handleLaunch}
              disabled={isSimulating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 font-['Chakra_Petch'] font-extrabold text-base tracking-wider uppercase text-slate-950 shadow-xl shadow-blue-500/25 hover:brightness-110 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Rocket className="h-5 w-5 fill-slate-950" />
              <span>{status === 'ready' ? 'IGNITE ENGINES (LAUNCH)' : 'RE-LAUNCH MISSION'}</span>
            </button>
          </div>

          {/* "What happens if?" Experiment Section */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <h4 className="font-['Chakra_Petch'] text-sm font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4" />
              WHAT HAPPENS IF? (EXPERIMENT SCENARIOS)
            </h4>

            <div className="space-y-3">
              {ROCKET_EXPERIMENTS.map((exp, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-950/40 p-3.5 transition-all hover:border-blue-500/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-semibold text-xs text-white">{exp.title}</h5>
                    <button
                      onClick={() => applyPreset(exp.preset)}
                      className="shrink-0 rounded-lg bg-blue-500/20 px-2.5 py-1 text-[10px] font-mono font-bold text-blue-300 hover:bg-blue-500/30"
                    >
                      Test It →
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400 leading-normal">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
