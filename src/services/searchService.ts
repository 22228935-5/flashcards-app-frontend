import { materiaService } from './materiaService';
import { flashcardService } from './flashcardService';
import { Materia, Tema, Flashcard } from '../types';
import { temaService } from './temasService';

export const searchService = {
  searchMaterias: async (query?: string): Promise<Materia[]> => {
    return materiaService.searchMaterias(query);
  },

  searchTemas: async (materiaId: string, query?: string): Promise<Tema[]> => {
    return temaService.searchTemas(materiaId, query);
  },

  searchFlashcards: async (temaId: string, query?: string): Promise<Flashcard[]> => {
    return flashcardService.searchFlashcards(temaId, query);
  },

  searchAll: async (query: string): Promise<{
    materias: Materia[];
    temas: Tema[];
    flashcards: Flashcard[];
  }> => {
    throw new Error('Busca global ainda não implementada');
  }
};

