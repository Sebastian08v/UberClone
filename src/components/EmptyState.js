import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState({ message }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 32 },
  text: { color: '#777', fontSize: 15, textAlign: 'center' },
});