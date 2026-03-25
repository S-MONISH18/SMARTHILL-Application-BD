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

// 🔥 Booking screen
import BookTractorScreen from '../screens/tractorOwner/BookTractorScreen';

// 🔔 Notifications
import NotificationsScreen from '../screens/common/NotificationsScreen';

// 🛒 NEW: Farmer Orders
import FarmerOrderRequestsScreen from '../screens/farmer/FarmerOrderRequestsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

//////////////////////////////////////////////////////
// TAB ICON
//////////////////////////////////////////////////////
const TabIcon = ({ symbol, color }) => (
  <Text style={{ fontSize: 18, color }}>{symbol}</Text>
);

//////////////////////////////////////////////////////
// 🚜 TRACTOR STACK
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
// MAIN TAB NAVIGATOR
//////////////////////////////////////////////////////
export default function FarmerTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="FarmerHome"
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
      {/* 🏠 HOME */}
      <Tab.Screen
        name="FarmerHome"
        component={FarmerDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <TabIcon symbol="🏠" color={color} />
          ),
        }}
      />

      {/* 📊 FARM */}
      <Tab.Screen
        name="FarmData"
        component={FarmDataScreen}
        options={{
          tabBarLabel: 'Farm',
          tabBarIcon: ({ color }) => (
            <TabIcon symbol="📊" color={color} />
          ),
        }}
      />

      {/* 🚜 TRACTORS */}
      <Tab.Screen
        name="Tractors"
        component={TractorStack}
        options={{
          tabBarLabel: 'Tractors',
          tabBarIcon: ({ color }) => (
            <TabIcon symbol="🚜" color={color} />
          ),
        }}
      />

      {/* 🛒 ORDERS (🔥 IMPORTANT NEW) */}
      <Tab.Screen
        name="Orders"
        component={FarmerOrderRequestsScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color }) => (
            <TabIcon symbol="📦" color={color} />
          ),
        }}
      />

      {/* 🔔 NOTIFICATIONS */}
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ color }) => (
            <TabIcon symbol="🔔" color={color} />
          ),
        }}
      />

      {/* 🛒 SELL */}
      <Tab.Screen
        name="SellProducts"
        component={SellProductsScreen}
        options={{
          tabBarLabel: 'Sell',
          tabBarIcon: ({ color }) => (
            <TabIcon symbol="🛒" color={color} />
          ),
        }}
      />

      {/* 👤 PROFILE */}
      <Tab.Screen
        name="FarmerProfile"
        component={FarmerProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <TabIcon symbol="👤" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}