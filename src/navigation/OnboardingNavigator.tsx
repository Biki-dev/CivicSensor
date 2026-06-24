import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '@appTypes/index';
import { WelcomeScreen } from '@screens/onboarding/WelcomeScreen';

// Placeholder screens for Phase 3
import { PlaceholderScreen } from './PlaceholderScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome"            component={WelcomeScreen} />
    <Stack.Screen name="ChooseNeighborhood" component={PlaceholderScreen} />
    <Stack.Screen name="Walkthrough"        component={PlaceholderScreen} />
    <Stack.Screen name="ProfileSetup"       component={PlaceholderScreen} />
  </Stack.Navigator>
);