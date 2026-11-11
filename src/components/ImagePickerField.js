// AI-assisted: see docs/AI_LOG.md #8. 
import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerField({ label, value, onChange, cameraText, galleryText, permissionText, error }) {
  const [permissionError, setPermissionError] = useState('');

  const pickFromCamera = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) return setPermissionError(permissionText);
    setPermissionError('');
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) onChange(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return setPermissionError(permissionText);
    setPermissionError('');
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled) onChange(result.assets[0].uri);
  };

  const message = error || permissionError;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {value ? <Image source={{ uri: value }} style={styles.preview} /> : null}
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={pickFromCamera}>
          <Text>{cameraText}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickFromGallery}>
          <Text>{galleryText}</Text>
        </TouchableOpacity>
      </View>
      {message ? <Text style={styles.error}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  preview: { width: 120, height: 120, borderRadius: 8, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8 },
  button: { borderWidth: 1, borderColor: '#999', borderRadius: 8, padding: 10 },
  error: { color: '#d32f2f', fontSize: 12, marginTop: 4 },
});