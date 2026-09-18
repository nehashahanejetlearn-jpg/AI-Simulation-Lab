import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronRight,
  Flame,
  Rocket,
  Dna,
  Shuffle,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { QuizQuestion, QuizTopic } from '../types';
import { QUIZ_COLLECTIONS } from '../data/quizData';

interface QuizArenaProps {
  initialTopic?: QuizTopic;
  onQuizComplete: (topic: QuizTopic, score: number, total: number) => void;
  onExploreLabs: () => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({
  initialTopic = 'mixed',
  onQuizComplete,
  onExploreLabs,
}) => {
  const [currentTopic, setCurrentTopic] = useState<QuizTopic>(initialTopic);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const questions: QuizQuestion[] = QUIZ_COLLECTIONS[currentTopic] || QUIZ_COLLECTIONS.volcano;
  const currentQuestion = questions[questionIndex];

  const handleSelectTopic = (topic: QuizTopic) => {
    setCurrentTopic(topic);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      setScore(newScore);
    }
  };

  const handleNext = () => {
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      onQuizComplete(currentTopic, score, questions.length);

      // Trigger confetti if high score (>= 75%)
      const percentage = Math.round((score / questions.length) * 100);
      if (percentage >= 75) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#34d399', '#fbbf24', '#f87171'],
        });
      }
    }
  };

  const handleRetake = () => {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-3.5 py-1 text-xs font-mono text-cyan-400 mb-3">
          <Award className="h-4 w-4 text-cyan-400" />
          <span>SCIENCE KNOWLEDGE EVALUATION</span>
        </div>
        <h1 className="font-['Chakra_Petch'] text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
          SCIENCE QUIZ ARENA
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
          Test your mastery of thermodynamics, rocket mechanics, and genetics with instant scientific explanations.
        </p>
      </div>

      {/* Topic Switcher Pills */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <button
          onClick={() => handleSelectTopic('volcano')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
            currentTopic === 'volcano'
              ? 'bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/25'
              : 'border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-orange-500/40'
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>Volcano Quiz</span>
        </button>

        <button
          onClick={() => handleSelectTopic('rocket')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
            currentTopic === 'rocket'
              ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/25'
              : 'border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-blue-500/40'
          }`}
        >
          <Rocket className="h-4 w-4" />
          <span>Rocket Quiz</span>
        </button>

        <button
          onClick={() => handleSelectTopic('dna')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
            currentTopic === 'dna'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
              : 'border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-emerald-500/40'
          }`}
        >
          <Dna className="h-4 w-4" />
          <span>DNA Quiz</span>
        </button>

        <button
          onClick={() => handleSelectTopic('mixed')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
            currentTopic === 'mixed'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
              : 'border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-purple-500/40'
          }`}
        >
          <Shuffle className="h-4 w-4" />
          <span>Mixed Challenge</span>
        </button>
      </div>

      {!isFinished ? (
        /* Active Question Card */
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {/* Progress Header */}
          <div className="flex items-center justify-between mb-4 text-xs font-mono">
            <span className="text-cyan-400 font-bold uppercase tracking-wider">
              QUESTION {questionIndex + 1} OF {questions.length}
            </span>
            <span className="text-slate-400">
              CURRENT SCORE: <span className="text-white font-bold">{score}</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 mb-6">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <h3 className="text-lg sm:text-xl font-bold text-white mb-6 leading-relaxed">
            {currentQuestion.question}
          </h3>

          {/* 4 Multiple Choice Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQuestion.correctAnswer;

              let optionStyle = 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-slate-600';
              if (isAnswered) {
                if (isCorrect) {
                  optionStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500';
                } else if (isSelected) {
                  optionStyle = 'border-red-500 bg-red-950/40 text-red-200 ring-1 ring-red-500';
                } else {
                  optionStyle = 'border-slate-800/40 bg-slate-950/20 text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 text-sm ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-xs font-mono font-bold text-slate-300">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-medium">{option}</span>
                  </div>

                  {isAnswered && (
                    <div className="shrink-0">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="h-5 w-5 text-red-400" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Immediate Scientific Feedback & Explanation */}
          {isAnswered && (
            <div
              className={`rounded-2xl border p-4 mb-6 transition-all ${
                selectedAnswer === currentQuestion.correctAnswer
                  ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-200'
                  : 'border-red-500/30 bg-red-950/30 text-red-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs uppercase font-mono mb-1">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>CORRECT! EXCELLENT OBSERVATION</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-400" />
                    <span>INCORRECT — HERE IS WHY:</span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <button
              id="quiz-next-question-btn"
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95"
            >
              <span>{questionIndex + 1 === questions.length ? 'COMPLETE QUIZ & VIEW SCORE' : 'NEXT QUESTION'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        /* Quiz Finished Summary View */
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-12 text-center backdrop-blur-xl shadow-2xl">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500/20 text-cyan-400 ring-2 ring-cyan-500/40">
            <Trophy className="h-10 w-10" />
          </div>

          <h2 className="font-['Chakra_Petch'] text-2xl sm:text-3xl font-bold uppercase tracking-wide text-white">
            EVALUATION COMPLETED!
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Topic: <span className="font-bold text-white capitalize">{currentTopic}</span> Science Mastery
          </p>

          <div className="my-8 inline-block rounded-3xl border border-slate-800 bg-slate-950/70 p-6 px-10">
            <div className="font-['Chakra_Petch'] text-5xl font-extrabold text-cyan-400">
              {score} <span className="text-2xl text-slate-500">/ {questions.length}</span>
            </div>
            <div className="mt-2 font-mono text-xs uppercase tracking-widest text-slate-400">
              Score: {Math.round((score / questions.length) * 100)}%
            </div>
          </div>

          <p className="text-sm text-slate-300 max-w-md mx-auto mb-8">
            {score === questions.length
              ? 'Flawless score! You have thoroughly mastered this scientific domain.'
              : score >= questions.length * 0.7
              ? 'Great job! You demonstrated a solid grasp of core physical and biological principles.'
              : 'Good effort! Review the simulation labs to see how the physical parameters interact and try again.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleRetake}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-sm font-bold text-slate-200 hover:border-slate-500 hover:text-white"
            >
              <RotateCcw className="h-4 w-4 text-cyan-400" />
              <span>RETAKE QUIZ</span>
            </button>

            <button
              onClick={onExploreLabs}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 hover:brightness-110"
            >
              <span>RETURN TO LAB STATIONS</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
