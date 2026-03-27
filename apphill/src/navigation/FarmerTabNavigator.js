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

// � Register Tractor (farmers can now register too!)
import RegisterTractorScreen from '../screens/tractorOwner/RegisterTractorScreen';

// �🔔 Notifications
import NotificationsScreen from '../screens/common/NotificationsScreen';

// 🛒 NEW: Farmer Orders
import FarmerOrderRequestsScreen from '../screens/farmer/FarmerOrderRequestsScreen';

// 💬 ChatBox Assistant
import ChatBoxScreen from '../screens/common/ChatBoxScreen';

// ❓ FAQ & Support
import FAQScreen from '../screens/common/FAQScreen';

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
      <Stack.Screen
        name="RegisterTractor"
        component={RegisterTractorScreen}
        options={{ title: 'Register Your Tractor' }}
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

      {/* ❓ FAQ & Support */}
      <Tab.Screen
        name="FAQ"
        component={FAQScreen}
        options={{
          tabBarLabel: 'Help',
          tabBarIcon: ({ color }) => (
            <TabIcon symbol="❓" color={color} />
          ),
        }}
      />

      {/* 💬 ChatBox Assistant */}
      <Tab.Screen
        name="ChatBox"
        component={ChatBoxScreen}
        options={{
          tabBarLabel: 'AI Chat',
          tabBarIcon: ({ color }) => (
            <TabIcon symbol="💬" color={color} />
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