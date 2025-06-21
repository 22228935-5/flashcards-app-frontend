import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlashcardPopulated } from '../../../types';
import { UI_TEXTS } from '../../../constants/estudo';

const styles = StyleSheet.create({
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
});

interface FlashcardViewProps {
  flashcard: FlashcardPopulated;
  showAnswer: boolean;
  onRevealAnswer: () => void;
}

const FlashcardView = React.memo<FlashcardViewProps>(({
  flashcard,
  showAnswer,
  onRevealAnswer
}) => (
  <View style={styles.cardContainer}>
    <View style={styles.flashcardContainer}>
      <View style={styles.questionSection}>
        <Text style={styles.questionLabel}>{UI_TEXTS.card.questionLabel}</Text>
        <Text style={styles.questionText}>{flashcard.question}</Text>
      </View>
      
      {showAnswer ? (
        <View style={styles.answerSection}>
          <Text style={styles.answerLabel}>{UI_TEXTS.card.answerLabel}</Text>
          <Text style={styles.answerText}>{flashcard.answer}</Text>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.revealButton}
          onPress={onRevealAnswer}
        >
          <Text style={styles.revealButtonText}>
            {UI_TEXTS.card.revealButton}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
));

export default FlashcardView;