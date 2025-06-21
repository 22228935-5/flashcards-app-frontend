export const NAVIGATION_CARDS_CONFIG = [
  {
    id: 'materias',
    title: '📚 Minhas Matérias',
    description: 'Organize seus estudos por matérias e temas',
    buttonTitle: 'Ver Matérias',
    variant: 'primary' as const,
  },
  {
    id: 'dashboard',
    title: '📊 Dashboard', 
    description: 'Acompanhe seu progresso e estatísticas detalhadas',
    buttonTitle: 'Ver Dashboard',
    variant: 'secondary' as const,
  }
];

export const MESSAGES = {
  welcome: (userName?: string) => `Olá, ${userName || 'Usuário'}! 👋`,
  subtitle: 'O que vamos estudar hoje?',
  buttons: {
    logout: 'Sair'
  },
  errors: {
    loadUser: 'Erro ao carregar dados do usuário',
    loadStats: 'Erro ao carregar estatísticas',
    loadReviews: 'Erro ao carregar contadores de revisão',
    logout: 'Erro ao fazer logout'
  },
  logout: {
    title: 'Sair',
    message: 'Tem certeza que deseja sair?',
    buttons: {
      cancel: 'Cancelar',
      confirm: 'Sair'
    }
  },
  reviewChoice: {
    title: 'Escolher Matéria',
    message: 'Qual matéria deseja revisar?',
    cancel: 'Cancelar'
  }
};

export const REFRESH_CONFIG = {
  colors: ['#007AFF'],
  tintColor: '#007AFF'
};

export const EMPTY_STATES = {
  reviewCounts: { 
    totalTemas: 0, 
    materiasCounts: [] 
  }
};

export const TEXT_FORMATTERS = {
  temasText: (count: number): string => count === 1 ? 'tema' : 'temas',
  welcomeText: (userName?: string): string => `Olá, ${userName || 'Usuário'}! 👋`
};