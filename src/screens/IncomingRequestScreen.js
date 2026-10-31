import React from 'react';
import { View, Text, Button } from 'react-native';

export default function IncomingRequestScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Solicitud entrante</Text>
      <Button
        title="Ir a viaje en curso"
        onPress={() => navigation.navigate('TripInProgress')}
      />
    </View>
  );
}