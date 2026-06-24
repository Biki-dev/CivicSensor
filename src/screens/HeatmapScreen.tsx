import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { typography } from '@theme/typography';

export default function HeatmapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: spacing.screenH }}>
        <Text style={{ ...typography.h2, color: colors.textPrimary }}>Neighborhood Heatmap</Text>
        <Text style={{ ...typography.body, color: colors.textMuted, marginTop: spacing.sm }}>This screen will render aggregated report density and trends (Phase 6).</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary }
});
