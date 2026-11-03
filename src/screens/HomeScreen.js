import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { SessionContext } from '../context/SessionContext';

export default function HomeScreen({ navigation }) {
  const { approvalStatus, setApprovalStatus, t } = useContext(SessionContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{t.home.title}</Text>
      <Text>
        {t.home.status}: {approvalStatus}
      </Text>
      <Button
        title={t.home.approve}
        onPress={() => setApprovalStatus('approved')}
      />
      <Button
        title={t.home.goToRequest}
        onPress={() => navigation.navigate('IncomingRequest')}
      />
    </View>
  );
}