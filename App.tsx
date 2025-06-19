import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MateriasScreen from './src/screens/MateriasScreen';
import TemasScreen from './src/screens/TemasScreen';
import FlashcardsScreen from './src/screens/FlashcardsScreen';
import EstudoScreen from './src/screens/EstudoScreen';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsLoggedIn(false);
    }
  };

  if (isLoggedIn === null) {
    return (
      <SafeAreaProvider>
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: '#f5f5f5' 
        }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#007AFF', marginBottom: 8 }}>
            📚 Flashcards
          </Text>
          <Text style={{ fontSize: 16, color: '#666' }}>
            Sistema de Estudos com Repetição Espaçada
          </Text>
          <Text style={{ fontSize: 14, color: '#999', marginTop: 16 }}>
            Carregando...
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? 'Home' : 'Login'}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerShadowVisible: true,
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: '🏠 Início',
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="Materias"
            component={MateriasScreen}
            options={{
              title: '📚 Matérias',
            }}
          />
          <Stack.Screen
            name="Temas"
            component={TemasScreen}
            options={({ route }) => ({
              title: `🎯 ${route.params?.materiaName || 'Temas'}`,
            })}
          />
          <Stack.Screen
            name="Flashcards"
            component={FlashcardsScreen}
            options={({ route }) => ({
              title: `📝 ${route.params?.temaName || 'Flashcards'}`,
            })}
          />
          <Stack.Screen
            name="Estudo"
            component={EstudoScreen}
            options={({ route }) => ({
              title: `🧠 Estudando: ${route.params?.temaName || 'Flashcards'}`,
              headerStyle: {
                backgroundColor: '#4CAF50',
              },
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;