
import api from './api';
import { GeneralStats, MateriaStats, TemaStats } from '../types';

export const saveStudyResult = async (data: {
  materiaId: string;
  temaId: string;
  flashcardId: string;
  result: 'correct' | 'incorrect' | 'skipped';
}) => {
  const response = await api.post('/stats/study-result', data);
  return response.data;
};

export const getGeneralStats = async (): Promise<GeneralStats> => {
  const response = await api.get<GeneralStats>('/stats/general');
  return response.data;
};

export const getMateriaStats = async (materiaId: string): Promise<MateriaStats> => {
  const response = await api.get<MateriaStats>(`/stats/materia/${materiaId}`);
  return response.data;
};

export const getTemaStats = async (temaId: string): Promise<TemaStats> => {
  const response = await api.get<TemaStats>(`/stats/tema/${temaId}`);
  return response.data;
};

export const getDashboardStats = async (): Promise<any> => {
  const response = await api.get('/stats/dashboard');
  return response.data;
};

export const statsService = {
  saveStudyResult,
  getGeneralStats,
  getMateriaStats,
  getTemaStats,
  getDashboardStats,
};