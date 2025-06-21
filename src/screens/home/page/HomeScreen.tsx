import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ViewStyle, TextStyle, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import Button from '../../../components/Button';
import { useHomeData } from '../../../utils/hooks/useHomeData';
import ReviewCard from '../components/ReviewCard';
import StatsCard from '../components/StatsCard';
import { 
  NAVIGATION_CARDS_CONFIG, 
  MESSAGES, 
  REFRESH_CONFIG 
} from '../../../constants/home';

const styles = StyleSheet.create<Styles>({
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

interface NavigationCard {
  id: string;
  title: string;
  description: string;
  buttonTitle: string;
  onPress: () => void;
  variant: 'primary' | 'secondary';
}

interface HomeCardProps {
  title: string;
  description: string;
  buttonTitle: string;
  onPress: () => void;
  variant: 'primary' | 'secondary';
}

interface Styles {
  container: ViewStyle;
  content: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  card: ViewStyle;
  cardTitle: TextStyle;
  cardDescription: TextStyle;
}

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const useHomeNavigation = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const navigateToMaterias = useCallback(() => {
    navigation.navigate('Materias');
  }, [navigation]);

  const navigateToDashboard = useCallback(() => {
    navigation.navigate('Dashboard');
  }, [navigation]);

  const navigateToTemas = useCallback((materiaId: string, materiaName: string) => {
    navigation.navigate('Temas', { materiaId, materiaName });
  }, [navigation]);

  const resetToLogin = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }, [navigation]);

  return { 
    navigateToMaterias, 
    navigateToDashboard, 
    navigateToTemas, 
    resetToLogin 
  };
};

const useNavigationCards = (
  navigateToMaterias: () => void,
  navigateToDashboard: () => void
): NavigationCard[] => {
  return useMemo(() => NAVIGATION_CARDS_CONFIG.map(config => ({
    ...config,
    onPress: config.id === 'materias' ? navigateToMaterias : navigateToDashboard
  })), [navigateToMaterias, navigateToDashboard]);
};

const HomeCard = React.memo<HomeCardProps>(({ 
  title, 
  description, 
  buttonTitle, 
  onPress, 
  variant,
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

HomeCard.displayName = 'HomeCard';

const HomeScreen: React.FC = () => {
  const {
    user,
    stats,
    reviewCounts,
    loadingStats,
    loadingReviews,
    loadUser,
    loadStats,
    loadReviewCounts,
    refreshAll,
    handleQuickReview,
    handleChooseReview,
    handleLogout,
  } = useHomeData();

  const { navigateToMaterias, navigateToDashboard, navigateToTemas, resetToLogin } = useHomeNavigation();

  // Refs para controlar carregamento
  const isLoadingDataRef = useRef(false);
  const hasLoadedInitialDataRef = useRef(false);
  const lastFocusTimeRef = useRef(0);

  const welcomeText = useMemo(() => MESSAGES.welcome(user?.name), [user?.name]);
  const navigationCards = useNavigationCards(navigateToMaterias, navigateToDashboard);
  const hasReviewItems = useMemo(() => reviewCounts.totalTemas > 0, [reviewCounts.totalTemas]);
  const isLoading = useMemo(() => loadingStats || loadingReviews, [loadingStats, loadingReviews]);

  const onQuickReview = useCallback(() => {
    handleQuickReview(navigateToTemas);
  }, [handleQuickReview, navigateToTemas]);

  const onChooseReview = useCallback(() => {
    handleChooseReview(navigateToTemas);
  }, [handleChooseReview, navigateToTemas]);

  const onLogout = useCallback(() => {
    handleLogout(resetToLogin);
  }, [handleLogout, resetToLogin]);

  const onRefresh = useCallback(async () => {
    if (!isLoadingDataRef.current) {
      await refreshAll();
    }
  }, [refreshAll]);

  // Função centralizada para carregar dados
  const loadHomeData = useCallback(async () => {
    // Previne múltiplas chamadas simultâneas
    if (isLoadingDataRef.current) {
      console.log('[HomeScreen] Já está carregando dados, ignorando...');
      return;
    }

    isLoadingDataRef.current = true;
    console.log('[HomeScreen] Iniciando carregamento de dados...');

    try {
      // Carrega em sequência para evitar race conditions
      await loadStats();
      await loadReviewCounts();
    } catch (error) {
      console.error('[HomeScreen] Erro ao carregar dados:', error);
    } finally {
      isLoadingDataRef.current = false;
    }
  }, [loadStats, loadReviewCounts]);

  // Carrega o usuário ao montar o componente
  useEffect(() => {
    console.log('[HomeScreen] Componente montado, carregando usuário...');
    loadUser();
  }, []); // Vazio de propósito - só executa uma vez

  // Carrega dados quando o usuário estiver disponível
  useEffect(() => {
    if (user && !hasLoadedInitialDataRef.current) {
      console.log('[HomeScreen] Usuário carregado, iniciando carregamento inicial de dados');
      hasLoadedInitialDataRef.current = true;
      loadHomeData();
    }
  }, [user]); // Só depende do user, não das funções

  // Recarrega dados quando a tela recebe foco (com debounce)
  useFocusEffect(
    useCallback(() => {
      // Pula se ainda não carregou os dados iniciais
      if (!hasLoadedInitialDataRef.current) {
        return;
      }

      const now = Date.now();
      
      // Atualiza o timestamp do último focus
      if (lastFocusTimeRef.current === 0) {
        lastFocusTimeRef.current = now;
        return;
      }

      const timeSinceLastFocus = now - lastFocusTimeRef.current;
      
      // Só recarrega se passou mais de 30 segundos
      if (timeSinceLastFocus > 30000) {
        console.log(`[HomeScreen] Recarregando dados (${Math.round(timeSinceLastFocus / 1000)}s desde último focus)`);
        lastFocusTimeRef.current = now;
        loadHomeData();
      }
    }, []) // Vazio de propósito - loadHomeData é estável devido ao useCallback
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          colors={REFRESH_CONFIG.colors}
          tintColor={REFRESH_CONFIG.tintColor}
        />
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>{welcomeText}</Text>
        <Text style={styles.subtitle}>{MESSAGES.subtitle}</Text>
        
        {hasReviewItems && (
          <ReviewCard
            reviewCounts={reviewCounts}
            onQuickReview={onQuickReview}
            onChooseReview={onChooseReview}
          />
        )}

        <StatsCard stats={stats} loading={loadingStats} />

        {navigationCards.map((card) => (
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
          title={MESSAGES.buttons.logout}
          onPress={onLogout}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;