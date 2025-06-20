import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '../components/Button';
import Input from '../components/Input';
import SearchInput from '../components/SearchInput';
import api from '../services/api';
import { searchService } from '../services/searchService';
import { RootStackParamList, Tema } from '../types';

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
  // ✅ NOVOS ESTILOS PARA HEADER
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  reviewBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reviewBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
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
  temaCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  readyForReviewCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    backgroundColor: '#f8fff8',
  },
  reviewBadgeCard: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reviewBadgeCardText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  temaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  temaName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    paddingRight: 60,
  },
  temaDate: {
    fontSize: 12,
    color: '#666',
  },
  reviewInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  lastScore: {
    fontSize: 12,
    color: '#666',
  },
  temaActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  studyButton: {
    backgroundColor: '#4CAF50',
  },
  studyButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});

type TemasScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Temas'>;
type TemasScreenRouteProp = RouteProp<RootStackParamList, 'Temas'>;

const TemasScreen: React.FC = () => {
  const navigation = useNavigation<TemasScreenNavigationProp>();
  const route = useRoute<TemasScreenRouteProp>();
  const { materiaId, materiaName } = route.params;

  const [temas, setTemas] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTema, setEditingTema] = useState<Tema | null>(null);
  const [nome, setNome] = useState('');
  const [saving, setSaving] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  const loadTemas = useCallback(async (query?: string) => {
    setLoading(true);
    try {
      const response = await searchService.searchTemas(materiaId, query);
      setTemas(response);
    } catch (error) {
      console.error('Erro ao carregar temas:', error);
      Alert.alert('Erro', 'Não foi possível carregar os temas');
    } finally {
      setLoading(false);
    }
  }, [materiaId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setCurrentSearchQuery('');
    await loadTemas();
    setRefreshing(false);
  }, [loadTemas]);

  const handleSearch = useCallback(async (query: string) => {
    setCurrentSearchQuery(query);
    setLoading(true);
    try {
      const response = await searchService.searchTemas(materiaId, query);
      setTemas(response);
    } catch (error) {
      console.error('Erro ao buscar temas:', error);
      Alert.alert('Erro', 'Não foi possível buscar os temas');
    } finally {
      setLoading(false);
    }
  }, [materiaId]);

  const handleClearSearch = useCallback(async () => {
    setCurrentSearchQuery('');
    await loadTemas();
  }, [loadTemas]);

  const handleCreateTema = useCallback(async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Nome do tema é obrigatório');
      return;
    }

    setSaving(true);
    try {
      const response = await api.post<Tema>('/temas', {
        name: nome,
        materiaId
      });
      setTemas(prev => [response.data, ...prev]);
      setNome('');
      setShowCreateForm(false);
      Alert.alert('Sucesso', 'Tema criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar tema:', error);
      Alert.alert('Erro', 'Não foi possível criar o tema');
    } finally {
      setSaving(false);
    }
  }, [nome, materiaId]);

  const handleEditTema = useCallback(async () => {
    if (!nome.trim() || !editingTema) {
      Alert.alert('Erro', 'Nome do tema é obrigatório');
      return;
    }

    setSaving(true);
    try {
      const response = await api.put<Tema>(`/temas/${editingTema._id}`, { name: nome });
      setTemas(prev => prev.map(t => t._id === editingTema._id ? response.data : t));
      setNome('');
      setEditingTema(null);
      Alert.alert('Sucesso', 'Tema atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao editar tema:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o tema');
    } finally {
      setSaving(false);
    }
  }, [nome, editingTema]);

  const handleDeleteTema = useCallback((tema: Tema) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir "${tema.name}"?\n\nTodos os flashcards deste tema também serão excluídos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/temas/${tema._id}`);
              setTemas(prev => prev.filter(t => t._id !== tema._id));
              Alert.alert('Sucesso', 'Tema excluído com sucesso!');
            } catch (error) {
              console.error('Erro ao excluir tema:', error);
              Alert.alert('Erro', 'Não foi possível excluir o tema');
            }
          },
        },
      ]
    );
  }, []);

  const startEdit = useCallback((tema: Tema) => {
    setEditingTema(tema);
    setNome(tema.name);
    setShowCreateForm(false);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingTema(null);
    setNome('');
    setShowCreateForm(false);
  }, []);

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

  const toggleCreateForm = useCallback(() => {
    setShowCreateForm(prev => !prev);
  }, []);

  const isFormVisible = useMemo(() => {
    return showCreateForm || editingTema !== null;
  }, [showCreateForm, editingTema]);

  const formTitle = useMemo(() => {
    return editingTema ? 'Editar Tema' : 'Novo Tema';
  }, [editingTema]);

  const submitButtonTitle = useMemo(() => {
    return editingTema ? 'Salvar' : 'Criar';
  }, [editingTema]);

  const submitHandler = useMemo(() => {
    return editingTema ? handleEditTema : handleCreateTema;
  }, [editingTema, handleEditTema, handleCreateTema]);

  const sortedTemas = useMemo(() => {
    return [...temas].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [temas]);

  const { temasParaRevisar, temaspendentes } = useMemo(() => {
    const now = new Date();
    const prontos: Tema[] = [];
    const pendentes: Tema[] = [];
    
    sortedTemas.forEach(tema => {
      if (tema.nextReview && new Date(tema.nextReview) <= now) {
        prontos.push(tema);
      } else {
        pendentes.push(tema);
      }
    });
    
    return { temasParaRevisar: prontos, temaspendentes: pendentes };
  }, [sortedTemas]);

  const refreshControl = useMemo(() => (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  ), [refreshing, onRefresh]);

  useFocusEffect(
  useCallback(() => {
    loadTemas();
  }, [loadTemas])
);

  if (loading && temas.length === 0 && !currentSearchQuery) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando temas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>📚 {materiaName}</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.headerSubtitle}>
            {temas.length} {temas.length === 1 ? 'tema' : 'temas'}
          </Text>
          {temasParaRevisar.length > 0 && (
            <View style={styles.reviewBadge}>
              <Text style={styles.reviewBadgeText}>
                🔔 {temasParaRevisar.length} para revisar
              </Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        refreshControl={refreshControl}
        contentContainerStyle={styles.scrollContent}
      >
        <SearchInput
          placeholder="Buscar temas..."
          onSearch={handleSearch}
          onClear={handleClearSearch}
          debounceDelay={300}
          minCharacters={2}
        />

        {isFormVisible && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>{formTitle}</Text>
            <Input
              label="Nome do Tema"
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Álgebra, Geometria..."
            />
            <View style={styles.formButtons}>
              <Button
                title={submitButtonTitle}
                onPress={submitHandler}
                loading={saving}
              />
              <Button
                title="Cancelar"
                onPress={cancelEdit}
                variant="secondary"
              />
            </View>
          </View>
        )}

        {sortedTemas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              {currentSearchQuery ? '🔍 Nenhum tema encontrado' : '🎯 Nenhum tema cadastrado'}
            </Text>
            <Text style={styles.emptyDescription}>
              {currentSearchQuery 
                ? `Não encontramos temas com "${currentSearchQuery}"`
                : `Crie o primeiro tema para organizar seus flashcards de ${materiaName}!`}
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {temasParaRevisar.length > 0 && !currentSearchQuery && (
              <>
                <Text style={styles.sectionTitle}>🔔 Prontos para Revisar</Text>
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

            {temaspendentes.length > 0 && !currentSearchQuery && temasParaRevisar.length > 0 && (
              <Text style={styles.sectionTitle}>📚 Outros Temas</Text>
            )}
            
            {(currentSearchQuery ? sortedTemas : temaspendentes).map((tema) => (
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
        <TouchableOpacity
          style={styles.fabButton}
          onPress={toggleCreateForm}
        >
          <Text style={styles.fabButtonText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

interface TemaCardProps {
  tema: Tema;
  onPress: (tema: Tema) => void;
  onEdit: (tema: Tema) => void;
  onDelete: (tema: Tema) => void;
  onStudy: (tema: Tema) => void;
  isReadyForReview: boolean;
}

const TemaCard = React.memo<TemaCardProps>(({ 
  tema, 
  onPress, 
  onEdit, 
  onDelete, 
  onStudy,
  isReadyForReview 
}) => {
  const handlePress = useCallback(() => onPress(tema), [onPress, tema]);
  const handleEdit = useCallback(() => onEdit(tema), [onEdit, tema]);
  const handleDelete = useCallback(() => onDelete(tema), [onDelete, tema]);
  const handleStudy = useCallback(() => onStudy(tema), [onStudy, tema]);

  const formattedDate = useMemo(() => {
    return new Date(tema.createdAt).toLocaleDateString('pt-BR');
  }, [tema.createdAt]);

  const reviewInfo = useMemo(() => {
    if (!tema.nextReview) {
      return { status: 'Nunca estudado', color: '#999', showStudyButton: true };
    }

    const nextReview = new Date(tema.nextReview);
    const now = new Date();
    const diffTime = nextReview.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return { status: 'Pronto para revisar!', color: '#4CAF50', showStudyButton: true };
    } else if (diffDays === 1) {
      return { status: 'Revisar amanhã', color: '#FF9800', showStudyButton: false };
    } else {
      return { status: `Revisar em ${diffDays} dias`, color: '#666', showStudyButton: false };
    }
  }, [tema.nextReview]);

  return (
    <TouchableOpacity 
      style={[
        styles.temaCard,
        isReadyForReview && styles.readyForReviewCard
      ]} 
      onPress={handlePress}
    >
      {isReadyForReview && (
        <View style={styles.reviewBadgeCard}>
          <Text style={styles.reviewBadgeCardText}>🔔 REVISAR</Text>
        </View>
      )}

      <View style={styles.temaHeader}>
        <Text style={styles.temaName}>{tema.name}</Text>
        <Text style={styles.temaDate}>{formattedDate}</Text>
      </View>

      <View style={styles.reviewInfo}>
        <Text style={[styles.reviewStatus, { color: reviewInfo.color }]}>
          {reviewInfo.status}
        </Text>
        {tema.lastReviewScore !== undefined && (
          <Text style={styles.lastScore}>
            📊 Última: {tema.lastReviewScore}%
          </Text>
        )}
      </View>

      <View style={styles.temaActions}>
        {reviewInfo.showStudyButton && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.studyButton]} 
            onPress={handleStudy}
          >
            <Text style={[styles.actionButtonText, styles.studyButtonText]}>
              🧠 Estudar
            </Text>
          </TouchableOpacity>
        )}
        
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
    </TouchableOpacity>
  );
});

export default TemasScreen;