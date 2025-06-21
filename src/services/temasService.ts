import api from './api';
import { Tema, TemaForm } from '../types';

export const getTemas = async (materiaId: string): Promise<Tema[]> => {
  const response = await api.get<Tema[]>(`/temas/materia/${materiaId}`);
  return response.data;
};

export const getTema = async (id: string): Promise<Tema> => {
  const response = await api.get<Tema>(`/temas/${id}`);
  return response.data;
};

export const createTema = async (tema: TemaForm & { materiaId: string }): Promise<Tema> => {
  const response = await api.post<Tema>('/temas', tema);
  return response.data;
};

export const updateTema = async (id: string, tema: Partial<TemaForm>): Promise<Tema> => {
  const response = await api.put<Tema>(`/temas/${id}`, tema);
  return response.data;
};

export const deleteTema = async (id: string): Promise<void> => {
  await api.delete(`/temas/${id}`);
};

export const searchTemas = async (materiaId: string, query?: string): Promise<Tema[]> => {
  if (!query || query.trim() === '') {
    return getTemas(materiaId);
  }
  const response = await api.get<Tema[]>(`/search/temas?materiaId=${materiaId}&q=${encodeURIComponent(query)}`);
  return response.data;
};

export const getTemasForReview = async (materiaId: string): Promise<Tema[]> => {
  const response = await api.get<Tema[]>(`/temas/due/${materiaId}`);
  return response.data;
};

export const getTemasReviewCount = async (materiaId: string): Promise<number> => {
  const response = await api.get(`/temas/due-count/${materiaId}`);
  return response.data.count || 0;
};

export const markTemaAsReviewed = async (
  temaId: string, 
  reviewData: {
    difficulty: 'facil' | 'medio' | 'dificil';
    score: number;
    totalQuestions: number;
    correctAnswers: number;
  }
): Promise<Tema> => {
  const response = await api.put<Tema>(`/temas/review/${temaId}`, reviewData);
  return response.data;
};

export const temaService = {
  getTemas,
  getTema,
  createTema,
  updateTema,
  deleteTema,
  searchTemas,
  getTemasForReview,
  getTemasReviewCount,
  markTemaAsReviewed,
};