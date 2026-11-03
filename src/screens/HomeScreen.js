import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { SessionContext } from '../context/SessionContext';
import { saveLanguage, getLanguage } from '../services/storage';

export default function HomeScreen({ navigation }) {
  const { approvalStatus, setApprovalStatus } = useContext(SessionContext);
  const [language, setLanguage] = useState('');

  useEffect(() => {
    getLanguage().then(setLanguage);
  }, []);

  const cambiarIdioma = async () => {
    const nuevo = language === 'es' ? 'en' : 'es';
    await saveLanguage(nuevo);
    setLanguage(nuevo);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home</Text>
      <Text>Estado: {approvalStatus}</Text>
      <Text>Idioma guardado: {language}</Text>
      <Button title="Cambiar idioma (prueba)" onPress={cambiarIdioma} />
      <Button title="Aprobar" onPress={() => setApprovalStatus('approved')} />
      <Button
        title="Ir a solicitud entrante"
        onPress={() => navigation.navigate('IncomingRequest')}
      />
    </View>
  );
}