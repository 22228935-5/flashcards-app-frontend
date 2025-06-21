
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});

interface FABButtonProps {
  onPress: () => void;
}

const FABButton = React.memo<FABButtonProps>(({ onPress }) => (
  <TouchableOpacity style={styles.fabButton} onPress={onPress}>
    <Text style={styles.fabButtonText}>+</Text>
  </TouchableOpacity>
));

export default FABButton;