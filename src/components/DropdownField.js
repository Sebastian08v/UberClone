// AI-assisted: see docs/AI_LOG.md #8. 
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function DropdownField({ label, value, onValueChange, options, placeholder, error }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, error ? styles.boxError : null]}>
        <Picker selectedValue={value} onValueChange={onValueChange}>
          <Picker.Item label={placeholder} value="" />
          {options.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  box: { borderWidth: 1, borderColor: '#999', borderRadius: 8 },
  boxError: { borderColor: '#d32f2f' },
  error: { color: '#d32f2f', fontSize: 12, marginTop: 4 },
});