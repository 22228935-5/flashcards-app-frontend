import { Materia, Tema } from '../types';

import { materiaService } from './materiaService';
import { temaService } from './temasService';

interface ReviewCounts {
  totalTemas: number;
  materiasCounts: Array<{
    materia: Materia;
    count: number;
  }>;
}

export const getAllMateriasReviewCounts = async (): Promise<ReviewCounts> => {
  const materias = await materiaService.getMaterias();

  const countsPromises = materias.map(async (materia) => {
    try {
      const count = await temaService.getTemasReviewCount(materia._id);
      return { materia, count };
    } catch (error) {
      console.error(`Erro ao buscar contagem para ${materia.name}:`, error);
      return { materia, count: 0 };
    }
  });

  const materiasCounts = await Promise.all(countsPromises);
  
  const filteredCounts = materiasCounts.filter(item => item.count > 0);
  const totalTemas = materiasCounts.reduce((sum, item) => sum + item.count, 0);

  return { totalTemas, materiasCounts: filteredCounts };
};

export const getNextReviewTema = async (): Promise<{ materia: Materia; tema: Tema } | null> => {
  const reviewCounts = await getAllMateriasReviewCounts();
  
  if (reviewCounts.materiasCounts.length === 0) {
    return null;
  }

  const firstMateria = reviewCounts.materiasCounts[0].materia;
  const temas = await temaService.getTemasForReview(firstMateria._id);
  
  if (temas.length === 0) {
    return null;
  }

  return { materia: firstMateria, tema: temas[0] };
};

export const reviewService = {
  getAllMateriasReviewCounts,
  getNextReviewTema,
};