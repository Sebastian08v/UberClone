import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { SessionContext } from '../context/SessionContext';

export default function ProfileSettingsScreen() {
  const { approvalStatus } = useContext(SessionContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Perfil y configuración</Text>
      <Text>Estado: {approvalStatus}</Text>
    </View>
  );
}