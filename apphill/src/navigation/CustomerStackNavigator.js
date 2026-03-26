import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomerTabNavigator from './CustomerTabNavigator';
import BookTractorScreen from '../screens/tractorOwner/BookTractorScreen';
import RegisterTractorScreen from '../screens/tractorOwner/RegisterTractorScreen';

const Stack = createNativeStackNavigator();

export default function CustomerStackNavigator() {
  return (
    <Stack.Navigator>

      {/* Tabs */}
      <Stack.Screen
        name="CustomerTabs"
        component={CustomerTabNavigator}
        options={{ headerShown: false }}
      />

      {/* Booking Screen */}
      <Stack.Screen
        name="BookTractorScreen"
        component={BookTractorScreen}
        options={{ title: 'Book Tractor' }}
      />

      {/* Register Tractor Screen */}
      <Stack.Screen
        name="RegisterTractorScreen"
        component={RegisterTractorScreen}
        options={{ title: 'Register Tractor' }}
      />

    </Stack.Navigator>
  );
}