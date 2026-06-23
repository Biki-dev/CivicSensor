import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { useAppStore } from '@store/index';
import { colors, palette } from '@theme/colors';
import { spacing, radius, shadows } from '@theme/spacing';
import { typography } from '@theme/typography';
import Svg, { Rect, Circle, Line, Path, G } from 'react-native-svg';
import { ISSUE_CATEGORIES } from '@constants/index';
import { Issue } from '@appTypes/index';

const { width } = Dimensions.get('window');
const MAP_HEIGHT = 380;

export default function MapScreen({ navigation }: any) {
  const { issues, user, verifyIssue } = useAppStore();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(issues[0] || null);

  // Map coordinates (lat 37.76 to 37.79, lon -122.45 to -122.41) to SVG viewport (0-300, 0-250)
  const mapCoordsToSvg = (lat: number, lon: number) => {
    const minLat = 37.76;
    const maxLat = 37.79;
    const minLon = -122.45;
    const maxLon = -122.41;

    const x = ((lon - minLon) / (maxLon - minLon)) * (width - 40);
    const y = MAP_HEIGHT - ((lat - minLat) / (maxLat - minLat)) * MAP_HEIGHT;
    
    return { x: Math.max(10, Math.min(width - 50, x)), y: Math.max(10, Math.min(MAP_HEIGHT - 30, y)) };
  };

  const getCategoryColor = (categoryName: string) => {
    const found = ISSUE_CATEGORIES.find(c => c.value === categoryName);
    return found ? found.color : '#95A5A6';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      {/* Styled Mock Map Canvas */}
      <View style={styles.mapContainer}>
        <Svg width={width - 20} height={MAP_HEIGHT} style={styles.mapSvg}>
          {/* Background Map Tint */}
          <Rect width="100%" height="100%" fill="#E9EEF4" rx={radius.card} />

          {/* Grid lines representing street grids */}
          {Array.from({ length: 12 }).map((_, i) => (
            <Line
              key={`h-${i}`}
              x1="0"
              y1={i * 35}
              x2="100%"
              y2={i * 35}
              stroke="#D4DBE5"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <Line
              key={`v-${i}`}
              x1={i * 45}
              y1="0"
              x2={i * 45}
              y2="100%"
              stroke="#D4DBE5"
              strokeWidth="1"
            />
          ))}

          {/* Park Area */}
          <Path
            d="M 50 40 L 180 40 L 180 120 L 50 120 Z"
            fill="#D4EFDF"
            opacity="0.8"
          />

          {/* Main Diagonal Highway */}
          <Line
            x1="0"
            y1={MAP_HEIGHT}
            x2={width - 20}
            y2="0"
            stroke="#BDC3C7"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <Line
            x1="0"
            y1={MAP_HEIGHT}
            x2={width - 20}
            y2="0"
            stroke="#FFF"
            strokeWidth="2"
            strokeDasharray="4,4"
            strokeLinecap="round"
          />

          {/* Issue Pins */}
          {issues.map(issue => {
            const { x, y } = mapCoordsToSvg(issue.location.latitude, issue.location.longitude);
            const color = getCategoryColor(issue.category);
            const isSelected = selectedIssue?.id === issue.id;

            return (
              <G key={issue.id} onPress={() => setSelectedIssue(issue)}>
                {/* Ping waves if selected */}
                {isSelected && (
                  <Circle
                    cx={x}
                    cy={y}
                    r="15"
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    opacity="0.5"
                  />
                )}
                {/* Outer ring */}
                <Circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill={colors.bgCard}
                  stroke={color}
                  strokeWidth="2"
                />
                {/* Center dot */}
                <Circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={color}
                />
              </G>
            );
          })}
        </Svg>
        
        {/* Map Legend */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>GPS SENSOR NETWORK STATUS: ACTIVE</Text>
        </View>
      </View>

      {/* Selected Incident Inspector Drawer */}
      {selectedIssue ? (
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <View style={styles.tagWrapper}>
              <View 
                style={[
                  styles.catDot, 
                  { backgroundColor: getCategoryColor(selectedIssue.category) }
                ]} 
              />
              <Text style={styles.drawerTitle}>{selectedIssue.title}</Text>
            </View>
            <View style={styles.statusChip}>
              <Text style={styles.statusChipText}>{selectedIssue.status.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.drawerAddress}>📍 {selectedIssue.address}</Text>
          <Text style={styles.drawerDesc} numberOfLines={2}>{selectedIssue.description}</Text>

          <View style={styles.drawerFooter}>
            <View style={styles.validationOverview}>
              <Text style={styles.valTitle}>TRUTH ACCURACY</Text>
              <Text style={styles.valStats}>
                {selectedIssue.verificationCount} verify votes · {selectedIssue.disputeCount} dispute
              </Text>
            </View>

            {user && selectedIssue.reportedById !== user.id && !selectedIssue.verifiedByIds.includes(user.id) ? (
              <TouchableOpacity 
                style={styles.drawerVerifyBtn}
                onPress={() => verifyIssue(selectedIssue.id, user.id)}
              >
                <Text style={styles.drawerVerifyText}>VERIFY NOW (+5 XP)</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.checkedBadge}>
                <Text style={styles.checkedText}>LOGGED & SIGNED</Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.emptyDrawer}>
          <Text style={styles.emptyDrawerText}>Select a telemetry pin on the grid to inspect details.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  mapContainer: {
    margin: 10,
    borderRadius: radius.card,
    backgroundColor: colors.bgCard,
    overflow: 'hidden',
    ...shadows.sm,
  },
  mapSvg: {
    alignSelf: 'center',
  },
  legendContainer: {
    backgroundColor: colors.bgDark,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  legendTitle: {
    ...typography.caption,
    color: colors.brandAccent,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  drawer: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    marginHorizontal: 10,
    marginVertical: 5,
    padding: spacing.md,
    ...shadows.md,
    borderColor: colors.border,
    borderWidth: 1.5,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  tagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  catDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.xs,
  },
  drawerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  statusChip: {
    backgroundColor: colors.bgDarkSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.xs,
  },
  statusChipText: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '800',
    color: palette.white,
  },
  drawerAddress: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  drawerDesc: {
    ...typography.bodySM,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  drawerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  validationOverview: {
    flex: 1,
  },
  valTitle: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
  },
  valStats: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  drawerVerifyBtn: {
    backgroundColor: colors.brandAccent,
    borderRadius: radius.btn,
    paddingVertical: spacing.xs * 1.5,
    paddingHorizontal: spacing.sm * 1.5,
  },
  drawerVerifyText: {
    ...typography.btnSM,
    color: palette.white,
    fontWeight: '800',
  },
  checkedBadge: {
    backgroundColor: palette.successSoft,
    borderRadius: radius.btn,
    paddingVertical: spacing.xs * 1.5,
    paddingHorizontal: spacing.sm * 1.5,
  },
  checkedText: {
    ...typography.btnSM,
    color: palette.success,
    fontWeight: '800',
  },
  emptyDrawer: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    marginHorizontal: 10,
    marginVertical: 5,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyDrawerText: {
    ...typography.bodySM,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
