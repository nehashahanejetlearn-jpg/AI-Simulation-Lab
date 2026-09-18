import React, { useState } from 'react';
import {
  Atom,
  Flame,
  Rocket,
  Dna,
  HelpCircle,
  Award,
  Menu,
  X,
  Play,
  Bot,
  Trophy,
} from 'lucide-react';
import { SimulationTab } from '../types';

interface NavbarProps {
  activeTab: SimulationTab;
  onSelectTab: (tab: SimulationTab) => void;
  badgeCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab, badgeCount = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: SimulationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-800/80 bg-[#070b14]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <button
          id="nav-brand-btn"
          onClick={() => handleNavClick('home')}
          className="group flex items-center gap-2.5 text-left transition-opacity hover:opacity-90"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 p-2 text-cyan-400 ring-1 ring-cyan-500/40 group-hover:ring-cyan-400">
            <Atom className="h-6 w-6 animate-[spin_12s_linear_infinite]" />
            <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-sm" />
          </div>
          <div>
            <span className="font-['Chakra_Petch'] text-lg font-bold tracking-wider text-slate-100 sm:text-xl">
              AI SCIENCE <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">LAB</span>
            </span>
            <span className="hidden font-mono text-[10px] tracking-widest text-cyan-400/80 sm:block">
              VIRTUAL SIMULATION PLATFORM
            </span>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/60 p-1 text-xs font-medium">
          <button
            id="nav-link-home"
            onClick={() => handleNavClick('home')}
            className={`rounded-full px-3 py-1.5 transition-all ${
              activeTab === 'home'
                ? 'bg-cyan-500/20 text-cyan-300 shadow-sm shadow-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Home
          </button>

          <button
            id="nav-link-volcano"
            onClick={() => handleNavClick('volcano')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all ${
              activeTab === 'volcano'
                ? 'bg-orange-500/20 text-orange-300 shadow-sm shadow-orange-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-orange-400" />
            Volcano Lab
          </button>

          <button
            id="nav-link-rocket"
            onClick={() => handleNavClick('rocket')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all ${
              activeTab === 'rocket'
                ? 'bg-blue-500/20 text-blue-300 shadow-sm shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Rocket className="h-3.5 w-3.5 text-blue-400" />
            Rocket Lab
          </button>

          <button
            id="nav-link-dna"
            onClick={() => handleNavClick('dna')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all ${
              activeTab === 'dna'
                ? 'bg-emerald-500/20 text-emerald-300 shadow-sm shadow-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dna className="h-3.5 w-3.5 text-emerald-400" />
            DNA Lab
          </button>

          <button
            id="nav-link-quiz"
            onClick={() => handleNavClick('quizzes')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all ${
              activeTab === 'quizzes'
                ? 'bg-purple-500/20 text-purple-300 shadow-sm shadow-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5 text-purple-400" />
            Quizzes
          </button>

          <button
            id="nav-link-ai"
            onClick={() => handleNavClick('ai-assistant')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all ${
              activeTab === 'ai-assistant'
                ? 'bg-cyan-500/20 text-cyan-300 shadow-sm shadow-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="h-3.5 w-3.5 text-cyan-400" />
            AI Assistant
          </button>

          <button
            id="nav-link-progress"
            onClick={() => handleNavClick('dashboard')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-amber-500/20 text-amber-300 shadow-sm shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            Dashboard ({badgeCount} Badges)
          </button>
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            id="nav-start-experiment-btn"
            onClick={() => handleNavClick(activeTab === 'home' ? 'volcano' : activeTab)}
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:brightness-110 active:scale-95"
          >
            <Play className="h-3.5 w-3.5 fill-slate-950" />
            Launch Station
          </button>

          <button
            id="nav-mobile-menu-btn"
            aria-label="Toggle Navigation Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-300 lg:hidden hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-[#070b14]/95 px-4 py-4 lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`flex items-center gap-2 rounded-lg p-2.5 text-left text-xs ${
                activeTab === 'home' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-300'
              }`}
            >
              <Atom className="h-4 w-4 text-cyan-400" />
              Home
            </button>
            <button
              onClick={() => handleNavClick('volcano')}
              className={`flex items-center gap-2 rounded-lg p-2.5 text-left text-xs ${
                activeTab === 'volcano' ? 'bg-orange-500/20 text-orange-300 font-semibold' : 'text-slate-300'
              }`}
            >
              <Flame className="h-4 w-4 text-orange-400" />
              Volcano Lab
            </button>
            <button
              onClick={() => handleNavClick('rocket')}
              className={`flex items-center gap-2 rounded-lg p-2.5 text-left text-xs ${
                activeTab === 'rocket' ? 'bg-blue-500/20 text-blue-300 font-semibold' : 'text-slate-300'
              }`}
            >
              <Rocket className="h-4 w-4 text-blue-400" />
              Rocket Lab
            </button>
            <button
              onClick={() => handleNavClick('dna')}
              className={`flex items-center gap-2 rounded-lg p-2.5 text-left text-xs ${
                activeTab === 'dna' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-300'
              }`}
            >
              <Dna className="h-4 w-4 text-emerald-400" />
              DNA Lab
            </button>
            <button
              onClick={() => handleNavClick('quizzes')}
              className={`flex items-center gap-2 rounded-lg p-2.5 text-left text-xs ${
                activeTab === 'quizzes' ? 'bg-purple-500/20 text-purple-300 font-semibold' : 'text-slate-300'
              }`}
            >
              <HelpCircle className="h-4 w-4 text-purple-400" />
              Quiz Arena
            </button>
            <button
              onClick={() => handleNavClick('ai-assistant')}
              className={`flex items-center gap-2 rounded-lg p-2.5 text-left text-xs ${
                activeTab === 'ai-assistant' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-300'
              }`}
            >
              <Bot className="h-4 w-4 text-cyan-400" />
              AI Assistant
            </button>
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`col-span-2 flex items-center justify-between rounded-lg p-2.5 text-left text-xs ${
                activeTab === 'dashboard' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                Student Dashboard
              </span>
              <span className="rounded-full bg-amber-500/30 px-2 py-0.5 text-[10px] text-amber-200">
                {badgeCount} Badges
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
