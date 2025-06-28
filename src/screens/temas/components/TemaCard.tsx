import React, { useCallback, useMemo } from 'react';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { REVIEW_STATUS, TEXT_FORMATTERS } from '../../../constants/temas';
import { Tema } from '../../../types';

const styles = StyleSheet.create({
  temaCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  readyForReviewCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    backgroundColor: '#f8fff8',
  },
  reviewBadgeCard: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reviewBadgeCardText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  temaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  temaName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    paddingRight: 60,
  },
  temaDate: {
    fontSize: 12,
    color: '#666',
  },
  reviewInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  lastScore: {
    fontSize: 12,
    color: '#666',
  },
  temaActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  studyButton: {
    backgroundColor: '#4CAF50',
  },
  studyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ffe6e6',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#333',
  },
  deleteButtonText: {
    color: '#d32f2f',
  },
});

interface TemaCardProps {
  tema: Tema;
  onPress: (tema: Tema) => void;
  onEdit: (tema: Tema) => void;
  onDelete: (tema: Tema) => void;
  onStudy: (tema: Tema) => void;
  isReadyForReview: boolean;
}

const TemaCard = React.memo<TemaCardProps>(({ 
  tema, 
  onPress, 
  onEdit, 
  onDelete, 
  onStudy,
  isReadyForReview 
}) => {
  const handlePress = useCallback(() => onPress(tema), [onPress, tema]);
  const handleEdit = useCallback(() => onEdit(tema), [onEdit, tema]);
  const handleDelete = useCallback(() => onDelete(tema), [onDelete, tema]);
  const handleStudy = useCallback(() => onStudy(tema), [onStudy, tema]);

  const formattedDate = useMemo(() => {
    return new Date(tema.createdAt).toLocaleDateString('pt-BR');
  }, [tema.createdAt]);

  const reviewInfo = useMemo(() => {
    if (!tema.nextReview) {
      return REVIEW_STATUS.neverStudied;
    }

    const nextReview = new Date(tema.nextReview);
    const now = new Date();
    const diffTime = nextReview.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return REVIEW_STATUS.readyToReview;
    } else if (diffDays === 1) {
      return REVIEW_STATUS.reviewTomorrow;
    } else {
      return REVIEW_STATUS.reviewInDays(diffDays);
    }
  }, [tema.nextReview]);

  return (
    <TouchableOpacity 
      style={[
        styles.temaCard,
        isReadyForReview && styles.readyForReviewCard
      ]} 
      onPress={handlePress}
    >
      {isReadyForReview && (
        <View style={styles.reviewBadgeCard}>
          <Text style={styles.reviewBadgeCardText}>🔔 REVISAR</Text>
        </View>
      )}

      <View style={styles.temaHeader}>
        <Text style={styles.temaName}>{tema.name}</Text>
        <Text style={styles.temaDate}>{formattedDate}</Text>
      </View>

      <View style={styles.reviewInfo}>
        <Text style={[styles.reviewStatus, { color: reviewInfo.color }]}>
          {reviewInfo.text}
        </Text>
        {tema.lastReviewScore !== undefined && (
          <Text style={styles.lastScore}>
            {TEXT_FORMATTERS.lastScore(tema.lastReviewScore)}
          </Text>
        )}
      </View>

      <View style={styles.temaActions}>
        {reviewInfo.showStudyButton && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.studyButton]} 
            onPress={handleStudy}
          >
            <Text style={[styles.actionButtonText, styles.studyButtonText]}>
              🧠 Estudar
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
          <Text style={styles.actionButtonText}>✏️ Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>🗑️ Excluir</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

export default TemaCard;