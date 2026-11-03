import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { SessionContext } from '../context/SessionContext';

export default function HomeScreen({ navigation }) {
  const { approvalStatus, setApprovalStatus } = useContext(SessionContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home</Text>
      <Text>Estado: {approvalStatus}</Text>
      <Button
        title="Aprobar"
        onPress={() => setApprovalStatus('approved')}
      />
      <Button
        title="Ir a solicitud entrante"
        onPress={() => navigation.navigate('IncomingRequest')}
      />
    </View>
  );
}