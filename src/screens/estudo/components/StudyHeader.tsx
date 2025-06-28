import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import { UI_TEXTS } from '../../../constants/estudo';

const styles = StyleSheet.create({
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
});

interface StudyHeaderProps {
  temaName: string;
  currentIndex: number;
  totalFlashcards: number;
  progress: number;
  studyStats: {
    correct: number;
    incorrect: number;
    skipped: number;
  };
  finalScore: number;
  showStats: boolean;
}

const StudyHeader = React.memo<StudyHeaderProps>(({
  temaName,
  currentIndex,
  totalFlashcards,
  progress,
  studyStats,
  finalScore,
  showStats
}) => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerTitle}>🧠 {temaName}</Text>
    <Text style={styles.progressText}>
      {UI_TEXTS.header.progress(currentIndex + 1, totalFlashcards)}
    </Text>
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: `${progress}%` }]} />
    </View>
    
    {showStats && (
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {UI_TEXTS.header.stats(
            studyStats.correct,
            studyStats.incorrect,
            studyStats.skipped,
            finalScore
          )}
        </Text>
      </View>
    )}
  </View>
));

export default StudyHeader;