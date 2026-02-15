
export type Language = 'English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Marathi' | 'Bengali' | 'Kannada';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  goal?: string; // e.g., "JEE 2025"
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  phantomStepDetected?: boolean;
  misconceptionDescription?: string;
  rubricFeedback?: string;
  stressLevel?: 'low' | 'medium' | 'high';
  analogyUsed?: string;
}

export interface TopicMastery {
  name: string;
  mastery: number; // 0 to 100
  status: 'proficient' | 'developing' | 'learning';
  connectedTo?: string[]; // For the graph
}

export interface StudyModule {
  id: string;
  week: number;
  subject: string;
  topic: string;
  chapter: string;
  status: 'completed' | 'current' | 'upcoming';
  priority: 'high' | 'medium' | 'low';
}

export interface StudyPlan {
  id: string;
  examType: 'CBSE Boards' | 'JEE Mains' | 'NEET';
  examDate: string;
  modules: StudyModule[];
  createdAt: number;
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
  user: User | null;
  language: Language;
  selectedSubject: 'Physics' | 'Chemistry' | 'Maths' | 'Biology';
  messages: ChatMessage[];
  isThinking: boolean;
  stressWarning: boolean;
  stressLevel: 'low' | 'medium' | 'high';
  stats: UserStats;
  notifications: Notification[];
  studyPlan: StudyPlan | null;
}

export const SUPPORTED_LANGUAGES: Language[] = ['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Kannada'];

export const SUBJECTS = ['Physics', 'Chemistry', 'Maths', 'Biology'] as const;
