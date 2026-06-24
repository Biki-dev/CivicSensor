import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@appTypes/index';
import { useAppStore } from '@store/index';

import { SplashScreen } from '@screens/SplashScreen';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import OnboardingScreen from '@screens/OnboardingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isOnboarded, restoreSession } = useAppStore();

  React.useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      {/* Always show splash first */}
      <Stack.Screen name="Splash" component={SplashScreen} />

      {!isAuthenticated ? (
        // Not logged in → show Auth flow
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : !isOnboarded ? (
        // Logged in but onboarding pending
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        // Fully authenticated → main app
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
};