export type SimulationTab =
  | 'home'
  | 'volcano'
  | 'rocket'
  | 'dna'
  | 'quizzes'
  | 'ai-assistant'
  | 'dashboard';

export type QuizTopic = 'volcano' | 'rocket' | 'dna' | 'mixed';

export interface VolcanoParams {
  pressure: number; // 0 - 100
  temperature: number; // 0 - 1500 °C
  gasConcentration: number; // 0 - 100 %
  isErupting: boolean;
  status: 'dormant' | 'active' | 'erupting';
  timeStep: number;
}

export interface RocketParams {
  thrust: number; // kN (e.g. 500 - 5000)
  fuel: number; // initial kg (e.g. 5000 - 50000)
  dryMass: number; // kg (e.g. 3000 - 20000)
  gravity: number; // m/s² (e.g. 1.62 - 24.79, default 9.81)
  airResistance: number; // Drag coefficient Cd (e.g. 0.05 - 1.0, default 0.25)
  // Real-time telemetry
  altitude: number; // in meters (convert to km for display)
  velocity: number; // m/s
  acceleration: number; // m/s²
  fuelRemaining: number; // kg
  fuelPercentage: number; // %
  status: 'ready' | 'launching' | 'coasting' | 'apogee' | 'landed' | 'crashed';
  time: number; // seconds
  maxAltitude: number; // max reached altitude in meters
  flightData: Array<{ time: number; altitude: number; velocity: number }>;
}

export type DnaBase = 'A' | 'T' | 'C' | 'G';

export interface DnaPair {
  id: number;
  left: DnaBase;
  right: DnaBase;
  yPos: number;
  rotation: number;
}

export interface DnaComponentInfo {
  id: string;
  name: string;
  formula?: string;
  role: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  topic: QuizTopic;
  question: string;
  options: string[];
  correctAnswer: number;
  correctIndex?: number;
  explanation: string;
  concept?: string;
}

export interface StudentBadge {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export interface UserProgress {
  simulationsExplored: {
    volcano: boolean;
    rocket: boolean;
    dna: boolean;
  };
  quizzesCompleted: Record<
    string,
    {
      topic: QuizTopic;
      score: number;
      total: number;
      completedAt: string;
    }
  >;
  badges: StudentBadge[];
  totalExperimentsRun: number;
}

export interface AiMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date | string;
}
