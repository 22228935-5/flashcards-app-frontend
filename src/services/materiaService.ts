import { Materia, MateriaForm } from '../types';

import api from './api';

export const getMaterias = async (): Promise<Materia[]> => {
  const response = await api.get<Materia[]>('/materias');
  return response.data;
};

export const getMateria = async (id: string): Promise<Materia> => {
  const response = await api.get<Materia>(`/materias/${id}`);
  return response.data;
};

export const createMateria = async (materia: MateriaForm): Promise<Materia> => {
  const response = await api.post<Materia>('/materias', materia);
  return response.data;
};

export const updateMateria = async (id: string, materia: MateriaForm): Promise<Materia> => {
  const response = await api.put<Materia>(`/materias/${id}`, materia);
  return response.data;
};

export const deleteMateria = async (id: string): Promise<void> => {
  await api.delete(`/materias/${id}`);
};

export const searchMaterias = async (query?: string): Promise<Materia[]> => {
  if (!query || query.trim() === '') {
    return getMaterias();
  }
  const response = await api.get<Materia[]>(`/search/materias?q=${encodeURIComponent(query)}`);
  return response.data;
};

export const materiaService = {
  getMaterias,
  getMateria,
  createMateria,
  updateMateria,
  deleteMateria,
  searchMaterias,
};