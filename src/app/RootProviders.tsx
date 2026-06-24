import React, { PropsWithChildren } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FeatureFlagProvider } from '@config/featureFlags';

export const RootProviders: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <FeatureFlagProvider>
          {children}
        </FeatureFlagProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
