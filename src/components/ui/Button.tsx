import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { radius, spacing, shadows } from '@theme/spacing';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'reward';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles = {
  primary: {
    bg:           colors.btnPrimary,
    text:         colors.btnPrimaryText,
    border:       'transparent',
    shadow:       shadows.teal,
    pressedBg:    colors.tealMid,
  },
  secondary: {
    bg:           colors.btnSecondary,
    text:         colors.btnSecondaryText,
    border:       'transparent',
    shadow:       shadows.md,
    pressedBg:    colors.navyLight,
  },
  ghost: {
    bg:           colors.btnGhost,
    text:         colors.btnGhostText,
    border:       colors.btnGhostBorder,
    shadow:       shadows.none,
    pressedBg:    colors.slateMid,
  },
  danger: {
    bg:           colors.coral,
    text:         colors.white,
    border:       'transparent',
    shadow:       shadows.sm,
    pressedBg:    colors.coralDeep,
  },
  reward: {
    bg:           colors.amber,
    text:         colors.navyDeep,
    border:       'transparent',
    shadow:       shadows.amber,
    pressedBg:    colors.amberDeep,
  },
} as const;

const sizeStyles: Record<Size, { paddingH: number; paddingV: number; textStyle: TextStyle; iconSize: number }> = {
  sm: { paddingH: spacing.md, paddingV: spacing.sm - 2, textStyle: typography.btnSM, iconSize: 16 },
  md: { paddingH: spacing.lg, paddingV: spacing['3'],   textStyle: typography.btn,   iconSize: 18 },
  lg: { paddingH: spacing.xl, paddingV: spacing.md,     textStyle: typography.btnLG, iconSize: 20 },
};

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const vs = variantStyles[variant];
  const ss = sizeStyles[size];
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.78}
      style={[
        styles.base,
        {
          backgroundColor:  isDisabled ? colors.btnDisabled : vs.bg,
          borderColor:      vs.border,
          paddingHorizontal: ss.paddingH,
          paddingVertical:   ss.paddingV,
          ...(fullWidth ? { width: '100%' } : {}),
        },
        !isDisabled && variant !== 'ghost' ? vs.shadow : {},
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          color={isDisabled ? colors.btnDisabledText : vs.text}
          size="small"
        />
      ) : (
        <View style={styles.inner}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text
            style={[
              ss.textStyle,
              { color: isDisabled ? colors.btnDisabledText : vs.text },
              textStyle,
            ]}
          >
            {label}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.btn,
    borderWidth: 1.5,
    minWidth: 80,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginLeft: spacing.xs,
  },
});