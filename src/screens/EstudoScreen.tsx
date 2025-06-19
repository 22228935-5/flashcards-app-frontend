import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Button from '../components/Button';
import api from '../services/api';
import { statsService } from '../services/statsService';
import { RootStackParamList, FlashcardPopulated } from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {  
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  headerContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  statsContainer: {
    marginTop: 8,
  },
  statsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  flashcardContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    minHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  questionSection: {
    marginBottom: 24,
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
    marginBottom: 12,
  },
  questionText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 26,
  },
  answerSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 12,
  },
  answerText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 26,
  },
  revealButton: {
    backgroundColor: '#e3f2fd',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
  },
  revealButtonText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  actionsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionColumn: {
    alignItems: 'center',
  },
  actionQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  resultButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  correctButton: {
    backgroundColor: '#4CAF50',
  },
  incorrectButton: {
    backgroundColor: '#f44336',
  },
  resultButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

type EstudoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Estudo'>;
type EstudoScreenRouteProp = RouteProp<RootStackParamList, 'Estudo'>;

const { width } = Dimensions.get('window');

const EstudoScreen: React.FC = () => {
  const navigation = useNavigation<EstudoScreenNavigationProp>();
  const route = useRoute<EstudoScreenRouteProp>();
  const { temaId, temaName } = route.params;
  
  const [flashcards, setFlashcards] = useState<FlashcardPopulated[]>([]); // ✅ Usar FlashcardPopulated
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studyStats, setStudyStats] = useState({
    correct: 0,
    incorrect: 0,
    skipped: 0,
  });

  const loadFlashcards = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<FlashcardPopulated[]>(`/flashcards/tema/${temaId}`);
      if (response.data.length === 0) {
        Alert.alert(
          'Nenhum flashcard',
          'Este tema não possui flashcards para estudar.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        return;
      }
      const shuffled = [...response.data].sort(() => Math.random() - 0.5);
      setFlashcards(shuffled);
    } catch (error) {
      console.error('Erro ao carregar flashcards:', error);
      Alert.alert('Erro', 'Não foi possível carregar os flashcards');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [temaId, navigation]);

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

  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true);
  }, []);

  const nextFlashcard = useCallback((finalStats?: { correct: number; incorrect: number; skipped: number }) => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      const stats = finalStats || studyStats;
      Alert.alert(
        'Estudo Concluído! 🎉',
        `Você estudou ${flashcards.length} flashcards!\n\n` +
        `✅ Acertou: ${stats.correct}\n` +
        `❌ Errou: ${stats.incorrect}\n` +
        `⏭️ Pulou: ${stats.skipped}`,
        [
          {
            text: 'Estudar Novamente',
            onPress: () => {
              setCurrentIndex(0);
              setShowAnswer(false);
              setStudyStats({ correct: 0, incorrect: 0, skipped: 0 });
              const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
              setFlashcards(shuffled);
            }
          },
          {
            text: 'Finalizar',
            style: 'default',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }
  }, [currentIndex, flashcards, studyStats, navigation]);

  const markCorrect = useCallback(async () => {
    const newStats = { ...studyStats, correct: studyStats.correct + 1 };
    setStudyStats(newStats);
    
    try {
      await statsService.saveStudyResult({
        materiaId: currentFlashcard.temaId.materiaId._id,
        temaId: currentFlashcard.temaId._id,
        flashcardId: currentFlashcard._id,
        result: 'correct'
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

  const markIncorrect = useCallback(async () => {
    const newStats = { ...studyStats, incorrect: studyStats.incorrect + 1 };
    setStudyStats(newStats);
    
    try {
      await statsService.saveStudyResult({
        materiaId: currentFlashcard.temaId.materiaId._id,
        temaId: currentFlashcard.temaId._id,
        flashcardId: currentFlashcard._id,
        result: 'incorrect'
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

  const skipCard = useCallback(async () => {
    const newStats = { ...studyStats, skipped: studyStats.skipped + 1 };
    setStudyStats(newStats);
    
    try {
      await statsService.saveStudyResult({
        materiaId: currentFlashcard.temaId.materiaId._id,
        temaId: currentFlashcard.temaId._id,
        flashcardId: currentFlashcard._id,
        result: 'skipped'
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

  const restartStudy = useCallback(() => {
    Alert.alert(
      'Reiniciar Estudo',
      'Tem certeza que deseja reiniciar o estudo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          onPress: () => {
            setCurrentIndex(0);
            setShowAnswer(false);
            setStudyStats({ correct: 0, incorrect: 0, skipped: 0 });
            const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
            setFlashcards(shuffled);
          }
        }
      ]
    );
  }, [flashcards]);

  useEffect(() => {
    loadFlashcards();
  }, [loadFlashcards]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>🧠 Preparando estudo...</Text>
      </View>
    );
  }

  if (!currentFlashcard) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>📝 Nenhum flashcard encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>🧠 {temaName}</Text>
        <Text style={styles.progressText}>
          {currentIndex + 1} de {flashcards.length}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        
        {totalAnswered > 0 && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              ✅ {studyStats.correct} • ❌ {studyStats.incorrect} • ⏭️ {studyStats.skipped}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.flashcardContainer}>
          <View style={styles.questionSection}>
            <Text style={styles.questionLabel}>❓ Pergunta:</Text>
            <Text style={styles.questionText}>{currentFlashcard.question}</Text>
          </View>
          {showAnswer ? (
            <View style={styles.answerSection}>
              <Text style={styles.answerLabel}>✅ Resposta:</Text>
              <Text style={styles.answerText}>{currentFlashcard.answer}</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.revealButton}
              onPress={handleShowAnswer}
            >
              <Text style={styles.revealButtonText}>👆 Toque para revelar a resposta</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {!showAnswer ? (
          <View style={styles.actionRow}>
            <Button
              title="🔄 Reiniciar"
              onPress={restartStudy}
              variant="secondary"
            />
            <Button
              title="⏭️ Pular"
              onPress={skipCard}
              variant="secondary"
            />
          </View>
        ) : (
          <View style={styles.actionColumn}>
            <Text style={styles.actionQuestion}>Como você se saiu?</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={[styles.resultButton, styles.incorrectButton]}
                onPress={markIncorrect}
              >
                <Text style={styles.resultButtonText}>❌ Errei</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.resultButton, styles.correctButton]}
                onPress={markCorrect}
              >
                <Text style={styles.resultButtonText}>✅ Acertei</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={skipCard}
            >
              <Text style={styles.skipButtonText}>⏭️ Pular esta</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default EstudoScreen;