import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import RegistrationTabs from './src/navigation/RegistrationTabs';
import { RegistrationProvider } from './src/context/RegistrationContext';
import { SessionProvider, SessionContext } from './src/context/SessionContext';
import { TripProvider } from './src/context/TripContext';

function AppContent() {
  const { approvalStatus } = useContext(SessionContext);

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