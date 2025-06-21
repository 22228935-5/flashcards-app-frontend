import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { GeneralStats } from '../../../types';

interface StatsCardProps {
  stats: GeneralStats | null;
  loading: boolean;
}

const hasStudyData = (stats: GeneralStats): boolean => 
  stats.studies.total > 0;

const formatStudyDetail = (stats: GeneralStats): string => 
  `✅ ${stats.studies.correct} • ❌ ${stats.studies.incorrect} • ⏭️ ${stats.studies.skipped}`;

const styles = StyleSheet.create({
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
});

const StatsCard: React.FC<StatsCardProps> = ({ stats, loading }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>📊 Estatísticas Gerais</Text>
      {loading ? (
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
          {hasStudyData(stats) && (
            <View style={styles.studyStats}>
              <Text style={styles.studyStatsText}>
                🧠 {stats.studies.total} Questões respondidas
              </Text>
              <Text style={styles.studyStatsDetail}>
                {formatStudyDetail(stats)}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <Text style={styles.noStatsText}>
          Faça seu primeiro estudo para ver estatísticas!
        </Text>
      )}
    </View>
  );
};

export default StatsCard;