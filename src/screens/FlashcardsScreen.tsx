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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Button from '../components/Button';
import Input from '../components/Input';
import api from '../services/api';
import { RootStackParamList, Flashcard } from '../types';


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
    gap: 16,
  },
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

type FlashcardsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Flashcards'>;
type FlashcardsScreenRouteProp = RouteProp<RootStackParamList, 'Flashcards'>;

const FlashcardsScreen: React.FC = () => {
  const navigation = useNavigation<FlashcardsScreenNavigationProp>();
  const route = useRoute<FlashcardsScreenRouteProp>();
  const { temaId, temaName } = route.params;
  
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [saving, setSaving] = useState(false);

  const loadFlashcards = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<Flashcard[]>(`/flashcards/tema/${temaId}`);
      setFlashcards(response.data);
    } catch (error) {
      console.error('Erro ao carregar flashcards:', error);
      Alert.alert('Erro', 'Não foi possível carregar os flashcards');
    } finally {
      setLoading(false);
    }
  }, [temaId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFlashcards();
    setRefreshing(false);
  }, [loadFlashcards]);

  const handleCreateFlashcard = useCallback(async () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert('Erro', 'Pergunta e resposta são obrigatórias');
      return;
    }

    setSaving(true);
    try {
      const response = await api.post<Flashcard>('/flashcards', { 
        question, 
        answer,
        temaId 
      });
      setFlashcards(prev => [response.data, ...prev]);
      setQuestion('');
      setAnswer('');
      setShowCreateForm(false);
      Alert.alert('Sucesso', 'Flashcard criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar flashcard:', error);
      Alert.alert('Erro', 'Não foi possível criar o flashcard');
    } finally {
      setSaving(false);
    }
  }, [question, answer, temaId]);

  const handleEditFlashcard = useCallback(async () => {
    if (!question.trim() || !answer.trim() || !editingFlashcard) {
      Alert.alert('Erro', 'Pergunta e resposta são obrigatórias');
      return;
    }

    setSaving(true);
    try {
      const response = await api.put<Flashcard>(`/flashcards/${editingFlashcard._id}`, { 
        question, 
        answer 
      });
      setFlashcards(prev => prev.map(f => f._id === editingFlashcard._id ? response.data : f));
      setQuestion('');
      setAnswer('');
      setEditingFlashcard(null);
      Alert.alert('Sucesso', 'Flashcard atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao editar flashcard:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o flashcard');
    } finally {
      setSaving(false);
    }
  }, [question, answer, editingFlashcard]);

  const handleDeleteFlashcard = useCallback((flashcard: Flashcard) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir este flashcard?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/flashcards/${flashcard._id}`);
              setFlashcards(prev => prev.filter(f => f._id !== flashcard._id));
              Alert.alert('Sucesso', 'Flashcard excluído com sucesso!');
            } catch (error) {
              console.error('Erro ao excluir flashcard:', error);
              Alert.alert('Erro', 'Não foi possível excluir o flashcard');
            }
          },
        },
      ]
    );
  }, []);

  const startEdit = useCallback((flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
    setQuestion(flashcard.question);
    setAnswer(flashcard.answer);
    setShowCreateForm(false);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingFlashcard(null);
    setQuestion('');
    setAnswer('');
    setShowCreateForm(false);
  }, []);

  const startStudy = useCallback(() => {
    if (flashcards.length === 0) {
      Alert.alert('Aviso', 'Crie alguns flashcards antes de começar a estudar!');
      return;
    }
    
    navigation.navigate('Estudo', { 
      temaId, 
      temaName 
    });
  }, [navigation, temaId, temaName, flashcards.length]);

  const toggleCreateForm = useCallback(() => {
    setShowCreateForm(prev => !prev);
  }, []);

  const isFormVisible = useMemo(() => {
    return showCreateForm || editingFlashcard !== null;
  }, [showCreateForm, editingFlashcard]);

  const formTitle = useMemo(() => {
    return editingFlashcard ? 'Editar Flashcard' : 'Novo Flashcard';
  }, [editingFlashcard]);

  const submitButtonTitle = useMemo(() => {
    return editingFlashcard ? 'Salvar' : 'Criar';
  }, [editingFlashcard]);

  const submitHandler = useMemo(() => {
    return editingFlashcard ? handleEditFlashcard : handleCreateFlashcard;
  }, [editingFlashcard, handleEditFlashcard, handleCreateFlashcard]);

  const sortedFlashcards = useMemo(() => {
    return [...flashcards].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [flashcards]);

  const refreshControl = useMemo(() => (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  ), [refreshing, onRefresh]);

  useEffect(() => {
    loadFlashcards();
  }, [loadFlashcards]);

  if (loading && flashcards.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando flashcards...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>🎯 {temaName}</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.headerSubtitle}>
            {flashcards.length} {flashcards.length === 1 ? 'flashcard' : 'flashcards'}
          </Text>
          {flashcards.length > 0 && (
            <TouchableOpacity 
              style={styles.studyButton}
              onPress={startStudy}
            >
              <Text style={styles.studyButtonText}>🧠 Estudar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        refreshControl={refreshControl}
        contentContainerStyle={styles.scrollContent}
      >
        {isFormVisible && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>{formTitle}</Text>
            
            <Input
              label="Pergunta"
              value={question}
              onChangeText={setQuestion}
              placeholder="Digite a pergunta..."
              multiline
              numberOfLines={3}
            />

            <Input
              label="Resposta"
              value={answer}
              onChangeText={setAnswer}
              placeholder="Digite a resposta..."
              multiline
              numberOfLines={4}
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
        {sortedFlashcards.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>📝 Nenhum flashcard encontrado</Text>
            <Text style={styles.emptyDescription}>
              Crie o primeiro flashcard para começar a estudar {temaName}!
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {sortedFlashcards.map((flashcard) => (
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

  return (
    <View style={styles.flashcardCard}>
      <View style={styles.flashcardHeader}>
        <Text style={styles.flashcardDate}>{formattedDate}</Text>
      </View>

      <TouchableOpacity onPress={toggleAnswer} style={styles.flashcardContent}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionLabel}>❓ Pergunta:</Text>
          <Text style={styles.questionText}>{flashcard.question}</Text>
        </View>

        {showAnswer && (
          <View style={styles.answerContainer}>
            <Text style={styles.answerLabel}>✅ Resposta:</Text>
            <Text style={styles.answerText}>{flashcard.answer}</Text>
          </View>
        )}

        <Text style={styles.tapHint}>
          {showAnswer ? 'Toque para ocultar resposta' : 'Toque para ver resposta'}
        </Text>
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

export default FlashcardsScreen;