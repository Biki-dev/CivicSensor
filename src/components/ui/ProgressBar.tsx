import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors, palette } from '@theme/colors';
import { typography } from '@theme/typography';
import { radius, spacing } from '@theme/spacing';

interface ProgressBarProps {
  progress: number;           // 0–100
  color?: string;
  trackColor?: string;
  height?: number;
  showLabel?: boolean;
  labelPrefix?: string;       // e.g. "340 / 600 XP"
  labelSuffix?: string;
  animated?: boolean;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = colors.brandAccent,
  trackColor = colors.slateMid,
  height = 8,
  showLabel = false,
  labelPrefix,
  labelSuffix,
  animated = true,
  style,
}) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const clamped = Math.min(100, Math.max(0, progress));

  useEffect(() => {
    if (animated) {
      Animated.spring(animValue, {
        toValue: clamped,
        tension: 60,
        friction: 8,
        useNativeDriver: false,
      }).start();
    } else {
      animValue.setValue(clamped);
    }
  }, [clamped, animated]);

  const widthInterpolated = animValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={style}>
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: trackColor,
            borderRadius: height / 2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthInterpolated,
              height,
              backgroundColor: color,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
      {showLabel && (
        <View style={styles.labelRow}>
          {labelPrefix && (
            <Text style={[typography.caption, { color: colors.textMuted }]}>
              {labelPrefix}
            </Text>
          )}
          <Text style={[typography.caption, { color: colors.textMuted, marginLeft: 'auto' }]}>
            {labelSuffix ?? `${Math.round(clamped)}%`}
          </Text>
        </View>
      )}
    </View>
  );
};

// ─── XP Level Bar (styled for dashboard) ─────────────────────────────────────

interface XPBarProps {
  currentPoints: number;
  minPoints: number;
  maxPoints: number;
  levelColor: string;
  style?: ViewStyle;
}

export const XPBar: React.FC<XPBarProps> = ({
  currentPoints, minPoints, maxPoints, levelColor, style,
}) => {
  const range = maxPoints === Infinity ? 1000 : maxPoints - minPoints;
  const earned = currentPoints - minPoints;
  const progress = Math.min(100, (earned / range) * 100);

  return (
    <View style={style}>
      <ProgressBar
        progress={progress}
        color={levelColor}
        height={10}
        animated
        style={{ marginBottom: 4 }}
      />
      <View style={styles.labelRow}>
        <Text style={[typography.caption, { color: colors.textMuted }]}>
          {currentPoints.toLocaleString()} pts
        </Text>
        {maxPoints !== Infinity && (
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            {maxPoints.toLocaleString()} pts
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
});