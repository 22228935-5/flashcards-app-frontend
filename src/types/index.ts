export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Materias: undefined;
  Temas: { materiaId: string; materiaName: string };
  Flashcards: { temaId: string; temaName: string };
  Estudo: { temaId: string; temaName: string };
};

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Materia {
  _id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tema {
  _id: string;
  name: string;
  materiaId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  _id: string;
  question: string;
  answer: string;
  temaId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface StudyStats {
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracy: number;
}

export interface ContentStats {
  materias: number;
  temas: number;
  flashcards: number;
}

export interface GeneralStats {
  content: ContentStats;
  studies: StudyStats;
}

export interface MateriaStats {
  content: {
    temas: number;
    flashcards: number;
  };
  studies: StudyStats;
  lastStudied: string | null;
}

export interface TemaStats {
  content: {
    flashcards: number;
  };
  studies: StudyStats;
  lastStudied: string | null;
}