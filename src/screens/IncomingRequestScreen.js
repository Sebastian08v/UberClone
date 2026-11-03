import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { SessionContext } from '../context/SessionContext';

export default function IncomingRequestScreen({ navigation }) {
  const { t } = useContext(SessionContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{t.incomingRequest.title}</Text>
      <Button
        title={t.incomingRequest.goToTrip}
        onPress={() => navigation.navigate('TripInProgress')}
      />
    </View>
  );
}