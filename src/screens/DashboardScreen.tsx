import React, { useState, useCallback } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';

import api from '../services/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E3F2FD',
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  urgentCard: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF9800',
    borderWidth: 1,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  urgentText: {
    color: '#FF9800',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  bestMateriaCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  bestMateriaName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
    textAlign: 'center',
  },
  bestMateriaScore: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  bestMateriaInfo: {
    fontSize: 14,
    color: '#999',
  },
  chartCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartDescription: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  simpleChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    marginVertical: 10,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  bar: {
    width: 30,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    minHeight: 5,
  },
  barValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  lineChartContainer: {
    marginVertical: 10,
  },
  lineChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 10,
  },
  linePoint: {
    alignItems: 'center',
    flex: 1,
  },
  lineBar: {
    width: 20,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    minHeight: 5,
  },
  lineValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  lineLabel: {
    fontSize: 9,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  materiaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  materiaInfo: {
    flex: 1,
  },
  materiaName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  materiaDetails: {
    fontSize: 14,
    color: '#666',
  },
  materiaScore: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  emptyState: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

interface DailyProgress {
  date: string;
  temasEstudados: number;
  scoreMedio: number;
}

interface MateriaStats {
  _id: string;
  name: string;
  temasEstudados: number;
  scoreMedio: number;
  ultimoEstudo: number;
}

interface DashboardSummary {
  totalTemasEstudados: number;
  scoreGeral: number;
  melhorMateria: MateriaStats | null;
  sequenciaEstudo: number;
  temasParaRever: number;
}

interface DashboardData {
  dailyProgress: DailyProgress[];
  materiaStats: MateriaStats[];
  summary: DashboardSummary;
}

const SimpleBarChart: React.FC<{ data: MateriaStats[] }> = ({ data }) => {
  const maxScore = Math.max(...data.map(item => item.scoreMedio), 1);
  
  return (
    <View style={styles.simpleChart}>
      {data.slice(0, 4).map((item) => (
        <View key={item._id} style={styles.barContainer}>
          <View 
            style={[
              styles.bar, 
              { 
                height: (item.scoreMedio / maxScore) * 100,
                backgroundColor: `hsl(${120 * (item.scoreMedio / 100)}, 70%, 50%)`
              }
            ]} 
          />
          <Text style={styles.barValue}>{item.scoreMedio}%</Text>
          <Text style={styles.barLabel} numberOfLines={1}>
            {item.name.length > 8 ? item.name.substring(0, 8) + '...' : item.name}
          </Text>
        </View>
      ))}
    </View>
  );
};

const SimpleLineChart: React.FC<{ data: DailyProgress[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.temasEstudados), 1);
  
  return (
    <View style={styles.lineChartContainer}>
      <View style={styles.lineChart}>
        {data.map((item, index) => (
          <View key={index} style={styles.linePoint}>
            <View 
              style={[
                styles.lineBar, 
                { height: (item.temasEstudados / maxValue) * 80 }
              ]} 
            />
            <Text style={styles.lineValue}>{item.temasEstudados}</Text>
            <Text style={styles.lineLabel}>
              {new Date(item.date).toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit' 
              })}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const DashboardScreen: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    dailyProgress: [],
    materiaStats: [],
    summary: {
      totalTemasEstudados: 0,
      scoreGeral: 0,
      melhorMateria: null,
      sequenciaEstudo: 0,
      temasParaRever: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/stats/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, [loadDashboardData]);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData])
  );

  const formatSequencia = (dias: number) => {
    if (dias === 0) return 'Nenhum dia';
    if (dias === 1) return '1 dia';
    return `${dias} dias`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{dashboardData.summary.totalTemasEstudados}</Text>
          <Text style={styles.summaryLabel}>Temas Estudados</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{dashboardData.summary.scoreGeral}%</Text>
          <Text style={styles.summaryLabel}>Score Geral</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{formatSequencia(dashboardData.summary.sequenciaEstudo)}</Text>
          <Text style={styles.summaryLabel}>Sequência</Text>
        </View>
        
        <View style={[styles.summaryCard, styles.urgentCard]}>
          <Text style={[styles.summaryNumber, styles.urgentText]}>
            {dashboardData.summary.temasParaRever}
          </Text>
          <Text style={[styles.summaryLabel, styles.urgentText]}>Para Revisar</Text>
        </View>
      </View>

      {dashboardData.summary.melhorMateria && (
        <View style={styles.bestMateriaCard}>
          <Text style={styles.cardTitle}>🏆 Melhor Performance</Text>
          <Text style={styles.bestMateriaName}>
            {dashboardData.summary.melhorMateria.name}
          </Text>
          <Text style={styles.bestMateriaScore}>
            {dashboardData.summary.melhorMateria.scoreMedio}% de acerto
          </Text>
          <Text style={styles.bestMateriaInfo}>
            {dashboardData.summary.melhorMateria.temasEstudados} temas estudados
          </Text>
        </View>
      )}

      {dashboardData.dailyProgress.length > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>📈 Progresso dos Últimos 7 Dias</Text>
          <SimpleLineChart data={dashboardData.dailyProgress} />
          <Text style={styles.chartDescription}>
            Quantidade de temas estudados por dia
          </Text>
        </View>
      )}

      {dashboardData.materiaStats.length > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>📚 Performance por Matéria (Score %)</Text>
          <SimpleBarChart data={dashboardData.materiaStats} />
          <Text style={styles.chartDescription}>
            Score médio de acerto por matéria
          </Text>
        </View>
      )}

      {dashboardData.materiaStats.length > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>📋 Todas as Matérias</Text>
          {dashboardData.materiaStats.map((materia) => (
            <View key={materia._id} style={styles.materiaItem}>
              <View style={styles.materiaInfo}>
                <Text style={styles.materiaName}>{materia.name}</Text>
                <Text style={styles.materiaDetails}>
                  {materia.temasEstudados} temas • {materia.scoreMedio}% de acerto
                </Text>
              </View>
              <View style={styles.materiaScore}>
                <Text style={styles.scoreText}>{materia.scoreMedio}%</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {dashboardData.summary.totalTemasEstudados === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>📚 Comece a Estudar!</Text>
          <Text style={styles.emptyText}>
            Quando você começar a estudar os temas, suas estatísticas aparecerão aqui.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default DashboardScreen;