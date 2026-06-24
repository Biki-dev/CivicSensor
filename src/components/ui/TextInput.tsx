import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { radius, spacing } from '@theme/spacing';

interface CivicInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  darkMode?: boolean;
}

export const TextInput = forwardRef<RNTextInput, CivicInputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      darkMode = false,
      style,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const borderColor = error
      ? colors.textDanger
      : isFocused
      ? colors.borderFocus
      : darkMode
      ? 'rgba(255,255,255,0.15)'
      : colors.border;

    const bgColor = darkMode
      ? 'rgba(255,255,255,0.07)'
      : colors.bgCard;

    const textColor = darkMode ? colors.textOnDark : colors.textPrimary;
    const placeholderColor = darkMode
      ? colors.textOnDarkMuted
      : colors.textMuted;

    return (
      <View style={containerStyle}>
        {label && (
          <Text
            style={[
              typography.label,
              styles.label,
              { color: darkMode ? colors.textOnDarkMuted : colors.textSecondary },
            ]}
          >
            {label}
          </Text>
        )}

        <View
          style={[
            styles.inputWrapper,
            {
              borderColor,
              backgroundColor: bgColor,
              borderWidth: isFocused ? 1.5 : 1,
            },
          ]}
        >
          {leftIcon && (
            <View style={styles.iconLeft}>{leftIcon}</View>
          )}

          <RNTextInput
            ref={ref}
            {...rest}
            placeholderTextColor={placeholderColor}
            style={[
              typography.body,
              styles.input,
              { color: textColor, flex: 1 },
              style,
            ]}
            onFocus={e => {
              setIsFocused(true);
              rest.onFocus?.(e);
            }}
            onBlur={e => {
              setIsFocused(false);
              rest.onBlur?.(e);
            }}
          />

          {rightIcon && (
            <TouchableOpacity
              onPress={onRightIconPress}
              disabled={!onRightIconPress}
              style={styles.iconRight}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>

        {(error || hint) && (
          <Text
            style={[
              typography.caption,
              styles.subText,
              { color: error ? colors.textDanger : colors.textMuted },
            ]}
          >
            {error ?? hint}
          </Text>
        )}
      </View>
    );
  },
);

TextInput.displayName = 'CivicTextInput';

const styles = StyleSheet.create({
  label: {
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.input,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: spacing.inputPadH,
    paddingVertical: spacing.inputPadV,
  },
  iconLeft: {
    paddingLeft: spacing.inputPadH,
  },
  iconRight: {
    paddingRight: spacing.inputPadH,
  },
  subText: {
    marginTop: spacing.xs,
    marginLeft: 2,
  },
});