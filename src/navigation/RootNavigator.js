import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import IncomingRequestScreen from '../screens/IncomingRequestScreen';
import PaymentSummaryScreen from '../screens/PaymentSummaryScreen';
import TripInProgressScreen from '../screens/TripInProgressScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator(){
    return(
        
        <Stack.Navigator>
            <Stack.Screen
                name = "Home"
                component = {HomeScreen}
                options = {{headerShown: false}}
            />

            <Stack.Screen
                name = "IncomingRequest"
                component = {IncomingRequestScreen}
                options = {{headerShown: false}}
            />

            <Stack.Screen
                name = "TripInProgress"
                component = {TripInProgressScreen}
                options = {{headerShown: false}}
            />

            <Stack.Screen
                name = "Payment"
                component = {PaymentSummaryScreen}
                options = {{headerShown: false}}
            />
            
        </Stack.Navigator>

        
    )
}