import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '@appTypes/index';
import { WelcomeScreen } from '@screens/onboarding/WelcomeScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome"            component={WelcomeScreen} />
    <Stack.Screen name="ChooseNeighborhood" component={WelcomeScreen} />
    <Stack.Screen name="Walkthrough"        component={WelcomeScreen} />
    <Stack.Screen name="ProfileSetup"       component={WelcomeScreen} />
  </Stack.Navigator>
);