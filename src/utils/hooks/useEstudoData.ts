import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { FlashcardPopulated } from '../../types';
import { MESSAGES, DIFFICULTY_INTERVALS, EMPTY_STATS, STUDY_RESULTS } from '../../constants/estudo';
import api from '../../services/api';
import { statsService } from '../../services/statsService';

interface UseEstudoDataReturn {
  flashcards: FlashcardPopulated[];
  currentIndex: number;
  showAnswer: boolean;
  loading: boolean;
  studyStats: StudyStats;
  currentFlashcard: FlashcardPopulated | undefined;
  progress: number;
  totalAnswered: number;
  finalScore: number;
  loadFlashcards: () => Promise<{ success: boolean; isEmpty: boolean }>;
  showAnswerAction: () => void;
  markCorrect: () => Promise<void>;
  markIncorrect: () => Promise<void>;
  skipCard: () => Promise<void>;
  restartStudy: () => void;
}

interface StudyStats {
  correct: number;
  incorrect: number;
  skipped: number;
}

// =====================================
// 🎯 HOOK PRINCIPAL - useEstudoData
// =====================================
export const useEstudoData = (
  temaId: string,
  temaName: string,
  onStudyComplete: () => void
): UseEstudoDataReturn => {
  // ✅ ESTADOS PRINCIPAIS
  const [flashcards, setFlashcards] = useState<FlashcardPopulated[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studyStats, setStudyStats] = useState<StudyStats>(EMPTY_STATS);

  // ✅ COMPUTADAS
  const currentFlashcard = useMemo(() => {
    return flashcards[currentIndex];
  }, [flashcards, currentIndex]);

  const progress = useMemo(() => {
    if (flashcards.length === 0) return 0;
    return ((currentIndex + 1) / flashcards.length) * 100;
  }, [currentIndex, flashcards.length]);

  const totalAnswered = useMemo(() => {
    return studyStats.correct + studyStats.incorrect + studyStats.skipped;
  }, [studyStats]);

  const finalScore = useMemo(() => {
    const total = studyStats.correct + studyStats.incorrect + studyStats.skipped;
    if (total === 0) return 0;
    return Math.round((studyStats.correct / total) * 100);
  }, [studyStats]);

  // ✅ CARREGAR FLASHCARDS (igual ao original)
  const loadFlashcards = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<FlashcardPopulated[]>(`/flashcards/tema/${temaId}`);
      if (response.data.length === 0) {
        Alert.alert(
          'Nenhum flashcard',
          'Este tema não possui flashcards para estudar.',
          [{ text: 'OK', onPress: onStudyComplete }]
        );
        return { success: false, isEmpty: true };
      }
      const shuffled = [...response.data].sort(() => Math.random() - 0.5);
      setFlashcards(shuffled);
      return { success: true, isEmpty: false };
    } catch (error) {
      console.error('Erro ao carregar flashcards:', error);
      Alert.alert('Erro', MESSAGES.errors.loadFlashcards);
      onStudyComplete();
      return { success: false, isEmpty: false };
    } finally {
      setLoading(false);
    }
  }, [temaId, onStudyComplete]);

  // ✅ MOSTRAR RESPOSTA
  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true);
  }, []);

  // ✅ MARCAR TEMA COMO REVISADO (igual ao original)
  const markThemeAsReviewed = useCallback(async (
    difficulty: 'facil' | 'medio' | 'dificil', 
    finalStats: StudyStats
  ) => {
    try {
      const total = flashcards.length;
      const correctAnswers = finalStats.correct;
      const score = Math.round((correctAnswers / total) * 100);
      
      await api.put(`/temas/review/${temaId}`, {
        difficulty,
        score,
        totalQuestions: total,
        correctAnswers
      });
      
      const intervals = DIFFICULTY_INTERVALS;
      const days = intervals[difficulty];
      
      Alert.alert(
        MESSAGES.alerts.themeReviewed.title,
        MESSAGES.alerts.themeReviewed.message(score, correctAnswers, total, days),
        [
          {
            text: MESSAGES.buttons.continue,
            onPress: onStudyComplete
          }
        ]
      );
      return true;
    } catch (error) {
      console.error('Erro ao marcar tema como revisado:', error);
      Alert.alert('Erro', MESSAGES.errors.markReviewed);
      onStudyComplete();
      return false;
    }
  }, [temaId, flashcards.length, onStudyComplete]);

  // ✅ PRÓXIMO FLASHCARD (igual ao original)
  const nextFlashcard = useCallback((finalStats?: StudyStats) => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      const stats = finalStats || studyStats;
      const score = Math.round((stats.correct / flashcards.length) * 100);
      
      Alert.alert(
        MESSAGES.alerts.studyCompleted.title,
        MESSAGES.alerts.studyCompleted.message(stats, score),
        [
          {
            text: MESSAGES.buttons.difficulties.easy,
            onPress: () => markThemeAsReviewed('facil', stats)
          },
          {
            text: MESSAGES.buttons.difficulties.medium,
            onPress: () => markThemeAsReviewed('medio', stats)
          },
          {
            text: MESSAGES.buttons.difficulties.hard,
            onPress: () => markThemeAsReviewed('dificil', stats)
          },
          {
            text: MESSAGES.buttons.studyAgain,
            style: 'cancel',
            onPress: () => {
              setCurrentIndex(0);
              setShowAnswer(false);
              setStudyStats(EMPTY_STATS);
              const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
              setFlashcards(shuffled);
            }
          }
        ]
      );
    }
  }, [currentIndex, flashcards, studyStats, markThemeAsReviewed]);

  // ✅ MARCAR COMO CORRETO (igual ao original)
  const markCorrect = useCallback(async () => {
    const newStats = { ...studyStats, correct: studyStats.correct + 1 };
    setStudyStats(newStats);
    
    try {
      await statsService.saveStudyResult({
        materiaId: currentFlashcard.temaId.materiaId._id,
        temaId: currentFlashcard.temaId._id,
        flashcardId: currentFlashcard._id,
        result: STUDY_RESULTS.CORRECT
      });
    } catch (error) {
      console.error('Erro ao salvar estatística:', error);
    }
    
    if (currentIndex === flashcards.length - 1) {
      nextFlashcard(newStats);
    } else {
      nextFlashcard();
    }
  }, [studyStats, currentIndex, flashcards.length, nextFlashcard, currentFlashcard]);

  // ✅ MARCAR COMO INCORRETO (igual ao original)
  const markIncorrect = useCallback(async () => {
    const newStats = { ...studyStats, incorrect: studyStats.incorrect + 1 };
    setStudyStats(newStats);
    
    try {
      await statsService.saveStudyResult({
        materiaId: currentFlashcard.temaId.materiaId._id,
        temaId: currentFlashcard.temaId._id,
        flashcardId: currentFlashcard._id,
        result: STUDY_RESULTS.INCORRECT
      });
    } catch (error) {
      console.error('Erro ao salvar estatística:', error);
    }
    
    if (currentIndex === flashcards.length - 1) {
      nextFlashcard(newStats);
    } else {
      nextFlashcard();
    }
  }, [studyStats, currentIndex, flashcards.length, nextFlashcard, currentFlashcard]);

  // ✅ PULAR CARD (igual ao original)
  const skipCard = useCallback(async () => {
    const newStats = { ...studyStats, skipped: studyStats.skipped + 1 };
    setStudyStats(newStats);
    
    try {
      await statsService.saveStudyResult({
        materiaId: currentFlashcard.temaId.materiaId._id,
        temaId: currentFlashcard.temaId._id,
        flashcardId: currentFlashcard._id,
        result: STUDY_RESULTS.SKIPPED
      });
    } catch (error) {
      console.error('Erro ao salvar estatística:', error);
    }
    
    if (currentIndex === flashcards.length - 1) {
      nextFlashcard(newStats);
    } else {
      nextFlashcard();
    }
  }, [studyStats, currentIndex, flashcards.length, nextFlashcard, currentFlashcard]);

  // ✅ REINICIAR ESTUDO (igual ao original)
  const restartStudy = useCallback(() => {
    Alert.alert(
      MESSAGES.alerts.restartStudy.title,
      MESSAGES.alerts.restartStudy.message,
      [
        { text: MESSAGES.buttons.cancel, style: 'cancel' },
        {
          text: MESSAGES.buttons.restart,
          onPress: () => {
            setCurrentIndex(0);
            setShowAnswer(false);
            setStudyStats(EMPTY_STATS);
            const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
            setFlashcards(shuffled);
          }
        }
      ]
    );
  }, [flashcards]);

  // ✅ Apenas o retorno foi alterado aqui:
  return {
    flashcards,
    currentIndex,
    showAnswer,
    loading,
    studyStats,
    currentFlashcard,
    progress,
    totalAnswered,
    finalScore,
    loadFlashcards,
    showAnswerAction: handleShowAnswer,  // <-- alteração: renomeamos handleShowAnswer no retorno
    markCorrect,
    markIncorrect,
    skipCard,
    restartStudy
  };
};