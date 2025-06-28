import React from 'react';

import { TextInput, Text, View, StyleSheet, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputMultiline: {
    minHeight: 80,
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
});

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

interface InputState {
  hasError: boolean;
  isMultiline: boolean;
  isSecure: boolean;
  numberOfLines: number;
}

const createInputState = (props: InputProps): InputState => ({
  hasError: Boolean(props.error),
  isMultiline: props.multiline ?? false,
  isSecure: props.secureTextEntry ?? false,
  numberOfLines: props.numberOfLines ?? 1
});

const hasErrorState = (state: InputState): boolean => 
  state.hasError;

const isMultilineInput = (state: InputState): boolean => 
  state.isMultiline;

const calculateInputStyles = (state: InputState): ViewStyle[] => {
  const baseStyles: ViewStyle[] = [styles.input];
  
  if (isMultilineInput(state)) {
    baseStyles.push(styles.inputMultiline);
  }
  
  if (hasErrorState(state)) {
    baseStyles.push(styles.inputError);
  }
  
  return baseStyles;
};

const getTextAlignVertical = (state: InputState): 'auto' | 'top' | 'bottom' | 'center' => 
  isMultilineInput(state) ? 'top' : 'center';

const renderLabel = (text: string) => (
  <Text style={styles.label}>{text}</Text>
);

const renderErrorMessage = (error: string) => (
  <Text style={styles.errorText}>{error}</Text>
);

const renderTextInput = (props: InputProps, state: InputState) => (
  <TextInput
    style={calculateInputStyles(state)}
    value={props.value}
    onChangeText={props.onChangeText}
    placeholder={props.placeholder}
    secureTextEntry={state.isSecure}
    multiline={state.isMultiline}
    numberOfLines={state.numberOfLines}
    textAlignVertical={getTextAlignVertical(state)}
  />
);

const shouldRenderError = (error: string | undefined): error is string => 
  Boolean(error);

const Input: React.FC<InputProps> = (props) => {
  const state = createInputState(props);
  
  return (
    <View style={styles.container}>
      {renderLabel(props.label)}
      {renderTextInput(props, state)}
      {shouldRenderError(props.error) && renderErrorMessage(props.error)}
    </View>
  );
};

export default Input;