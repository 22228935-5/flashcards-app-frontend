import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

export const useLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);

  const withLoading = useCallback(async <T>(operation: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    try {
      return await operation();
    } catch (error) {
      console.error('Operation failed:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, setLoading, withLoading };
};

export const useConfirmDialog = () => {
  const showConfirmDialog = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancelar', style: 'cancel', onPress: onCancel },
        { text: 'Confirmar', style: 'destructive', onPress: onConfirm },
      ]
    );
  }, []);

  return { showConfirmDialog };
};

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown, customMessage?: string) => {
    console.error('Error:', error);
    const message = customMessage || 'Ocorreu um erro inesperado';
    Alert.alert('Erro', message);
  }, []);

  return { handleError };
};

export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse, setValue };
};