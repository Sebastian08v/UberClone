import React from 'react';
import { View, Text, Button } from 'react-native';

export default function PaymentSummaryScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Cobro y resumen</Text>
      <Button
        title="Volver al inicio"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}