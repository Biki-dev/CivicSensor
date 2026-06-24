import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '@theme/colors';
import { radius, shadows, spacing } from '@theme/spacing';

type CardElevation = 'flat' | 'sm' | 'md' | 'lg';

interface CardProps {
  children: React.ReactNode;
  elevation?: CardElevation;
  onPress?: () => void;
  style?: ViewStyle;
  padded?: boolean;         // adds default internal padding
  accentColor?: string;     // left-border accent line
  darkMode?: boolean;       // navy background variant
}

const elevationMap: Record<CardElevation, object> = {
  flat: shadows.none,
  sm:   shadows.sm,
  md:   shadows.md,
  lg:   shadows.lg,
};

export const Card: React.FC<CardProps> = ({
  children,
  elevation = 'sm',
  onPress,
  style,
  padded = true,
  accentColor,
  darkMode = false,
}) => {
  const containerStyle: ViewStyle = {
    backgroundColor: darkMode ? colors.bgDarkSecondary : colors.bgCard,
    borderRadius: radius.card,
    overflow: 'hidden',
    ...(padded ? { padding: spacing.cardPadH } : {}),
    ...elevationMap[elevation],
    ...(accentColor ? { borderLeftWidth: 4, borderLeftColor: accentColor } : {}),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.82}
        style={[containerStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[containerStyle, style]}>
      {children}
    </View>
  );
};

// ─── Convenience sub-components ───────────────────────────────────────────────

export const CardRow: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children, style,
}) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
    {children}
  </View>
);

export const CardDivider: React.FC = () => (
  <View style={styles.divider} />
);

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
});