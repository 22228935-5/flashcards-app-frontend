import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_TIMEOUT } from '@env';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: parseInt(API_TIMEOUT) || 10000,
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Erro ao buscar token:', error);
  }
  return config;
});

export default api;