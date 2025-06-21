import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { AuthResponse, LoginForm, RegisterForm, User } from '../types';

export const storeAuthData = async (token: string, user: User): Promise<void> => {
  try {
    console.log('🔐 Tentando salvar token:', token.substring(0, 20) + '...');
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    const savedToken = await AsyncStorage.getItem('token');
    console.log('✅ Token salvo e verificado:', savedToken?.substring(0, 20) + '...');
  } catch (error) {
    console.error('❌ Erro ao armazenar dados de auth:', error);
    throw error;
  }
};

export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    console.log('🗑️ Dados de auth removidos');
  } catch (error) {
    console.error('❌ Erro ao limpar dados de auth:', error);
  }
};

export const getStoredUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  } catch {
    return null;
  }
};

export const getStoredToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('🔍 Token recuperado:', token?.substring(0, 20) + '...' || 'null');
    return token;
  } catch {
    return null;
  }
};

export const login = async (credentials: LoginForm): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  console.log('📥 Login response:', response.data.token.substring(0, 20) + '...');
  return response.data;
};

export const register = async (userData: RegisterForm): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', userData);
  console.log('📥 Register response:', response.data.token.substring(0, 20) + '...');
  return response.data;
};

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null) {
    const apiError = error as any;
    return apiError.response?.data?.message || apiError.message || 'Erro interno do servidor';
  }
  return 'Erro interno do servidor';
};

// Função para testar o token atual
export const debugCurrentToken = async (): Promise<void> => {
  try {
    const token = await getStoredToken();
    console.log('🐛 DEBUG - Token completo:', token || 'Nenhum token encontrado');
    
    if (token) {
      // Verificar formato do token
      console.log('📋 Token info:');
      console.log('  - Tamanho:', token.length);
      console.log('  - Começa com:', token.substring(0, 10));
      console.log('  - Termina com:', token.substring(token.length - 10));
      console.log('  - Tem pontos:', token.split('.').length, 'partes');
      
      // Testar uma requisição simples
      try {
        const response = await api.get('/materias');
        console.log('✅ Token funciona - materias encontradas:', response.data.length);
      } catch (error: any) {
        console.log('❌ Token não funciona - Status:', error.status);
        console.log('❌ Mensagem:', error.message);
        
        // Tentar requisição manual
        console.log('🧪 Testando requisição manual...');
        try {
          const manualResponse = await fetch('http://sua-api-url/materias', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('🧪 Fetch manual status:', manualResponse.status);
        } catch (fetchError) {
          console.log('❌ Fetch manual falhou:', fetchError);
        }
      }
    }
  } catch (error) {
    console.error('❌ Erro no debug:', error);
  }
};