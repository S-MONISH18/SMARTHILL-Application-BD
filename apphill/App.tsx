import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

// 🔥 Disable native screens optimization
import { enableScreens } from 'react-native-screens';
enableScreens(false);

// 🔥 Import NativeModules
import { NativeModules } from 'react-native';

export default function App() {

  useEffect(() => {
    // 🔥 Force remove FLAG_SECURE continuously
    const interval = setInterval(() => {
      try {
        NativeModules?.RNAndroidWindowSecure?.clearSecureFlag?.();
      } catch (e) {}
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}