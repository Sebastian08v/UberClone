import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { SessionContext } from '../context/SessionContext';

export default function PersonalDataScreen() {
  const { setApprovalStatus } = useContext(SessionContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Datos personales</Text>
      <Button
        title="Simular registro"
        onPress={() => setApprovalStatus('pending')}
      />
    </View>
  );
}