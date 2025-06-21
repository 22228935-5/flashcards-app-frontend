import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { Materia } from '../../types';
import { searchService } from '../../services/searchService';
import api from '../../services/api';
import { MESSAGES } from '../../constants/materias';

const EMPTY_MATERIAS: Materia[] = [];

const useMaterias = () => {
  const [materias, setMaterias] = useState<Materia[]>(EMPTY_MATERIAS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  const loadMaterias = useCallback(async (query?: string) => {
    setLoading(true);
    try {
      const response = await searchService.searchMaterias(query);
      setMaterias(response);
    } catch (error) {
      console.error('Erro ao carregar matérias:', error);
      Alert.alert('Erro', MESSAGES.errors.loadMaterias);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMaterias(currentSearchQuery);
    setRefreshing(false);
  }, [loadMaterias, currentSearchQuery]);

  const handleSearch = useCallback(async (query: string) => {
    setCurrentSearchQuery(query);
    await loadMaterias(query);
  }, [loadMaterias]);

  const handleClearSearch = useCallback(async () => {
    setCurrentSearchQuery('');
    await loadMaterias();
  }, [loadMaterias]);

  const sortedMaterias = useMemo(() => {
    return [...materias].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [materias]);

  return {
    materias: sortedMaterias,
    loading,
    refreshing,
    currentSearchQuery,
    loadMaterias,
    onRefresh,
    handleSearch,
    handleClearSearch,
    setMaterias
  };
};

interface FormState {
  showCreateForm: boolean;
  editingMateria: Materia | null;
  nome: string;
  saving: boolean;
}

const useFormState = () => {
  const [formState, setFormState] = useState<FormState>({
    showCreateForm: false,
    editingMateria: null,
    nome: '',
    saving: false
  });

  const updateFormState = useCallback((updates: Partial<FormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState({
      showCreateForm: false,
      editingMateria: null,
      nome: '',
      saving: false
    });
  }, []);

  const startEdit = useCallback((materia: Materia) => {
    setFormState({
      showCreateForm: false,
      editingMateria: materia,
      nome: materia.name,
      saving: false
    });
  }, []);

  const toggleCreateForm = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      showCreateForm: !prev.showCreateForm,
      editingMateria: null,
      nome: ''
    }));
  }, []);

  const isFormVisible = useMemo(() => {
    return formState.showCreateForm || formState.editingMateria !== null;
  }, [formState.showCreateForm, formState.editingMateria]);

  const formTitle = useMemo(() => {
    return formState.editingMateria ? 'Editar Matéria' : 'Nova Matéria';
  }, [formState.editingMateria]);

  const submitButtonTitle = useMemo(() => {
    return formState.editingMateria ? 'Salvar' : 'Criar';
  }, [formState.editingMateria]);

  return {
    formState,
    updateFormState,
    resetForm,
    startEdit,
    toggleCreateForm,
    isFormVisible,
    formTitle,
    submitButtonTitle
  };
};

const useMateriaActions = (
  formState: FormState,
  updateFormState: (updates: Partial<FormState>) => void,
  resetForm: () => void,
  setMaterias: React.Dispatch<React.SetStateAction<Materia[]>>
) => {
  const handleCreateMateria = useCallback(async () => {
    if (!formState.nome.trim()) {
      Alert.alert('Erro', MESSAGES.errors.nomeObrigatorio);
      return;
    }

    updateFormState({ saving: true });
    try {
      const response = await api.post<Materia>('/materias', { name: formState.nome });
      setMaterias(prev => [response.data, ...prev]);
      resetForm();
      Alert.alert('Sucesso', MESSAGES.success.createMateria);
    } catch (error) {
      console.error('Erro ao criar matéria:', error);
      Alert.alert('Erro', MESSAGES.errors.createMateria);
    } finally {
      updateFormState({ saving: false });
    }
  }, [formState.nome, updateFormState, resetForm, setMaterias]);

  const handleEditMateria = useCallback(async () => {
    if (!formState.nome.trim() || !formState.editingMateria) {
      Alert.alert('Erro', MESSAGES.errors.nomeObrigatorio);
      return;
    }

    updateFormState({ saving: true });
    try {
      const response = await api.put<Materia>(
        `/materias/${formState.editingMateria._id}`, 
        { name: formState.nome }
      );
      setMaterias(prev => prev.map(m => 
        m._id === formState.editingMateria!._id ? response.data : m
      ));
      resetForm();
      Alert.alert('Sucesso', MESSAGES.success.updateMateria);
    } catch (error) {
      console.error('Erro ao editar matéria:', error);
      Alert.alert('Erro', MESSAGES.errors.updateMateria);
    } finally {
      updateFormState({ saving: false });
    }
  }, [formState.nome, formState.editingMateria, updateFormState, resetForm, setMaterias]);

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
              Alert.alert('Sucesso', MESSAGES.success.deleteMateria);
            } catch (error) {
              console.error('Erro ao excluir matéria:', error);
              Alert.alert('Erro', MESSAGES.errors.deleteMateria);
            }
          },
        },
      ]
    );
  }, [setMaterias]);

  const submitHandler = useMemo(() => {
    return formState.editingMateria ? handleEditMateria : handleCreateMateria;
  }, [formState.editingMateria, handleEditMateria, handleCreateMateria]);

  return {
    handleCreateMateria,
    handleEditMateria,
    handleDeleteMateria,
    submitHandler
  };
};

export interface MateriaData {
  materias: Materia[];
  loading: boolean;
  refreshing: boolean;
  currentSearchQuery: string;
  formState: FormState;
  isFormVisible: boolean;
  formTitle: string;
  submitButtonTitle: string;
}

export interface MateriaActions {
  loadMaterias: (query?: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  handleSearch: (query: string) => Promise<void>;
  handleClearSearch: () => Promise<void>;
  updateFormState: (updates: Partial<FormState>) => void;
  resetForm: () => void;
  startEdit: (materia: Materia) => void;
  toggleCreateForm: () => void;
  handleCreateMateria: () => Promise<void>;
  handleEditMateria: () => Promise<void>;
  handleDeleteMateria: (materia: Materia) => void;
  submitHandler: () => Promise<void>;
}

export const useMateriaData = (): MateriaData & MateriaActions => {
  const {
    materias,
    loading,
    refreshing,
    currentSearchQuery,
    loadMaterias,
    onRefresh,
    handleSearch,
    handleClearSearch,
    setMaterias
  } = useMaterias();

  const {
    formState,
    updateFormState,
    resetForm,
    startEdit,
    toggleCreateForm,
    isFormVisible,
    formTitle,
    submitButtonTitle
  } = useFormState();

  const {
    handleCreateMateria,
    handleEditMateria,
    handleDeleteMateria,
    submitHandler
  } = useMateriaActions(formState, updateFormState, resetForm, setMaterias);

  return {
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
    handleCreateMateria,
    handleEditMateria,
    handleDeleteMateria,
    submitHandler
  };
};