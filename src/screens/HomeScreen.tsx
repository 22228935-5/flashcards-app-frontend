import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Button from '../components/Button';
import { RootStackParamList, User } from '../types';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
});

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [user, setUser] = useState<User | null>(null);

  const loadUser = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('user');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
            }
          },
        },
      ]
    );
  }, [navigation]);

  const navigateToMaterias = useCallback(() => {
    navigation.navigate('Materias');
  }, [navigation]);

  const showFeatureNotReady = useCallback(() => {
    Alert.alert('Em desenvolvimento', 'Esta funcionalidade será implementada em breve!');
  }, []);

  const welcomeText = useMemo(() => {
    return `Olá, ${user?.name || 'Usuário'}! 👋`;
  }, [user?.name]);

  const cardData = useMemo(() => [
    {
      id: 'materias',
      title: '📚 Minhas Matérias',
      description: 'Organize seus estudos por matérias e temas',
      buttonTitle: 'Ver Matérias',
      onPress: navigateToMaterias,
      variant: 'primary' as const,
    },
    {
      id: 'estatisticas',
      title: '📊 Estatísticas',
      description: 'Acompanhe seu progresso nos estudos',
      buttonTitle: 'Em breve',
      onPress: showFeatureNotReady,
      variant: 'secondary' as const,
    },
  ], [navigateToMaterias, showFeatureNotReady]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{welcomeText}</Text>
        <Text style={styles.subtitle}>O que vamos estudar hoje?</Text>

        {cardData.map((card) => (
          <HomeCard
            key={card.id}
            title={card.title}
            description={card.description}
            buttonTitle={card.buttonTitle}
            onPress={card.onPress}
            variant={card.variant}
          />
        ))}

        <Button
          title="Sair"
          onPress={handleLogout}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
};

interface HomeCardProps {
  title: string;
  description: string;
  buttonTitle: string;
  onPress: () => void;
  variant: 'primary' | 'secondary';
}

const HomeCard = React.memo<HomeCardProps>(({ 
  title, 
  description, 
  buttonTitle, 
  onPress, 
  variant 
}) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
    <Button
      title={buttonTitle}
      onPress={onPress}
      variant={variant}
    />
  </View>
));

export default HomeScreen;