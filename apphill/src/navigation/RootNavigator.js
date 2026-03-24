import React from 'react';
import { useAuth } from '../context/AuthContext';

import AuthNavigator from './AuthNavigator';
import FarmerTabNavigator from './FarmerTabNavigator';
import TractorOwnerTabNavigator from './TractorOwnerTabNavigator';
import CustomerStackNavigator from './CustomerStackNavigator'; // ✅ UPDATED

export default function RootNavigator() {
  const { currentUser } = useAuth();

  // 🔐 Not logged in
  if (!currentUser) {
    return <AuthNavigator />;
  }

  // 👨‍🌾 Farmer
  if (currentUser.role === 'farmer') {
    return <FarmerTabNavigator />;
  }

  // 🚜 Tractor Owner
  if (currentUser.role === 'tractor_owner') {
    return <TractorOwnerTabNavigator />;
  }

  // 🛒 Customer (UPDATED → Stack Navigator)
  if (currentUser.role === 'customer') {
    return <CustomerStackNavigator />;
  }

  // fallback
  return <AuthNavigator />;
}