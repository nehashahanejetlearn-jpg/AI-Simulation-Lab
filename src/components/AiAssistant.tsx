import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Volume2,
  VolumeX,
  Lightbulb,
  CornerDownLeft,
  RotateCcw,
  Loader2,
  Cpu,
} from 'lucide-react';
import { AiMessage } from '../types';

const INITIAL_MESSAGES: AiMessage[] = [
  {
    id: 'welcome-1',
    sender: 'ai',
    text: "Greetings, cadet! I am NOVA, your AI Science Assistant. Ask me anything about magma viscosity, rocket escape velocity, or DNA nucleotide sequences!",
    timestamp: new Date(),
  },
];

const SUGGESTED_QUESTIONS = [
  'Why do volcanoes erupt?',
  'How do rockets escape Earth gravity?',
  'What is complementary base pairing in DNA?',
  'What causes a volcano to become explosive?',
  'How does rocket mass affect acceleration?',
  'What is the role of DNA Helicase?',
];

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<AiMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Subtle futuristic Web Audio beep synthesizer
  const playFuturisticSound = (type: 'send' | 'receive') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'send') {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } else {
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.18);
      }
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    playFuturisticSound('send');

    const userMessage: AiMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToSend.trim() }),
      });

      const data = await response.json();
      const answerText = data.answer || "I've analyzed your science query: science simulations demonstrate how dynamic variables interact in real world physics!";

      playFuturisticSound('receive');

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: answerText,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: "Volcanoes erupt due to high magma and gas pressures; rockets ascend via Newton's third law of action-reaction; and DNA pairs A with T and C with G through hydrogen bonds.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-mono text-cyan-400 mb-3">
          <Cpu className="h-4 w-4 text-cyan-400" />
          <span>SYNTHETIC INTELLIGENCE TUTOR</span>
        </div>
        <h1 className="font-['Chakra_Petch'] text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
          AI SCIENCE ASSISTANT (NOVA)
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
          Ask questions about any simulation lab to receive clear, student-friendly scientific explanations.
        </p>
      </div>

      {/* Futuristic Chat Terminal Box */}
      <div className="overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-900/80 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500" />
            </div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
              NOVA v3.2 // AI SCIENCE ENGINE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:text-white transition-colors"
              title={soundEnabled ? 'Disable Audio UI Beeps' : 'Enable Audio UI Beeps'}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-cyan-400" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              onClick={handleClear}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:text-white transition-colors"
              title="Reset Conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div className="h-[420px] overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40">
                    <Bot className="h-5 w-5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                    isAi
                      ? 'border border-cyan-500/20 bg-slate-950/70 text-slate-200 shadow-lg'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium shadow-md shadow-cyan-500/20'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block mt-2 font-mono text-[10px] ${
                      isAi ? 'text-slate-500' : 'text-slate-900/70'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {!isAi && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-blue-600/30 text-blue-300 ring-1 ring-blue-500/40">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40">
                <Bot className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-slate-950/70 px-4 py-3 text-xs font-mono text-cyan-400">
                <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                <span>SYNTHESIZING SCIENTIFIC RESPONSE...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        <div className="border-t border-slate-800/80 bg-slate-950/50 p-3 sm:px-6">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-2">
            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
            <span>SUGGESTED SCIENCE INQUIRIES:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300 transition-colors hover:border-cyan-500/50 hover:text-white disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* User Input Bar */}
        <div className="border-t border-slate-800 bg-slate-950/90 p-4 sm:px-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a science question (e.g. 'Why does higher temperature make lava less viscous?')..."
              className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
