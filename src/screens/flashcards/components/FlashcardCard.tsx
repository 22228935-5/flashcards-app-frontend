import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Flashcard } from '../../../types';
import { FLASHCARD_UI } from '../../../constants/flashcards';

const styles = StyleSheet.create({
  flashcardCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  flashcardHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  flashcardDate: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  flashcardContent: {
    padding: 16,
  },
  questionContainer: {
    marginBottom: 12,
  },
  questionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
    marginBottom: 4,
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  answerContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
  },
  answerText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  tapHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  flashcardActions: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ffe6e6',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#333',
  },
  deleteButtonText: {
    color: '#d32f2f',
  },
});

interface FlashcardCardProps {
  flashcard: Flashcard;
  onEdit: (flashcard: Flashcard) => void;
  onDelete: (flashcard: Flashcard) => void;
}

const FlashcardCard = React.memo<FlashcardCardProps>(({ flashcard, onEdit, onDelete }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleEdit = useCallback(() => onEdit(flashcard), [onEdit, flashcard]);
  const handleDelete = useCallback(() => onDelete(flashcard), [onDelete, flashcard]);
  const toggleAnswer = useCallback(() => setShowAnswer(prev => !prev), []);

  const formattedDate = useMemo(() => {
    return new Date(flashcard.createdAt).toLocaleDateString('pt-BR');
  }, [flashcard.createdAt]);

  const hintText = useMemo(() => {
    return showAnswer ? FLASHCARD_UI.hints.hideAnswer : FLASHCARD_UI.hints.showAnswer;
  }, [showAnswer]);

  return (
    <View style={styles.flashcardCard}>
      <View style={styles.flashcardHeader}>
        <Text style={styles.flashcardDate}>{formattedDate}</Text>
      </View>

      <TouchableOpacity onPress={toggleAnswer} style={styles.flashcardContent}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionLabel}>{FLASHCARD_UI.questionLabel}</Text>
          <Text style={styles.questionText}>{flashcard.question}</Text>
        </View>

        {showAnswer && (
          <View style={styles.answerContainer}>
            <Text style={styles.answerLabel}>{FLASHCARD_UI.answerLabel}</Text>
            <Text style={styles.answerText}>{flashcard.answer}</Text>
          </View>
        )}

        <Text style={styles.tapHint}>{hintText}</Text>
      </TouchableOpacity>

      <View style={styles.flashcardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
          <Text style={styles.actionButtonText}>✏️ Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>🗑️ Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default FlashcardCard;