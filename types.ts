
export type Language = 'English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Marathi' | 'Bengali' | 'Kannada';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  phantomStepDetected?: boolean;
  rubricFeedback?: string;
  stressLevel?: 'low' | 'medium' | 'high';
}

export interface TopicMastery {
  name: string;
  mastery: number; // 0 to 100
  status: 'proficient' | 'developing' | 'learning';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface ForumPost {
  id: string;
  author: string;
  title: string;
  content: string;
  subject: string;
  upvotes: number;
  replies: number;
  timestamp: number;
}

export interface UserStats {
  points: number;
  level: number;
  badges: Badge[];
}

export interface Notification {
  id: string;
  type: 'forum' | 'achievement' | 'progress';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface AppState {
  language: Language;
  selectedSubject: 'Physics' | 'Chemistry' | 'Maths' | 'Biology';
  messages: ChatMessage[];
  isThinking: boolean;
  stressWarning: boolean;
  stats: UserStats;
  notifications: Notification[];
}

export const SUPPORTED_LANGUAGES: Language[] = ['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Kannada'];

export const SUBJECTS = ['Physics', 'Chemistry', 'Maths', 'Biology'] as const;
