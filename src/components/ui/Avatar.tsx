import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors, palette } from '@theme/colors';
import { typography } from '@theme/typography';
import { getLevelConfig } from '@constants/index';
import type { UserLevel } from '@appTypes/index';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name: string;
  uri?: string;
  size?: AvatarSize;
  level?: UserLevel;          // draws coloured ring
  showLevelRing?: boolean;
  style?: ViewStyle;
}

const sizeMap: Record<AvatarSize, { container: number; text: object; ring: number; borderW: number }> = {
  xs: { container: 28, text: typography.labelSM, ring: 32, borderW: 2 },
  sm: { container: 36, text: typography.label,   ring: 40, borderW: 2 },
  md: { container: 48, text: typography.h4,      ring: 54, borderW: 2.5 },
  lg: { container: 64, text: typography.h2,      ring: 70, borderW: 3 },
  xl: { container: 88, text: typography.h1,      ring: 96, borderW: 3.5 },
};

const generateBgColor = (name: string): string => {
  const colors = [
    '#3B82F6', '#8B5CF6', '#EC4899', '#10B981',
    '#F59E0B', '#EF4444', '#06B6D4', '#6366F1',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  uri,
  size = 'md',
  level,
  showLevelRing = false,
  style,
}) => {
  const s = sizeMap[size];
  const initials = getInitials(name);
  const bgColor = generateBgColor(name);
  const levelColor = level ? getLevelConfig(level).color : palette.tealVibrant;

  const inner = (
    <View
      style={[
        styles.container,
        {
          width: s.container,
          height: s.container,
          borderRadius: s.container / 2,
          backgroundColor: uri ? 'transparent' : bgColor,
        },
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: s.container, height: s.container, borderRadius: s.container / 2 }}
        />
      ) : (
        <Text style={[s.text, styles.initials]}>{initials}</Text>
      )}
    </View>
  );

  if (showLevelRing && level) {
    return (
      <View
        style={{
          width: s.ring,
          height: s.ring,
          borderRadius: s.ring / 2,
          borderWidth: s.borderW,
          borderColor: levelColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {inner}
      </View>
    );
  }

  return inner;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});