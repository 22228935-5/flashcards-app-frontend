import { ParamListBase } from "@react-navigation/native";

export interface RootStackParamList extends ParamListBase {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Materias: undefined;
  Temas: { 
    materiaId: string;
    materiaName: string 
  };
  Flashcards: { 
    temaId: string;
    temaName: string
  };
  Estudo: { 
    temaId: string;
    temaName: string
  };
  Dashboard: undefined;
};

interface BaseEntity {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Materia extends BaseEntity {
  name: string;
  userId: string;
}

export interface Tema extends BaseEntity {
  name: string;
  materiaId: string;
  nextReview?: string;
  reviewCount?: number;
  lastDifficulty?: DifficultyLevel;
  lastReviewScore?: number;
}

export interface Flashcard extends BaseEntity {
  question: string;
  answer: string;
  temaId: string;
}

export type DifficultyLevel = 'facil' | 'medio' | 'dificil';

interface PopulatedMateria {
  _id: string;
  name: string;
  userId: string;
}

interface PopulatedTema {
  _id: string;
  name: string;
  materiaId: PopulatedMateria;
}

export interface FlashcardPopulated extends Omit<Flashcard, 'temaId'> {
  temaId: PopulatedTema;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface StudyMetrics {
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracy: number;
}

export interface ContentMetrics {
  materias: number;
  temas: number;
  flashcards: number;
}

export interface GeneralStats {
  content: ContentMetrics;
  studies: StudyMetrics;
}

export interface MateriaStats {
  content: Omit<ContentMetrics, 'materias'>;
  studies: StudyMetrics;
  lastStudied: string | null;
}

export interface TemaStats {
  content: Omit<ContentMetrics, 'materias' | 'temas'>;
  studies: StudyMetrics;
  lastStudied: string | null;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

export interface StudySession {
  temaId: string;
  flashcards: Flashcard[];
  currentIndex: number;
  results: StudyResult[];
}

export interface StudyResult {
  flashcardId: string;
  result: 'correct' | 'incorrect' | 'skipped';
  timeSpent: number;
}

export interface DashboardData {
  dailyProgress: DailyProgress[];
  materiaStats: MateriaStats[];
  summary: DashboardSummary;
}

export interface DailyProgress {
  date: string;
  temasEstudados: number;
  scoreMedio: number;
}

export interface DashboardSummary {
  totalTemasEstudados: number;
  scoreGeral: number;
  melhorMateria: MateriaStats;
  sequenciaEstudo: number;
  temasParaRever: number;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm extends LoginForm {
  name: string;
}

export interface MateriaForm {
  name: string;
}

export interface TemaForm {
  name: string;
  materiaId: string;
}

export interface FlashcardForm {
  question: string;
  answer: string;
  temaId: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  status: number;
  message: string;
  validationErrors?: ValidationError[];
}

export const isApiError = (error: unknown): error is ApiError => {
  return typeof error === 'object' && 
         error !== null && 
         'status' in error && 
         'message' in error;
};

export const isValidationError = (error: unknown): error is ValidationError => {
  return typeof error === 'object' && 
         error !== null && 
         'field' in error && 
         'message' in error;
};

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  'facil', 
  'medio', 
  'dificil'
] as const;

export const STUDY_RESULTS = [
  'correct', 
  'incorrect', 
  'skipped'
] as const;

export type { StudyMetrics as StudyStats };
export type { ContentMetrics as ContentStats };