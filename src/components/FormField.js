// AI-assisted: see docs/AI_LOG.md #8. 
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function FormField({ label, value, onChangeText, error, ...rest }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#999', borderRadius: 8, padding: 10 },
  inputError: { borderColor: '#d32f2f' },
  error: { color: '#d32f2f', fontSize: 12, marginTop: 4 },
});