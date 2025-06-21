import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import SearchInput from '../../../components/SearchInput';
import { useMateriaData } from '../../../utils/hooks/useMateriaData';
import { RootStackParamList, Materia } from '../../../types';
import { SEARCH_CONFIG, MESSAGES } from '../../../constants/materias';
import MateriaForm from '../components/MateriaForm';
import EmptyState from '../components/EmptyState';
import MateriaCard from '../components/MateriaCard';
import FABButton from '../components/FABButton';

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
});

type MateriasScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Materias'>;

const useMateriasNavigation = () => {
  const navigation = useNavigation<MateriasScreenNavigationProp>();

  const openTemas = useCallback((materia: Materia) => {
    navigation.navigate('Temas', { 
      materiaId: materia._id, 
      materiaName: materia.name 
    });
  }, [navigation]);

  return { openTemas };
};

const MateriasScreen: React.FC = () => {
  const {
    materias,
    loading,
    refreshing,
    currentSearchQuery,
    formState,
    isFormVisible,
    formTitle,
    submitButtonTitle,
    loadMaterias,
    onRefresh,
    handleSearch,
    handleClearSearch,
    updateFormState,
    resetForm,
    startEdit,
    toggleCreateForm,
    handleDeleteMateria,
    submitHandler
  } = useMateriaData();

  const { openTemas } = useMateriasNavigation();

  const refreshControl = useMemo(() => (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  ), [refreshing, onRefresh]);

  const emptyStateConfig = useMemo(() => ({
    title: currentSearchQuery ? MESSAGES.empty.noResults : MESSAGES.empty.noMaterias,
    description: MESSAGES.empty.description(currentSearchQuery)
  }), [currentSearchQuery]);

  const hasMaterias = useMemo(() => materias.length > 0, [materias.length]);
  const showLoadingState = useMemo(() => 
    loading && !hasMaterias && !currentSearchQuery, 
    [loading, hasMaterias, currentSearchQuery]
  );

  useFocusEffect(
    useCallback(() => {
      loadMaterias();
    }, [])
  );

  if (showLoadingState) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{MESSAGES.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
          <MateriaForm
            title={formTitle}
            nome={formState.nome}
            onChangeNome={(nome) => updateFormState({ nome })}
            onSubmit={submitHandler}
            onCancel={resetForm}
            submitButtonTitle={submitButtonTitle}
            saving={formState.saving}
          />
        )}
        
        {!hasMaterias ? (
          <EmptyState
            title={emptyStateConfig.title}
            description={emptyStateConfig.description}
          />
        ) : (
          <View style={styles.listContainer}>
            {materias.map((materia) => (
              <MateriaCard
                key={materia._id}
                materia={materia}
                onPress={openTemas}
                onEdit={startEdit}
                onDelete={handleDeleteMateria}
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


export default MateriasScreen;