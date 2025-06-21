import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

interface SearchInputProps {
  placeholder: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  debounceDelay?: number;
  minCharacters?: number;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
    color: '#666',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#999',
    fontWeight: 'bold',
  },
});

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  onSearch,
  onClear,
  debounceDelay = 300,
  minCharacters = 1
}) => {
  const [query, setQuery] = useState('');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRenderRef = useRef(true);

  // Limpa o timer ao desmontar o componente
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Função para executar a busca
  const executeSearch = useCallback((searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    
    // Só executa se o usuário já interagiu e não é o primeiro render
    if (!hasUserInteracted || isFirstRenderRef.current) {
      return;
    }

    // Verifica se deve executar a busca baseado no tamanho mínimo
    if (trimmedQuery.length === 0 || trimmedQuery.length >= minCharacters) {
      onSearch(trimmedQuery);
    }
  }, [hasUserInteracted, minCharacters, onSearch]);

  // Efeito para lidar com mudanças no query com debounce
  useEffect(() => {
    // Marca que não é mais o primeiro render
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    // Limpa o timer anterior
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Cria novo timer
    debounceTimerRef.current = setTimeout(() => {
      executeSearch(query);
    }, debounceDelay);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debounceDelay, executeSearch]);

  const handleChangeText = useCallback((text: string) => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    setQuery(text);
  }, [hasUserInteracted]);

  const handleSubmitEditing = useCallback(() => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    
    // Limpa o timer de debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Executa a busca imediatamente
    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 0 || trimmedQuery.length >= minCharacters) {
      onSearch(trimmedQuery);
    }
  }, [query, minCharacters, onSearch, hasUserInteracted]);

  const handleClear = useCallback(() => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    
    // Limpa o timer de debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    setQuery('');
    onSearch('');
    onClear?.();
  }, [onSearch, onClear, hasUserInteracted]);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={query}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmitEditing}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {query.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchInput;