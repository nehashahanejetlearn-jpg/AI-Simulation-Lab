import React from 'react';
import { ArrowDown, Flame, Rocket, Dna, Sparkles, ShieldCheck, Cpu } from 'lucide-react';

interface HeroSectionProps {
  onEnterLab: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onEnterLab }) => {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28 text-center">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-500/15 via-blue-500/20 to-purple-500/15 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute top-1/2 left-10 w-72 h-72 bg-orange-500/10 blur-[100px] rounded-full" />
      <div className="pointer-events-none absolute top-1/2 right-10 w-72 h-72 bg-emerald-500/10 blur-[100px] rounded-full" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1.5 text-xs font-mono text-cyan-300 shadow-inner backdrop-blur-md mb-6">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
          </span>
          <span>INTERACTIVE STUDENT SIMULATION ENVIRONMENT v2.5</span>
        </div>

        {/* Main Title */}
        <h1 className="font-['Chakra_Petch'] text-4xl font-extrabold uppercase tracking-tight text-white sm:text-6xl lg:text-7xl">
          AI SCIENCE{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            SIMULATION LAB
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 font-['Chakra_Petch'] text-xl font-semibold tracking-widest text-cyan-400 sm:text-2xl">
          Explore. Experiment. Discover.
        </p>

        {/* Supporting Text */}
        <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed">
          Step inside a virtual science laboratory where you can experiment with volcanoes,
          launch rockets, and explore the structure of DNA.
        </p>

        {/* Prominent CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="hero-enter-lab-btn"
            onClick={onEnterLab}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-8 py-4 text-base font-bold text-slate-950 shadow-xl shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-95"
          >
            <span className="tracking-wider">ENTER THE LAB</span>
            <ArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>
        </div>

        {/* Quick Simulation Highlights preview */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="rounded-2xl border border-orange-500/20 bg-slate-900/40 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2.5 text-orange-400">
              <Flame className="h-5 w-5" />
              <span className="font-['Chakra_Petch'] text-sm font-bold tracking-wide text-slate-200">
                VOLCANO SIMULATION
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Control magma pressure, temperature, and gas concentration to trigger realistic eruptions.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-slate-900/40 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2.5 text-blue-400">
              <Rocket className="h-5 w-5" />
              <span className="font-['Chakra_Petch'] text-sm font-bold tracking-wide text-slate-200">
                ROCKET LAUNCH
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Balance thrust, mass, gravity, and drag to launch spacecraft into suborbital and orbital trajectories.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/40 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <Dna className="h-5 w-5" />
              <span className="font-['Chakra_Petch'] text-sm font-bold tracking-wide text-slate-200">
                DNA DOUBLE HELIX
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Rotate 3D molecular structures, test base pairs, and observe semi-conservative replication in real time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
