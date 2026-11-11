// AI-assisted: see docs/AI_LOG.md #7. 
import React, {useContext} from 'react';
import { SessionContext } from '../context/SessionContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import PersonalDataScreen from '../screens/PersonalDataScreen';
import VehicleScreen from '../screens/VehicleScreen';
import DocumentsScreen from '../screens/DocumentsScreen';

const Tab = createBottomTabNavigator();

const ICONOS = {
  PersonalData: ['person', 'person-outline'],
  Vehicle: ['car-sport', 'car-sport-outline'],
  Documents: ['document', 'document-outline'],
};

export default function RegistrationTabs() {
  // AI-assisted: see docs/AI_LOG.md #7. 
  const { t } = useContext(SessionContext);
  return (
    <Tab.Navigator
    // AI-assisted: see docs/AI_LOG.md #4. 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const [activo, inactivo] = ICONOS[route.name];
          return (
            <Ionicons
              name={focused ? activo : inactivo}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
    {/* AI-assisted: see docs/AI_LOG.md #7. */} 
      <Tab.Screen
        name="PersonalData"
        component={PersonalDataScreen}
        options={{ title: t.tabs.personalData }}
      />
      <Tab.Screen
        name="Vehicle"
        component={VehicleScreen}
        options={{ title: t.tabs.vehicle }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{ title: t.tabs.documents }}
      />
    </Tab.Navigator>
  );
}