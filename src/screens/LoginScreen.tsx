import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Button from '../components/Button';
import Input from '../components/Input';
import api from '../services/api';
import { RootStackParamList, AuthResponse } from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
});

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const screenTexts = useMemo(() => ({
    subtitle: isLogin ? 'Entre na sua conta' : 'Crie sua conta',
    submitButton: isLogin ? 'Entrar' : 'Cadastrar',
    toggleButton: isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'
  }), [isLogin]);

  const validateForm = useCallback(() => {
    const newErrors: typeof errors = {};

    if (!isLogin && !name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [isLogin, name, email, password]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const data = isLogin 
        ? { email, password }
        : { name, email, password };

      const response = await api.post<AuthResponse>(endpoint, data);
      
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
 
      navigation.replace('Home');
      
    } catch (error: any) {
      console.error('Erro na autenticação:', error);
      
      let message = 'Erro interno do servidor';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  }, [validateForm, isLogin, email, password, name, navigation]);

  const toggleMode = useCallback(() => {
    setIsLogin(prev => !prev);
    setErrors({});
    setName('');
    setEmail('');
    setPassword('');
  }, []);

  const handleNameChange = useCallback((text: string) => {
    setName(text);
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  }, [errors.name]);

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  }, [errors.email]);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  }, [errors.password]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>📚 Flashcards</Text>
          <Text style={styles.subtitle}>{screenTexts.subtitle}</Text>

          {!isLogin && (
            <Input
              label="Nome"
              value={name}
              onChangeText={handleNameChange}
              placeholder="Digite seu nome"
              error={errors.name}
            />
          )}

          <Input
            label="Email"
            value={email}
            onChangeText={handleEmailChange}
            placeholder="Digite seu email"
            error={errors.email}
          />

          <Input
            label="Senha"
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="Digite sua senha"
            secureTextEntry
            error={errors.password}
          />

          <Button
            title={screenTexts.submitButton}
            onPress={handleSubmit}
            loading={loading}
          />

          <Button
            title={screenTexts.toggleButton}
            onPress={toggleMode}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;