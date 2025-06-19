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