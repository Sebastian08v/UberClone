import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { SessionContext } from '../context/SessionContext';

export default function ProfileSettingsScreen() {
  const { approvalStatus, language, changeLanguage, t } =
    useContext(SessionContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{t.profile.title}</Text>
      <Text>
        {t.home.status}: {approvalStatus}
      </Text>
      <Text>
        {t.language}: {language}
      </Text>
      <Button title="Español" onPress={() => changeLanguage('es')} />
      <Button title="English" onPress={() => changeLanguage('en')} />
    </View>
  );
}