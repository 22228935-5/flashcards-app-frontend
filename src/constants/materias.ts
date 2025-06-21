export const SEARCH_CONFIG = {
  debounceDelay: 300,
  minCharacters: 2,
  placeholder: 'Buscar matérias...'
};

export const MESSAGES = {
  errors: {
    loadMaterias: 'Não foi possível carregar as matérias',
    searchMaterias: 'Não foi possível buscar as matérias',
    createMateria: 'Não foi possível criar a matéria',
    updateMateria: 'Não foi possível atualizar a matéria',
    deleteMateria: 'Não foi possível excluir a matéria',
    nomeObrigatorio: 'Nome da matéria é obrigatório'
  },
  success: {
    createMateria: 'Matéria criada com sucesso!',
    updateMateria: 'Matéria atualizada com sucesso!',
    deleteMateria: 'Matéria excluída com sucesso!'
  },
  empty: {
    noMaterias: '📚 Nenhuma matéria cadastrada',
    noResults: '🔍 Nenhuma matéria encontrada',
    description: (query?: string) => query 
      ? `Não encontramos matérias com "${query}"`
      : 'Crie sua primeira matéria para começar a organizar seus estudos!'
  },
  loading: 'Carregando matérias...',
  deleteConfirmation: {
    title: 'Confirmar Exclusão',
    message: (name: string) => 
      `Tem certeza que deseja excluir "${name}"?\n\nTodos os temas e flashcards desta matéria também serão excluídos.`,
    buttons: {
      cancel: 'Cancelar',
      delete: 'Excluir'
    }
  }
};

export const FORM_CONFIG = {
  inputPlaceholder: 'Ex: Matemática, História...',
  inputLabel: 'Nome da Matéria',
  titles: {
    create: 'Nova Matéria',
    edit: 'Editar Matéria'
  },
  buttons: {
    create: 'Criar',
    edit: 'Salvar',
    cancel: 'Cancelar'
  }
};