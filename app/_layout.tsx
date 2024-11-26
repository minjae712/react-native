import React, { useState } from 'react';
import { Image, StyleSheet, StatusBar, useColorScheme } from 'react-native';
import DrawerNavigator from '@/components/navigation/DrawerNavigator';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from "../utils/AuthContext";

export default function HomeScreen() {
  // 1. currentView 상태와 setter 함수 정의
  const [currentView, setCurrentView] = useState("YYYY-MM-DD"); // 초기값 설정


  return (
    <SafeAreaProvider>
      <StatusBar barStyle='dark-content'
        translucent={true}
        hidden={false}
        backgroundColor="transparent" />
      <AuthProvider>
        <DrawerNavigator
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
