import React from 'react'
import ProfileSettingsScreen from '../screens/ProfileSettingsScreen';
import TripHistoryScreen from '../screens/TripHistoryScreen';
import EarningsScreen from '../screens/EarningsScreen';
import RootNavigator from '../navigation/RootNavigator'

import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Root" component={RootNavigator} options={{title: 'Inicio'}} />  
      <Drawer.Screen name="Profile" component={ProfileSettingsScreen} />
      <Drawer.Screen name="TripHistory" component={TripHistoryScreen} />
      <Drawer.Screen name="Earning" component={EarningsScreen} />
    </Drawer.Navigator>
  );
}