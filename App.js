import React from 'react';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import {NavigationContainer} from '@react-navigation/native';


export default function App() {
  return (
    <NavigationContainer>
        <DrawerNavigator/>
    </NavigationContainer>
  );
}

