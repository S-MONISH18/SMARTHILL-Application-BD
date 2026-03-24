import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import colors from '../theme/colors';
import typography from '../theme/typography';

import CustomerDashboardScreen from '../screens/customer/CustomerDashboardScreen';
import BuyProductsScreen from '../screens/customer/BuyProductsScreen';
import RentTractorScreen from '../screens/customer/RentTractorScreen';
import CustomerProfileScreen from '../screens/customer/CustomerProfileScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ symbol, color }) => (
  <Text style={{ fontSize: 18, color }}>{symbol}</Text>
);

export default function CustomerTabNavigator() {
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
        name="CustomerHome"
        component={CustomerDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <TabIcon symbol="🏠" color={color} />,
        }}
      />

      <Tab.Screen
        name="BuyProducts"
        component={BuyProductsScreen}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color }) => <TabIcon symbol="🛍️" color={color} />,
        }}
      />

      <Tab.Screen
        name="CustomerRentTractor"
        component={RentTractorScreen}
        options={{
          tabBarLabel: 'Tractors',
          tabBarIcon: ({ color }) => <TabIcon symbol="🚜" color={color} />,
        }}
      />

      <Tab.Screen
        name="CustomerProfile"
        component={CustomerProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon symbol="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}