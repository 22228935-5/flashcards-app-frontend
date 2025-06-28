import React, { useCallback, useMemo } from 'react';

import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';

import SearchInput from '../../../components/SearchInput';
import { SEARCH_CONFIG, MESSAGES, SECTIONS } from '../../../constants/temas';
import { RootStackParamList, Tema } from '../../../types';
import { useTemasData } from '../../../utils/hooks/useTemasData';
import EmptyState from '../../materias/components/EmptyState';
import FABButton from '../components/EmptyState';
import TemaCard from '../components/TemaCard';
import TemaForm from '../components/TemaForm';
import TemaHeader from '../components/TemaHeader';

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
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 8,
  },
});

type TemasScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Temas'>;
type TemasScreenRouteProp = RouteProp<RootStackParamList, 'Temas'>;

// =====================================
// 🚀 HOOK DE NAVEGAÇÃO
// =====================================
const useTemasNavigation = () => {
  const navigation = useNavigation<TemasScreenNavigationProp>();

  const openFlashcards = useCallback((tema: Tema) => {
    navigation.navigate('Flashcards', {
      temaId: tema._id,
      temaName: tema.name
    });
  }, [navigation]);

  const startStudy = useCallback((tema: Tema) => {
    navigation.navigate('Estudo', {
      temaId: tema._id,
      temaName: tema.name
    });
  }, [navigation]);

  return { openFlashcards, startStudy };
};

// =====================================
// 🎨 COMPONENTE PRINCIPAL
// =====================================
const TemasScreen: React.FC = () => {
  const route = useRoute<TemasScreenRouteProp>();
  const { materiaId, materiaName } = route.params;

  const {
    temas,
    loading,
    refreshing,
    currentSearchQuery,
    formState,
    isFormVisible,
    formTitle,
    submitButtonTitle,
    temasParaRevisar,
    temasPendentes,
    loadTemas,
    onRefresh,
    handleSearch,
    handleClearSearch,
    updateFormState,
    resetForm,
    startEdit,
    toggleCreateForm,
    handleDeleteTema,
    submitHandler
  } = useTemasData(materiaId);

  const { openFlashcards, startStudy } = useTemasNavigation();

  // =====================================
  // 📱 VALORES COMPUTADOS
  // =====================================
  const refreshControl = useMemo(() => (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  ), [refreshing, onRefresh]);

  const emptyStateConfig = useMemo(() => ({
    title: currentSearchQuery ? MESSAGES.empty.noResults : MESSAGES.empty.noTemas,
    description: MESSAGES.empty.description(currentSearchQuery, materiaName)
  }), [currentSearchQuery, materiaName]);

  const hasTemas = useMemo(() => temas.length > 0, [temas.length]);
  const showLoadingState = useMemo(() => 
    loading && !hasTemas && !currentSearchQuery, 
    [loading, hasTemas, currentSearchQuery]
  );
  const showSections = useMemo(() => 
    !currentSearchQuery && hasTemas, 
    [currentSearchQuery, hasTemas]
  );

  // =====================================
  // 🔄 EFEITOS
  // =====================================
  useFocusEffect(
    useCallback(() => {
      loadTemas();
    }, []) // Array vazio como discutimos
  );

  // =====================================
  // 🎯 RENDER CONDICIONAL DE LOADING
  // =====================================
  if (showLoadingState) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{MESSAGES.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TemaHeader
        materiaName={materiaName}
        temasCount={temas.length}
        reviewCount={temasParaRevisar.length}
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
          <TemaForm
            title={formTitle}
            nome={formState.nome}
            onChangeNome={(nome) => updateFormState({ nome })}
            onSubmit={submitHandler}
            onCancel={resetForm}
            submitButtonTitle={submitButtonTitle}
            saving={formState.saving}
          />
        )}

        {!hasTemas ? (
          <EmptyState
            title={emptyStateConfig.title}
            description={emptyStateConfig.description}
          />
        ) : (
          <View style={styles.listContainer}>
            {showSections && temasParaRevisar.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>{SECTIONS.readyForReview}</Text>
                {temasParaRevisar.map((tema) => (
                  <TemaCard
                    key={tema._id}
                    tema={tema}
                    onPress={openFlashcards}
                    onEdit={startEdit}
                    onDelete={handleDeleteTema}
                    onStudy={startStudy}
                    isReadyForReview={true}
                  />
                ))}
              </>
            )}

            {showSections && temasPendentes.length > 0 && temasParaRevisar.length > 0 && (
              <Text style={styles.sectionTitle}>{SECTIONS.otherTemas}</Text>
            )}
            
            {(currentSearchQuery ? temas : temasPendentes).map((tema) => (
              <TemaCard
                key={tema._id}
                tema={tema}
                onPress={openFlashcards}
                onEdit={startEdit}
                onDelete={handleDeleteTema}
                onStudy={startStudy}
                isReadyForReview={false}
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

export default TemasScreen;