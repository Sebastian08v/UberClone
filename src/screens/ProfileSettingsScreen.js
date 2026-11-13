import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { openCheckout } from '../services/paymentService';
import { SessionContext } from '../context/SessionContext';

export default function ProfileSettingsScreen() {
  const { approvalStatus, language, changeLanguage, t } =
    useContext(SessionContext);
  const handlePay = async () => {
    try {
      await openCheckout('trip123', 19200);
    } catch (error) {
      console.log('Error de pago:', error.message);
    }
  };
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
      <Button title="Probar pago" onPress={handlePay} />
    </View>
    

    
  );
}