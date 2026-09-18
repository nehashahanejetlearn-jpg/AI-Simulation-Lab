import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ParticleBackground } from './components/ParticleBackground';
import { HeroSection } from './components/HeroSection';
import { SimulationSelection } from './components/SimulationSelection';
import { VolcanoLab } from './components/VolcanoLab';
import { RocketLab } from './components/RocketLab';
import { DnaLab } from './components/DnaLab';
import { QuizArena } from './components/QuizArena';
import { AiAssistant } from './components/AiAssistant';
import { ProgressDashboard } from './components/ProgressDashboard';
import { SimulationTab, QuizTopic, UserProgress } from './types';
import { BADGES_LIST } from './data/scienceFacts';
import { Flame, Rocket, Dna, Sparkles, BookOpen, Bot, Award, Cpu } from 'lucide-react';

const STORAGE_KEY = 'ai_science_simulation_lab_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  simulationsExplored: {
    volcano: false,
    rocket: false,
    dna: false,
  },
  quizzesCompleted: {},
  badges: BADGES_LIST,
  totalExperimentsRun: 0,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<SimulationTab>('home');
  const [selectedQuizTopic, setSelectedQuizTopic] = useState<QuizTopic>('mixed');
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_PROGRESS;
  });

  // Save progress to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      // ignore
    }
  }, [progress]);

  // Evaluate badge unlocks
  const evaluateBadges = (updatedProgress: UserProgress) => {
    const badges = [...updatedProgress.badges];

    // Volcanologist Badge
    const volcanoQuiz = updatedProgress.quizzesCompleted.volcano;
    if (updatedProgress.simulationsExplored.volcano && (volcanoQuiz?.score || 0) >= 3) {
      const b = badges.find((x) => x.id === 'badge-volcano');
      if (b && !b.unlocked) b.unlocked = true;
    }

    // Rocket Scientist Badge
    const rocketQuiz = updatedProgress.quizzesCompleted.rocket;
    if (updatedProgress.simulationsExplored.rocket && (rocketQuiz?.score || 0) >= 3) {
      const b = badges.find((x) => x.id === 'badge-rocket');
      if (b && !b.unlocked) b.unlocked = true;
    }

    // Geneticist Badge
    const dnaQuiz = updatedProgress.quizzesCompleted.dna;
    if (updatedProgress.simulationsExplored.dna && (dnaQuiz?.score || 0) >= 3) {
      const b = badges.find((x) => x.id === 'badge-dna');
      if (b && !b.unlocked) b.unlocked = true;
    }

    // Master Scientist Badge
    const hasThreeBasic =
      badges.find((x) => x.id === 'badge-volcano')?.unlocked &&
      badges.find((x) => x.id === 'badge-rocket')?.unlocked &&
      badges.find((x) => x.id === 'badge-dna')?.unlocked;

    if (hasThreeBasic) {
      const b = badges.find((x) => x.id === 'badge-master');
      if (b && !b.unlocked) b.unlocked = true;
    }

    return badges;
  };

  const recordExperiment = (type: 'volcano' | 'rocket' | 'dna') => {
    setProgress((prev) => {
      const updated: UserProgress = {
        ...prev,
        simulationsExplored: {
          ...prev.simulationsExplored,
          [type]: true,
        },
        totalExperimentsRun: prev.totalExperimentsRun + 1,
      };
      updated.badges = evaluateBadges(updated);
      return updated;
    });
  };

  const handleQuizComplete = (topic: QuizTopic, score: number, total: number) => {
    setProgress((prev) => {
      const updated: UserProgress = {
        ...prev,
        quizzesCompleted: {
          ...prev.quizzesCompleted,
          [topic]: {
            topic,
            score,
            total,
            completedAt: new Date().toISOString(),
          },
        },
      };
      updated.badges = evaluateBadges(updated);
      return updated;
    });
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset all lab progress, experiment counts, and badges?')) {
      setProgress(DEFAULT_PROGRESS);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }
  };

  const handleStartQuizTopic = (topic: QuizTopic) => {
    setSelectedQuizTopic(topic);
    setActiveTab('quizzes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSimulations = () => {
    const el = document.getElementById('simulation-selection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('home');
      setTimeout(() => {
        document.getElementById('simulation-selection')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Progress metrics for cards
  const volcanoMastery = Math.min(
    100,
    (progress.simulationsExplored.volcano ? 50 : 0) +
      ((progress.quizzesCompleted.volcano?.score || 0) / 5) * 50
  );
  const rocketMastery = Math.min(
    100,
    (progress.simulationsExplored.rocket ? 50 : 0) +
      ((progress.quizzesCompleted.rocket?.score || 0) / 5) * 50
  );
  const dnaMastery = Math.min(
    100,
    (progress.simulationsExplored.dna ? 50 : 0) +
      ((progress.quizzesCompleted.dna?.score || 0) / 5) * 50
  );

  return (
    <div className="relative min-h-screen bg-[#070b14] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Dynamic Animated Particle Sky Canvas */}
      <ParticleBackground />

      {/* Top Futuristic Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        badgeCount={progress.badges.filter((b) => b.unlocked).length}
      />

      {/* Main Content Area */}
      <main className="relative z-10 pt-20 pb-24">
        {activeTab === 'home' && (
          <>
            <HeroSection onEnterLab={scrollToSimulations} />
            <SimulationSelection
              onSelectTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              volcanoProgress={Math.round(volcanoMastery)}
              rocketProgress={Math.round(rocketMastery)}
              dnaProgress={Math.round(dnaMastery)}
            />

            {/* Quick Access Floating Row to AI Assistant and Quizzes */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-cyan-950/30 p-6 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
                      <Bot className="h-4 w-4" />
                      <span>SYNTHETIC TUTOR</span>
                    </div>
                    <h3 className="font-['Chakra_Petch'] text-lg font-bold text-white">
                      Ask NOVA the Science Assistant
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md">
                      Curious about why volcanoes explode or how rockets achieve orbit? Get student-friendly explanations in seconds.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('ai-assistant');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="shrink-0 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-slate-950 hover:brightness-110 shadow-md shadow-cyan-500/20"
                  >
                    Open AI Tutor
                  </button>
                </div>

                <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-r from-slate-900/80 to-purple-950/30 p-6 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-purple-400 text-xs font-mono mb-1">
                      <Award className="h-4 w-4" />
                      <span>EVALUATION ARENA</span>
                    </div>
                    <h3 className="font-['Chakra_Petch'] text-lg font-bold text-white">
                      Test Your Science Knowledge
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md">
                      Earn scientific badges like “Volcanologist” and “Rocket Scientist” through interactive quizzes.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedQuizTopic('mixed');
                      setActiveTab('quizzes');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="shrink-0 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:brightness-110 shadow-md shadow-purple-500/20"
                  >
                    Take Quiz
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'volcano' && (
          <VolcanoLab
            onTakeQuiz={(topic) => handleStartQuizTopic(topic)}
            onRecordExperiment={() => recordExperiment('volcano')}
          />
        )}

        {activeTab === 'rocket' && (
          <RocketLab
            onTakeQuiz={(topic) => handleStartQuizTopic(topic)}
            onRecordExperiment={() => recordExperiment('rocket')}
          />
        )}

        {activeTab === 'dna' && (
          <DnaLab
            onTakeQuiz={(topic) => handleStartQuizTopic(topic)}
            onRecordExperiment={() => recordExperiment('dna')}
          />
        )}

        {activeTab === 'quizzes' && (
          <QuizArena
            initialTopic={selectedQuizTopic}
            onQuizComplete={handleQuizComplete}
            onExploreLabs={scrollToSimulations}
          />
        )}

        {activeTab === 'ai-assistant' && <AiAssistant />}

        {activeTab === 'dashboard' && (
          <ProgressDashboard
            progress={progress}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/90 py-8 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-['Chakra_Petch'] font-bold text-sm">
              AI
            </div>
            <div>
              <span className="font-['Chakra_Petch'] font-bold text-sm text-white">
                AI SCIENCE SIMULATION LAB
              </span>
              <p className="text-[11px] text-slate-500">
                Explore. Experiment. Discover. — Interactive STEM platform for students
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <button
              onClick={() => {
                setActiveTab('volcano');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-orange-400"
            >
              Volcano
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => {
                setActiveTab('rocket');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-blue-400"
            >
              Rocket
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => {
                setActiveTab('dna');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-emerald-400"
            >
              DNA
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => {
                setActiveTab('quizzes');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-cyan-400"
            >
              Quizzes
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => {
                setActiveTab('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-purple-400"
            >
              Dashboard
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
