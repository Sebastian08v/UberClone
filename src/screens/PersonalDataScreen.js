import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { SessionContext } from '../context/SessionContext';

export default function PersonalDataScreen() {
  const { setApprovalStatus, language, changeLanguage, t } =
    useContext(SessionContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{t.personalData.title}</Text>
      <Text>
        {t.language}: {language}
      </Text>
      <Button title="Español" onPress={() => changeLanguage('es')} />
      <Button title="English" onPress={() => changeLanguage('en')} />
      <Button
        title={t.personalData.simulateRegister}
        onPress={() => setApprovalStatus('pending')}
      />
    </View>
  );
}