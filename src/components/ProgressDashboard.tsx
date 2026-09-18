import React from 'react';
import {
  Award,
  Trophy,
  Flame,
  Rocket,
  Dna,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { UserProgress, SimulationTab, StudentBadge } from '../types';

interface ProgressDashboardProps {
  progress: UserProgress;
  onNavigateTab: (tab: SimulationTab) => void;
  onResetProgress: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  onNavigateTab,
  onResetProgress,
}) => {
  const earnedBadgeCount = progress.badges.filter((b: StudentBadge) => b.unlocked).length;
  const totalBadges = progress.badges.length;

  const totalQuizzesPassed = Object.values(progress.quizzesCompleted).filter(
    (q: { score: number }) => q.score > 0
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-mono text-cyan-400 mb-2">
            <Trophy className="h-4 w-4 text-cyan-400" />
            <span>CADET ACADEMIC PROFILE</span>
          </div>
          <h1 className="font-['Chakra_Petch'] text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            STUDENT PROGRESS & ACHIEVEMENTS
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Review completed laboratory simulations, scientific quiz scores, and unlocked research accolades.
          </p>
        </div>

        <button
          onClick={onResetProgress}
          className="mt-4 sm:mt-0 flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-500 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Tracking</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>LABS EXPLORED</span>
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 font-['Chakra_Petch'] text-3xl font-bold text-white">
            {Object.values(progress.simulationsExplored).filter(Boolean).length} / 3
          </div>
          <div className="mt-1 text-xs text-cyan-400">
            All primary stations active
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>TOTAL EXPERIMENTS</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 font-['Chakra_Petch'] text-3xl font-bold text-white">
            {progress.totalExperimentsRun}
          </div>
          <div className="mt-1 text-xs text-amber-400">
            Interactive parameter trials
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>QUIZZES PASSED</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-['Chakra_Petch'] text-3xl font-bold text-white">
            {totalQuizzesPassed} / 4
          </div>
          <div className="mt-1 text-xs text-emerald-400">
            Knowledge evaluations
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>BADGES EARNED</span>
            <Trophy className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 font-['Chakra_Petch'] text-3xl font-bold text-white">
            {earnedBadgeCount} / {totalBadges}
          </div>
          <div className="mt-1 text-xs text-purple-400">
            Scientific honors unlocked
          </div>
        </div>
      </div>

      {/* 3 Simulation Station Status Cards */}
      <h3 className="font-['Chakra_Petch'] text-xl font-bold tracking-wide text-white uppercase mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-cyan-400" />
        SIMULATION PROGRESSION
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Volcano Station */}
        <div className="rounded-3xl border border-orange-500/20 bg-slate-900/70 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400">
              <Flame className="h-6 w-6" />
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase ${
                progress.simulationsExplored.volcano
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {progress.simulationsExplored.volcano ? 'Explored' : 'Not Started'}
            </span>
          </div>

          <h4 className="mt-4 font-['Chakra_Petch'] text-lg font-bold text-white">
            VOLCANO LAB
          </h4>
          <p className="mt-1 text-xs text-slate-400">
            Thermodynamics & magma chamber pressures.
          </p>

          <div className="mt-4 border-t border-slate-800 pt-3 text-xs text-slate-300 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Quiz Score:</span>
              <span className="text-orange-400 font-bold">
                {progress.quizzesCompleted.volcano ? `${progress.quizzesCompleted.volcano.score}/${progress.quizzesCompleted.volcano.total}` : 'Unattempted'}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('volcano')}
            className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-orange-500/40 bg-orange-500/10 py-2.5 text-xs font-bold text-orange-300 hover:bg-orange-500/20"
          >
            <span>Launch Station</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Rocket Station */}
        <div className="rounded-3xl border border-blue-500/20 bg-slate-900/70 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400">
              <Rocket className="h-6 w-6" />
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase ${
                progress.simulationsExplored.rocket
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {progress.simulationsExplored.rocket ? 'Explored' : 'Not Started'}
            </span>
          </div>

          <h4 className="mt-4 font-['Chakra_Petch'] text-lg font-bold text-white">
            ROCKET PROPULSION
          </h4>
          <p className="mt-1 text-xs text-slate-400">
            Orbital mechanics, thrust, and atmospheric drag.
          </p>

          <div className="mt-4 border-t border-slate-800 pt-3 text-xs text-slate-300 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Quiz Score:</span>
              <span className="text-blue-400 font-bold">
                {progress.quizzesCompleted.rocket ? `${progress.quizzesCompleted.rocket.score}/${progress.quizzesCompleted.rocket.total}` : 'Unattempted'}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('rocket')}
            className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-500/10 py-2.5 text-xs font-bold text-blue-300 hover:bg-blue-500/20"
          >
            <span>Launch Station</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* DNA Station */}
        <div className="rounded-3xl border border-emerald-500/20 bg-slate-900/70 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
              <Dna className="h-6 w-6" />
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase ${
                progress.simulationsExplored.dna
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {progress.simulationsExplored.dna ? 'Explored' : 'Not Started'}
            </span>
          </div>

          <h4 className="mt-4 font-['Chakra_Petch'] text-lg font-bold text-white">
            DNA MOLECULAR LAB
          </h4>
          <p className="mt-1 text-xs text-slate-400">
            Nucleotides, double helix & semi-conservative replication.
          </p>

          <div className="mt-4 border-t border-slate-800 pt-3 text-xs text-slate-300 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Quiz Score:</span>
              <span className="text-emerald-400 font-bold">
                {progress.quizzesCompleted.dna ? `${progress.quizzesCompleted.dna.score}/${progress.quizzesCompleted.dna.total}` : 'Unattempted'}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('dna')}
            className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20"
          >
            <span>Launch Station</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Scientific Badges Earned Section */}
      <h3 className="font-['Chakra_Petch'] text-xl font-bold tracking-wide text-white uppercase mb-4 flex items-center gap-2">
        <Award className="h-5 w-5 text-purple-400" />
        SCIENTIFIC BADGES & ACCOLADES
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {progress.badges.map((badge: StudentBadge) => (
          <div
            key={badge.id}
            className={`relative overflow-hidden rounded-3xl border p-5 backdrop-blur-xl transition-all ${
              badge.unlocked
                ? 'border-purple-500/40 bg-slate-900/80 shadow-lg shadow-purple-950/20'
                : 'border-slate-800/80 bg-slate-950/40 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${
                  badge.unlocked ? 'bg-purple-500/20 ring-1 ring-purple-500/40' : 'bg-slate-800'
                }`}
              >
                {badge.icon}
              </div>

              {badge.unlocked ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <Lock className="h-4 w-4 text-slate-500" />
              )}
            </div>

            <h4 className="mt-4 font-['Chakra_Petch'] font-bold text-white text-base">
              {badge.title}
            </h4>
            <p className="mt-1 text-xs text-slate-300 leading-normal">
              {badge.description}
            </p>

            <div className="mt-3 text-[10px] font-mono uppercase tracking-wider">
              {badge.unlocked ? (
                <span className="text-emerald-400 font-bold">UNLOCKED ★ RESEARCHER</span>
              ) : (
                <span className="text-slate-500">LOCKED — COMPLETE REQUIREMENTS</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
