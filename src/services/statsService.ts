import api from './api';
import { GeneralStats, MateriaStats, TemaStats } from '../types';

export const statsService = {
  saveStudyResult: async (data: {
    materiaId: string;
    temaId: string;
    flashcardId: string;
    result: 'correct' | 'incorrect' | 'skipped';
  }) => {
    const response = await api.post('/stats/study-result', data);
    return response.data;
  },

  getGeneralStats: async (): Promise<GeneralStats> => {
    const response = await api.get<GeneralStats>('/stats/general');
    return response.data;
  },

  getMateriaStats: async (materiaId: string): Promise<MateriaStats> => {
    const response = await api.get<MateriaStats>(`/stats/materia/${materiaId}`);
    return response.data;
  },

  getTemaStats: async (temaId: string): Promise<TemaStats> => {
    const response = await api.get<TemaStats>(`/stats/tema/${temaId}`);
    return response.data;
  }
};