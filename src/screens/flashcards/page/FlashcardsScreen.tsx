// =====================================
// 📁 screens/flashcards/page/FlashcardsScreen.tsx
// =====================================

import React, { useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import SearchInput from '../../../components/SearchInput';
import { useFlashcardsData } from '../../../utils/hooks/useFlashcardsData';
import { RootStackParamList } from '../../../types';
import { SEARCH_CONFIG, MESSAGES } from '../../../constants/flashcards';
import FlashcardHeader from '../components/FlashcardHeader';
import FlashcardForm from '../components/FlashcardForm';
import EmptyState from '../components/EmptyState';
import FlashcardCard from '../components/FlashcardCard';
import FABButton from '../components/FABButton';

type FlashcardsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Flashcards'>;
type FlashcardsScreenRouteProp = RouteProp<RootStackParamList, 'Flashcards'>;

const useFlashcardsNavigation = () => {
  const navigation = useNavigation<FlashcardsScreenNavigationProp>();

  const startStudy = useCallback((temaId: string, temaName: string, flashcardsCount: number) => {
    if (flashcardsCount === 0) {
      Alert.alert('Aviso', MESSAGES.study.noFlashcards);
      return;
    }
    navigation.navigate('Estudo', { temaId, temaName });
  }, [navigation]);

  return { startStudy };
};

const FlashcardsScreen: React.FC = () => {
  const route = useRoute<FlashcardsScreenRouteProp>();
  const { temaId, temaName } = route.params;

  const {
    flashcards,
    loading,
    refreshing,
    currentSearchQuery,
    formState,
    isFormVisible,
    formTitle,
    submitButtonTitle,
    loadFlashcards,
    onRefresh,
    handleSearch,
    handleClearSearch,
    updateFormState,
    resetForm,
    startEdit,
    toggleCreateForm,
    handleDeleteFlashcard,
    submitHandler
  } = useFlashcardsData(temaId);

  const { startStudy } = useFlashcardsNavigation();

  const refreshControl = useMemo(() => (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  ), [refreshing, onRefresh]);

  const emptyStateConfig = useMemo(() => ({
    title: currentSearchQuery ? MESSAGES.empty.noResults : MESSAGES.empty.noFlashcards,
    description: MESSAGES.empty.description(currentSearchQuery, temaName)
  }), [currentSearchQuery, temaName]);

  const hasFlashcards = useMemo(() => flashcards.length > 0, [flashcards.length]);
  
  const showLoadingState = useMemo(() => 
    loading && !hasFlashcards && !currentSearchQuery, 
    [loading, hasFlashcards, currentSearchQuery]
  );

  const onStartStudy = useCallback(() => {
    startStudy(temaId, temaName, flashcards.length);
  }, [startStudy, temaId, temaName, flashcards.length]);

  const onChangeQuestion = useCallback((question: string) => {
    updateFormState({ question });
  }, [updateFormState]);

  const onChangeAnswer = useCallback((answer: string) => {
    updateFormState({ answer });
  }, [updateFormState]);

  useEffect(() => {
    loadFlashcards();
  }, []);

  if (showLoadingState) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{MESSAGES.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashcardHeader
        temaName={temaName}
        flashcardsCount={flashcards.length}
        onStartStudy={onStartStudy}
      />

      <ScrollView
        refreshControl={refreshControl}
        contentContainerStyle={styles.scrollContent}
      >
        <SearchInput
          placeholder={SEARCH_CONFIG.placeholder}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          debounceDelay={SEARCH_CONFIG.debounceDelay}
          minCharacters={SEARCH_CONFIG.minCharacters}
        />

        {isFormVisible && (
          <FlashcardForm
            title={formTitle}
            question={formState.question}
            answer={formState.answer}
            onChangeQuestion={onChangeQuestion}
            onChangeAnswer={onChangeAnswer}
            onSubmit={submitHandler}
            onCancel={resetForm}
            submitButtonTitle={submitButtonTitle}
            saving={formState.saving}
          />
        )}

        {!hasFlashcards ? (
          <EmptyState
            title={emptyStateConfig.title}
            description={emptyStateConfig.description}
          />
        ) : (
          <View style={styles.listContainer}>
            {flashcards.map((flashcard) => (
              <FlashcardCard
                key={flashcard._id}
                flashcard={flashcard}
                onEdit={startEdit}
                onDelete={handleDeleteFlashcard}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {!isFormVisible && (
        <FABButton onPress={toggleCreateForm} />
      )}
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
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  listContainer: {
    gap: 16,
  },
});

export default FlashcardsScreen;