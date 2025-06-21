import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Materia } from '../../../types';

const styles = StyleSheet.create({
  materiaCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  materiaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  materiaName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  materiaDate: {
    fontSize: 12,
    color: '#666',
  },
  materiaActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
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

interface MateriaCardProps {
  materia: Materia;
  onPress: (materia: Materia) => void;
  onEdit: (materia: Materia) => void;
  onDelete: (materia: Materia) => void;
}

const MateriaCard = React.memo<MateriaCardProps>(({ materia, onPress, onEdit, onDelete }) => {
  const handlePress = useCallback(() => onPress(materia), [onPress, materia]);
  const handleEdit = useCallback(() => onEdit(materia), [onEdit, materia]);
  const handleDelete = useCallback(() => onDelete(materia), [onDelete, materia]);

  const formattedDate = useMemo(() => {
    return new Date(materia.createdAt).toLocaleDateString('pt-BR');
  }, [materia.createdAt]);

  return (
    <TouchableOpacity style={styles.materiaCard} onPress={handlePress}>
      <View style={styles.materiaHeader}>
        <Text style={styles.materiaName}>{materia.name}</Text>
        <Text style={styles.materiaDate}>{formattedDate}</Text>
      </View>
      
      <View style={styles.materiaActions}>
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

export default MateriaCard;