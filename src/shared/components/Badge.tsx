import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography } from '@theme/typography';
import { colors } from '@theme/colors';
import { spacing, radius } from '@theme/spacing';

interface BadgeProps {
  label: string;
  count?: number;
  color?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, count, color }) => (
  <View style={[styles.badge, { borderColor: color ?? colors.brandAccent }]}> 
    <Text style={[styles.text, { color: color ?? colors.brandAccent }]}>{label}</Text>
    {count !== undefined && <Text style={[styles.count, { color: color ?? colors.brandAccent }]}>{count}</Text>}
  </View>
);

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.badge,
    borderWidth: 1,
    backgroundColor: colors.bgCard,
  },
  text: {
    ...typography.caption,
    fontWeight: '700',
  },
  count: {
    ...typography.caption,
    marginLeft: spacing.xs,
    opacity: 0.8,
  },
});
