import { Flashcard, FlashcardForm } from '../types';

import api from './api';

export const getFlashcards = async (temaId: string): Promise<Flashcard[]> => {
  const response = await api.get<Flashcard[]>(`/flashcards/tema/${temaId}`);
  return response.data;
};

export const getFlashcard = async (id: string): Promise<Flashcard> => {
  const response = await api.get<Flashcard>(`/flashcards/${id}`);
  return response.data;
};

export const createFlashcard = async (flashcard: FlashcardForm & { temaId: string }): Promise<Flashcard> => {
  const response = await api.post<Flashcard>('/flashcards', flashcard);
  return response.data;
};

export const updateFlashcard = async (id: string, flashcard: FlashcardForm): Promise<Flashcard> => {
  const response = await api.put<Flashcard>(`/flashcards/${id}`, flashcard);
  return response.data;
};

export const deleteFlashcard = async (id: string): Promise<void> => {
  await api.delete(`/flashcards/${id}`);
};

export const searchFlashcards = async (temaId: string, query?: string): Promise<Flashcard[]> => {
  if (!query || query.trim() === '') {
    return getFlashcards(temaId);
  }
  const response = await api.get<Flashcard[]>(`/search/flashcards?temaId=${temaId}&q=${encodeURIComponent(query)}`);
  return response.data;
};

export const flashcardService = {
  getFlashcards,
  getFlashcard,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  searchFlashcards,
};