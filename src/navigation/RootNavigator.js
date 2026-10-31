import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import IncomingRequestScreen from '../screens/IncomingRequestScreen';
import PaymentSummaryScreen from '../screens/PaymentSummaryScreen';
import TripInProgressScreen from '../screens/TripInProgressScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator(){
    return(

        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen
                name = "Home"
                component = {HomeScreen}
            />

            <Stack.Screen
                name = "IncomingRequest"
                component = {IncomingRequestScreen}
            />

            <Stack.Screen
                name = "TripInProgress"
                component = {TripInProgressScreen}
            />

            <Stack.Screen
                name = "Payment"
                component = {PaymentSummaryScreen}
            />
            
        </Stack.Navigator>

        
    )
}