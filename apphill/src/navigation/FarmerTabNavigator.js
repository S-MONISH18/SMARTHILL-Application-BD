import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import colors from '../theme/colors';
import typography from '../theme/typography';

// Screens
import FarmerDashboardScreen from '../screens/farmer/FarmerDashboardScreen';
import FarmDataScreen from '../screens/farmer/FarmDataScreen';
import AvailableTractorsScreen from '../screens/farmer/AvailableTractorsScreen';
import SellProductsScreen from '../screens/farmer/SellProductsScreen';
import FarmerProfileScreen from '../screens/farmer/FarmerProfileScreen';

// 🔥 Booking screen (reuse same)
import BookTractorScreen from '../screens/tractorOwner/BookTractorScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabIcon = ({ symbol, color }) => (
  <Text style={{ fontSize: 18, color }}>{symbol}</Text>
);

//////////////////////////////////////////////////////
// 🔥 STACK for Farmer Tractor Flow
//////////////////////////////////////////////////////
function TractorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AvailableTractors"
        component={AvailableTractorsScreen}
        options={{ title: 'Available Tractors' }}
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
export default function FarmerTabNavigator() {
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
        name="FarmerHome"
        component={FarmerDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <TabIcon symbol="🏠" color={color} />,
        }}
      />

      <Tab.Screen
        name="FarmData"
        component={FarmDataScreen}
        options={{
          tabBarLabel: 'Farm',
          tabBarIcon: ({ color }) => <TabIcon symbol="📊" color={color} />,
        }}
      />

      {/* 🔥 IMPORTANT CHANGE */}
      <Tab.Screen
        name="Tractors"
        component={TractorStack}
        options={{
          tabBarLabel: 'Tractors',
          tabBarIcon: ({ color }) => <TabIcon symbol="🚜" color={color} />,
        }}
      />

      <Tab.Screen
        name="SellProducts"
        component={SellProductsScreen}
        options={{
          tabBarLabel: 'Sell',
          tabBarIcon: ({ color }) => <TabIcon symbol="🛒" color={color} />,
        }}
      />

      <Tab.Screen
        name="FarmerProfile"
        component={FarmerProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon symbol="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}