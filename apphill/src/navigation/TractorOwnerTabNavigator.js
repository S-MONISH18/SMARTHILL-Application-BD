import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import colors from '../theme/colors';
import typography from '../theme/typography';

// Screens
import TractorOwnerDashboardScreen from '../screens/tractorOwner/TractorOwnerDashboardScreen';
import RegisterTractorScreen from '../screens/tractorOwner/RegisterTractorScreen';
import MyTractorsScreen from '../screens/tractorOwner/MyTractorsScreen';
import RentalRequestsScreen from '../screens/tractorOwner/RentalRequestsScreen';
import TractorOwnerProfileScreen from '../screens/tractorOwner/TractorOwnerProfileScreen';
import BookTractorScreen from '../screens/tractorOwner/BookTractorScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabIcon = ({ symbol, color }) => (
  <Text style={{ fontSize: 18, color }}>{symbol}</Text>
);

//////////////////////////////////////////////////////
// 🔥 STACK for MyTractors → BookTractor
//////////////////////////////////////////////////////
function MyTractorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyTractors"
        component={MyTractorsScreen}
        options={{ title: 'My Tractors' }}
      />
      <Stack.Screen
        name="BookTractor"
        component={BookTractorScreen}
        options={{ title: 'Book Tractor' }}
      />
    </Stack.Navigator>
  );
}

//////////////////////////////////////////////////////
// 🔥 MAIN TAB NAVIGATOR
//////////////////////////////////////////////////////
export default function TractorOwnerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          ...typography.caption,
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        name="TractorOwnerHome"
        component={TractorOwnerDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <TabIcon symbol="🏠" color={color} />,
        }}
      />

      <Tab.Screen
        name="RegisterTractor"
        component={RegisterTractorScreen}
        options={{
          tabBarLabel: 'Register',
          tabBarIcon: ({ color }) => <TabIcon symbol="➕" color={color} />,
        }}
      />

      {/* 🔥 IMPORTANT CHANGE HERE */}
      <Tab.Screen
        name="Tractors"
        component={MyTractorStack}
        options={{
          tabBarLabel: 'Tractors',
          tabBarIcon: ({ color }) => <TabIcon symbol="🚜" color={color} />,
        }}
      />

      <Tab.Screen
        name="RentalRequests"
        component={RentalRequestsScreen}
        options={{
          tabBarLabel: 'Requests',
          tabBarIcon: ({ color }) => <TabIcon symbol="📩" color={color} />,
        }}
      />

      <Tab.Screen
        name="TractorOwnerProfile"
        component={TractorOwnerProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon symbol="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}