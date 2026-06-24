import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

export const LoadingSpinner: React.FC<{ size?: 'small' | 'large' }> = ({ size = 'large' }) => (
  <View style={styles.container}>
    <ActivityIndicator size={size} color={colors.brandAccent} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
