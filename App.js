import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RegistrationTabs from './src/navigation/RegistrationTabs';
import DrawerNavigator from './src/navigation/DrawerNavigator';

export default function App() {
  const MOSTRAR_REGISTRO = true;
  return ( 
    <NavigationContainer>
      {MOSTRAR_REGISTRO ? <RegistrationTabs /> : <DrawerNavigator />}
    </NavigationContainer>
  );
}

