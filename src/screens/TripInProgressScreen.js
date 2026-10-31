import React from 'react';
import { View, Text, Button } from 'react-native';

export default function TripInProgressScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Viaje en curso</Text>
      <Button
        title="Ir a cobro"
        onPress={() => navigation.navigate('Payment')}
      />
    </View>
  );
}