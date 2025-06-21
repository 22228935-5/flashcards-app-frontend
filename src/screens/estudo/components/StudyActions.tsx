import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Button from '../../../components/Button';
import { UI_TEXTS } from '../../../constants/estudo';

const styles = StyleSheet.create({
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

interface StudyActionsProps {
  showAnswer: boolean;
  onRestart: () => void;
  onSkip: () => void;
  onMarkCorrect: () => void;
  onMarkIncorrect: () => void;
}

const StudyActions = React.memo<StudyActionsProps>(({
  showAnswer,
  onRestart,
  onSkip,
  onMarkCorrect,
  onMarkIncorrect
}) => (
  <View style={styles.actionsContainer}>
    {!showAnswer ? (
      <View style={styles.actionRow}>
        <Button
          title={UI_TEXTS.actions.restart}
          onPress={onRestart}
          variant="secondary"
        />
        <Button
          title={UI_TEXTS.actions.skip}
          onPress={onSkip}
          variant="secondary"
        />
      </View>
    ) : (
      <View style={styles.actionColumn}>
        <Text style={styles.actionQuestion}>
          {UI_TEXTS.card.howDidYouDo}
        </Text>
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.resultButton, styles.incorrectButton]}
            onPress={onMarkIncorrect}
          >
            <Text style={styles.resultButtonText}>
              {UI_TEXTS.actions.incorrect}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.resultButton, styles.correctButton]}
            onPress={onMarkCorrect}
          >
            <Text style={styles.resultButtonText}>
              {UI_TEXTS.actions.correct}
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <Text style={styles.skipButtonText}>
            {UI_TEXTS.actions.skipThis}
          </Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
));

export default StudyActions;
