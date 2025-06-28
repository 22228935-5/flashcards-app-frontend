import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import Button from '../../../components/Button';
import Input from '../../../components/Input';

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
});

interface MateriaFormProps {
  title: string;
  nome: string;
  onChangeNome: (nome: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitButtonTitle: string;
  saving: boolean;
}

const MateriaForm = React.memo<MateriaFormProps>(({
  title,
  nome,
  onChangeNome,
  onSubmit,
  onCancel,
  submitButtonTitle,
  saving
}) => (
  <View style={styles.formContainer}>
    <Text style={styles.formTitle}>{title}</Text>
    
    <Input
      label="Nome da Matéria"
      value={nome}
      onChangeText={onChangeNome}
      placeholder="Ex: Matemática, História..."
    />
    
    <View style={styles.formButtons}>
      <Button
        title={submitButtonTitle}
        onPress={onSubmit}
        loading={saving}
      />
      <Button
        title="Cancelar"
        onPress={onCancel}
        variant="secondary"
      />
    </View>
  </View>
));

export default MateriaForm;