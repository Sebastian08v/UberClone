// AI-assisted: see docs/AI_LOG.md #8. 
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DatePickerField({ label, value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShow(false);
    if (event.type === 'set' && selectedDate) onChange(selectedDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.input, error ? styles.inputError : null]}
        onPress={() => setShow(true)}
      >
        <Text>{value ? value.toLocaleDateString() : placeholder}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker value={value || new Date()} mode="date" onChange={handleChange} />
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#999', borderRadius: 8, padding: 12 },
  inputError: { borderColor: '#d32f2f' },
  error: { color: '#d32f2f', fontSize: 12, marginTop: 4 },
});