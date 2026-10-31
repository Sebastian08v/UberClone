import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home</Text>
      <Button
        title="Ir a solicitud entrante"
        onPress={() => navigation.navigate('IncomingRequest')}
      />
    </View>
  );
}
