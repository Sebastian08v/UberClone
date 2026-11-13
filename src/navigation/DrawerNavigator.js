import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RootNavigator from './RootNavigator';
import ProfileSettingsScreen from '../screens/ProfileSettingsScreen';
import TripHistoryScreen from '../screens/TripHistoryScreen';
import EarningsScreen from '../screens/EarningsScreen';
import TripDetailScreen from '../screens/TripDetailScreen';
import { HeaderBackButton } from '@react-navigation/elements';
import { SessionContext } from '../context/SessionContext';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { t } = useContext(SessionContext);

  return (
    <Drawer.Navigator
      behavior="history">
      <Drawer.Screen
        name="Trip"
        component={RootNavigator}
        options={{ title: t.drawer.home }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileSettingsScreen}
        options={{ title: t.drawer.profile }}
      />
      <Drawer.Screen
        name="TripHistory"
        component={TripHistoryScreen}
        options={{ title: t.drawer.tripHistory }}
      />
      <Drawer.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{ title: t.drawer.earnings }}
      />
      <Drawer.Screen
        name="TripDetail"
        component={TripDetailScreen}
        options={({ navigation }) => ({
          title: t.tripDetail.title,
          drawerItemStyle: { display: 'none' }, // no aparece en el menú
          headerLeft: (props) => (
            <HeaderBackButton {...props} onPress={() => navigation.goBack()} />
          ),
        })}
      />
    </Drawer.Navigator>
  );
}