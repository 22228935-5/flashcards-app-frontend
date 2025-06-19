import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MateriasScreen from './src/screens/MateriasScreen';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const TemasPlaceholder = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 18, color: '#666' }}>🎯 Tela de Temas</Text>
    <Text style={{ fontSize: 14, color: '#999', marginTop: 8 }}>Em desenvolvimento...</Text>
  </View>
);

const FlashcardsPlaceholder = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 18, color: '#666' }}>📝 Tela de Flashcards</Text>
    <Text style={{ fontSize: 14, color: '#999', marginTop: 8 }}>Em desenvolvimento...</Text>
  </View>
);

const EstudoPlaceholder = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 18, color: '#666' }}>🧠 Tela de Estudo</Text>
    <Text style={{ fontSize: 14, color: '#999', marginTop: 8 }}>Em desenvolvimento...</Text>
  </View>
);

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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
          <Text style={{ fontSize: 18, color: '#666' }}>📚 Flashcards</Text>
          <Text style={{ fontSize: 14, color: '#999', marginTop: 8 }}>Carregando...</Text>
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
            component={TemasPlaceholder}
            options={({ route }) => ({
              title: `🎯 ${route.params?.materiaName || 'Temas'}`,
            })}
          />
          <Stack.Screen
            name="Flashcards"
            component={FlashcardsPlaceholder}
            options={({ route }) => ({
              title: `📝 ${route.params?.temaName || 'Flashcards'}`,
            })}
          />
          <Stack.Screen
            name="Estudo"
            component={EstudoPlaceholder}
            options={({ route }) => ({
              title: `🧠 ${route.params?.temaName || 'Estudo'}`,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;