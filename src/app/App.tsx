import React from 'react';
import { StatusBar } from 'react-native';
import { RootProviders } from './RootProviders';
import { Navigation } from './Navigation';
import { palette } from '@theme/colors';

const App: React.FC = () => (
  <RootProviders>
    <StatusBar
      barStyle="light-content"
      backgroundColor={palette.navyDeep}
      translucent={false}
    />
    <Navigation />
  </RootProviders>
);

export default App;
