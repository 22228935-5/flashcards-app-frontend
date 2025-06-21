import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TEXT_FORMATTERS } from '../../../constants/temas';

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  reviewBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reviewBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
});

interface TemaHeaderProps {
  materiaName: string;
  temasCount: number;
  reviewCount: number;
}

const TemaHeader = React.memo<TemaHeaderProps>(({ 
  materiaName, 
  temasCount, 
  reviewCount 
}) => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerTitle}>📚 {materiaName}</Text>
    <View style={styles.headerInfo}>
      <Text style={styles.headerSubtitle}>
        {temasCount} {TEXT_FORMATTERS.temasCount(temasCount)}
      </Text>
      {reviewCount > 0 && (
        <View style={styles.reviewBadge}>
          <Text style={styles.reviewBadgeText}>
            {TEXT_FORMATTERS.reviewBadge(reviewCount)}
          </Text>
        </View>
      )}
    </View>
  </View>
));

export default TemaHeader;