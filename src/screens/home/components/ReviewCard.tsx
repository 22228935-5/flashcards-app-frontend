import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Button from '../../../components/Button';
import { Materia } from '../../../types';

interface ReviewCounts {
  totalTemas: number;
  materiasCounts: Array<{
    materia: Materia;
    count: number;
  }>;
}

interface ReviewCardProps {
  reviewCounts: ReviewCounts;
  onQuickReview: () => void;
  onChooseReview: () => void;
}

const URGENT_THRESHOLD = 5;
const MAX_VISIBLE_MATERIAS = 3;

const isUrgentReview = (totalTemas: number): boolean => 
  totalTemas >= URGENT_THRESHOLD;

const getReviewTitle = (isUrgent: boolean): string => 
  isUrgent ? '🔥 Revisões Urgentes!' : '🔔 Temas para Revisar';

const getReviewDescription = (isUrgent: boolean): string => 
  isUrgent 
    ? 'Você tem muitos temas acumulados para revisar!' 
    : 'Ótimo momento para reforçar seu aprendizado!';

const formatTemasText = (count: number): string => 
  count === 1 ? 'tema' : 'temas';

const shouldShowChooseButton = (materiasCounts: ReviewCounts['materiasCounts']): boolean => 
  materiasCounts.length > 1;

const getVisibleMaterias = (materiasCounts: ReviewCounts['materiasCounts']) => 
  materiasCounts.slice(0, MAX_VISIBLE_MATERIAS);

const getHiddenMateriasCount = (materiasCounts: ReviewCounts['materiasCounts']): number => 
  Math.max(0, materiasCounts.length - MAX_VISIBLE_MATERIAS);

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
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
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
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
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

const ReviewCard: React.FC<ReviewCardProps> = ({ 
  reviewCounts, 
  onQuickReview, 
  onChooseReview 
}) => {
  const isUrgent = isUrgentReview(reviewCounts.totalTemas);
  const visibleMaterias = getVisibleMaterias(reviewCounts.materiasCounts);
  const hiddenCount = getHiddenMateriasCount(reviewCounts.materiasCounts);

  return (
    <View style={[styles.card, isUrgent ? styles.urgentReviewCard : styles.reviewCard]}>
      <View style={styles.reviewHeader}>
        <Text style={styles.cardTitle}>{getReviewTitle(isUrgent)}</Text>
        <View style={[styles.reviewBadge, isUrgent && styles.urgentReviewBadge]}>
          <Text style={styles.reviewBadgeText}>
            {reviewCounts.totalTemas} {formatTemasText(reviewCounts.totalTemas)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.cardDescription}>{getReviewDescription(isUrgent)}</Text>
      
      {reviewCounts.materiasCounts.length > 0 && (
        <View style={styles.reviewList}>
          {visibleMaterias.map((item) => (
            <View key={item.materia._id} style={styles.reviewMateriaItem}>
              <Text style={styles.reviewMateriaName}>📚 {item.materia.name}</Text>
              <Text style={styles.reviewMateriaCount}>
                {item.count} {formatTemasText(item.count)}
              </Text>
            </View>
          ))}
          {hiddenCount > 0 && (
            <Text style={styles.cardDescription}>
              +{hiddenCount} outras matérias...
            </Text>
          )}
        </View>
      )}
      
      <View style={styles.reviewButtons}>
        <Button
          title="🚀 Revisar Agora"
          onPress={onQuickReview}
          variant="primary"
        />
        {shouldShowChooseButton(reviewCounts.materiasCounts) && (
          <Button
            title="📋 Escolher"
            onPress={onChooseReview}
            variant="secondary"
          />
        )}
      </View>
    </View>
  );
};

export default ReviewCard;