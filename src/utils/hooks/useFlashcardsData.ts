import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { Flashcard } from '../../types';
import { MESSAGES, EMPTY_STATES } from '../../constants/flashcards';
import { flashcardService } from '../../services/flashcardService';

const useFlashcards = (temaId: string) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(EMPTY_STATES.flashcards);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  const loadFlashcards = useCallback(async (query?: string) => {
    setLoading(true);
    try {
      const response = await flashcardService.searchFlashcards(temaId, query);
      setFlashcards(response);
    } catch (error) {
      console.error('Erro ao carregar flashcards:', error);
      Alert.alert('Erro', MESSAGES.errors.loadFlashcards);
    } finally {
      setLoading(false);
    }
  }, [temaId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setCurrentSearchQuery('');
    await loadFlashcards();
    setRefreshing(false);
  }, [loadFlashcards]);

  const handleSearch = useCallback(async (query: string) => {
    setCurrentSearchQuery(query);
    await loadFlashcards(query);
  }, [loadFlashcards]);

  const handleClearSearch = useCallback(async () => {
    setCurrentSearchQuery('');
    await loadFlashcards();
  }, [loadFlashcards]);

  const sortedFlashcards = useMemo(() => {
    return [...flashcards].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [flashcards]);

  return {
    flashcards: sortedFlashcards,
    loading,
    refreshing,
    currentSearchQuery,
    loadFlashcards,
    onRefresh,
    handleSearch,
    handleClearSearch,
    setFlashcards
  };
};

interface FormState {
  showCreateForm: boolean;
  editingFlashcard: Flashcard | null;
  question: string;
  answer: string;
  saving: boolean;
}

const useFormState = () => {
  const [formState, setFormState] = useState<FormState>({
    showCreateForm: false,
    editingFlashcard: null,
    question: '',
    answer: '',
    saving: false
  });

  const updateFormState = useCallback((updates: Partial<FormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState({
      showCreateForm: false,
      editingFlashcard: null,
      question: '',
      answer: '',
      saving: false
    });
  }, []);

  const startEdit = useCallback((flashcard: Flashcard) => {
    setFormState({
      showCreateForm: false,
      editingFlashcard: flashcard,
      question: flashcard.question,
      answer: flashcard.answer,
      saving: false
    });
  }, []);

  const toggleCreateForm = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      showCreateForm: !prev.showCreateForm,
      editingFlashcard: null,
      question: '',
      answer: ''
    }));
  }, []);

  const isFormVisible = useMemo(() => {
    return formState.showCreateForm || formState.editingFlashcard !== null;
  }, [formState.showCreateForm, formState.editingFlashcard]);

  const formTitle = useMemo(() => {
    return formState.editingFlashcard ? 'Editar Flashcard' : 'Novo Flashcard';
  }, [formState.editingFlashcard]);

  const submitButtonTitle = useMemo(() => {
    return formState.editingFlashcard ? 'Salvar' : 'Criar';
  }, [formState.editingFlashcard]);

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

const useFlashcardsActions = (
  temaId: string,
  formState: FormState,
  updateFormState: (updates: Partial<FormState>) => void,
  resetForm: () => void,
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>
) => {
  const handleCreateFlashcard = useCallback(async () => {
    if (!formState.question.trim() || !formState.answer.trim()) {
      Alert.alert('Erro', MESSAGES.errors.camposObrigatorios);
      return;
    }

    updateFormState({ saving: true });
    try {
      const newFlashcard = await flashcardService.createFlashcard({
        question: formState.question,
        answer: formState.answer,
        temaId
      });
      setFlashcards(prev => [newFlashcard, ...prev]);
      resetForm();
      Alert.alert('Sucesso', MESSAGES.success.createFlashcard);
    } catch (error) {
      console.error('Erro ao criar flashcard:', error);
      Alert.alert('Erro', MESSAGES.errors.createFlashcard);
    } finally {
      updateFormState({ saving: false });
    }
  }, [formState.question, formState.answer, temaId, updateFormState, resetForm, setFlashcards]);

  const handleEditFlashcard = useCallback(async () => {
    if (!formState.question.trim() || !formState.answer.trim() || !formState.editingFlashcard) {
      Alert.alert('Erro', MESSAGES.errors.camposObrigatorios);
      return;
    }

    updateFormState({ saving: true });
    try {
      const updatedFlashcard = await flashcardService.updateFlashcard(
        formState.editingFlashcard._id,
        {
          question: formState.question,
          answer: formState.answer,
          temaId
        }
      );
      setFlashcards(prev => prev.map(f => 
        f._id === formState.editingFlashcard!._id ? updatedFlashcard : f
      ));
      resetForm();
      Alert.alert('Sucesso', MESSAGES.success.updateFlashcard);
    } catch (error) {
      console.error('Erro ao editar flashcard:', error);
      Alert.alert('Erro', MESSAGES.errors.updateFlashcard);
    } finally {
      updateFormState({ saving: false });
    }
  }, [formState.question, formState.answer, formState.editingFlashcard, updateFormState, resetForm, setFlashcards]);

  const handleDeleteFlashcard = useCallback((flashcard: Flashcard) => {
    Alert.alert(
      MESSAGES.deleteConfirmation.title,
      MESSAGES.deleteConfirmation.message,
      [
        { text: MESSAGES.deleteConfirmation.buttons.cancel, style: 'cancel' },
        {
          text: MESSAGES.deleteConfirmation.buttons.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              await flashcardService.deleteFlashcard(flashcard._id);
              setFlashcards(prev => prev.filter(f => f._id !== flashcard._id));
              Alert.alert('Sucesso', MESSAGES.success.deleteFlashcard);
            } catch (error) {
              console.error('Erro ao excluir flashcard:', error);
              Alert.alert('Erro', MESSAGES.errors.deleteFlashcard);
            }
          },
        },
      ]
    );
  }, [setFlashcards]);

  const submitHandler = useMemo(() => {
    return formState.editingFlashcard ? handleEditFlashcard : handleCreateFlashcard;
  }, [formState.editingFlashcard, handleEditFlashcard, handleCreateFlashcard]);

  return {
    handleCreateFlashcard,
    handleEditFlashcard,
    handleDeleteFlashcard,
    submitHandler
  };
};

export interface FlashcardsData {
  flashcards: Flashcard[];
  loading: boolean;
  refreshing: boolean;
  currentSearchQuery: string;
  formState: FormState;
  isFormVisible: boolean;
  formTitle: string;
  submitButtonTitle: string;
}

export interface FlashcardsActions {
  loadFlashcards: (query?: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  handleSearch: (query: string) => Promise<void>;
  handleClearSearch: () => Promise<void>;
  updateFormState: (updates: Partial<FormState>) => void;
  resetForm: () => void;
  startEdit: (flashcard: Flashcard) => void;
  toggleCreateForm: () => void;
  handleDeleteFlashcard: (flashcard: Flashcard) => void;
  submitHandler: () => Promise<void>;
}

export const useFlashcardsData = (temaId: string): FlashcardsData & FlashcardsActions => {
  const {
    flashcards,
    loading,
    refreshing,
    currentSearchQuery,
    loadFlashcards,
    onRefresh,
    handleSearch,
    handleClearSearch,
    setFlashcards
  } = useFlashcards(temaId);

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
    handleDeleteFlashcard,
    submitHandler
  } = useFlashcardsActions(temaId, formState, updateFormState, resetForm, setFlashcards);

  return {
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
  };
};