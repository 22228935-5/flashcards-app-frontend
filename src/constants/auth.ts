export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
};

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /\S+@\S+\.\S+/,
};

export const ERROR_MESSAGES = {
  EMAIL_REQUIRED: 'Email é obrigatório',
  EMAIL_INVALID: 'Email inválido',
  PASSWORD_REQUIRED: 'Senha é obrigatória',
  PASSWORD_MIN_LENGTH: 'Senha deve ter pelo menos 6 caracteres',
  NAME_REQUIRED: 'Nome é obrigatório',
  SERVER_ERROR: 'Erro interno do servidor',
  AUTH_ERROR: 'Erro na autenticação',
};

export const AUTH_TEXTS = {
  LOGIN: {
    SUBTITLE: 'Entre na sua conta',
    SUBMIT_BUTTON: 'Entrar',
    TOGGLE_BUTTON: 'Não tem conta? Cadastre-se',
  },
  REGISTER: {
    SUBTITLE: 'Crie sua conta',
    SUBMIT_BUTTON: 'Cadastrar',
    TOGGLE_BUTTON: 'Já tem conta? Entre',
  },
};