import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import RegistrationTabs from './src/navigation/RegistrationTabs';
import { RegistrationProvider } from './src/context/RegistrationContext';
import { SessionProvider, SessionContext } from './src/context/SessionContext';
import { TripProvider } from './src/context/TripContext';

function AppContent() {
  // AI-assisted: see docs/AI_LOG.md #5.
  const { approvalStatus, loading } = useContext(SessionContext);

  // Espera a restaurar la sesión antes de decidir la pantalla
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {approvalStatus === null ? <RegistrationTabs /> : <DrawerNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <RegistrationProvider>
        <TripProvider>
          <AppContent />
        </TripProvider>
      </RegistrationProvider>
    </SessionProvider>
  );
}