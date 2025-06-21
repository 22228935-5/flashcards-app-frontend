
import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { Tema } from '../../types';
import { MESSAGES, EMPTY_STATES } from '../../constants/temas';
import { temaService } from '../../services/temasService';

const useTemas = (materiaId: string) => {
  const [temas, setTemas] = useState<Tema[]>(EMPTY_STATES.temas);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  const loadTemas = useCallback(async (query?: string) => {
    setLoading(true);
    try {
      const response = await temaService.searchTemas(materiaId, query);
      setTemas(response);
    } catch (error) {
      console.error('Erro ao carregar temas:', error);
      Alert.alert('Erro', MESSAGES.errors.loadTemas);
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
    await loadTemas(query);
  }, [loadTemas]);

  const handleClearSearch = useCallback(async () => {
    setCurrentSearchQuery('');
    await loadTemas();
  }, [loadTemas]);

  const sortedTemas = useMemo(() => {
    return [...temas].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [temas]);

  return {
    temas: sortedTemas,
    loading,
    refreshing,
    currentSearchQuery,
    loadTemas,
    onRefresh,
    handleSearch,
    handleClearSearch,
    setTemas
  };
};

interface FormState {
  showCreateForm: boolean;
  editingTema: Tema | null;
  nome: string;
  saving: boolean;
}

const useFormState = () => {
  const [formState, setFormState] = useState<FormState>({
    showCreateForm: false,
    editingTema: null,
    nome: '',
    saving: false
  });

  const updateFormState = useCallback((updates: Partial<FormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState({
      showCreateForm: false,
      editingTema: null,
      nome: '',
      saving: false
    });
  }, []);

  const startEdit = useCallback((tema: Tema) => {
    setFormState({
      showCreateForm: false,
      editingTema: tema,
      nome: tema.name,
      saving: false
    });
  }, []);

  const toggleCreateForm = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      showCreateForm: !prev.showCreateForm,
      editingTema: null,
      nome: ''
    }));
  }, []);

  const isFormVisible = useMemo(() => {
    return formState.showCreateForm || formState.editingTema !== null;
  }, [formState.showCreateForm, formState.editingTema]);

  const formTitle = useMemo(() => {
    return formState.editingTema ? 'Editar Tema' : 'Novo Tema';
  }, [formState.editingTema]);

  const submitButtonTitle = useMemo(() => {
    return formState.editingTema ? 'Salvar' : 'Criar';
  }, [formState.editingTema]);

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

const useTemasActions = (
  materiaId: string,
  formState: FormState,
  updateFormState: (updates: Partial<FormState>) => void,
  resetForm: () => void,
  setTemas: React.Dispatch<React.SetStateAction<Tema[]>>
) => {
  const handleCreateTema = useCallback(async () => {
    if (!formState.nome.trim()) {
      Alert.alert('Erro', MESSAGES.errors.nomeObrigatorio);
      return;
    }

    updateFormState({ saving: true });
    try {
      const newTema = await temaService.createTema({
        name: formState.nome,
        materiaId
      });
      setTemas(prev => [newTema, ...prev]);
      resetForm();
      Alert.alert('Sucesso', MESSAGES.success.createTema);
    } catch (error) {
      console.error('Erro ao criar tema:', error);
      Alert.alert('Erro', MESSAGES.errors.createTema);
    } finally {
      updateFormState({ saving: false });
    }
  }, [formState.nome, materiaId, updateFormState, resetForm, setTemas]);

  const handleEditTema = useCallback(async () => {
    if (!formState.nome.trim() || !formState.editingTema) {
      Alert.alert('Erro', MESSAGES.errors.nomeObrigatorio);
      return;
    }

    updateFormState({ saving: true });
    try {
      const updatedTema = await temaService.updateTema(formState.editingTema._id, { 
        name: formState.nome 
      });
      setTemas(prev => prev.map(t => 
        t._id === formState.editingTema!._id ? updatedTema : t
      ));
      resetForm();
      Alert.alert('Sucesso', MESSAGES.success.updateTema);
    } catch (error) {
      console.error('Erro ao editar tema:', error);
      Alert.alert('Erro', MESSAGES.errors.updateTema);
    } finally {
      updateFormState({ saving: false });
    }
  }, [formState.nome, formState.editingTema, updateFormState, resetForm, setTemas]);

  const handleDeleteTema = useCallback((tema: Tema) => {
    Alert.alert(
      MESSAGES.deleteConfirmation.title,
      MESSAGES.deleteConfirmation.message(tema.name),
      [
        { text: MESSAGES.deleteConfirmation.buttons.cancel, style: 'cancel' },
        {
          text: MESSAGES.deleteConfirmation.buttons.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              await temaService.deleteTema(tema._id);
              setTemas(prev => prev.filter(t => t._id !== tema._id));
              Alert.alert('Sucesso', MESSAGES.success.deleteTema);
            } catch (error) {
              console.error('Erro ao excluir tema:', error);
              Alert.alert('Erro', MESSAGES.errors.deleteTema);
            }
          },
        },
      ]
    );
  }, [setTemas]);

  const submitHandler = useMemo(() => {
    return formState.editingTema ? handleEditTema : handleCreateTema;
  }, [formState.editingTema, handleEditTema, handleCreateTema]);

  return {
    handleCreateTema,
    handleEditTema,
    handleDeleteTema,
    submitHandler
  };
};

const useTemasGrouping = (temas: Tema[]) => {
  return useMemo(() => {
    const now = new Date();
    const prontos: Tema[] = [];
    const pendentes: Tema[] = [];
    
    temas.forEach(tema => {
      if (tema.nextReview && new Date(tema.nextReview) <= now) {
        prontos.push(tema);
      } else {
        pendentes.push(tema);
      }
    });
    
    return { temasParaRevisar: prontos, temasPendentes: pendentes };
  }, [temas]);
};

export interface TemasData {
  temas: Tema[];
  loading: boolean;
  refreshing: boolean;
  currentSearchQuery: string;
  formState: FormState;
  isFormVisible: boolean;
  formTitle: string;
  submitButtonTitle: string;
  temasParaRevisar: Tema[];
  temasPendentes: Tema[];
}

export interface TemasActions {
  loadTemas: (query?: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  handleSearch: (query: string) => Promise<void>;
  handleClearSearch: () => Promise<void>;
  updateFormState: (updates: Partial<FormState>) => void;
  resetForm: () => void;
  startEdit: (tema: Tema) => void;
  toggleCreateForm: () => void;
  handleDeleteTema: (tema: Tema) => void;
  submitHandler: () => Promise<void>;
}

export const useTemasData = (materiaId: string): TemasData & TemasActions => {
  const {
    temas,
    loading,
    refreshing,
    currentSearchQuery,
    loadTemas,
    onRefresh,
    handleSearch,
    handleClearSearch,
    setTemas
  } = useTemas(materiaId);

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
    handleDeleteTema,
    submitHandler
  } = useTemasActions(materiaId, formState, updateFormState, resetForm, setTemas);

  const { temasParaRevisar, temasPendentes } = useTemasGrouping(temas);

  return {
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
  };
};