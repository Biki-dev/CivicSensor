/**
 * CivicSensor — Root App Entry
 * Phase 2: Navigation + Auth foundation wired up
 */
import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from '@navigation/RootNavigator';
import { palette } from '@theme/colors';

// Suppress known non-critical warnings during dev
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

// Navigation theme — keeps system nav bars consistent
const NAV_THEME = {
  dark: false,
  colors: {
    primary:      palette.tealVibrant,
    background:   palette.slateLight,
    card:         palette.white,
    text:         palette.inkBlack,
    border:       palette.slateMid,
    notification: palette.coral,
  },
};

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={palette.navyDeep}
          translucent={false}
        />
        <NavigationContainer theme={NAV_THEME}>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;