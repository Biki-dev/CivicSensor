import React, { PropsWithChildren } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

export const ScreenContainer: React.FC<PropsWithChildren> = ({ children }) => (
  <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
    {children}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    minHeight: '100%',
    backgroundColor: colors.bgPrimary,
    paddingHorizontal: spacing.screenH,
    paddingTop: spacing.screenV,
    paddingBottom: spacing.screenV,
  },
});
