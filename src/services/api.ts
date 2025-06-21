import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_TIMEOUT } from '@env';
import { ApiError, ValidationError } from '../types';

interface ApiConfig {
  readonly baseURL: string;
  readonly timeout: number;
  readonly headers: Record<string, string>;
}

interface TokenStorage {
  getToken(): Promise<string | null>;
  setToken(token: string): Promise<void>;
  removeToken(): Promise<void>;
}

interface Logger {
  logSuccess(url: string, status: number): void;
  logError(url: string, message: string): void;
}

class AsyncTokenStorage implements TokenStorage {
  private readonly TOKEN_KEY = 'token';

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Token retrieval failed:', error);
      return null;
    }
  }

  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Token storage failed:', error);
    }
  }

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Token removal failed:', error);
    }
  }
}

// Logger Implementation - Single Responsibility
class ConsoleLogger implements Logger {
  logSuccess(url: string, status: number): void {
    console.log(`✅ API Response: ${url} ${status}`);
  }

  logError(url: string, message: string): void {
    console.error(`❌ API Error: ${url} ${message}`);
  }
}

// Request Interceptor - Single Responsibility
class AuthInterceptor {
  constructor(private readonly tokenStorage: TokenStorage) {}

  async handle(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    const token = await this.tokenStorage.getToken();
    console.log('🔍 Interceptor - Token encontrado:', token?.substring(0, 20) + '...' || 'null');
    
    if (this.shouldAddToken(token, config)) {
      this.addAuthHeader(config, token!);
      console.log('✅ Header Authorization adicionado');
    } else {
      console.log('⚠️ Token não adicionado - motivo:', 
        !token ? 'token null' : 'já tem auth header');
    }
    
    return config;
  }

  private shouldAddToken(token: string | null, config: InternalAxiosRequestConfig): boolean {
    return token !== null && !this.hasAuthHeader(config);
  }

  private hasAuthHeader(config: InternalAxiosRequestConfig): boolean {
    return Boolean(config.headers?.Authorization);
  }

  private addAuthHeader(config: InternalAxiosRequestConfig, token: string): void {
    const authHeader = `Bearer ${token}`;
    config.headers.Authorization = authHeader;
    console.log('🔑 Header definido como:', authHeader.substring(0, 30) + '...');
  }
}

interface AxiosErrorResponse {
  status?: number;
  data?: {
    message?: string;
    validationErrors?: ValidationError[];
  };
}

interface AxiosErrorConfig {
  url?: string;
}

interface AxiosError {
  message?: string;
  response?: AxiosErrorResponse;
  config?: AxiosErrorConfig;
}

class ResponseInterceptor {
  constructor(private readonly logger: Logger) {}

  handleSuccess(response: AxiosResponse): AxiosResponse {
    this.logSuccessResponse(response);
    return response;
  }

  handleError(error: AxiosError): Promise<never> {
    this.logErrorResponse(error);
    return Promise.reject(this.transformError(error));
  }

  private logSuccessResponse(response: AxiosResponse): void {
    const url = response.config.url || 'unknown';
    this.logger.logSuccess(url, response.status);
  }

  private logErrorResponse(error: AxiosError): void {
    const url = error.config?.url || 'unknown';
    const message = error.message || 'Unknown error';
    this.logger.logError(url, message);
  }

  private transformError(error: AxiosError): ApiError {
    return {
      status: error.response?.status || 0,
      message: error.response?.data?.message || error.message || 'Unknown error',
      validationErrors: error.response?.data?.validationErrors
    };
  }
}

// Configuration Factory - Single Responsibility
class ApiConfigFactory {
  static create(): ApiConfig {
    return {
      baseURL: this.getBaseUrl(),
      timeout: this.getTimeout(),
      headers: this.getDefaultHeaders()
    };
  }

  private static getBaseUrl(): string {
    if (!API_BASE_URL) {
      throw new Error('API_BASE_URL environment variable is required');
    }
    return API_BASE_URL;
  }

  private static getTimeout(): number {
    const timeout = parseInt(API_TIMEOUT) || 10000;
    return this.validateTimeout(timeout);
  }

  private static validateTimeout(timeout: number): number {
    const MIN_TIMEOUT = 1000;
    const MAX_TIMEOUT = 60000;
    
    if (timeout < MIN_TIMEOUT || timeout > MAX_TIMEOUT) {
      console.warn(`Invalid timeout: ${timeout}. Using default 10000ms`);
      return 10000;
    }
    
    return timeout;
  }

  private static getDefaultHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
    };
  }
}

class ApiClient {
  private readonly instance: AxiosInstance;
  private readonly tokenStorage: TokenStorage;

  constructor(
    config: ApiConfig,
    tokenStorage: TokenStorage,
    logger: Logger
  ) {
    this.tokenStorage = tokenStorage;
    this.instance = this.createInstance(config);
    this.setupInterceptors(tokenStorage, logger);
  }

  private createInstance(config: ApiConfig): AxiosInstance {
    return axios.create(config);
  }

  private setupInterceptors(tokenStorage: TokenStorage, logger: Logger): void {
    this.setupRequestInterceptor(tokenStorage);
    this.setupResponseInterceptor(logger);
  }

  private setupRequestInterceptor(tokenStorage: TokenStorage): void {
    const authInterceptor = new AuthInterceptor(tokenStorage);
    
    this.instance.interceptors.request.use(
      (config) => authInterceptor.handle(config),
      (error: AxiosError) => Promise.reject(error)
    );
  }

  private setupResponseInterceptor(logger: Logger): void {
    const responseInterceptor = new ResponseInterceptor(logger);
    
    this.instance.interceptors.response.use(
      (response) => responseInterceptor.handleSuccess(response),
      (error: AxiosError) => responseInterceptor.handleError(error)
    );
  }

  get axiosInstance(): AxiosInstance {
    return this.instance;
  }

  async clearAuthToken(): Promise<void> {
    await this.tokenStorage.removeToken();
  }

  async setAuthToken(token: string): Promise<void> {
    await this.tokenStorage.setToken(token);
  }
}

function createApiClient(): ApiClient {
  const config = ApiConfigFactory.create();
  const tokenStorage = new AsyncTokenStorage();
  const logger = new ConsoleLogger();
  
  return new ApiClient(config, tokenStorage, logger);
}

const apiClient = createApiClient();

export default apiClient.axiosInstance;

export { apiClient };

export type { ApiConfig, TokenStorage, Logger };