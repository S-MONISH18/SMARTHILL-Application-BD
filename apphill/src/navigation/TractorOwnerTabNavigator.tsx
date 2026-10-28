/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import colors from '../theme/colors';
import { TabIcon, TabLabel } from '../components/TabBarItem';

// Screens
import TractorOwnerDashboardScreen from '../screens/tractorOwner/TractorOwnerDashboardScreen';
import RegisterTractorScreen from '../screens/tractorOwner/RegisterTractorScreen';
import MyTractorsScreen from '../screens/tractorOwner/MyTractorsScreen';
import RentalRequestsScreen from '../screens/tractorOwner/RentalRequestsScreen';
import TractorOwnerProfileScreen from '../screens/tractorOwner/TractorOwnerProfileScreen';
import BookTractorScreen from '../screens/tractorOwner/BookTractorScreen';

// 💬 ChatBox Assistant
import ChatBoxScreen from '../screens/common/ChatBoxScreen';

// ❓ FAQ & Support
import FAQScreen from '../screens/common/FAQScreen';

const Tab = createBottomTabNavigator<any>();
const Stack = createNativeStackNavigator<any>();

//////////////////////////////////////////////////////
// 🔥 STACK for MyTractors → BookTractor
//////////////////////////////////////////////////////
function MyTractorStack() {
  return (
    <Stack.Navigator id="owner-tractor-stack">
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
      id="owner-tabs"
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
      <Tab.Screen
        name="TractorOwnerHome"
        component={TractorOwnerDashboardScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Home" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon symbol="🏠" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="RegisterTractor"
        component={RegisterTractorScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Register" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon symbol="➕" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="Tractors"
        component={MyTractorStack}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Tractors" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon symbol="🚜" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="RentalRequests"
        component={RentalRequestsScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Requests" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon symbol="📩" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="TractorOwnerProfile"
        component={TractorOwnerProfileScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Profile" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon symbol="👤" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="FAQ"
        component={FAQScreen}
        options={{
          tabBarItemStyle: { display: 'none' },
        }}
      />

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
