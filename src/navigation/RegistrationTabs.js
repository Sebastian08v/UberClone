import React from 'react';
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
  return (
    <Tab.Navigator
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
      <Tab.Screen
        name="PersonalData"
        component={PersonalDataScreen}
        options={{ title: 'Datos personales' }}
      />
      <Tab.Screen
        name="Vehicle"
        component={VehicleScreen}
        options={{ title: 'Vehículo' }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{ title: 'Documentos' }}
      />
    </Tab.Navigator>
  );
}