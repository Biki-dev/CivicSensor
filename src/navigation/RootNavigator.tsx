import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@appTypes/index';
import { useAuthStore } from '@store/authStore';

import { SplashScreen }       from '@screens/SplashScreen';
import { AuthNavigator }      from './AuthNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainTabNavigator }   from './MainTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      {/* Always show splash first */}
      <Stack.Screen name="Splash" component={SplashScreen} />

      {!isAuthenticated ? (
        // Not logged in → show Auth flow
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : user && !user.onboardingComplete ? (
        // Logged in but onboarding pending
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : (
        // Fully authenticated → main app
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
};