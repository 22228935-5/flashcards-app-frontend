import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useEstudoData } from '../../../utils/hooks/useEstudoData';
import { RootStackParamList } from '../../../types';
import { MESSAGES } from '../../../constants/estudo';
import StudyHeader from '../components/StudyHeader';
import FlashcardView from '../components/FlashcardView';
import StudyActions from '../components/StudyActions';

type EstudoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Estudo'>;
type EstudoScreenRouteProp = RouteProp<RootStackParamList, 'Estudo'>;

const EstudoScreen: React.FC = () => {
  const navigation = useNavigation<EstudoScreenNavigationProp>();
  const route = useRoute<EstudoScreenRouteProp>();
  const { temaId, temaName } = route.params;

  const handleStudyComplete = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const {
    flashcards,
    loading,
    currentIndex,
    showAnswer,
    studyStats,
    progress,
    totalAnswered,
    finalScore,
    currentFlashcard,
    loadFlashcards,
    showAnswerAction,
    markCorrect,
    markIncorrect,
    skipCard,
    restartStudy
  } = useEstudoData(temaId, temaName, handleStudyComplete);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const result = await loadFlashcards();
        if (!result.success) {
          if (result.isEmpty) {
            Alert.alert(MESSAGES.alerts.noFlashcards.title, MESSAGES.alerts.noFlashcards.message, [
              { text: MESSAGES.buttons.ok, onPress: () => navigation.goBack() }
            ]);
          } else {
            Alert.alert('Erro', MESSAGES.errors.loadFlashcards);
            navigation.goBack();
          }
        }
      };
      loadData();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{MESSAGES.loading}</Text>
      </View>
    );
  }

  if (!currentFlashcard) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{MESSAGES.noFlashcards}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StudyHeader
        temaName={temaName}
        currentIndex={currentIndex}
        totalFlashcards={flashcards.length}
        progress={progress}
        studyStats={studyStats}
        finalScore={finalScore}
        showStats={totalAnswered > 0}
      />

      <FlashcardView
        flashcard={currentFlashcard}
        showAnswer={showAnswer}
        onRevealAnswer={showAnswerAction}
      />

      <StudyActions
        showAnswer={showAnswer}
        onRestart={restartStudy}
        onSkip={skipCard}
        onMarkCorrect={markCorrect}
        onMarkIncorrect={markIncorrect}
      />
    </View>
  );
};

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
});

export default EstudoScreen;
