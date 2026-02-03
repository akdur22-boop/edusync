import React from 'react';

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Only for mock auth check
}

export interface PaymentInfo {
  registrationDate: string;
  totalAmount: number;
  currency: string;
  nextPaymentDate: string;
  lastPaymentDate?: string; // New field for revenue tracking
  paymentStatus: 'paid' | 'pending' | 'overdue';
  period?: '1_month' | '3_months' | '12_months';
}

export interface Student extends User {
  role: 'student';
  studentNumber: string; // Auto-generated
  classGrade: string;
  teacherId?: string;
  parentId?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  initialNet?: number;
  paymentInfo?: PaymentInfo;
  status?: 'active' | 'passive' | 'risky';
  examGoal?: string;
  lastDataEntry?: string;
}

export interface Result {
  id: string;
  studentId: string;
  sourceName: string; // Yayın adı
  lesson: string;     // Ders
  topic: string;      // Konu
  testName: string;   // Test adı
  correct: number;
  incorrect: number;
  empty: number;
  date: string;
}

export interface AIAnalysis {
  weakTopics: string[];
  recommendation: string;
  score: number;
}

export interface TopicProgress {
  lesson: string;
  topic: string;
  totalQuestions: number;
  accuracy: number; // percentage 0-100
  solvedCount: number;
  trend: 'up' | 'down' | 'stable';
}

export interface LessonReport {
  lesson: string;
  totalQuestions: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalEmpty: number;
  accuracy: number;
  net: number; // Added net
}

export interface TopicPerformance {
  topic: string;
  lesson: string;
  accuracy: number;
  status: 'strong' | 'weak' | 'average';
}

export interface ReportCard {
  month: string;
  year: number;
  totalScore: number; // 0-100
  totalQuestions: number;
  averageAccuracy: number;
  totalNet: number;
  previousNet: number; // For comparison
  institutionAvgNet: number; // For comparison
  lessonBreakdown: LessonReport[];
  topicBreakdown: {
    strongest: TopicPerformance[];
    weakest: TopicPerformance[];
  };
  recommendations: string[];
  badge: 'gold' | 'silver' | 'bronze' | 'none';
  coachComment?: string;
}

// --- NEW DASHBOARD TYPES ---

export type ActionPriority = 'high' | 'medium' | 'low';
export type ActionType = 'missing_data' | 'performance_drop' | 'payment_due' | 'missing_note';
export type MessageStatus = 'send_message' | 'awaiting_reply' | 'replied';

export interface ActionItem {
  id: string;
  studentId: string;
  studentName: string;
  type: ActionType;
  message: string;
  priority: ActionPriority;
  date: string;
  messageStatus: MessageStatus; // New field for status chip
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents7Days: number;
  activeTrend: number; // Percentage change
  inactiveStudents: number;
  inactiveTrend: number;
  riskyStudents: number;
  riskyTrend: number;
  pendingPayments: number;
  paymentTrend: number;
  weeklyQuestions: number;
  avgAccuracy: number;
  hardestLesson: string;
  neglectedLesson: string;
}

export interface StudentSpotlight {
  id: string;
  name: string;
  change: number; // Net change
  type: 'riser' | 'faller';
  avatarColor: string;
}

export interface WeeklyTrendData {
  date: string;
  value: number; // Net
  totalQuestions: number;
  correct: number;
  incorrect: number;
}

// New Types for Subject Status Module
export interface SubjectStatus {
  subject: string;
  score: number; // percentage
  status: 'strong' | 'stable' | 'risky';
}

export interface SubjectInsight {
  lesson: string;
  reason: string;
  actions: string[];
}

// --- FINANCE MODULE TYPES ---
export interface Transaction {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'subscription' | 'book_fee' | 'private_lesson';
}

export interface UpcomingPayment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: string;
  daysLeft: number;
  status: 'pending';
}

export interface FinanceStats {
  monthlyRevenue: number;
  monthlyGrowth: number; // percentage
  totalRevenueYear: number;
  pendingAmount: number;
  overdueAmount: number;
  revenueHistory: { month: string; amount: number }[];
  recentTransactions: Transaction[];
  upcomingPayments: UpcomingPayment[];
}

export interface DashboardData {
  stats: DashboardStats;
  actions: ActionItem[];
  weeklyTrend: WeeklyTrendData[];
  subjectStatuses: SubjectStatus[];
  subjectInsight: SubjectInsight; 
  aiSummary: {
    title: string;
    insight: string;
    checklist: string[];
    mood: 'positive' | 'neutral' | 'negative';
  };
  spotlights: {
    risers: StudentSpotlight[];
    fallers: StudentSpotlight[];
    focusToday: Student[];
  };
  finance: FinanceStats; // Added finance data
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  date: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Note {
  id: string;
  content: string;
  date: string;
  type: 'meeting' | 'note';
  title: string;
}

// Landing Page Interfaces
export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface NavItem {
  label: string;
  href: string;
}

// --- MOCK EXAM TYPES ---
export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'classic';
  options?: string[]; // For multiple choice (A, B, C, D, E)
  answer?: string; // Correct answer or key
  points: number;
}

export interface MockExam {
  id: string;
  title: string;
  subject: string;
  date: string;
  questions: Question[];
  status: 'draft' | 'published';
}

// --- HOMEWORK / ASSIGNMENT TYPES ---
export interface Book {
  id: string;
  title: string;
  publisher: string;
  subject: string;
  image?: string;
}

export interface Assignment {
  id: string;
  studentId: string;
  studentName: string;
  bookId: string;
  bookName: string;
  testRange: string; // e.g., "Sayfa 10-12" or "Test 5"
  questionCount: number;
  dueDate: string;
  status: 'pending' | 'completed';
  answers?: string[]; // Student's answers: 'A', 'B', 'C', 'EMPTY', etc.
  score?: number;
  assignedDate: string;
}

// --- STUDY PROGRAM TYPES ---
export interface ProgramItem {
  id: string;
  date: string; // ISO Date "2024-02-20"
  subject: string;
  topic: string;
  bookId?: string;
  bookName?: string;
  questionTarget?: number;
  isCompleted: boolean;
  type: 'study' | 'test' | 'rest';
}

export interface StudyProgram {
  id: string;
  studentId: string;
  items: ProgramItem[];
}

// --- VIDEO LIBRARY TYPES ---
export interface VideoResource {
  id: string;
  channelName: string;
  title: string; // Playlist or Video Title
  examType: 'YKS' | 'LGS' | 'TYT' | 'AYT';
  subject: string;
  level: 'Temel' | 'Orta' | 'İleri';
  style: 'Konu Anlatımı' | 'Soru Çözümü' | 'Kamp';
  url: string; // Youtube Link
  avatarColor: string;
  tags: string[];
  likes: number;
}