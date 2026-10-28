/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import colors from '../theme/colors';
import { TabIcon, TabLabel } from '../components/TabBarItem';

// Screens
import CustomerDashboardScreen from '../screens/customer/CustomerDashboardScreen';
import BuyProductsScreen from '../screens/customer/BuyProductsScreen';
import RentTractorScreen from '../screens/customer/RentTractorScreen';
import CustomerProfileScreen from '../screens/customer/CustomerProfileScreen';

// NEW SCREENS
import NotificationsScreen from '../screens/common/NotificationsScreen';
import MyCustomerBookingsScreen from '../screens/customer/MyCustomerBookingsScreen';

// ChatBox Assistant
import ChatBoxScreen from '../screens/common/ChatBoxScreen';

// FAQ Support
import FAQScreen from '../screens/common/FAQScreen';

const Tab = createBottomTabNavigator<any>();

//////////////////////////////////////////////////////
// NAVIGATOR
//////////////////////////////////////////////////////
export default function CustomerTabNavigator() {
  return (
    <Tab.Navigator
      id="customer-tabs"
      initialRouteName="CustomerHome"
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
      {/* HOME */}
      <Tab.Screen
        name="CustomerHome"
        component={CustomerDashboardScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Home" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon symbol="🏠" focused={focused} />,
        }}
      />

      {/* PRODUCTS */}
      <Tab.Screen
        name="BuyProducts"
        component={BuyProductsScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Products" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon symbol="🛍️" focused={focused} />,
        }}
      />

      {/* TRACTORS */}
      <Tab.Screen
        name="CustomerRentTractor"
        component={RentTractorScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Tractors" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon symbol="🚜" focused={focused} />,
        }}
      />

      {/* BOOKINGS */}
      <Tab.Screen
        name="MyBookings"
        component={MyCustomerBookingsScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Bookings" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon symbol="📄" focused={focused} />,
        }}
      />

      {/* NOTIFICATIONS */}
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Alerts" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon symbol="🔔" focused={focused} />,
        }}
      />

      {/* PROFILE */}
      <Tab.Screen
        name="CustomerProfile"
        component={CustomerProfileScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Profile" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon symbol="👤" focused={focused} />,
        }}
      />

      {/* FAQ - Hidden from main tabs */}
      <Tab.Screen
        name="FAQ"
        component={FAQScreen}
        options={{
          tabBarItemStyle: { display: 'none' },
        }}
      />

      {/* ChatBox Assistant - Hidden from main tabs */}
      <Tab.Screen
        name="ChatBox"
        component={ChatBoxScreen}
        options={{
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tab.Navigator>
  );
}
