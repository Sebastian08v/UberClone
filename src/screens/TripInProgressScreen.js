import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { SessionContext } from '../context/SessionContext';

export default function TripInProgressScreen({ navigation }) {
  const { t } = useContext(SessionContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{t.tripInProgress.title}</Text>
      <Button
        title={t.tripInProgress.goToPayment}
        onPress={() => navigation.navigate('Payment')}
      />
    </View>
  );
}