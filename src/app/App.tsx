// App entry: global styles, safe area, shared state and navigation.
import '../../global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/context/AppContext';
import AppNavigator from '@/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppNavigator />
        <StatusBar style="dark" />
      </AppProvider>
    </SafeAreaProvider>
  );
}
