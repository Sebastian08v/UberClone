import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { SessionContext } from '../context/SessionContext';

export default function PaymentSummaryScreen({ navigation }) {
  const { t } = useContext(SessionContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{t.payment.title}</Text>
      <Button
        title={t.payment.backHome}
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}