import api from './api';
import { Materia, Tema, Flashcard } from '../types';

export const searchService = {
  searchMaterias: async (query?: string): Promise<Materia[]> => {
    const params = query ? { q: query } : {};
    const response = await api.get<Materia[]>('/search/materias', { params });
    return response.data;
  },

  searchTemas: async (materiaId: string, query?: string): Promise<Tema[]> => {
    const params = { materiaId, ...(query && { q: query }) };
    const response = await api.get<Tema[]>('/search/temas', { params });
    return response.data;
  },

  searchFlashcards: async (temaId: string, query?: string): Promise<Flashcard[]> => {
    const params = { temaId, ...(query && { q: query }) };
    const response = await api.get<Flashcard[]>('/search/flashcards', { params });
    return response.data;
  }
};