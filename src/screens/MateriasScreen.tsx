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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Button from '../components/Button';
import Input from '../components/Input';
import api from '../services/api';
import { RootStackParamList, Materia } from '../types';

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
  materiaCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  materiaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  materiaName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  materiaDate: {
    fontSize: 12,
    color: '#666',
  },
  materiaActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
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

type MateriasScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Materias'>;

const MateriasScreen: React.FC = () => {
  const navigation = useNavigation<MateriasScreenNavigationProp>();
  
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMateria, setEditingMateria] = useState<Materia | null>(null);
  const [nome, setNome] = useState('');
  const [saving, setSaving] = useState(false);

  const loadMaterias = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<Materia[]>('/materias');
      setMaterias(response.data);
    } catch (error) {
      console.error('Erro ao carregar matérias:', error);
      Alert.alert('Erro', 'Não foi possível carregar as matérias');
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMaterias();
    setRefreshing(false);
  }, [loadMaterias]);

  const handleCreateMateria = useCallback(async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Nome da matéria é obrigatório');
      return;
    }

    setSaving(true);
    try {
      const response = await api.post<Materia>('/materias', { name: nome });
      setMaterias(prev => [response.data, ...prev]);
      setNome('');
      setShowCreateForm(false);
      Alert.alert('Sucesso', 'Matéria criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar matéria:', error);
      Alert.alert('Erro', 'Não foi possível criar a matéria');
    } finally {
      setSaving(false);
    }
  }, [nome]);

  const handleEditMateria = useCallback(async () => {
    if (!nome.trim() || !editingMateria) {
      Alert.alert('Erro', 'Nome da matéria é obrigatório');
      return;
    }

    setSaving(true);
    try {
      const response = await api.put<Materia>(`/materias/${editingMateria._id}`, { name: nome });
      setMaterias(prev => prev.map(m => m._id === editingMateria._id ? response.data : m));
      setNome('');
      setEditingMateria(null);
      Alert.alert('Sucesso', 'Matéria atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao editar matéria:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a matéria');
    } finally {
      setSaving(false);
    }
  }, [nome, editingMateria]);

  const handleDeleteMateria = useCallback((materia: Materia) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir "${materia.name}"?\n\nTodos os temas e flashcards desta matéria também serão excluídos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/materias/${materia._id}`);
              setMaterias(prev => prev.filter(m => m._id !== materia._id));
              Alert.alert('Sucesso', 'Matéria excluída com sucesso!');
            } catch (error) {
              console.error('Erro ao excluir matéria:', error);
              Alert.alert('Erro', 'Não foi possível excluir a matéria');
            }
          },
        },
      ]
    );
  }, []);

  const startEdit = useCallback((materia: Materia) => {
    setEditingMateria(materia);
    setNome(materia.name);
    setShowCreateForm(false);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingMateria(null);
    setNome('');
    setShowCreateForm(false);
  }, []);

  const openTemas = useCallback((materia: Materia) => {
    navigation.navigate('Temas', { 
      materiaId: materia._id, 
      materiaName: materia.name 
    });
  }, [navigation]);

  const toggleCreateForm = useCallback(() => {
    setShowCreateForm(prev => !prev);
  }, []);

  const isFormVisible = useMemo(() => {
    return showCreateForm ?? editingMateria !== null;
  }, [showCreateForm, editingMateria]);

  const formTitle = useMemo(() => {
    return editingMateria ? 'Editar Matéria' : 'Nova Matéria';
  }, [editingMateria]);

  const submitButtonTitle = useMemo(() => {
    return editingMateria ? 'Salvar' : 'Criar';
  }, [editingMateria]);

  const submitHandler = useMemo(() => {
    return editingMateria ? handleEditMateria : handleCreateMateria;
  }, [editingMateria, handleEditMateria, handleCreateMateria]);

  const sortedMaterias = useMemo(() => {
    return [...materias].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [materias]);

  const refreshControl = useMemo(() => (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  ), [refreshing, onRefresh]);

  useEffect(() => {
    loadMaterias();
  }, [loadMaterias]);

  if (loading && materias.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando matérias...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={refreshControl}
        contentContainerStyle={styles.scrollContent}
      >
        {isFormVisible && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>{formTitle}</Text>
            
            <Input
              label="Nome da Matéria"
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Matemática, História..."
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

        {sortedMaterias.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>📚 Nenhuma matéria encontrada</Text>
            <Text style={styles.emptyDescription}>
              Crie sua primeira matéria para começar a organizar seus estudos!
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {sortedMaterias.map((materia) => (
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

interface MateriaCardProps {
  materia: Materia;
  onPress: (materia: Materia) => void;
  onEdit: (materia: Materia) => void;
  onDelete: (materia: Materia) => void;
}

const MateriaCard = React.memo<MateriaCardProps>(({ materia, onPress, onEdit, onDelete }) => {
  const handlePress = useCallback(() => onPress(materia), [onPress, materia]);
  const handleEdit = useCallback(() => onEdit(materia), [onEdit, materia]);
  const handleDelete = useCallback(() => onDelete(materia), [onDelete, materia]);

  const formattedDate = useMemo(() => {
    return new Date(materia.createdAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, [materia.createdAt]);

  return (
    <TouchableOpacity style={styles.materiaCard} onPress={handlePress}>
      <View style={styles.materiaHeader}>
        <Text style={styles.materiaName}>{materia.name}</Text>
        <Text style={styles.materiaDate}>{formattedDate}</Text>
      </View>
      
      <View style={styles.materiaActions}>
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

export default MateriasScreen;