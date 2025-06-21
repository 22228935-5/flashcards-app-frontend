import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { FORM_CONFIG } from '../../../constants/flashcards';

interface FlashcardFormProps {
  title: string;
  question: string;
  answer: string;
  onChangeQuestion: (question: string) => void;
  onChangeAnswer: (answer: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitButtonTitle: string;
  saving: boolean;
}

const FlashcardForm = React.memo<FlashcardFormProps>(({
  title,
  question,
  answer,
  onChangeQuestion,
  onChangeAnswer,
  onSubmit,
  onCancel,
  submitButtonTitle,
  saving
}) => (
  <View style={styles.formContainer}>
    <Text style={styles.formTitle}>{title}</Text>
    
    <Input
      label={FORM_CONFIG.questionLabel}
      value={question}
      onChangeText={onChangeQuestion}
      placeholder={FORM_CONFIG.questionPlaceholder}
      multiline
      numberOfLines={3}
    />
    
    <Input
      label={FORM_CONFIG.answerLabel}
      value={answer}
      onChangeText={onChangeAnswer}
      placeholder={FORM_CONFIG.answerPlaceholder}
      multiline
      numberOfLines={4}
    />
    
    <View style={styles.formButtons}>
      <Button
        title={submitButtonTitle}
        onPress={onSubmit}
        loading={saving}
      />
      <Button
        title={FORM_CONFIG.buttons.cancel}
        onPress={onCancel}
        variant="secondary"
      />
    </View>
  </View>
));

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

export default FlashcardForm;