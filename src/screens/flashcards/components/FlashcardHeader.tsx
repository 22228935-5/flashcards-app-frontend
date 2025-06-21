import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TEXT_FORMATTERS, FLASHCARD_UI } from '../../../constants/flashcards';

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
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  studyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  studyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

interface FlashcardHeaderProps {
  temaName: string;
  flashcardsCount: number;
  onStartStudy: () => void;
}

const FlashcardHeader = React.memo<FlashcardHeaderProps>(({ 
  temaName, 
  flashcardsCount, 
  onStartStudy 
}) => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerTitle}>{TEXT_FORMATTERS.headerTitle(temaName)}</Text>
    <View style={styles.headerInfo}>
      <Text style={styles.headerSubtitle}>
        {flashcardsCount} {TEXT_FORMATTERS.flashcardsCount(flashcardsCount)}
      </Text>
      {flashcardsCount > 0 && (
        <TouchableOpacity style={styles.studyButton} onPress={onStartStudy}>
          <Text style={styles.studyButtonText}>{FLASHCARD_UI.studyButton}</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
));

export default FlashcardHeader;