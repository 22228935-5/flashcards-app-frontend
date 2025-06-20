import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Button from '../components/Button';
import { RootStackParamList, User, GeneralStats, Materia } from '../types';
import { statsService } from '../services/statsService';
import api from '../services/api';

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
  reviewCard: {
    backgroundColor: '#f8fff8',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  urgentReviewCard: {
    backgroundColor: '#fff8f0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
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
  loadingText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
  noStatsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  studyStats: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  studyStatsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  studyStatsDetail: {
    fontSize: 12,
    color: '#666',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgentReviewBadge: {
    backgroundColor: '#FF9800',
  },
  reviewBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  reviewList: {
    marginBottom: 12,
  },
  reviewMateriaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  reviewMateriaName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  reviewMateriaCount: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  reviewButtons: {
    flexDirection: 'row',
    gap: 8,
  },
});

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface ReviewCounts {
  totalTemas: number;
  materiasCounts: Array<{
    materia: Materia;
    count: number;
  }>;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<GeneralStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [reviewCounts, setReviewCounts] = useState<ReviewCounts>({ totalTemas: 0, materiasCounts: [] });
  const [loadingReviews, setLoadingReviews] = useState(false);

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

  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const generalStats = await statsService.getGeneralStats();
      setStats(generalStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const loadReviewCounts = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const materiasResponse = await api.get<Materia[]>('/materias');
      const materias = materiasResponse.data;

      const countsPromises = materias.map(async (materia) => {
        try {
          const response = await api.get(`/temas/due-count/${materia._id}`);
          return {
            materia,
            count: response.data.count || 0
          };
        } catch (error) {
          console.error(`Erro ao buscar contagem para ${materia.name}:`, error);
          return {
            materia,
            count: 0
          };
        }
      });

      const materiasCounts = await Promise.all(countsPromises);
      const totalTemas = materiasCounts.reduce((sum, item) => sum + item.count, 0);

      setReviewCounts({
        totalTemas,
        materiasCounts: materiasCounts.filter(item => item.count > 0)
      });
    } catch (error) {
      console.error('Erro ao carregar contadores de revisão:', error);
    } finally {
      setLoadingReviews(false);
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

  const navigateToDashboard = useCallback(() => {
    navigation.navigate('Dashboard');
  }, [navigation]);

  const handleQuickReview = useCallback(() => {
    if (reviewCounts.materiasCounts.length > 0) {
      const firstMateria = reviewCounts.materiasCounts[0].materia;
      navigation.navigate('Temas', {
        materiaId: firstMateria._id,
        materiaName: firstMateria.name
      });
    }
  }, [reviewCounts.materiasCounts, navigation]);

const handleChooseReview = useCallback(() => {
  const options = reviewCounts.materiasCounts.map(item => ({
    text: `${item.materia.name} (${item.count} temas)`,
    onPress: () => navigation.navigate('Temas', {
      materiaId: item.materia._id,
      materiaName: item.materia.name
    })
  }));

  options.push({ 
    text: 'Cancelar', 
    onPress: () => {},
  });

  Alert.alert(
    'Escolher Matéria',
    'Qual matéria deseja revisar?',
    options
  );
}, [reviewCounts.materiasCounts, navigation]);

  const welcomeText = useMemo(() => {
    return `Olá, ${user?.name || 'Usuário'}! 👋`;
  }, [user?.name]);

  const isUrgentReview = useMemo(() => {
    return reviewCounts.totalTemas >= 5;
  }, [reviewCounts.totalTemas]);

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
      id: 'dashboard',
      title: '📊 Dashboard',
      description: 'Acompanhe seu progresso e estatísticas detalhadas',
      buttonTitle: 'Ver Dashboard',
      onPress: navigateToDashboard,
      variant: 'secondary' as const,
    }
  ], [navigateToMaterias, navigateToDashboard]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadStats();
        loadReviewCounts();
      }
    }, [user, loadStats, loadReviewCounts])
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{welcomeText}</Text>
        <Text style={styles.subtitle}>O que vamos estudar hoje?</Text>
        
        {/* ✅ CARD DE REVISÕES */}
        {reviewCounts.totalTemas > 0 && (
          <View style={[styles.card, isUrgentReview ? styles.urgentReviewCard : styles.reviewCard]}>
            <View style={styles.reviewHeader}>
              <Text style={styles.cardTitle}>
                {isUrgentReview ? '🔥 Revisões Urgentes!' : '🔔 Temas para Revisar'}
              </Text>
              <View style={[styles.reviewBadge, isUrgentReview && styles.urgentReviewBadge]}>
                <Text style={styles.reviewBadgeText}>
                  {reviewCounts.totalTemas} {reviewCounts.totalTemas === 1 ? 'tema' : 'temas'}
                </Text>
              </View>
            </View>
            <Text style={styles.cardDescription}>
              {isUrgentReview 
                ? 'Você tem muitos temas acumulados para revisar!' 
                : 'Ótimo momento para reforçar seu aprendizado!'
              }
            </Text>
            {reviewCounts.materiasCounts.length > 0 && (
              <View style={styles.reviewList}>
                {reviewCounts.materiasCounts.slice(0, 3).map((item) => (
                  <View key={item.materia._id} style={styles.reviewMateriaItem}>
                    <Text style={styles.reviewMateriaName}>📚 {item.materia.name}</Text>
                    <Text style={styles.reviewMateriaCount}>
                      {item.count} {item.count === 1 ? 'tema' : 'temas'}
                    </Text>
                  </View>
                ))}
                {reviewCounts.materiasCounts.length > 3 && (
                  <Text style={styles.cardDescription}>
                    +{reviewCounts.materiasCounts.length - 3} outras matérias...
                  </Text>
                )}
              </View>
            )}
            <View style={styles.reviewButtons}>
              <Button
                title="🚀 Revisar Agora"
                onPress={handleQuickReview}
                variant="primary"
              />
              {reviewCounts.materiasCounts.length > 1 && (
                <Button
                  title="📋 Escolher"
                  onPress={handleChooseReview}
                  variant="secondary"
                />
              )}
            </View>
          </View>
        )}

        {/* ✅ ESTATÍSTICAS GERAIS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Estatísticas Gerais</Text>
          {loadingStats ? (
            <Text style={styles.loadingText}>Carregando...</Text>
          ) : stats ? (
            <View>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.content.materias}</Text>
                  <Text style={styles.statLabel}>📚 Matérias</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.content.temas}</Text>
                  <Text style={styles.statLabel}>🎯 Temas</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.content.flashcards}</Text>
                  <Text style={styles.statLabel}>📝 Flashcards</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.studies.accuracy}%</Text>
                  <Text style={styles.statLabel}>✅ Acerto</Text>
                </View>
              </View>
              {stats.studies.total > 0 && (
                <View style={styles.studyStats}>
                  <Text style={styles.studyStatsText}>
                    🧠 {stats.studies.total} Questões respondidas
                  </Text>
                  <Text style={styles.studyStatsDetail}>
                    ✅ {stats.studies.correct} • ❌ {stats.studies.incorrect} • ⏭️ {stats.studies.skipped}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.noStatsText}>Faça seu primeiro estudo para ver estatísticas!</Text>
          )}
        </View>

        {/* ✅ CARDS DE NAVEGAÇÃO - COM DASHBOARD */}
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
  variant,
}) => (
  <View style={[styles.card]}>
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