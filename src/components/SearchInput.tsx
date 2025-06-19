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
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const isFirstRender = useRef(true);
  const hasUserInteracted = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [query, debounceDelay]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!hasUserInteracted.current) {
      return;
    }

    const trimmedQuery = debouncedQuery.trim();
    
    if (trimmedQuery.length === 0 || trimmedQuery.length >= minCharacters) {
      onSearch(trimmedQuery);
    }
  }, [debouncedQuery, onSearch, minCharacters]);

  const handleClear = useCallback(() => {
    hasUserInteracted.current = true;
    setQuery('');
    setDebouncedQuery('');
    onSearch('');
    onClear?.();
  }, [onSearch, onClear]);

  const handleChangeText = useCallback((text: string) => {
    hasUserInteracted.current = true;
    setQuery(text);
  }, []);

  const handleSubmitEditing = useCallback(() => {
    hasUserInteracted.current = true;
    const trimmedQuery = query.trim();
    onSearch(trimmedQuery);
  }, [query, onSearch]);

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