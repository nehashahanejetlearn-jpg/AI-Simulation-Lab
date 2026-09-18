import React, { useState, useEffect, useRef } from 'react';
import {
  Dna,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Info,
  ChevronRight,
  BookOpen,
  Split,
  Atom,
} from 'lucide-react';
import { DnaBase, DnaPair } from '../types';
import { DNA_COMPONENTS } from '../data/scienceFacts';

interface DnaLabProps {
  onTakeQuiz: (topic: 'dna') => void;
  onRecordExperiment: (type: 'dna') => void;
}

// Generate base pairs along the helix
const INITIAL_PAIRS: DnaPair[] = [
  { id: 0, left: 'A', right: 'T', yPos: 0, rotation: 0 },
  { id: 1, left: 'C', right: 'G', yPos: 1, rotation: 36 },
  { id: 2, left: 'T', right: 'A', yPos: 2, rotation: 72 },
  { id: 3, left: 'G', right: 'C', yPos: 3, rotation: 108 },
  { id: 4, left: 'A', right: 'T', yPos: 4, rotation: 144 },
  { id: 5, left: 'C', right: 'G', yPos: 5, rotation: 180 },
  { id: 6, left: 'G', right: 'C', yPos: 6, rotation: 216 },
  { id: 7, left: 'T', right: 'A', yPos: 7, rotation: 252 },
  { id: 8, left: 'A', right: 'T', yPos: 8, rotation: 288 },
  { id: 9, left: 'C', right: 'G', yPos: 9, rotation: 324 },
  { id: 10, left: 'T', right: 'A', yPos: 10, rotation: 360 },
  { id: 11, left: 'G', right: 'C', yPos: 11, rotation: 396 },
  { id: 12, left: 'A', right: 'T', yPos: 12, rotation: 432 },
  { id: 13, left: 'C', right: 'G', yPos: 13, rotation: 468 },
];

export const DnaLab: React.FC<DnaLabProps> = ({ onTakeQuiz, onRecordExperiment }) => {
  const [selectedBase, setSelectedBase] = useState<DnaBase | null>('A');
  const [rotationSpeed, setRotationSpeed] = useState(0.018);
  const [isRotating, setIsRotating] = useState(true);
  const [zoom, setZoom] = useState(1.0);
  const [isReplicating, setIsReplicating] = useState(false);
  const [replicationProgress, setReplicationProgress] = useState(0); // 0 to 100%
  const [selectedComponentId, setSelectedComponentId] = useState<string>('nucleotide');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const angleRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const lastMouseXRef = useRef(0);

  useEffect(() => {
    onRecordExperiment('dna');
  }, []);

  // Handle Replication Progress Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isReplicating && replicationProgress < 100) {
      timer = setInterval(() => {
        setReplicationProgress((prev) => {
          if (prev >= 100) {
            setIsReplicating(false);
            return 100;
          }
          return prev + 1;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isReplicating, replicationProgress]);

  const handleStartReplication = () => {
    onRecordExperiment('dna');
    if (replicationProgress >= 100) {
      setReplicationProgress(0);
    }
    setIsReplicating(true);
  };

  const handlePauseReplication = () => {
    setIsReplicating(false);
  };

  const handleReset = () => {
    setIsReplicating(false);
    setReplicationProgress(0);
    setZoom(1.0);
    setRotationSpeed(0.018);
    setIsRotating(true);
  };

  // Base Color Mapping
  const getBaseColor = (base: DnaBase) => {
    switch (base) {
      case 'A':
        return { fill: '#ef4444', text: '#fee2e2', border: '#b91c1c', name: 'Adenine' };
      case 'T':
        return { fill: '#0ea5e9', text: '#e0f2fe', border: '#0369a1', name: 'Thymine' };
      case 'C':
        return { fill: '#10b981', text: '#d1fae5', border: '#047857', name: 'Cytosine' };
      case 'G':
        return { fill: '#f59e0b', text: '#fef3c7', border: '#b45309', name: 'Guanine' };
    }
  };

  const getComplementaryBase = (base: DnaBase): DnaBase => {
    switch (base) {
      case 'A': return 'T';
      case 'T': return 'A';
      case 'C': return 'G';
      case 'G': return 'C';
    }
  };

  // 3D Canvas Rendering
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

    const render = () => {
      if (isRotating && !isDraggingRef.current) {
        angleRef.current += rotationSpeed;
      }

      ctx.clearRect(0, 0, width, height);

      // Dark futuristic laboratory background
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7);
      bgGrad.addColorStop(0, '#0d1d1a');
      bgGrad.addColorStop(0.7, '#07100e');
      bgGrad.addColorStop(1, '#050a09');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Grid coordinate lines
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = 95 * zoom;
      const stepY = 28 * zoom;
      const totalPairs = INITIAL_PAIRS.length;
      const startY = centerY - (totalPairs * stepY) / 2;

      // Replication strand separation displacement
      const separation = (replicationProgress / 100) * 120 * zoom;

      // Render helper: draws a single DNA double helix segment
      const drawHelixSegment = (
        pair: DnaPair,
        offsetX: number,
        isDaughter: boolean,
        fadeAlpha: number
      ) => {
        const theta = (pair.rotation * Math.PI) / 180 + angleRef.current;
        const currentY = startY + pair.yPos * stepY;

        // 3D coordinates on horizontal circle
        const x1 = offsetX + Math.cos(theta) * radius;
        const z1 = Math.sin(theta); // depth (-1 to 1)

        const x2 = offsetX + Math.cos(theta + Math.PI) * radius;
        const z2 = Math.sin(theta + Math.PI);

        // Depth perspective scaling
        const scale1 = 0.8 + 0.35 * ((z1 + 1) / 2);
        const scale2 = 0.8 + 0.35 * ((z2 + 1) / 2);

        const nodeRadius1 = 9 * zoom * scale1;
        const nodeRadius2 = 9 * zoom * scale2;

        const leftCol = getBaseColor(pair.left);
        const rightCol = getBaseColor(pair.right);

        // 1. Draw Hydrogen Bond Bridges (only if not unzipped by replication)
        const unzipped = replicationProgress > 20 && pair.yPos <= Math.floor((replicationProgress / 100) * totalPairs);

        if (!unzipped) {
          ctx.beginPath();
          ctx.moveTo(x1, currentY);
          ctx.lineTo(x2, currentY);
          ctx.strokeStyle = `rgba(148, 163, 184, ${0.4 * fadeAlpha})`;
          ctx.lineWidth = 2 * zoom;
          ctx.stroke();

          // Dotted hydrogen bond indicators
          const bondCount = pair.left === 'C' || pair.left === 'G' ? 3 : 2;
          for (let b = 1; b <= bondCount; b++) {
            const bx = x1 + (x2 - x1) * (0.35 + (b * 0.3) / (bondCount + 1));
            ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * fadeAlpha})`;
            ctx.beginPath();
            ctx.arc(bx, currentY, 2 * zoom, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Draw left base sphere
        const alpha1 = (0.4 + 0.6 * ((z1 + 1) / 2)) * fadeAlpha;
        ctx.fillStyle = leftCol.fill;
        ctx.globalAlpha = alpha1;
        ctx.beginPath();
        ctx.arc(x1, currentY, nodeRadius1, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = leftCol.border;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label on sphere
        if (scale1 > 0.85) {
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.floor(10 * zoom)}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(pair.left, x1, currentY);
        }

        // Draw right base sphere
        const alpha2 = (0.4 + 0.6 * ((z2 + 1) / 2)) * fadeAlpha;
        ctx.fillStyle = rightCol.fill;
        ctx.globalAlpha = alpha2;
        ctx.beginPath();
        ctx.arc(x2, currentY, nodeRadius2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = rightCol.border;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (scale2 > 0.85) {
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.floor(10 * zoom)}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(pair.right, x2, currentY);
        }

        ctx.globalAlpha = 1;
      };

      // Draw sugar-phosphate backbone ribbons linking consecutive steps
      const drawBackboneRibbons = (offsetX: number, fadeAlpha: number) => {
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.75 * fadeAlpha})`;
        ctx.lineWidth = 3.5 * zoom;

        // Strand 1
        ctx.beginPath();
        for (let i = 0; i < totalPairs; i++) {
          const pair = INITIAL_PAIRS[i];
          const theta = (pair.rotation * Math.PI) / 180 + angleRef.current;
          const x = offsetX + Math.cos(theta) * radius;
          const y = startY + pair.yPos * stepY;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Strand 2
        ctx.strokeStyle = `rgba(20, 184, 166, ${0.75 * fadeAlpha})`;
        ctx.beginPath();
        for (let i = 0; i < totalPairs; i++) {
          const pair = INITIAL_PAIRS[i];
          const theta = (pair.rotation * Math.PI) / 180 + angleRef.current + Math.PI;
          const x = offsetX + Math.cos(theta) * radius;
          const y = startY + pair.yPos * stepY;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      if (replicationProgress === 0) {
        // Single parent double helix centered
        drawBackboneRibbons(centerX, 1);
        INITIAL_PAIRS.forEach((pair) => drawHelixSegment(pair, centerX, false, 1));
      } else {
        // Semi-conservative replication split: Left daughter and Right daughter forming
        // Left Strand & newly synthesizing right partner
        drawBackboneRibbons(centerX - separation, 1);
        INITIAL_PAIRS.forEach((pair) =>
          drawHelixSegment(pair, centerX - separation, true, 1)
        );

        // Right Strand & newly synthesizing left partner
        drawBackboneRibbons(centerX + separation, 1);
        INITIAL_PAIRS.forEach((pair) =>
          drawHelixSegment(pair, centerX + separation, true, 1)
        );

        // Helicase Enzyme Visual Representation at replication fork
        const forkY = startY + (replicationProgress / 100) * (totalPairs * stepY);
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(centerX, forkY, 18 * zoom, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#fda4af';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '700 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('HELICASE', centerX, forkY);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [zoom, rotationSpeed, isRotating, replicationProgress]);

  // Mouse drag handler for manual 3D rotation
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMouseXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseXRef.current;
    lastMouseXRef.current = e.clientX;
    angleRef.current += dx * 0.015;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const activeComponent = DNA_COMPONENTS.find((c) => c.id === selectedComponentId) || DNA_COMPONENTS[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Station Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2.5 text-emerald-400">
            <Dna className="h-6 w-6" />
            <span className="font-mono text-xs tracking-widest uppercase">LAB STATION 03</span>
          </div>
          <h1 className="font-['Chakra_Petch'] text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            DNA MOLECULAR STRUCTURE & REPLICATION LAB
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Interact with the 3D double helix, examine nucleotide base pairing, and simulate semi-conservative replication.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            id="dna-rotate-toggle-btn"
            onClick={() => setIsRotating(!isRotating)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500"
          >
            {isRotating ? <Pause className="h-4 w-4 text-amber-400" /> : <Play className="h-4 w-4 text-emerald-400" />}
            <span>{isRotating ? 'Pause Spin' : 'Auto Spin'}</span>
          </button>

          <button
            id="dna-reset-btn"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500"
          >
            <RotateCcw className="h-4 w-4 text-cyan-400" />
            <span>Reset</span>
          </button>

          <button
            id="dna-quiz-shortcut-btn"
            onClick={() => onTakeQuiz('dna')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:brightness-110"
          >
            <span>TAKE DNA QUIZ</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Simulation & Base Pairs (8 cols) / Educational Info (4 cols) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: 3D Canvas & Replication Controls (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Canvas Viewport */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-[#070b14] shadow-2xl shadow-emerald-950/20">
            {/* Overlay Badges */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/85 px-3 py-1 text-xs font-mono text-slate-200 backdrop-blur-md">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold uppercase tracking-wider">
                  {isReplicating
                    ? `REPLICATING: ${replicationProgress}%`
                    : replicationProgress === 100
                    ? 'REPLICATION COMPLETE (2 DAUGHTER MOLECULES)'
                    : 'B-DNA DOUBLE HELIX'}
                </span>
              </div>

              {/* Zoom controls */}
              <div className="flex items-center gap-1 pointer-events-auto">
                <button
                  onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
                  aria-label="Zoom in"
                  className="rounded-lg border border-slate-700 bg-slate-900/80 p-1.5 text-slate-300 hover:bg-slate-800"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setZoom((z) => Math.max(0.65, z - 0.15))}
                  aria-label="Zoom out"
                  className="rounded-lg border border-slate-700 bg-slate-900/80 p-1.5 text-slate-300 hover:bg-slate-800"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 3D Canvas */}
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full h-[460px] cursor-grab active:cursor-grabbing block"
              aria-label="3D Interactive DNA Double Helix Visualizer"
            />

            {/* Bottom Bar over canvas */}
            <div className="border-t border-slate-800 bg-slate-950/80 p-3 px-5 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-emerald-400">★ DRAG:</span> Rotate in 3D
                <span className="text-emerald-400 ml-2">★ SPEED:</span>
                <input
                  type="range"
                  min="0.005"
                  max="0.05"
                  step="0.005"
                  value={rotationSpeed}
                  onChange={(e) => setRotationSpeed(Number(e.target.value))}
                  className="w-16 accent-emerald-500 h-1.5 bg-slate-800 cursor-pointer"
                />
              </div>
              <div className="text-slate-400">
                DIAMETER: <span className="text-white font-bold">2.0 nm</span> | BASE PAIR RISE: <span className="text-white font-bold">0.34 nm</span>
              </div>
            </div>
          </div>

          {/* DNA Replication Control Bar */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h4 className="font-['Chakra_Petch'] text-sm font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-2">
                  <Split className="h-4 w-4" />
                  SEMI-CONSERVATIVE REPLICATION ENGINE
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Watch DNA Helicase unzip the hydrogen bonds while DNA Polymerase synthesizes complementary daughter strands.
                </p>
              </div>

              {/* Replication Trigger Buttons */}
              <div className="flex items-center gap-2">
                {isReplicating ? (
                  <button
                    onClick={handlePauseReplication}
                    className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/20 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/30"
                  >
                    <Pause className="h-3.5 w-3.5" />
                    PAUSE
                  </button>
                ) : (
                  <button
                    onClick={handleStartReplication}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:brightness-110"
                  >
                    <Play className="h-3.5 w-3.5 fill-slate-950" />
                    START REPLICATION
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsReplicating(false);
                    setReplicationProgress(0);
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-slate-500"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  RESET
                </button>
              </div>
            </div>

            {/* Replication Progress Bar */}
            <div className="relative mt-2">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>Helicase Unzipping: {replicationProgress}%</span>
                <span>Two Identical DNA Molecules: {replicationProgress === 100 ? 'Complete' : 'In Progress'}</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-150"
                  style={{ width: `${replicationProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Base-Pair Controls */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <h4 className="font-['Chakra_Petch'] text-sm font-bold tracking-wider text-white uppercase flex items-center gap-2 mb-3">
              <Atom className="h-4 w-4 text-emerald-400" />
              INTERACTIVE COMPLEMENTARY BASE-PAIR EXPLORER
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              Select any of the four nitrogenous bases below to observe its strict complementary pairing rule:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['A', 'T', 'C', 'G'] as DnaBase[]).map((base) => {
                const info = getBaseColor(base);
                const isSelected = selectedBase === base;
                return (
                  <button
                    key={base}
                    onClick={() => {
                      onRecordExperiment('dna');
                      setSelectedBase(base);
                    }}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-white ring-2 ring-emerald-400/50 bg-slate-800'
                        : 'border-slate-700/80 bg-slate-900/60 hover:border-slate-500'
                    }`}
                  >
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl font-['Chakra_Petch'] text-xl font-bold text-white shadow-lg"
                      style={{ backgroundColor: info.fill }}
                    >
                      {base}
                    </span>
                    <span className="mt-2 text-xs font-semibold text-slate-200">{info.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {base === 'A' || base === 'G' ? 'Purine (2 Rings)' : 'Pyrimidine (1 Ring)'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Complementary Base Pairing Display */}
            {selectedBase && (
              <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg font-bold text-white"
                      style={{ backgroundColor: getBaseColor(selectedBase).fill }}
                    >
                      {selectedBase}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-xs text-emerald-400 font-bold">
                        {selectedBase === 'A' || selectedBase === 'T' ? '== 2 Hydrogen Bonds ==' : '≡≡ 3 Hydrogen Bonds ≡≡'}
                      </span>
                      <span className="text-[10px] text-slate-400">Complementary Pair</span>
                    </div>
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg font-bold text-white"
                      style={{ backgroundColor: getBaseColor(getComplementaryBase(selectedBase)).fill }}
                    >
                      {getComplementaryBase(selectedBase)}
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 sm:text-right">
                    <span className="font-bold text-emerald-300">
                      Chargaff’s Rule: {selectedBase} pairs strictly with {getComplementaryBase(selectedBase)}!
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Maintains a uniform 2.0 nm width throughout the entire DNA spiral.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Clickable DNA Components & Informational Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Clickable Components */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl">
            <h3 className="font-['Chakra_Petch'] text-lg font-bold tracking-wide text-white uppercase flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              CLICKABLE DNA COMPONENTS
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Select any sub-structure to inspect its molecular formula and biochemical role:
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {DNA_COMPONENTS.map((comp) => {
                const isActive = selectedComponentId === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => {
                      onRecordExperiment('dna');
                      setSelectedComponentId(comp.id);
                    }}
                    className={`rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                        : 'border border-slate-700 bg-slate-800/80 text-slate-300 hover:border-emerald-500/50 hover:text-white'
                    }`}
                  >
                    {comp.name}
                  </button>
                );
              })}
            </div>

            {/* Selected Component Detail Box */}
            <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-1">
                <span>{activeComponent.formula}</span>
                <span className="text-[10px] text-slate-400">{activeComponent.role}</span>
              </div>
              <h4 className="font-bold text-white text-sm mt-1">{activeComponent.name}</h4>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                {activeComponent.description}
              </p>
            </div>
          </div>

          {/* Educational Information: How Does DNA Store Information? */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <h4 className="font-['Chakra_Petch'] text-sm font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4" />
              HOW DOES DNA STORE INFORMATION?
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">1. The Double Helix:</strong> DNA is composed of two anti-parallel
                polynucleotide strands winding around an imaginary central axis, like a twisted rope ladder.
              </p>
              <p>
                <strong className="text-white">2. Nucleotides:</strong> Each rung of the ladder consists of matching
                nitrogenous base pairs (A with T, C with G) anchored to a rigid sugar-phosphate backbone.
              </p>
              <p>
                <strong className="text-white">3. Genetic Code:</strong> The precise linear sequence of these bases
                spells out instructions for assembling proteins through codons (triplets of bases like ATG for Methionine).
              </p>
              <p>
                <strong className="text-white">4. High Information Density:</strong> All the genetic instructions to build
                and operate a human body are stored inside just 6 picograms of DNA per cell nucleus!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
