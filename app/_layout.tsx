import React from 'react';
import { Image, StyleSheet, Platform, StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from '@/components/navigation/DrawerNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <StatusBar backgroundColor={isDarkMode ? Colors.dark : Colors.light}></StatusBar>
      <SafeAreaProvider>
        <NavigationContainer independent={true}>
          <DrawerNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
}
