export const SEARCH_CONFIG = {
  debounceDelay: 300,
  minCharacters: 2,
  placeholder: 'Buscar por pergunta...'
};

export const MESSAGES = {
  loading: 'Carregando flashcards...',
  errors: {
    loadFlashcards: 'Não foi possível carregar os flashcards',
    searchFlashcards: 'Não foi possível buscar os flashcards',
    createFlashcard: 'Não foi possível criar o flashcard',
    updateFlashcard: 'Não foi possível atualizar o flashcard',
    deleteFlashcard: 'Não foi possível excluir o flashcard',
    camposObrigatorios: 'Pergunta e resposta são obrigatórias'
  },
  success: {
    createFlashcard: 'Flashcard criado com sucesso!',
    updateFlashcard: 'Flashcard atualizado com sucesso!',
    deleteFlashcard: 'Flashcard excluído com sucesso!'
  },
  empty: {
    noFlashcards: '📝 Nenhum flashcard cadastrado',
    noResults: '🔍 Nenhum flashcard encontrado',
    description: (query?: string, temaName?: string) => {
      if (query) {
        return `Não encontramos flashcards com "${query}"`;
      }
      return `Crie o primeiro flashcard para começar a estudar ${temaName}!`;
    }
  },
  deleteConfirmation: {
    title: 'Confirmar Exclusão',
    message: 'Tem certeza que deseja excluir este flashcard?',
    buttons: {
      cancel: 'Cancelar',
      delete: 'Excluir'
    }
  },
  study: {
    noFlashcards: 'Crie alguns flashcards antes de começar a estudar!'
  }
};

export const FORM_CONFIG = {
  questionPlaceholder: 'Digite a pergunta...',
  answerPlaceholder: 'Digite a resposta...',
  questionLabel: 'Pergunta',
  answerLabel: 'Resposta',
  titles: {
    create: 'Novo Flashcard',
    edit: 'Editar Flashcard'
  },
  buttons: {
    create: 'Criar',
    edit: 'Salvar',
    cancel: 'Cancelar'
  }
};

export const FLASHCARD_UI = {
  questionLabel: '❓ Pergunta:',
  answerLabel: '✅ Resposta:',
  hints: {
    showAnswer: 'Toque para ver resposta',
    hideAnswer: 'Toque para ocultar resposta'
  },
  studyButton: '🧠 Estudar'
};

export const TEXT_FORMATTERS = {
  flashcardsCount: (count: number): string => 
    count === 1 ? 'flashcard' : 'flashcards',
  headerTitle: (temaName: string): string => `🎯 ${temaName}`
};

export const EMPTY_STATES = {
  flashcards: [] as any[]
};