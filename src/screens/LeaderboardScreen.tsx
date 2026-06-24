import React from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet } from 'react-native';
import { useAppStore } from '@store/index';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { typography } from '@theme/typography';

export default function LeaderboardScreen() {
  const { user } = useAppStore();

  const mockEntries = [
    { rank: 1, displayName: 'Alex M.', points: 420 },
    { rank: 2, displayName: 'Priya S.', points: 380 },
    { rank: 3, displayName: 'You', points: user?.points || 0 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: spacing.screenH }}>
        <Text style={{ ...typography.h2, color: colors.textPrimary }}>Leaderboard</Text>
        <FlatList
          data={mockEntries}
          keyExtractor={i => `${i.rank}`}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: spacing.sm }}>
              <Text style={{ ...typography.body, color: colors.textPrimary }}>{item.rank}. {item.displayName} — {item.points} pts</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary }
});
