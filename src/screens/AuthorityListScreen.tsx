import React from 'react';
import { SafeAreaView, View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppStore } from '@store/index';
import { colors } from '@theme/colors';
import { spacing, radius, shadows } from '@theme/spacing';
import { typography } from '@theme/typography';

export default function AuthorityListScreen({ navigation }: any) {
  const { authorities } = useAppStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <View style={{ padding: spacing.screenH, paddingTop: spacing.lg }}>
        <Text style={{ ...typography.h2, color: colors.textPrimary, fontWeight: '800' }}>City Authorities</Text>
      </View>

      <FlatList
        data={authorities}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: spacing.screenH }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card]}
            onPress={() => navigation.navigate('AuthorityDetail', { authorityId: item.id })}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.meta}>{item.department} • {item.jurisdiction}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ color: colors.textMuted, padding: spacing.md }}>No authorities available.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.xs,
  },
  title: {
    ...typography.bodySM,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  }
});
