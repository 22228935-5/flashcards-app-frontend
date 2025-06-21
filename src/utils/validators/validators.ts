export const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) return 'Email é obrigatório';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Email inválido';
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password.trim()) return 'Senha é obrigatória';
  if (password.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
  return undefined;
};

export const validateName = (name: string): string | undefined => {
  if (!name.trim()) return 'Nome é obrigatório';
  return undefined;
};

export const validateRequired = (value: string, fieldName: string): string | undefined => {
  if (!value.trim()) return `${fieldName} é obrigatório`;
  return undefined;
};

export const validateMinLength = (
  value: string, 
  minLength: number, 
  fieldName: string
): string | undefined => {
  if (value.length < minLength) {
    return `${fieldName} deve ter pelo menos ${minLength} caracteres`;
  }
  return undefined;
};