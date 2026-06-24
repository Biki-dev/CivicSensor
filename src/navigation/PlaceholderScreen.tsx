import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';

export const PlaceholderScreen: React.FC = () => {
  const route = useRoute();
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>🚧</Text>
      <Text style={[typography.h3, { color: colors.textPrimary }]}>
        {route.name}
      </Text>
      <Text style={[typography.body, styles.sub]}>
        Coming in a future phase
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sub: {
    color: colors.textMuted,
    marginTop: 8,
  },
});