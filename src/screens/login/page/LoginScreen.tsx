import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { validateEmail, validatePassword, validateName } from '../../../utils/validators/validators';
import { login, register, storeAuthData, getErrorMessage, debugCurrentToken } from '../../../services/authService';
import { AUTH_TEXTS } from '../../../constants/auth';
import { RootStackParamList, LoginForm, RegisterForm } from '../../../types';

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

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

interface Styles {
  container: ViewStyle;
  scrollContainer: ViewStyle;
  content: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
}

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const useAuth = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const performAuth = useCallback(async (
    isLogin: boolean, 
    formData: LoginForm | RegisterForm
  ) => {
    const response = isLogin 
      ? await login(formData as LoginForm)
      : await register(formData as RegisterForm);
    
    await storeAuthData(response.token, response.user);
    
    setTimeout(() => {
      debugCurrentToken();
    }, 100);
    
    navigation.replace('Home');
  }, [navigation]);

  return { performAuth };
};

const LoginScreen: React.FC = () => {
  const { performAuth } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const screenTexts = useMemo(() => 
    isLogin ? AUTH_TEXTS.LOGIN : AUTH_TEXTS.REGISTER, [isLogin]);

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};

    if (!isLogin) {
      const nameError = validateName(name);
      if (nameError) newErrors.name = nameError;
    }

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [isLogin, name, email, password]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData = isLogin 
        ? { email, password }
        : { name, email, password };

      await performAuth(isLogin, formData);
    } catch (error) {
      console.error('Erro na autenticação:', error);
      Alert.alert('Erro', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [validateForm, isLogin, email, password, name, performAuth]);

  const toggleMode = useCallback(() => {
    setIsLogin(prev => !prev);
    setErrors({});
    setName('');
    setEmail('');
    setPassword('');
  }, []);

  const clearFieldError = useCallback((field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleNameChange = useCallback((text: string) => {
    setName(text);
    clearFieldError('name');
  }, [clearFieldError]);

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    clearFieldError('email');
  }, [clearFieldError]);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    clearFieldError('password');
  }, [clearFieldError]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>📚 Flashcards</Text>
          <Text style={styles.subtitle}>{screenTexts.SUBTITLE}</Text>

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
            title={screenTexts.SUBMIT_BUTTON}
            onPress={handleSubmit}
            loading={loading}
          />

          <Button
            title={screenTexts.TOGGLE_BUTTON}
            onPress={toggleMode}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;