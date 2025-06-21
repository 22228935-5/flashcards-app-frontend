import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#007AFF',
  },
});

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: ButtonVariant;
  disabled?: boolean;
}

interface ButtonState {
  variant: ButtonVariant;
  disabled: boolean;
  loading: boolean;
}

const createButtonState = (props: ButtonProps): ButtonState => ({
  variant: props.variant ?? 'primary',
  disabled: props.disabled ?? false,
  loading: props.loading ?? false
});

const isSecondaryVariant = (state: ButtonState): boolean => 
  state.variant === 'secondary';

const isPrimaryVariant = (state: ButtonState): boolean => 
  state.variant === 'primary';

const isInteractionDisabled = (state: ButtonState): boolean => 
  state.disabled || state.loading;

const calculateButtonStyles = (state: ButtonState): ViewStyle[] => {
  const baseStyles: ViewStyle[] = [styles.button];
  
  if (isSecondaryVariant(state)) {
    baseStyles.push(styles.buttonSecondary);
  }
  
  if (state.disabled) {
    baseStyles.push(styles.buttonDisabled);
  }
  
  return baseStyles;
};

const calculateTextStyles = (state: ButtonState): TextStyle[] => {
  const baseStyles: TextStyle[] = [styles.buttonText];
  
  if (isSecondaryVariant(state)) {
    baseStyles.push(styles.buttonTextSecondary);
  }
  
  return baseStyles;
};

const getIndicatorColor = (state: ButtonState): string => 
  isPrimaryVariant(state) ? '#fff' : '#007AFF';

const renderLoadingContent = (state: ButtonState) => (
  <ActivityIndicator color={getIndicatorColor(state)} />
);

const renderTextContent = (title: string, state: ButtonState) => (
  <Text style={calculateTextStyles(state)}>
    {title}
  </Text>
);

const renderButtonContent = (title: string, state: ButtonState) => 
  state.loading ? renderLoadingContent(state) : renderTextContent(title, state);

const Button: React.FC<ButtonProps> = (props) => {
  const state = createButtonState(props);
  const buttonStyles = calculateButtonStyles(state);
  const disabled = isInteractionDisabled(state);
  
  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={props.onPress}
      disabled={disabled}
    >
      {renderButtonContent(props.title, state)}
    </TouchableOpacity>
  );
};

export default Button;