/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import colors from '../theme/colors';
import { TabIcon, TabLabel } from '../components/TabBarItem';

// Screens
import FarmerDashboardScreen from '../screens/farmer/FarmerDashboardScreen';
import FarmDataScreen from '../screens/farmer/FarmDataScreen';
import AvailableTractorsScreen from '../screens/farmer/AvailableTractorsScreen';
import SellProductsScreen from '../screens/farmer/SellProductsScreen';
import FarmerProfileScreen from '../screens/farmer/FarmerProfileScreen';

// 🔥 Booking screen
import BookTractorScreen from '../screens/tractorOwner/BookTractorScreen';

// 🚜 Register Tractor (farmers can now register too!)
import RegisterTractorScreen from '../screens/tractorOwner/RegisterTractorScreen';

// 🔔 Notifications
import NotificationsScreen from '../screens/common/NotificationsScreen';

// 🛒 NEW: Farmer Orders
import FarmerOrderRequestsScreen from '../screens/farmer/FarmerOrderRequestsScreen';

// 💬 ChatBox Assistant
import ChatBoxScreen from '../screens/common/ChatBoxScreen';

// ❓ FAQ & Support
import FAQScreen from '../screens/common/FAQScreen';

// 🌱 Crop Prediction
import CropPredictionScreen from '../screens/farmer/CropPredictionScreen';

const Tab = createBottomTabNavigator<any>();
const Stack = createNativeStackNavigator<any>();

//////////////////////////////////////////////////////
// 🚜 TRACTOR STACK
//////////////////////////////////////////////////////
function TractorStack() {
  return (
    <Stack.Navigator id="farmer-tractor-stack">
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
      id="farmer-tabs"
      initialRouteName="FarmerHome"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E8F5E9',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 5,
        },
      }}
    >
      {/* 🏠 HOME */}
      <Tab.Screen
        name="FarmerHome"
        component={FarmerDashboardScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Home" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon symbol="🏠" focused={focused} />,
        }}
      />

      {/* 📊 FARM */}
      <Tab.Screen
        name="FarmData"
        component={FarmDataScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Farm" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon symbol="📊" focused={focused} />,
        }}
      />

      {/* 🚜 TRACTORS */}
      <Tab.Screen
        name="Tractors"
        component={TractorStack}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Tractors" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon symbol="🚜" focused={focused} />,
        }}
      />

      {/* 📦 ORDERS */}
      <Tab.Screen
        name="Orders"
        component={FarmerOrderRequestsScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Orders" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon symbol="📦" focused={focused} />,
        }}
      />

      {/* 🛒 SELL */}
      <Tab.Screen
        name="SellProducts"
        component={SellProductsScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Sell" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon symbol="🛒" focused={focused} />,
        }}
      />

      {/* 👤 PROFILE */}
      <Tab.Screen
        name="FarmerProfile"
        component={FarmerProfileScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Profile" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon symbol="👤" focused={focused} />,
        }}
      />

      {/* 🔔 NOTIFICATIONS - Hidden from main tabs but still accessible */}
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarItemStyle: { display: 'none' },
        }}
      />

      {/* ❓ FAQ & Support - Hidden from main tabs */}
      <Tab.Screen
        name="FAQ"
        component={FAQScreen}
        options={{
          tabBarItemStyle: { display: 'none' },
        }}
      />

      {/* 💬 ChatBox Assistant - Hidden from main tabs */}
      <Tab.Screen
        name="ChatBox"
        component={ChatBoxScreen}
        options={{
          tabBarItemStyle: { display: 'none' },
        }}
      />

      {/* 🌱 Crop Prediction - Hidden from main tabs */}
      <Tab.Screen
        name="CropPrediction"
        component={CropPredictionScreen}
        options={{
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tab.Navigator>
  );
}
