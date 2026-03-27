import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import colors from '../theme/colors';
import typography from '../theme/typography';

// Screens
import CustomerDashboardScreen from '../screens/customer/CustomerDashboardScreen';
import BuyProductsScreen from '../screens/customer/BuyProductsScreen';
import RentTractorScreen from '../screens/customer/RentTractorScreen';
import CustomerProfileScreen from '../screens/customer/CustomerProfileScreen';

// 🔥 NEW SCREENS
import NotificationsScreen from '../screens/common/NotificationsScreen';
import MyCustomerBookingsScreen from '../screens/customer/MyCustomerBookingsScreen';

// 💬 ChatBox Assistant
import ChatBoxScreen from '../screens/common/ChatBoxScreen';

// ❓ FAQ & Support
import FAQScreen from '../screens/common/FAQScreen';

const Tab = createBottomTabNavigator();

//////////////////////////////////////////////////////
// TAB ICON
//////////////////////////////////////////////////////
const TabIcon = ({ symbol, color }) => (
  <Text style={{ fontSize: 18, color }}>{symbol}</Text>
);

//////////////////////////////////////////////////////
// NAVIGATOR
//////////////////////////////////////////////////////
export default function CustomerTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="CustomerHome"
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
        name="CustomerHome"
        component={CustomerDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <TabIcon symbol="🏠" color={color} />
          ),
        }}
      />

      {/* 🛍 PRODUCTS */}
      <Tab.Screen
        name="BuyProducts"
        component={BuyProductsScreen}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color }) => (
            <TabIcon symbol="🛍️" color={color} />
          ),
        }}
      />

      {/* 🚜 TRACTORS */}
      <Tab.Screen
        name="CustomerRentTractor"
        component={RentTractorScreen}
        options={{
          tabBarLabel: 'Tractors',
          tabBarIcon: ({ color }) => (
            <TabIcon symbol="🚜" color={color} />
          ),
        }}
      />

      {/* 📄 BOOKINGS */}
      <Tab.Screen
        name="MyBookings"
        component={MyCustomerBookingsScreen}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ color }) => (
            <TabIcon symbol="📄" color={color} />
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

      {/* ❓ FAQ */}
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

      {/* � ChatBox Assistant */}
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

      {/* �👤 PROFILE */}
      <Tab.Screen
        name="CustomerProfile"
        component={CustomerProfileScreen}
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