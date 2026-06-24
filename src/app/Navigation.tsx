import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from '@navigation/RootNavigator';
import { palette } from '@theme/colors';

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

export const Navigation: React.FC = () => (
  <NavigationContainer theme={NAV_THEME}>
    <RootNavigator />
  </NavigationContainer>
);
