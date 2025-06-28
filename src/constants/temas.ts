export const SEARCH_CONFIG = {
  debounceDelay: 300,
  minCharacters: 2,
  placeholder: 'Buscar temas...'
};

export const MESSAGES = {
  loading: 'Carregando temas...',
  errors: {
    loadTemas: 'Não foi possível carregar os temas',
    searchTemas: 'Não foi possível buscar os temas',
    createTema: 'Não foi possível criar o tema',
    updateTema: 'Não foi possível atualizar o tema',
    deleteTema: 'Não foi possível excluir o tema',
    nomeObrigatorio: 'Nome do tema é obrigatório'
  },
  success: {
    createTema: 'Tema criado com sucesso!',
    updateTema: 'Tema atualizado com sucesso!',
    deleteTema: 'Tema excluído com sucesso!'
  },
  empty: {
    noTemas: '🎯 Nenhum tema cadastrado',
    noResults: '🔍 Nenhum tema encontrado',
    description: (query?: string, materiaName?: string) => {
      if (query) {
        return `Não encontramos temas com "${query}"`;
      }
      return `Crie o primeiro tema para organizar seus flashcards de ${materiaName}!`;
    }
  },
  deleteConfirmation: {
    title: 'Confirmar Exclusão',
    message: (name: string) => 
      `Tem certeza que deseja excluir "${name}"?\n\nTodos os flashcards deste tema também serão excluídos.`,
    buttons: {
      cancel: 'Cancelar',
      delete: 'Excluir'
    }
  }
};

export const FORM_CONFIG = {
  inputPlaceholder: 'Ex: Álgebra, Geometria...',
  inputLabel: 'Nome do Tema',
  titles: {
    create: 'Novo Tema',
    edit: 'Editar Tema'
  },
  buttons: {
    create: 'Criar',
    edit: 'Salvar',
    cancel: 'Cancelar'
  }
};

export const SECTIONS = {
  readyForReview: '🔔 Prontos para Revisar',
  otherTemas: '📚 Outros Temas'
};

export const REVIEW_STATUS = {
  neverStudied: {
    text: 'Nunca estudado',
    color: '#999',
    showStudyButton: true
  },
  readyToReview: {
    text: 'Pronto para revisar!',
    color: '#4CAF50',
    showStudyButton: true
  },
  reviewTomorrow: {
    text: 'Revisar amanhã',
    color: '#FF9800',
    showStudyButton: false
  },
  reviewInDays: (days: number) => ({
    text: `Revisar em ${days} dias`,
    color: '#666',
    showStudyButton: false
  })
};

export const TEXT_FORMATTERS = {
  temasCount: (count: number): string => count === 1 ? 'tema' : 'temas',
  reviewBadge: (count: number): string => `🔔 ${count} para revisar`,
  lastScore: (score: number): string => `📊 Última: ${score}%`
};

export const EMPTY_STATES = {
  temas: []
};