import AsyncStorage from '@react-native-async-storage/async-storage';

// Claves definidas una sola vez para evitar errores de tipeo
const KEYS = {
  LANGUAGE: 'language',
  AVAILABILITY: 'lastAvailability',
  SESSION: 'session',
};

export async function saveLanguage(language) {
  try {
    await AsyncStorage.setItem(KEYS.LANGUAGE, language);
  } catch (error) {
    console.warn('Error saving language:', error);
  }
}

export async function getLanguage() {
  try {
    const value = await AsyncStorage.getItem(KEYS.LANGUAGE);
    return value ?? 'es'; // primera vez: español por defecto
  } catch (error) {
    console.warn('Error reading language:', error);
    return 'es';
  }
}

export async function saveAvailability(isAvailable) {
  try {
    await AsyncStorage.setItem(KEYS.AVAILABILITY, JSON.stringify(isAvailable));
  } catch (error) {
    console.warn('Error saving availability:', error);
  }
}

export async function getAvailability() {
  try {
    const value = await AsyncStorage.getItem(KEYS.AVAILABILITY);
    return value === null ? false : JSON.parse(value); // primera vez: No disponible
  } catch (error) {
    console.warn('Error reading availability:', error);
    return false;
  }
}

export async function saveSession(session) {
  try {
    await AsyncStorage.setItem(KEYS.SESSION, JSON.stringify(session));
  } catch (error) {
    console.warn('Error saving session:', error);
  }
}

export async function getSession() {
  try {
    const value = await AsyncStorage.getItem(KEYS.SESSION);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.warn('Error reading session:', error);
    return null;
  }
}

export async function clearSession() {
  try {
    await AsyncStorage.removeItem(KEYS.SESSION);
  } catch (error) {
    console.warn('Error clearing session:', error);
  }
}