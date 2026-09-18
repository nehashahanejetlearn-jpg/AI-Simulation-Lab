import React from 'react';
import { Flame, Rocket, Dna, CheckCircle2, ChevronRight, Activity, Gauge, Sparkles } from 'lucide-react';
import { SimulationTab } from '../types';

interface SimulationSelectionProps {
  onSelectTab: (tab: SimulationTab) => void;
  volcanoProgress: number;
  rocketProgress: number;
  dnaProgress: number;
}

export const SimulationSelection: React.FC<SimulationSelectionProps> = ({
  onSelectTab,
  volcanoProgress,
  rocketProgress,
  dnaProgress,
}) => {
  return (
    <section id="simulation-selection" className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs font-mono text-cyan-400 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>CHOOSE YOUR SCIENTIFIC EXPERIMENT</span>
          </div>
          <h2 className="font-['Chakra_Petch'] text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            INTERACTIVE SIMULATION LABS
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
            Select a laboratory station below to manipulate realistic physics parameters, run live trials,
            and master foundational science concepts.
          </p>
        </div>

        {/* 3 Large Interactive Simulation Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Card 1: VOLCANO LAB */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-b from-slate-900/90 via-[#130f14]/80 to-[#0c090e] p-6 sm:p-8 shadow-xl shadow-orange-950/20 backdrop-blur-xl transition-all duration-300 hover:border-orange-400/60 hover:shadow-2xl hover:shadow-orange-500/10">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-orange-500/15 blur-3xl transition-opacity group-hover:opacity-100" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/40 group-hover:scale-105 transition-transform">
                  <Flame className="h-8 w-8" />
                </div>
                <div className="text-right">
                  <span className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest">Mastery</span>
                  <span className="font-mono text-xs font-bold text-orange-400">{volcanoProgress}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-600 to-amber-400 transition-all duration-500"
                  style={{ width: `${volcanoProgress}%` }}
                />
              </div>

              {/* Title & Description */}
              <h3 className="mt-6 font-['Chakra_Petch'] text-2xl font-bold tracking-wide text-white group-hover:text-orange-300 transition-colors">
                🌋 VOLCANO LAB
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                “Explore how pressure, magma, gases, and temperature interact to create volcanic eruptions.”
              </p>

              {/* Features List */}
              <div className="mt-6 border-t border-slate-800/80 pt-5">
                <h4 className="font-mono text-xs font-semibold tracking-wider text-orange-400/90 uppercase mb-3 flex items-center gap-1.5">
                  <Gauge className="h-3.5 w-3.5" /> Simulation Capabilities:
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                    <span>Adjust magma pressure (0–100)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                    <span>Adjust temperature (0–1500°C)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                    <span>Adjust gas concentration (0–100%)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                    <span>Control eruption intensity & VEI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                    <span>Observe lava flow viscosity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                    <span>Observe smoke, ash & incandescent glow</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                    <span>Start/Pause/Reset simulation</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8">
              <button
                id="btn-explore-volcano"
                onClick={() => onSelectTab('volcano')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-orange-500/20 transition-all hover:brightness-110 active:scale-95"
              >
                <span>EXPLORE VOLCANO</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Card 2: ROCKET LAB */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-b from-slate-900/90 via-[#0b1325]/80 to-[#070d18] p-6 sm:p-8 shadow-xl shadow-blue-950/20 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/60 hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-blue-500/15 blur-3xl transition-opacity group-hover:opacity-100" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40 group-hover:scale-105 transition-transform">
                  <Rocket className="h-8 w-8" />
                </div>
                <div className="text-right">
                  <span className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest">Mastery</span>
                  <span className="font-mono text-xs font-bold text-blue-400">{rocketProgress}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500"
                  style={{ width: `${rocketProgress}%` }}
                />
              </div>

              {/* Title & Description */}
              <h3 className="mt-6 font-['Chakra_Petch'] text-2xl font-bold tracking-wide text-white group-hover:text-blue-300 transition-colors">
                🚀 ROCKET LAB
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                “Discover how thrust, fuel, gravity, and air resistance affect rocket launches.”
              </p>

              {/* Features List */}
              <div className="mt-6 border-t border-slate-800/80 pt-5">
                <h4 className="font-mono text-xs font-semibold tracking-wider text-blue-400/90 uppercase mb-3 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" /> Simulation Capabilities:
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span>Adjust rocket thrust (kN)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span>Adjust fuel amount (kg)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span>Adjust rocket mass</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span>Adjust gravity (Earth, Moon, Mars)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span>Adjust air resistance (drag)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span>Launch rocket & track altitude, velocity, acceleration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span>Start/Pause/Reset simulation</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8">
              <button
                id="btn-launch-rocket"
                onClick={() => onSelectTab('rocket')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-blue-500/20 transition-all hover:brightness-110 active:scale-95"
              >
                <span>LAUNCH ROCKET</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Card 3: DNA LAB */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900/90 via-[#0a1814]/80 to-[#06100d] p-6 sm:p-8 shadow-xl shadow-emerald-950/20 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/60 hover:shadow-2xl hover:shadow-emerald-500/10">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-emerald-500/15 blur-3xl transition-opacity group-hover:opacity-100" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40 group-hover:scale-105 transition-transform">
                  <Dna className="h-8 w-8" />
                </div>
                <div className="text-right">
                  <span className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest">Mastery</span>
                  <span className="font-mono text-xs font-bold text-emerald-400">{dnaProgress}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-500"
                  style={{ width: `${dnaProgress}%` }}
                />
              </div>

              {/* Title & Description */}
              <h3 className="mt-6 font-['Chakra_Petch'] text-2xl font-bold tracking-wide text-white group-hover:text-emerald-300 transition-colors">
                🧬 DNA LAB
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                “Explore the structure of DNA and discover how genetic information is organized.”
              </p>

              {/* Features List */}
              <div className="mt-6 border-t border-slate-800/80 pt-5">
                <h4 className="font-mono text-xs font-semibold tracking-wider text-emerald-400/90 uppercase mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Simulation Capabilities:
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Interactive rotating DNA double helix</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Zoom in/out controls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Select DNA bases (A, T, C, and G)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Show complementary base pairing (A-T, C-G)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Demonstrate semi-conservative replication</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Highlight individual nucleotides & backbone</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Start/Pause/Reset animation</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8">
              <button
                id="btn-explore-dna"
                onClick={() => onSelectTab('dna')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 active:scale-95"
              >
                <span>EXPLORE DNA</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
