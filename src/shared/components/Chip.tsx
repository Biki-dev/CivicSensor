import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { typography } from '@theme/typography';
import { colors } from '@theme/colors';
import { spacing, radius } from '@theme/spacing';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export const Chip: React.FC<ChipProps> = ({ label, selected = false, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.chip, selected && styles.selected]}
    activeOpacity={0.75}
  >
    <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.chip,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: {
    backgroundColor: colors.brandAccent,
    borderColor: colors.brandAccent,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  selectedLabel: {
    color: colors.white,
  },
});
